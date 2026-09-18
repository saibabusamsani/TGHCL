import { CapturedPhoto, CapturedVideo, PickedDocument } from './media.type';

export interface Milestone {
  id: string;
  label: string;
  categoryLabel: string;
  contractValue: number;
  payablePercent: number;
  amountToRelease: number;
  dueDate: string;
}

export interface BillPayload {
  projectId: string;
  milestoneId: string;
  billDate: string;
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

export interface BillFormState {
  projectId: string | null;
  milestoneId: string | null;
  billDate: Date;
  billNumber: string;
  billAmount: string;
  remarks: string;
  photos: CapturedPhoto[];
  video: CapturedVideo | null;
  document: PickedDocument | null;
}

export const toBillPayload = (form: BillFormState): BillPayload => ({
  projectId: form.projectId!,
  milestoneId: form.milestoneId!,
  billDate: form.billDate.toISOString(),
  billNumber: form.billNumber,
  billAmount: Number(form.billAmount),
  remarks: form.remarks,
  photos: form.photos.map((p) => p.uri),
  video: form.video?.uri ?? null,
  document: form.document?.uri ?? null,
});