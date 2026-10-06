
export const DESIGNATION = {
  BENEFICIARY:2,
  Contractor: 4,
} as const;

export type DesignationId = typeof DESIGNATION[keyof typeof DESIGNATION];
