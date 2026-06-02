export type AppTheme = "cyber" | "premium";

export const THEME_COOKIE_NAME = "openreadmore-theme";
export const DEFAULT_THEME: AppTheme = "cyber";

export function normalizeTheme(value: unknown): AppTheme {
  return value === "premium" || value === "cyber" ? value : DEFAULT_THEME;
}

export function getNextTheme(theme: AppTheme): AppTheme {
  return theme === "cyber" ? "premium" : "cyber";
}
