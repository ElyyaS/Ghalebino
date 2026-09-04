import Link from "next/link";
import type { Metadata } from "next";
import { getBlogPosts } from "@/server/queries";
import { formatDate } from "@/lib/format";
import { EmptyState } from "@/components/ui/feedback";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "وبلاگ" };

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">وبلاگ قالبی نو</h1>
        <p className="mt-1 text-sm text-slate-500">آموزش‌ها، راهنماها و اخبار دنیای قالب و توسعه وب</p>
      </header>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-brand-300 hover:shadow-sm"
            >
              <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="grid h-full place-items-center bg-gradient-to-br from-brand-100 to-accent-100 text-brand-300" />
                )}
              </div>
              <div className="p-4">
                <h2 className="line-clamp-2 font-semibold leading-6 text-slate-900 group-hover:text-brand-700">{post.title}</h2>
                {post.excerpt ? <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">{post.excerpt}</p> : null}
                <p className="mt-3 text-xs text-slate-400">
                  {post.authorName} · {formatDate(post.publishedAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="مقاله‌ای منتشر نشده است" />
      )}
    </div>
  );
}
