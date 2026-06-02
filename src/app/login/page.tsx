import { AuthForm } from "@/components/AuthForm";
import { getAppTheme } from "@/lib/server-theme";

export default async function LoginPage() {
  const theme = await getAppTheme();
  return <AuthForm mode="login" theme={theme} />;
}
