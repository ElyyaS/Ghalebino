import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Alert } from "@/components/ui/feedback";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : "";

  return (
    <AuthCard title="بازنشانی رمز عبور" subtitle="رمز عبور جدید خود را وارد کنید">
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <Alert tone="danger">لینک بازیابی نامعتبر است.</Alert>
      )}
    </AuthCard>
  );
}
