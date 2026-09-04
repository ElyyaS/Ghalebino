import "server-only";

import { db, notifications } from "@/db";

export type NotificationInput = {
  type: string;
  title: string;
  body?: string;
  link?: string;
};

export async function notify(userId: number, input: NotificationInput): Promise<void> {
  await db.insert(notifications).values({
    userId,
    type: input.type,
    title: input.title,
    body: input.body,
    link: input.link,
  });
}
