
export const DESIGNATION = {
  Contractor: 4,
  ADMIN: 2
} as const;

export type DesignationId = typeof DESIGNATION[keyof typeof DESIGNATION];
