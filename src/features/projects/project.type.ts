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
