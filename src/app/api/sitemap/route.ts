import { and, eq, isNull } from "drizzle-orm";
import { blogPosts, categories, db, products, sellers, technologies } from "@/db";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function url(path: string, priority = 0.5) {
  return `<url><loc>${BASE}${path}</loc><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
}

export async function GET() {
  const [productRows, categoryRows, techRows, sellerRows, blogRows] = await Promise.all([
    db
      .select({ slug: products.slug })
      .from(products)
      .where(and(eq(products.status, "PUBLISHED"), isNull(products.deletedAt))),
    db.select({ slug: categories.slug }).from(categories),
    db.select({ slug: technologies.slug }).from(technologies),
    db.select({ username: sellers.username }).from(sellers),
    db
      .select({ slug: blogPosts.slug })
      .from(blogPosts)
      .where(eq(blogPosts.status, "PUBLISHED")),
  ]);

  const entries = [
    url("/", 1),
    url("/marketplace", 0.9),
    url("/sellers", 0.7),
    url("/blog", 0.7),
    ...productRows.map((p) => url(`/products/${p.slug}`, 0.8)),
    ...categoryRows.map((c) => url(`/categories/${c.slug}`, 0.7)),
    ...techRows.map((t) => url(`/technologies/${t.slug}`, 0.6)),
    ...sellerRows.map((s) => url(`/sellers/${s.username}`, 0.6)),
    ...blogRows.map((b) => url(`/blog/${b.slug}`, 0.5)),
  ].join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
