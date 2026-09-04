"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Banknote,
  Bell,
  Download,
  Flag,
  FolderTree,
  GitCompare,
  Heart,
  LayoutDashboard,
  LifeBuoy,
  Newspaper,
  Package,
  Plus,
  Settings,
  ShoppingBag,
  Star,
  Store,
  Tags,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NavItem = {
  href: string;
  label: string;
  icon:
  | "dashboard"
  | "users"
  | "wallet"
  | "package"
  | "folder-tree"
  | "shopping-bag"
  | "banknote"
  | "tags"
  | "flag"
  | "newspaper"
  | "settings"
  | "download"
  | "heart"
  | "compare"
  | "star"
  | "support"
  | "bell"
  | "store"
  | "plus";
};

const iconMap = {
  dashboard: LayoutDashboard,
  users: Users,
  wallet: Wallet,
  package: Package,
  "folder-tree": FolderTree,
  "shopping-bag": ShoppingBag,
  banknote: Banknote,
  tags: Tags,
  flag: Flag,
  newspaper: Newspaper,
  settings: Settings,
  download: Download,
  heart: Heart,
  compare: GitCompare,
  star: Star,
  support: LifeBuoy,
  bell: Bell,
  store: Store,
  plus: Plus,
} as const;

export function DashboardSidebar({
  items,
}: {
  items: readonly NavItem[];
}) {
  const pathname = usePathname();

  return (
    <> <nav className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 md:hidden">
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = iconMap[item.icon];

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
              active
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-slate-200 bg-white text-slate-600",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {item.label}
          </Link>
        );
      })}
    </nav>

      <aside className="hidden w-60 shrink-0 md:block">
        <nav className="sticky top-20 space-y-1">
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = iconMap[item.icon];

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>

  );
}
