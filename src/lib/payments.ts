import "server-only";

export type PaymentCreateParams = {
  orderNumber: string;
  amount: number;
  description?: string;
};

export type PaymentResult = {
  success: boolean;
  ref: string;
  redirectUrl?: string;
};

export interface PaymentProvider {
  readonly name: string;
  createPayment(params: PaymentCreateParams): Promise<PaymentResult>;
  verifyPayment(ref: string, amount: number): Promise<boolean>;
}

export class MockPaymentProvider implements PaymentProvider {
  readonly name = "mock";

  async createPayment(params: PaymentCreateParams): Promise<PaymentResult> {
    const ref = `MOCK-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return { success: true, ref };
  }

  async verifyPayment(ref: string): Promise<boolean> {
    return ref.startsWith("MOCK-");
  }
}

export const paymentProvider: PaymentProvider = new MockPaymentProvider();
