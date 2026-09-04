import "server-only";

import { auditLogs, db } from "@/db";

export async function audit(
  actorId: number | null,
  action: string,
  resourceType: string,
  resourceId: number | null,
  metadata?: Record<string, unknown>,
): Promise<void> {
  if (process.env.NEXT_PUBLIC_DEV_MODE === "true") {
    return;
  }

  await db.insert(auditLogs).values({
    actorId,
    action,
    resourceType,
    resourceId,
    metadata: metadata ?? {},
  });
}