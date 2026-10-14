import { useMemo, useState } from 'react';

import { useAppSelector } from '../../../store/hooks';
import {
  useGetBeneficiaryDetailsQuery,
  useGetBeneficiaryInstallmentSummaryQuery,
} from '../../projects/projects.api';
import {
  BeneficiaryInstallmentSummary,
  PayingFrom,
  PaymentStage,
  StageTemplate,
} from '../../projects/project.type';
import { isValidEmail } from '../../../utils';
import { usePayUCheckout } from './usePayUCheckout';

const STAGE_TEMPLATE: StageTemplate[] = [
  { key: 'first_stage', title: 'First Instalment', amount: 10000 },
  { key: 'second_stage', title: 'Second Instalment', amount: 100000 },
  { key: 'third_stage', title: 'Third Instalment', amount: 200000 },
];

const STAGE_AMOUNTS = STAGE_TEMPLATE.map(stage => stage.amount);

type AllocState = 'none' | 'partial' | 'cleared';

interface StagePreview {
  stage: PaymentStage;
  applied: number;
  pendingAfter: number;
  state: AllocState;
}


/**
 * In:  capacities [10000, 100000, 200000], amount 50000
 * Out: [10000, 40000, 0] --> Each stage paid amount
 */
const allocateInOrder = (capacities: number[], amount: number): number[] => {
  let remaining = amount;

  return capacities.map(capacity => {
    const applied = Math.min(capacity, remaining);
    remaining -= applied;
    return applied;
  });
};

const buildStages = (totalPaid: number, isLoaded: boolean) => {
  const paidPerStage = allocateInOrder(STAGE_AMOUNTS, totalPaid);

  // First stage that is not fully paid is the current one.
  const currentIndex = isLoaded ? paidPerStage.findIndex((paid, index) => paid < STAGE_AMOUNTS[index]) : -1;

  const stages = STAGE_TEMPLATE.map((stage, index): PaymentStage => {
    const paid = paidPerStage[index];
    const due = stage.amount - paid;

    return {
      ...stage,
      number: index + 1,
      paid,
      due,
      status: due === 0 ? 'paid' : index === currentIndex ? 'current' : 'upcoming',
    };
  });

  return {
    stages,
    currentStage: currentIndex >= 0 ? stages[currentIndex] : undefined,
  };
};

const buildTimeline = (data?: BeneficiaryInstallmentSummary) => {
  const total = data?.totalInstallmentAmount ?? 0;
  const totalPaid = Math.min(data?.totalPaidAmount ?? 0, total);
  const { stages, currentStage } = buildStages(totalPaid, !!data);
  const unpaidStages = stages.filter(stage => stage.due > 0);

  const previewPayment = (amount: number): StagePreview[] => {
    const appliedPerStage = allocateInOrder(unpaidStages.map(stage => stage.due),amount,);

    return unpaidStages.map((stage, index) => {
      const applied = appliedPerStage[index];
      const pendingAfter = stage.due - applied;

      return {
        stage,
        applied,
        pendingAfter,
        state: applied === 0 ? 'none' : pendingAfter === 0 ? 'cleared' : 'partial',
      };
    });
  };

  return {
    stages,
    currentStage,
    total,
    totalPaid,
    outstanding: total - totalPaid,
    previewPayment,
  };
};

const getEmailError = (email: string, touched: boolean) => {
  if (isValidEmail(email) || (!touched && !email)) return undefined;
  return email ? 'Enter a valid email address' : 'Email is required';
};



export const usePaymentTimeline = ({ onInvalidEmail }: { onInvalidEmail?: () => void } = {}) => {
  const user = useAppSelector(state => state.authentication.user);

  const { data: beneficiaries } = useGetBeneficiaryDetailsQuery();
  const beneficiaryId = beneficiaries?.[0]?.id;

  const {data: summary,isFetching,refetch} = useGetBeneficiaryInstallmentSummaryQuery({ beneficiaryId: beneficiaryId! },{ skip: !beneficiaryId } );

  const timeline = useMemo(() => buildTimeline(summary), [summary]);

  const [amountText, setAmountText] = useState('');
  const [email, setEmail] = useState(user?.email ?? '');
  const [emailTouched, setEmailTouched] = useState(false);
  const [payingFrom, setPayingFrom] = useState<PayingFrom | null>(null);

  const { startPayment, isProcessing } = usePayUCheckout({
    onComplete: result => {
      refetch();
      if (result === 'SUCCESS') setAmountText('');
      setPayingFrom(null);
    },
  });

  const amount = Number(amountText.replace(/,/g, ''));
  const payable = amount > 0 && amount <= timeline.outstanding ? amount : 0; 

  const pay = (value: number, from: PayingFrom) => {
    if (!summary) return;

    if (!isValidEmail(email)) {
      setEmailTouched(true);
      onInvalidEmail?.();
      return;
    }

    setPayingFrom(from);
    startPayment({ amount: value, applicationNo: summary.applicationNo, email: email.trim() });
  };

  return {
    ...timeline,
    user,
    summary,
    loading: !summary,
    isFetching,
    refetch,

    email,
    setEmail,
    emailError: getEmailError(email, emailTouched),

    amountText,
    setAmountText,
    amount,
    payable,

    isProcessing,
    payingFrom,
    pay,
  };
};