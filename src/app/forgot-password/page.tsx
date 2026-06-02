import { ForgotPasswordForm } from "@/components/PasswordResetForms";
import { getAppTheme } from "@/lib/server-theme";

export default async function ForgotPasswordPage() {
  const theme = await getAppTheme();
  return <ForgotPasswordForm theme={theme} />;
}
