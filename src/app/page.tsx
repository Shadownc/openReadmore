import { CyberHome } from "@/components/CyberHome";
import { PremiumHome } from "@/components/PremiumHome";
import { getAppTheme } from "@/lib/server-theme";

export default async function Home() {
  const theme = await getAppTheme();

  if (theme === "premium") {
    return <PremiumHome theme={theme} />;
  }

  return <CyberHome theme={theme} />;
}
