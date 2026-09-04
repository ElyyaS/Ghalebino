import { getAdminBlogPosts } from "@/server/queries";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/feedback";
import { CreateBlogPostForm } from "@/components/admin/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getAdminBlogPosts();

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-start font-medium">عنوان</th>
              <th className="px-4 py-3 text-start font-medium">وضعیت</th>
              <th className="px-4 py-3 text-start font-medium">تاریخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{p.title}</td>
                <td className="px-4 py-3">
                  <Badge tone={p.status === "PUBLISHED" ? "success" : "neutral"}>
                    {p.status === "PUBLISHED" ? "منتشر شده" : "پیش‌نویس"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-500">{formatDate(p.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateBlogPostForm />
    </div>
  );
}
