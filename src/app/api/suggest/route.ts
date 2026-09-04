import type { NextRequest } from "next/server";
import { and, eq, ilike, isNull } from "drizzle-orm";
import { db, products } from "@/db";

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 1) return Response.json([]);

  const rows = await db
    .select({ slug: products.slug, title: products.title })
    .from(products)
    .where(
      and(
        eq(products.status, "PUBLISHED"),
        isNull(products.deletedAt),
        ilike(products.title, `%${q}%`),
      ),
    )
    .limit(6);

  return Response.json(rows);
}
