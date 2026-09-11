const categorySlugMap = {
  "html-templates": "html",
  "react-templates": "react",
  "nextjs-templates": "nextjs",
  "wordpress-themes": "wordpress",
  "ecommerce-templates": "ecommerce",
  "admin-dashboards": "admin",
  "ui-kits": "ui-kit",
  "landing-pages": "landing",
  "portfolio-templates": "portfolio",
  "business-templates": "business",
} as const;

type DatabaseCategorySlug = keyof typeof categorySlugMap;
type PublicCategorySlug = (typeof categorySlugMap)[DatabaseCategorySlug];

const publicToDatabaseCategorySlug = Object.fromEntries(
  Object.entries(categorySlugMap).map(([databaseSlug, publicSlug]) => [
    publicSlug,
    databaseSlug,
  ]),
) as Record<PublicCategorySlug, DatabaseCategorySlug>;

export function toPublicCategorySlug(
  databaseSlug: string,
): PublicCategorySlug | null {
  return categorySlugMap[databaseSlug as DatabaseCategorySlug] ?? null;
}

export function toDatabaseCategorySlug(
  publicSlug: string,
): DatabaseCategorySlug | null {
  return (
    publicToDatabaseCategorySlug[publicSlug as PublicCategorySlug] ?? null
  );
}
