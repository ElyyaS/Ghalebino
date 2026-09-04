import type { ReactNode } from "react";
import { DashboardSidebar, type NavItem } from "./dashboard-sidebar";

export function DashboardShell({
  title,
  subtitle,
  items,
  children,
}: {
  title: string;
  subtitle?: string;
  items: NavItem[];
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-6 md:flex-row">
        <DashboardSidebar items={items} />
        <div className="min-w-0 flex-1">
          <header className="mb-6">
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
