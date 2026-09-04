import "server-only";

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<void>;
}

export class MockEmailProvider implements EmailProvider {
  readonly sent: EmailMessage[] = [];

  async send(message: EmailMessage): Promise<void> {
    this.sent.push(message);
    console.log(`[mock-email] to=${message.to} subject=${message.subject}`);
  }

  lastTo(to: string): EmailMessage | null {
    return [...this.sent].reverse().find((m) => m.to === to) ?? null;
  }
}

export const emailProvider: EmailProvider = new MockEmailProvider();
