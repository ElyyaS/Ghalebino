import { SlidersHorizontal } from "lucide-react";

type Option = { id: number; name: string; slug: string };

export function FilterPanel({
  basePath,
  categories,
  technologies,
  current,
}: {
  basePath: string;
  categories: Option[];
  technologies: Option[];
  current: {
    q?: string;
    sort?: string;
    category?: string;
    technology?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    onSale?: string;
  };
}) {
  return (
    <form method="get" action={basePath} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4">
      <input type="hidden" name="q" value={current.q ?? ""} />
      <input type="hidden" name="sort" value={current.sort ?? ""} />

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-800">دسته‌بندی</label>
        <select
          name="category"
          defaultValue={current.category ?? ""}
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
        >
          <option value="">همه دسته‌ها</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-800">تکنولوژی</label>
        <select
          name="technology"
          defaultValue={current.technology ?? ""}
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
        >
          <option value="">همه تکنولوژی‌ها</option>
          {technologies.map((t) => (
            <option key={t.id} value={t.slug}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-800">محدوده قیمت (تومان)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="از"
            defaultValue={current.minPrice ?? ""}
            className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
          />
          <span className="text-slate-400">تا</span>
          <input
            type="number"
            name="maxPrice"
            placeholder="تا"
            defaultValue={current.maxPrice ?? ""}
            className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-800">حداقل امتیاز</label>
        <select
          name="minRating"
          defaultValue={current.minRating ?? ""}
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
        >
          <option value="">مهم نیست</option>
          <option value="4">۴ و بالاتر</option>
          <option value="3">۳ و بالاتر</option>
          <option value="2">۲ و بالاتر</option>
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          name="onSale"
          value="1"
          defaultChecked={current.onSale === "1"}
          className="h-4 w-4 rounded border-slate-300 text-brand-600"
        />
        فقط تخفیف‌دارها
      </label>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
      >
        <SlidersHorizontal className="h-4 w-4" />
        اعمال فیلتر
      </button>

      <a
        href={basePath}
        className="block text-center text-xs text-slate-500 hover:text-brand-700"
      >
        حذف همه فیلترها
      </a>
    </form>
  );
}
