import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionUser } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { NavItem } from "@/components/dashboard/dashboard-sidebar";

const NAV: NavItem[] = [
  { href: "/dashboard/customer", label: "نمای کلی", icon: "dashboard" },
  { href: "/dashboard/customer/orders", label: "سفارش‌ها", icon: "package" },
  { href: "/dashboard/customer/downloads", label: "دانلودها", icon: "download" },
  { href: "/dashboard/customer/wishlist", label: "علاقه‌مندی‌ها", icon: "heart" },
  { href: "/dashboard/customer/compare", label: "مقایسه", icon: "compare" },
  { href: "/dashboard/customer/reviews", label: "دیدگاه‌ها", icon: "star" },
  { href: "/dashboard/customer/support", label: "پشتیبانی", icon: "support" },
  { href: "/dashboard/customer/notifications", label: "اعلان‌ها", icon: "bell" },
  { href: "/dashboard/customer/become-seller", label: "فروشنده شوید", icon: "store" },
  { href: "/dashboard/customer/settings", label: "تنظیمات", icon: "settings" },
];

export default async function CustomerLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login?next=/dashboard/customer");

  return (<DashboardShell title="پنل کاربری" subtitle={user.name} items={NAV}>
    {children} </DashboardShell>
  );
}