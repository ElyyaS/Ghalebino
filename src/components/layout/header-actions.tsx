"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingCart,
  Store,
  User as UserIcon,
  X,
} from "lucide-react";
import { logoutAction } from "@/server/actions/auth";
import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/lib/format";

type HeaderUser = {
  id: number;
  name: string;
  role: "ADMIN" | "SELLER" | "CUSTOMER" | string;
};

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Suggestion = {
  slug: string;
  title: string;
};

export function SearchBar() {
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const value = query.trim();

    if (!value) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;

    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/suggest?q=${encodeURIComponent(value)}`,
        );

        if (!response.ok) {
          if (!cancelled) {
            setSuggestions([]);
          }

          return;
        }

        const data: Suggestion[] = await response.json();

        if (!cancelled) {
          setSuggestions(data);
        }
      } catch {
        if (!cancelled) {
          setSuggestions([]);
        }
      }
    }, 200);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };

  }, [query]);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (
        boxRef.current &&
        !boxRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };

  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = query.trim();

    if (!value) {
      return;
    }

    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(value)}`);

  }

  function handleSuggestionClick() {
    setOpen(false);
  }

  return (<div ref={boxRef} className="relative hidden sm:block"> <form onSubmit={handleSubmit} className="relative"> <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

    <input
      value={query}
      onChange={(event) => {
        setQuery(event.target.value);
        setOpen(true);
      }}
      onFocus={() => setOpen(true)}
      placeholder="جستجوی قالب، تکنولوژی، فروشنده…"
      className="h-10 w-44 rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-9 text-sm transition-all placeholder:text-slate-400 focus:w-64 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 lg:w-64"
      aria-label="جستجو"
    />
  </form>

    {open && suggestions.length > 0 ? (
      <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
        {suggestions.map((suggestion) => (
          <Link
            key={suggestion.slug}
            href={`/products/${suggestion.slug}`}
            onClick={handleSuggestionClick}
            className="block border-b border-slate-100 px-3 py-2 text-sm text-slate-700 last:border-0 hover:bg-slate-50"
          >
            {suggestion.title}
          </Link>
        ))}
      </div>
    ) : null}
  </div>

  );
}

export function CartButton({ count }: { count: number }) {
  return (<Link
    href="/cart"
    className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100"
    aria-label="سبد خرید"
  > <ShoppingCart className="h-5 w-5" />

    {count > 0 ? (
      <span className="absolute -left-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold text-white">
        {toPersianDigits(count)}
      </span>
    ) : null}
  </Link>

  );
}

export function UserMenu({
  user,
  unread,
}: {
  user: HeaderUser | null;
  unread: number;
}) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  const userKey = user ? `${user.id}:${user.role}` : "guest";

  useEffect(() => {
    setOpen(false);
  }, [userKey, pathname]);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };

  }, []);

  if (!user) {
    return (<div className="flex items-center gap-2"> <Link
      href="/auth/login"
      className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
    >
      ورود </Link>

      <Link
        href="/auth/register"
        className="hidden rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-brand-700 sm:block"
      >
        ثبت‌نام
      </Link>
    </div>
    );

  }

  const dashboardHref =
    user.role === "ADMIN"
      ? "/admin"
      : user.role === "SELLER"
        ? "/dashboard/seller"
        : "/dashboard/customer";

  const notificationsHref =
    user.role === "ADMIN"
      ? "/admin"
      : user.role === "SELLER"
        ? "/dashboard/seller/notifications"
        : "/dashboard/customer/notifications";

  function toggleMenu() {
    setOpen((current) => !current);
  }

  function closeMenu() {
    setOpen(false);
  }

  return (<div ref={ref} className="relative"> <button
    type="button"
    onClick={toggleMenu}
    className="flex h-10 items-center gap-1.5 rounded-lg px-2 text-slate-700 transition-colors hover:bg-slate-100"
    aria-label="منوی حساب کاربری"
    aria-expanded={open}
    aria-haspopup="menu"
  > <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
      {user.name.slice(0, 1)} </span>

    <ChevronDown
      className={cn(
        "hidden h-4 w-4 text-slate-400 transition-transform sm:block",
        open && "rotate-180",
      )}
    />
  </button>

    {open ? (
      <div
        className="absolute left-0 top-12 z-50 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        role="menu"
      >
        <div className="border-b border-slate-100 px-4 py-3">
          <p className="truncate text-sm font-semibold text-slate-900">
            {user.name}
          </p>

          <p className="text-xs text-slate-500">
            {user.role === "ADMIN"
              ? "مدیر"
              : user.role === "SELLER"
                ? "فروشنده"
                : "مشتری"}
          </p>
        </div>

        <div className="p-1.5 text-sm">
          <MenuItem
            href={dashboardHref}
            icon={<LayoutDashboard className="h-4 w-4" />}
            label="داشبورد"
            onClick={closeMenu}
          />

          <MenuItem
            href={notificationsHref}
            icon={<Bell className="h-4 w-4" />}
            label="اعلان‌ها"
            badge={unread}
            onClick={closeMenu}
          />

          {user.role === "CUSTOMER" ? (
            <>
              <MenuItem
                href="/dashboard/customer/wishlist"
                icon={<Heart className="h-4 w-4" />}
                label="علاقه‌مندی‌ها"
                onClick={closeMenu}
              />

              <MenuItem
                href="/dashboard/customer/orders"
                icon={<Package className="h-4 w-4" />}
                label="سفارش‌ها"
                onClick={closeMenu}
              />
            </>
          ) : null}

          {user.role === "SELLER" ? (
            <MenuItem
              href="/dashboard/seller/products"
              icon={<Store className="h-4 w-4" />}
              label="محصولات من"
              onClick={closeMenu}
            />
          ) : null}

          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-slate-700 transition-colors hover:bg-rose-50 hover:text-rose-700"
            >
              <LogOut className="h-4 w-4" />
              خروج از حساب
            </button>
          </form>
        </div>
      </div>
    ) : null}
  </div>

  );
}

