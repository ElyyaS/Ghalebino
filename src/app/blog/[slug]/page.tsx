import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getBlogPost } from "@/server/queries";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  return { title: post?.seoTitle ?? post?.title ?? "مقاله", description: post?.excerpt ?? undefined };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/blog" className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-700">
        <ArrowRight className="h-4 w-4" />
        بازگشت به وبلاگ
      </Link>

      {post.coverImage ? (
        <div className="mb-6 aspect-[16/8] overflow-hidden rounded-2xl border border-slate-200">
          <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
        </div>
      ) : null}

      <h1 className="text-2xl font-bold leading-10 text-slate-900 sm:text-3xl">{post.title}</h1>
      <p className="mt-3 text-sm text-slate-400">
        {post.authorName} · {formatDate(post.publishedAt)}
      </p>

      <div className="mt-6 whitespace-pre-line rounded-2xl border border-slate-200 bg-white p-6 text-base leading-8 text-slate-700">
        {post.content}
      </div>
    </article>
  );
}
