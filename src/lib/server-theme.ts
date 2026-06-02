import { cookies } from "next/headers";

import { normalizeTheme, THEME_COOKIE_NAME } from "@/lib/theme";

export async function getAppTheme() {
  const cookieStore = await cookies();
  return normalizeTheme(cookieStore.get(THEME_COOKIE_NAME)?.value);
}
