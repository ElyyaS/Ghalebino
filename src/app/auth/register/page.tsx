import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import RegisterForm from "@/components/auth/register-form";

function getDashboardPath(role: string) {
  if (role === "ADMIN") return "/admin";
  if (role === "SELLER") return "/dashboard/seller";
  return "/dashboard/customer";
}

export default async function RegisterPage() {
  const user = await getSessionUser();

  if (user) {
    redirect(getDashboardPath(user.role));
  }

  return <RegisterForm />;
}
