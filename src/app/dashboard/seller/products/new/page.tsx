import { getAllCategories, getAllTechnologies } from "@/server/queries";
import { ProductForm } from "@/components/seller/product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, technologies] = await Promise.all([getAllCategories(), getAllTechnologies()]);

  return (
    <ProductForm
      mode="create"
      categories={categories}
      technologies={technologies}
    />
  );
}
