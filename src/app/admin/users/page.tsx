import { getAdminUsers } from "@/server/queries";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/feedback";
import { UserRoleSelect, UserStatusSelect } from "@/components/admin/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-start font-medium">کاربر</th>
              <th className="px-4 py-3 text-start font-medium">نقش</th>
              <th className="px-4 py-3 text-start font-medium">وضعیت</th>
              <th className="px-4 py-3 text-start font-medium">تاریخ عضویت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{u.name}</p>
                  <p className="text-xs text-slate-400" dir="ltr">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <UserRoleSelect userId={u.id} current={u.role} />
                </td>
                <td className="px-4 py-3">
                  <UserStatusSelect userId={u.id} current={u.status} />
                </td>
                <td className="px-4 py-3 text-slate-500">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
