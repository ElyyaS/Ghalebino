import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionUser } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { NavItem } from "@/components/dashboard/dashboard-sidebar";

const NAV: NavItem[] = [
  { href: "/admin", label: "نمای کلی", icon: "dashboard" },
  { href: "/admin/users", label: "کاربران", icon: "users" },
  { href: "/admin/sellers", label: "فروشندگان", icon: "wallet" },
  { href: "/admin/sellers/applications", label: "درخواست‌های فروشندگی", icon: "users" },
  { href: "/admin/products", label: "محصولات", icon: "package" },
  {
    href: "/admin/categories",
    label: "دسته‌بندی و تکنولوژی",
    icon: "folder-tree",
  },
  { href: "/admin/orders", label: "سفارش‌ها", icon: "shopping-bag" },
  { href: "/admin/withdrawals", label: "برداشت‌ها", icon: "banknote" },
  { href: "/admin/coupons", label: "کدهای تخفیف", icon: "tags" },
  { href: "/admin/reports", label: "گزارش‌ها", icon: "flag" },
  { href: "/admin/blog", label: "وبلاگ", icon: "newspaper" },
  { href: "/admin/settings", label: "تنظیمات", icon: "settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/auth/login?next=/admin");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <DashboardShell
      title="پنل مدیریت"
      subtitle="مدیریت بازارچه قالبی نو"
      items={NAV}
    >
      {children}
    </DashboardShell>
  );
}