"use client";

import { useRouter } from "next/navigation";

import { getNextTheme, type AppTheme, THEME_COOKIE_NAME } from "@/lib/theme";

type ThemeToggleProps = {
  theme: AppTheme;
  variant?: AppTheme;
  className?: string;
};

const labels: Record<AppTheme, string> = {
  cyber: "赛博主题",
  premium: "高级主题",
};

export function ThemeToggle({ theme, variant = theme, className }: ThemeToggleProps) {
  const router = useRouter();
  const nextTheme = getNextTheme(theme);
  const baseClassName =
    variant === "premium"
      ? "inline-flex min-h-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E6AD2]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506]"
      : "cyber-chamfer-sm inline-flex min-h-10 items-center justify-center border border-cyber-magenta/35 bg-cyber-magenta/8 px-3 py-2 text-xs font-black leading-none tracking-[0.12em] text-cyber-magenta shadow-[0_0_14px_rgba(255,0,255,0.08)] hover:bg-cyber-magenta/12 hover:text-cyber-magenta focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-magenta";

  function switchTheme() {
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `${THEME_COOKIE_NAME}=${nextTheme}; path=/; max-age=${maxAge}; samesite=lax`;
    router.refresh();
  }

  return (
    <button type="button" onClick={switchTheme} className={[baseClassName, className].filter(Boolean).join(" ")} title={`切换到${labels[nextTheme]}`}>
      {labels[nextTheme]}
    </button>
  );
}
