import Link from "next/link";
import { LayoutGrid } from "lucide-react";

import {
  CartButton,
  MobileMenu,
  SearchBar,
  UserMenu,
} from "./header-actions";

import { getSessionUser, getCartOwner } from "@/lib/auth";

import { mockCategories } from "@/server/mock-data";

import {
  getCartLines,
  getUnreadNotificationCount,
} from "@/server/queries";

const NAV = [
  { href: "/marketplace", label: "بازارچه" },
  { href: "/sellers", label: "فروشندگان" },
  { href: "/blog", label: "وبلاگ" },
  { href: "/help", label: "راهنما" },
];

export async function Header() {
  const user = await getSessionUser();

  const headerUser = user
    ? {
        id: user.id,
        name: user.name,
        role: user.role,
      }
    : null;

  const categories = mockCategories;

  const owner = await getCartOwner(false);

  const [lines, unread] = await Promise.all([
    getCartLines(owner),
    user ? getUnreadNotificationCount(user.id) : Promise.resolve(0),
  ]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:gap-3">
        <MobileMenu categories={categories} user={headerUser} />

        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white">
            <LayoutGrid className="h-5 w-5" />
          </span>

          <span className="hidden text-lg font-bold tracking-tight sm:block">
            قالبی <span className="text-gradient">نو</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 justify-end gap-1 sm:gap-2">
          <SearchBar />
          <CartButton count={lines.length} />
          <UserMenu user={headerUser} unread={unread} />
        </div>
      </div>
    </header>
  );
}