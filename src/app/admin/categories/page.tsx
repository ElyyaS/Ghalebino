import { getAllCategories, getAllTechnologies } from "@/server/queries";
import { Badge } from "@/components/ui/feedback";
import { CreateCategoryForm, CreateTechnologyForm } from "@/components/admin/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const [categories, technologies] = await Promise.all([getAllCategories(), getAllTechnologies()]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 font-semibold text-slate-900">دسته‌بندی‌ها</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <span key={c.id} className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700">
              {c.name}
              {!c.isVisible ? <Badge tone="neutral">مخفی</Badge> : null}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 font-semibold text-slate-900">تکنولوژی‌ها</h2>
        <div className="flex flex-wrap gap-2">
          {technologies.map((t) => (
            <span key={t.id} className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700">
              {t.name}
              <Badge tone="info">{t.kind}</Badge>
            </span>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CreateCategoryForm />
        <CreateTechnologyForm />
      </div>
    </div>
  );
}
