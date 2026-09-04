export class AppError extends Error {
  constructor(
    message: string,
    public readonly status: number = 400,
    public readonly code: string = "BAD_REQUEST",
  ) {
    super(message);
    this.name = "AppError";
  }
}

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function ok<T>(data: T): { ok: true; data: T } {
  return { ok: true, data };
}

export function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

export async function runAction<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (err) {
    if (err instanceof AppError) return { ok: false, error: err.message };
    console.error("[action-error]", err);
    return { ok: false, error: "خطایی رخ داد. لطفاً دوباره تلاش کنید." };
  }
}

export function firstErrorMessage(error: { issues?: Array<{ message: string }> }): string {
  return error.issues?.[0]?.message ?? "ورودی نامعتبر است.";
}

export type FormState = {
  error?: string;
  message?: string;
  devLink?: string;
};
