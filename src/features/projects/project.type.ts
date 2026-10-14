export interface Beneficiary {
  id: string;
  applicationNo: string;
  name: string;
  category: string;
  division: string;
  ac: string;
  project: string;
  site: string;
  allotmentNo: number;
  allotmentType: string;
  vcHcApprovedAt: string;
  virtualAccount: string;
  mobile: string;
  aadhaarMasked: string;
  paymentAccountId: string | null;
  paymentAccountName: string | null;
  lastSyncedAt: string;
}

export interface BeneficiaryInstallmentSummary {
  beneficiaryId: string;
  applicationNo: string;
  beneficiaryName: string;
  virtualAccount: string;
  projectName: string;
  totalInstallmentAmount: number;
  legacyPaidAmount: number;
  payuPaidAmount: number;
  totalPaidAmount: number;
  outstandingAmount: number;
}

export type StageStatus = 'paid' | 'current' | 'upcoming';

export type PayingFrom = 'stage' | 'custom';

export interface StageTemplate {
  key: string;
  title: string;
  note?: string;
  amount: number;
}

export interface StageDefinition {
  key: string;
  title: string;
  note?: string;
  amount: number;
}

export interface PaymentStage {
  key: string;
  title: string;
  amount: number;
  number: number;
  status: StageStatus;
  paid: number;
  due: number;
}

export interface StageAllocation {
  stage: PaymentStage;
  applied: number;
  pendingAfter: number;
}

export interface PaymentSummary {
  totalCost: number;
  paid: number;
  outstanding: number;
  percentPaid: number;
  stagesDoneLabel: string;
  outstandingLabel: string;
  totalCostLabel: string;
  paidLabel: string;
  progressLabel: string;
  nextDueLabel: string;
}

export interface PaymentPreview {
  allocations: StageAllocation[];
  remaining: number;
}

export type PreviewPayment = (amount: number) => PaymentPreview;