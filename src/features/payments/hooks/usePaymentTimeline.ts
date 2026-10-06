import { useCallback, useMemo, useState } from 'react';
import { formatINR } from '../../../utils';

export type StageStatus = 'paid' | 'current' | 'upcoming';

export interface PaymentStage {
  key: string;
  number: number;
  title: string;
  note?: string;
  status: StageStatus;
  amount: number;
  paid: number;
  due: number;
  /** "₹10,000" or "₹40,000 paid of ₹1,00,000" */
  amountLabel: string;
  /** "Paid" | "₹60,000 due" | "Upcoming" */
  chipLabel: string;
}

export interface StageAllocation {
  stage: PaymentStage;
  /** Part of the entered amount that goes to this stage */
  applied: number;
  /** What this stage still needs after the payment */
  pendingAfter: number;
}

// Static test data (replace with API data later)
const APPLICATION_FEE = 100;

const STAGES = [
  {
    key: 'first_stage',
    title: 'First Instalment',
    note: 'Application fee ₹100 + deposit',
    amount: 10000,
  },
  {
    key: 'second_stage',
    title: 'Second Instalment',
    amount: 100000,
  },
  {
    key: 'third_stage',
    title: 'Third Instalment',
    amount: 200000,
  },
];

const INITIAL_PAID: Record<string, number> = {
  first_stage: 10000,
};

/** Splits an amount across stages in order; returns the extra paid per stage. */
const allocate = (amount: number, paidByStage: Record<string, number>) => {
  const applied: Record<string, number> = {};
  let left = amount;

  for (const stage of STAGES) {
    if (left <= 0) break;
    const take = Math.min(stage.amount - (paidByStage[stage.key] ?? 0), left);
    if (take > 0) {
      applied[stage.key] = take;
      left -= take;
    }
  }

  return applied;
};

export const usePaymentTimeline = () => {
  const [paidByStage, setPaidByStage] = useState<Record<string, number>>(INITIAL_PAID);

  const stages = useMemo<PaymentStage[]>(() => {
    let currentAssigned = false;

    return STAGES.map((stage, index) => {
      const paid = paidByStage[stage.key] ?? 0;
      const due = Math.max(stage.amount - paid, 0);

      let status: StageStatus = 'upcoming';
      if (due === 0) {
        status = 'paid';
      } else if (!currentAssigned) {
        status = 'current';
        currentAssigned = true;
      }

      return {
        ...stage,
        number: index + 1,
        status,
        paid,
        due,
        amountLabel:
          paid > 0 && due > 0
            ? `${formatINR(paid)} paid of ${formatINR(stage.amount)}`
            : formatINR(stage.amount),
        chipLabel:
          status === 'paid' ? 'Paid' : status === 'current' ? `${formatINR(due)} due` : 'Upcoming',
      };
    });
  }, [paidByStage]);

  const summary = useMemo(() => {
    const totalCost = STAGES.reduce((sum, s) => sum + s.amount, 0) + APPLICATION_FEE;
    const paid = stages.reduce((sum, s) => sum + s.paid, 0) + APPLICATION_FEE;
    const outstanding = totalCost - paid;
    const current = stages.find(s => s.status === 'current');

    return {
      totalCost,
      paid,
      outstanding,
      percentPaid: Math.round((paid / totalCost) * 100),
      stagesDoneLabel: `${stages.filter(s => s.status === 'paid').length} of ${stages.length} stages completed`,
      outstandingLabel: formatINR(outstanding),
      totalCostLabel: formatINR(totalCost),
      paidLabel: formatINR(paid),
      progressLabel: `${formatINR(paid)} / ${formatINR(totalCost)}`,
      nextDueLabel: current
        ? `Stage ${current.number} · ${formatINR(current.due)} due`
        : 'All stages paid',
    };
  }, [stages]);

  /** Preview how an amount would be split across the unpaid stages. */
  const previewPayment = useCallback(
    (amount: number) => {
      const applied = allocate(amount, paidByStage);

      const allocations: StageAllocation[] = stages
        .filter(stage => stage.due > 0)
        .map(stage => ({
          stage,
          applied: applied[stage.key] ?? 0,
          pendingAfter: stage.due - (applied[stage.key] ?? 0),
        }));

      return {
        allocations,
        remaining: Math.max(summary.outstanding - amount, 0),
      };
    },
    [paidByStage, stages, summary.outstanding],
  );

  /** Apply a successful payment to the stages in order (call after PayU SUCCESS). */
  const applyPayment = useCallback((amount: number) => {
    setPaidByStage(prev => {
      const applied = allocate(amount, prev);
      const next = { ...prev };
      Object.entries(applied).forEach(([key, value]) => {
        next[key] = (next[key] ?? 0) + value;
      });
      return next;
    });
  }, []);

  return { stages, summary, previewPayment, applyPayment };
};