function MenuItem({
  href,
  icon,
  label,
  badge,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  onClick: () => void;
}) {
  return (<Link
    href={href}
    onClick={onClick}
    className="flex items-center justify-between rounded-lg px-3 py-2 text-slate-700 transition-colors hover:bg-slate-50"
    role="menuitem"
  > <span className="flex items-center gap-2.5">
      {icon}
      {label} </span>

    {badge && badge > 0 ? (
      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold text-white">
        {toPersianDigits(badge)}
      </span>
    ) : null}
  </Link>

  );
}

export function MobileMenu({
  categories,
  user,
}: {
  categories: Category[];
  user: HeaderUser | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname, user?.id]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid h-10 w-10 place-items-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
        aria-label="منو"
        aria-expanded={open}
      > <Menu className="h-5 w-5" /> </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            onClick={closeMenu}
            aria-label="بستن منو"
          />

          <div className="absolute inset-y-0 right-0 flex w-80 max-w-[85%] flex-col overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <span className="text-base font-bold">
                قالبی <span className="text-gradient">نو</span>
              </span>

              <button
                type="button"
                onClick={closeMenu}
                className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="بستن"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              {!user ? (
                <div className="mb-4 flex gap-2">
                  <Link
                    href="/auth/login"
                    onClick={closeMenu}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-medium"
                  >
                    ورود
                  </Link>

                  <Link
                    href="/auth/register"
                    onClick={closeMenu}
                    className="flex-1 rounded-lg bg-brand-600 px-3 py-2 text-center text-sm font-medium text-white"
                  >
                    ثبت‌نام
                  </Link>
                </div>
              ) : null}

              <nav className="space-y-1">
                {[
                  {
                    href: "/",
                    label: "صفحه اصلی",
                    icon: <LayoutDashboard className="h-4 w-4" />,
                  },
                  {
                    href: "/marketplace",
                    label: "بازارچه",
                    icon: <Store className="h-4 w-4" />,
                  },
                  {
                    href: "/sellers",
                    label: "فروشندگان",
                    icon: <UserIcon className="h-4 w-4" />,
                  },
                  {
                    href: "/blog",
                    label: "وبلاگ",
                    icon: <Package className="h-4 w-4" />,
                  },
                  {
                    href: "/help",
                    label: "راهنما",
                    icon: <Bell className="h-4 w-4" />,
                  },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>

              <p className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wide text-slate-400">
                دسته‌بندی‌ها
              </p>

              <div className="grid grid-cols-2 gap-1.5">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    onClick={closeMenu}
                    className="rounded-lg border border-slate-100 px-3 py-2 text-sm text-slate-600 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>

  );
}