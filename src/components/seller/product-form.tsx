"use client";

import { useActionState, useCallback, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { createProductAction, updateProductAction } from "@/server/actions/seller";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/forms";
import { Alert } from "@/components/ui/feedback";

type Category = { id: number; name: string };
type Tech = { id: number; name: string; kind: string };

type Initial = {
  title: string;
  shortDescription: string;
  description: string;
  categoryId: number;
  price: number;
  salePrice: number | null;
  currentVersion: string;
  demoUrl: string | null;
  documentationUrl: string | null;
  features: string[];
  requirements: string[];
  technologyIds: number[];
};

export function ProductForm({
  mode,
  productId,
  categories,
  technologies,
  initial,
}: {
  mode: "create" | "edit";
  productId?: number;
  categories: Category[];
  technologies: Tech[];
  initial?: Initial;
}) {
  const [features, setFeatures] = useState<string[]>(initial?.features.length ? initial.features : [""]);
  const [requirements, setRequirements] = useState<string[]>(initial?.requirements.length ? initial.requirements : [""]);

  const updateAction = useCallback(
    (prev: { error?: string; message?: string }, fd: FormData) => updateProductAction(productId!, fd),
    [productId],
  );
  const action = mode === "create" ? createProductAction : updateAction;
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-6">
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-900">اطلاعات پایه</h2>
        <Field label="عنوان محصول" htmlFor="title">
          <Input id="title" name="title" defaultValue={initial?.title} required />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="دسته‌بندی" htmlFor="categoryId">
            <Select id="categoryId" name="categoryId" defaultValue={initial?.categoryId ?? ""} required>
              <option value="">انتخاب کنید</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="نسخه" htmlFor="version">
            <Input id="version" name="version" defaultValue={initial?.currentVersion ?? "1.0.0"} dir="ltr" required />
          </Field>
          <Field label="قیمت (تومان)" htmlFor="price">
            <Input id="price" name="price" type="number" defaultValue={initial?.price ?? ""} min={0} required />
          </Field>
          <Field label="قیمت با تخفیف (اختیاری)" htmlFor="salePrice">
            <Input id="salePrice" name="salePrice" type="number" defaultValue={initial?.salePrice ?? ""} min={0} />
          </Field>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-900">توضیحات</h2>
        <Field label="توضیح کوتاه" htmlFor="shortDescription">
          <Textarea id="shortDescription" name="shortDescription" defaultValue={initial?.shortDescription} required />
        </Field>
        <Field label="توضیحات کامل" htmlFor="description">
          <Textarea id="description" name="description" defaultValue={initial?.description} className="min-h-[160px]" required />
        </Field>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-900">لینک‌ها</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="نشانی دمو (اختیاری)" htmlFor="demoUrl">
            <Input id="demoUrl" name="demoUrl" dir="ltr" defaultValue={initial?.demoUrl ?? ""} />
          </Field>
          <Field label="نشانی مستندات (اختیاری)" htmlFor="documentationUrl">
            <Input id="documentationUrl" name="documentationUrl" dir="ltr" defaultValue={initial?.documentationUrl ?? ""} />
          </Field>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-900">ویژگی‌ها</h2>
        {features.map((f, i) => (
          <div key={i} className="flex gap-2">
            <Input value={f} onChange={(e) => setFeatures((arr) => arr.map((x, j) => (j === i ? e.target.value : x)))} placeholder={`ویژگی ${i + 1}`} name="features" />
            <button type="button" onClick={() => setFeatures((arr) => arr.filter((_, j) => j !== i))} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="حذف">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <Button type="button" variant="subtle" size="sm" onClick={() => setFeatures((arr) => [...arr, ""])}>
          <Plus className="h-4 w-4" />
          افزودن ویژگی
        </Button>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-900">نیازمندی‌ها</h2>
        {requirements.map((r, i) => (
          <div key={i} className="flex gap-2">
            <Input value={r} onChange={(e) => setRequirements((arr) => arr.map((x, j) => (j === i ? e.target.value : x)))} placeholder={`نیازمندی ${i + 1}`} name="requirements" />
            <button type="button" onClick={() => setRequirements((arr) => arr.filter((_, j) => j !== i))} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="حذف">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <Button type="button" variant="subtle" size="sm" onClick={() => setRequirements((arr) => [...arr, ""])}>
          <Plus className="h-4 w-4" />
          افزودن نیازمندی
        </Button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 font-semibold text-slate-900">تکنولوژی‌ها</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {technologies.map((t) => (
            <label key={t.id} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
              <input type="checkbox" name="technologyIds" value={t.id} defaultChecked={initial?.technologyIds.includes(t.id)} className="h-4 w-4 rounded border-slate-300 text-brand-600" />
              {t.name}
            </label>
          ))}
        </div>
      </section>

      {state.error ? <Alert tone="danger">{state.error}</Alert> : null}
      {state.message ? <Alert tone="success">{state.message}</Alert> : null}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending} className="min-w-32">
          {pending ? "در حال ذخیره…" : mode === "create" ? "ایجاد محصول" : "ذخیره تغییرات"}
        </Button>
      </div>
    </form>
  );
}
