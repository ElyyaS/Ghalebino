import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db, downloads, orderItems, orders, productVersions } from "@/db";
import { getSessionUser } from "@/lib/auth";
import { storageProvider } from "@/lib/storage";

function ipHash(request: NextRequest): string {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderItemId: string }> },
) {
  const user = await getSessionUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const orderItemId = Number((await context.params).orderItemId);
  if (!Number.isInteger(orderItemId)) return new Response("Bad request", { status: 400 });

  const [item] = await db
    .select({ id: orderItems.id, productId: orderItems.productId, orderId: orderItems.orderId })
    .from(orderItems)
    .where(eq(orderItems.id, orderItemId))
    .limit(1);
  if (!item) return new Response("Not found", { status: 404 });

  const [order] = await db
    .select({ id: orders.id, status: orders.status })
    .from(orders)
    .where(and(eq(orders.id, item.orderId), eq(orders.userId, user.id)))
    .limit(1);

  if (!order || !["PAID", "COMPLETED"].includes(order.status)) {
    return new Response("Forbidden", { status: 403 });
  }

  const [version] = await db
    .select()
    .from(productVersions)
    .where(and(eq(productVersions.productId, item.productId), eq(productVersions.isActive, true)))
    .orderBy(desc(productVersions.releaseDate))
    .limit(1);

  const key = version?.fileKey ?? `products/${item.productId}/package.zip`;
  const file = await storageProvider.get(key);

  await db.insert(downloads).values({
    userId: user.id,
    orderItemId: item.id,
    productId: item.productId,
    versionId: version?.id ?? 0,
    ipHash: ipHash(request),
  });

  return new Response(file?.content ?? "", {
    headers: {
      "Content-Type": file?.contentType ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${file?.filename ?? "product.html"}"`,
      "Cache-Control": "no-store",
    },
  });
}
