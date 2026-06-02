import { AuthForm } from "@/components/AuthForm";
import { getAppTheme } from "@/lib/server-theme";

export default async function RegisterPage() {
  const theme = await getAppTheme();
  return <AuthForm mode="register" theme={theme} />;
}
