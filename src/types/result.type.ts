export type Result<T, E = never> =
  | { success: true; data: T }
  | { success: false; error: E };

export const ok = <T, E = never>(data: T): Result<T, E> => ({ success: true, data });
export const err = <E>(error: E): Result<never, E> => ({ success: false, error });