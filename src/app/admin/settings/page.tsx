import { getSiteSettings } from "@/server/queries";
import { SettingsForm } from "@/components/admin/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  const initial = {
    siteName: typeof settings.siteName === "string" ? settings.siteName : "قالبی نو",
    siteTagline: typeof settings.siteTagline === "string" ? settings.siteTagline : "مارکت‌پلیس قالب و محصولات وب",
    supportEmail: typeof settings.supportEmail === "string" ? settings.supportEmail : "support@example.com",
  };

  return <SettingsForm initial={initial} />;
}
