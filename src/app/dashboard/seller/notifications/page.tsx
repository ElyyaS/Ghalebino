import Link from "next/link";
import { Bell } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { getNotifications } from "@/server/queries";
import { formatDate } from "@/lib/format";
import { EmptyState } from "@/components/ui/feedback";
import { MarkNotificationsRead } from "@/components/dashboard/customer-actions";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = (await getSessionUser())!;

  const items = await getNotifications(user.id);

  return (<div className="space-y-4">
    {items.length > 0 ? (<div className="flex justify-end"> <MarkNotificationsRead /> </div>
    ) : null}

    {items.length > 0 ? (
      <div className="space-y-2">
        {items.map((notification) => (
          <Link
            key={notification.id}
            href={notification.link ?? "#"}
            className={`block rounded-2xl border bg-white p-4 transition-colors hover:border-brand-300 ${notification.isRead
                ? "border-slate-200"
                : "border-brand-200"
              }`}
          >
            <div className="flex items-center justify-between">
              <p className="font-medium text-slate-900">
                {notification.title}
              </p>

              {!notification.isRead ? (
                <span className="h-2 w-2 rounded-full bg-brand-600" />
              ) : null}
            </div>

            {notification.body ? (
              <p className="mt-1 text-sm text-slate-500">
                {notification.body}
              </p>
            ) : null}

            <p className="mt-2 text-xs text-slate-400">
              {formatDate(notification.createdAt)}
            </p>
          </Link>
        ))}
      </div>
    ) : (
      <EmptyState
        icon={<Bell className="h-10 w-10" />}
        title="اعلانی ندارید"
      />
    )}
  </div>

  );
}
