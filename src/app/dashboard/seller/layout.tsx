import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionUser } from "@/lib/auth";
import { getSellerByUserIdForDashboard } from "@/server/queries";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { NavItem } from "@/components/dashboard/dashboard-sidebar";

const NAV: NavItem[] = [
  { href: "/dashboard/seller", label: "نمای کلی", icon: "dashboard" },
  { href: "/dashboard/seller/products", label: "محصولات", icon: "package" },
  { href: "/dashboard/seller/products/new", label: "محصول جدید", icon: "plus" },
  { href: "/dashboard/seller/orders", label: "سفارش‌ها", icon: "shopping-bag" },
  { href: "/dashboard/seller/earnings", label: "مالی و برداشت", icon: "wallet" },
  { href: "/dashboard/seller/reviews", label: "بازخوردها", icon: "star" },
  { href: "/dashboard/seller/support", label: "پشتیبانی", icon: "support" },
  { href: "/dashboard/seller/store", label: "فروشگاه من", icon: "store" },
];

export default async function SellerLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login?next=/dashboard/seller");

  const seller = await getSellerByUserIdForDashboard(user.id);
  if (!seller || seller.status !== "ACTIVE") redirect("/dashboard/customer/become-seller");

  return (<DashboardShell title="پنل فروشنده" subtitle={seller.storeName} items={NAV}>
    {children} </DashboardShell>
  );
}