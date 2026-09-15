export interface Milestone {
  id: string;
  label: string;
  categoryLabel: string;
  contractValue: number;
  payablePercent: number;
  amountToRelease: number;
  dueDate: string; // ISO string over the wire
}

export interface BillPayload {
  projectId: string;
  milestoneId: string;
  billDate: string; // ISO string for API
  billNumber: string;
  billAmount: number;
  remarks: string;
  photos: string[];
  video: string | null;
  document: string | null;
}

export interface Bill extends BillPayload {
  id: string;
  status: 'DRAFT' | 'SUBMITTED' | 'AE_VERIFIED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface BillFormState extends Omit<BillPayload, 'projectId' | 'milestoneId' | 'billAmount' | 'billDate'> {
  projectId: string | null;
  milestoneId: string | null;
  billAmount: string;
  billDate: Date;
}

export const toBillPayload = (form: BillFormState): BillPayload => ({
  projectId: form.projectId!,
  milestoneId: form.milestoneId!,
  billDate: form.billDate.toISOString(),
  billNumber: form.billNumber,
  billAmount: Number(form.billAmount),
  remarks: form.remarks,
  photos: form.photos,
  video: form.video,
  document: form.document,
});