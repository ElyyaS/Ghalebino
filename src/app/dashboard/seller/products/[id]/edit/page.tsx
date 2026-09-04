import { notFound } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getAllCategories, getAllTechnologies, getSellerByUserIdForDashboard, getSellerProductForEdit } from "@/server/queries";
import { ProductForm } from "@/components/seller/product-form";
import { Badge } from "@/components/ui/feedback";
import { PRODUCT_STATUS_LABELS, productStatusTone } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = (await getSessionUser())!;
  const seller = (await getSellerByUserIdForDashboard(user.id))!;
  const [product, categories, technologies] = await Promise.all([
    getSellerProductForEdit(seller.id, Number(id)),
    getAllCategories(),
    getAllTechnologies(),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">ویرایش محصول</h2>
        <Badge tone={productStatusTone(product.status)}>{PRODUCT_STATUS_LABELS[product.status]}</Badge>
      </div>
      <ProductForm
        mode="edit"
        productId={product.id}
        categories={categories}
        technologies={technologies}
        initial={{
          title: product.title,
          shortDescription: product.shortDescription,
          description: product.description,
          categoryId: product.categoryId,
          price: product.price,
          salePrice: product.salePrice,
          currentVersion: product.currentVersion,
          demoUrl: product.demoUrl,
          documentationUrl: product.documentationUrl,
          features: product.features,
          requirements: product.requirements,
          technologyIds: product.technologyIds,
        }}
      />
    </div>
  );
}
