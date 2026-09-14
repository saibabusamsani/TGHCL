
export const DESIGNATION = {
  EMPLOYEE: 4,
  ADMIN: 2
} as const;

export type DesignationId = typeof DESIGNATION[keyof typeof DESIGNATION];
