import { ResetPasswordForm } from "@/components/PasswordResetForms";
import { getAppTheme } from "@/lib/server-theme";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const [{ token = "" }, theme] = await Promise.all([searchParams, getAppTheme()]);
  return <ResetPasswordForm token={token} theme={theme} />;
}
