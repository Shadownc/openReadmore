"use client";

import Link from "next/link";
import { type FormEvent, type ReactNode, useState } from "react";

import { ThemeToggle } from "@/components/ThemeToggle";
import type { AppTheme } from "@/lib/theme";

async function readApiJson(response: Response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as Record<string, string | boolean>;
  } catch {
    return { error: text };
  }
}

function AuthShell({ title, description, theme, children }: { title: string; description: string; theme: AppTheme; children: ReactNode }) {
  if (theme === "premium") {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#050506] text-[#EDEDEF]">
        <PremiumAmbientBackground />

        <section className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-5 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="hidden lg:block">
            <Link href="/" className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E6AD2]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506]">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5E6AD2] text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_10px_28px_rgba(94,106,210,0.35),inset_0_1px_0_rgba(255,255,255,0.22)]">R</span>
              <span className="text-sm font-semibold tracking-tight text-white">openReadmore</span>
            </Link>

            <div className="mt-12 max-w-xl">
              <p className="inline-flex rounded-full border border-[#5E6AD2]/30 bg-[#5E6AD2]/10 px-3.5 py-2 text-xs font-medium tracking-wide text-indigo-100 shadow-[0_0_40px_rgba(94,106,210,0.16)] backdrop-blur-xl">
                密码找回 / 安全重置链路
              </p>
              <h1 className="mt-6 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-3xl font-semibold leading-tight tracking-[-0.03em] text-transparent lg:text-4xl">
                通过注册邮箱重新接管账号
              </h1>
              <p className="mt-5 border-l border-white/[0.08] pl-4 text-sm leading-7 text-[#8A8F98]">
                系统会生成限时重置链接。完成重置后，原密码与旧登录状态会失效，后台访问需要使用新密码。
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.08] to-white/[0.025] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_24px_80px_rgba(0,0,0,0.45),0_0_80px_rgba(94,106,210,0.12)] backdrop-blur-xl sm:p-8">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-5">
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.24em] text-[#6872D9]">账号安全</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">{title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle theme={theme} variant="premium" />
                  <Link href="/login" className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] px-3 text-xs font-medium text-white/65 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E6AD2]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506]">
                    登录
                  </Link>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-[#8A8F98]">{description}</p>
              <div className="mt-7">{children}</div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="cyber-home relative min-h-screen overflow-hidden bg-cyber-bg text-cyber-text">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_top,#10101a_0%,#0a0a0f_48%,#030307_100%)]">
        <div className="cyber-grid absolute inset-0 opacity-35" />
        <div className="cyber-scanlines absolute inset-0 opacity-28" />
        <div className="absolute -left-72 top-16 h-136 w-120 rounded-full bg-cyber-green/7 blur-[120px]" />
        <div className="absolute -right-64 top-28 h-136 w-120 rounded-full bg-cyber-cyan/8 blur-[120px]" />
        <div className="absolute -bottom-72 left-1/2 h-128 w-208 -translate-x-1/2 rounded-full bg-cyber-magenta/6 blur-[130px]" />
      </div>

      <section className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-5 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="hidden lg:block">
          <Link href="/" className="inline-flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-green">
            <span className="cyber-chamfer-sm flex h-9 w-9 items-center justify-center border border-cyber-green/45 bg-cyber-green/8 text-sm font-black text-cyber-green shadow-[0_0_12px_rgba(0,255,136,0.14)]">阅</span>
            <span className="text-sm font-black tracking-[0.08em] text-white">公众号解锁平台</span>
          </Link>

          <div className="mt-12 max-w-xl">
            <p className="cyber-chamfer-sm inline-flex border border-cyber-border/80 bg-cyber-card/70 px-3 py-2 text-[11px] font-semibold tracking-[0.14em] text-cyber-text/70">
              密码找回 / 安全重置链路
            </p>
            <h1 className="mt-6 bg-gradient-to-r from-white via-cyber-cyan/85 to-cyber-green/85 bg-clip-text text-3xl font-black tracking-[0.02em] text-transparent lg:text-4xl">
              通过注册邮箱重新接管账号
            </h1>
            <p className="mt-5 border-l border-cyber-border pl-4 text-sm leading-7 text-cyber-text/56">
              系统会生成限时重置链接。完成重置后，原密码与旧登录状态会失效，后台访问需要使用新密码。
            </p>
          </div>
        </div>

        <div className="cyber-card cyber-chamfer relative mx-auto w-full max-w-md p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-3">
            <span className="absolute left-0 top-0 h-5 w-5 border-l border-t border-cyber-green/45" />
            <span className="absolute right-0 top-0 h-5 w-5 border-r border-t border-cyber-cyan/45" />
            <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-cyber-cyan/35" />
            <span className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-cyber-green/35" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between gap-3 border-b border-cyber-border pb-5">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-cyber-green/85">账号安全</p>
                <h2 className="mt-2 text-xl font-black tracking-[0.03em] text-white">{title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle theme={theme} variant="cyber" />
                <Link href="/login" className="cyber-chamfer-sm inline-flex min-h-10 items-center justify-center border border-cyber-border bg-black/25 px-3 text-xs font-bold leading-none tracking-[0.12em] text-cyber-text/60 hover:border-cyber-green/45 hover:text-cyber-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-green">
                  登录
                </Link>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-cyber-text/56">{description}</p>
            <div className="mt-7">{children}</div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function ForgotPasswordForm({ theme }: { theme: AppTheme }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setResetUrl("");
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email") }),
    });
    const json = await readApiJson(res);
    setLoading(false);
    setMessage(String(json.message || json.error || "如果邮箱存在，系统会生成重置链接。"));
    if (json.resetUrl) setResetUrl(String(json.resetUrl));
  }

  return (
    <AuthShell theme={theme} title="找回密码" description="输入注册邮箱，系统会生成一个 30 分钟内有效的密码重置链接。">
      <form onSubmit={submit}>
        <ThemedInput theme={theme} name="email" type="email" placeholder="注册邮箱" autoComplete="email" />
        {message && <StatusMessage theme={theme} tone="info">{message}</StatusMessage>}
        {resetUrl && (
          <div className={theme === "premium" ? "mt-4 break-all rounded-lg border border-[#5E6AD2]/30 bg-[#5E6AD2]/10 px-3 py-3 text-xs leading-6 text-white/70" : "cyber-chamfer-sm mt-4 break-all border border-cyber-magenta/35 bg-cyber-magenta/10 px-3 py-3 text-xs leading-6 text-cyber-text/70"}>
            开发环境重置链接：<Link href={resetUrl} className={theme === "premium" ? "text-indigo-200 hover:text-white" : "text-cyber-cyan hover:text-cyber-green"}>{resetUrl}</Link>
          </div>
        )}
        <ThemedButton theme={theme} disabled={loading}>{loading ? "提交中..." : "生成重置链接"}</ThemedButton>
      </form>
      <div className="mt-6 text-center text-sm">
        <Link href="/login" className={theme === "premium" ? "text-indigo-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E6AD2]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506]" : "text-cyber-cyan/85 hover:text-cyber-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-green"}>返回登录</Link>
      </div>
    </AuthShell>
  );
}

export function ResetPasswordForm({ token, theme }: { token: string; theme: AppTheme }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");
    if (password !== confirmPassword) {
      setLoading(false);
      setError("两次输入的密码不一致");
      return;
    }
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const json = await readApiJson(res);
    setLoading(false);
    if (!res.ok) {
      setError(String(json.error || "重置失败"));
      return;
    }
    setDone(true);
  }

  return (
    <AuthShell theme={theme} title="重置密码" description="请输入新密码。重置成功后，原有登录状态会失效。">
      {done ? (
        <div>
          <StatusMessage theme={theme} tone="success">密码已重置，请使用新密码登录。</StatusMessage>
          <Link href="/login" className={buttonClassName(theme, false)}>
            返回登录
          </Link>
        </div>
      ) : (
        <form onSubmit={submit}>
          <div className="space-y-4">
            <ThemedInput theme={theme} name="password" type="password" placeholder="新密码，至少 8 位" autoComplete="new-password" minLength={8} />
            <ThemedInput theme={theme} name="confirmPassword" type="password" placeholder="确认新密码" autoComplete="new-password" minLength={8} />
          </div>
          {error && <StatusMessage theme={theme} tone="error">{error}</StatusMessage>}
          <ThemedButton theme={theme} disabled={loading || !token}>{loading ? "重置中..." : "确认重置"}</ThemedButton>
        </form>
      )}
      <div className="mt-6 text-center text-sm">
        <Link href="/login" className={theme === "premium" ? "text-indigo-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E6AD2]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506]" : "text-cyber-cyan/85 hover:text-cyber-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-green"}>返回登录</Link>
      </div>
    </AuthShell>
  );
}

function PremiumAmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_top,#0a0a0f_0%,#050506_48%,#020203_100%)]">
      <div className="absolute left-[calc(50%-27rem)] -top-112 h-288 w-216 rounded-full bg-[#5E6AD2]/25 blur-[150px] homepage-ambient-float" />
      <div className="absolute left-[-22rem] top-32 h-[42rem] w-[34rem] rounded-full bg-fuchsia-500/12 blur-[120px] homepage-ambient-float homepage-ambient-float-delay" />
      <div className="absolute right-[-18rem] top-48 h-[38rem] w-[30rem] rounded-full bg-blue-500/12 blur-[110px] homepage-ambient-float homepage-ambient-float-slow" />
      <div className="absolute bottom-[-26rem] left-1/2 h-[42rem] w-[56rem] -translate-x-1/2 rounded-full bg-[#5E6AD2]/10 blur-[120px] homepage-ambient-pulse" />
      <div className="absolute inset-0 opacity-[0.018] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:64px_64px]" />
    </div>
  );
}

function ThemedInput({
  theme,
  name,
  type = "text",
  placeholder,
  autoComplete,
  minLength,
}: {
  theme: AppTheme;
  name: string;
  type?: string;
  placeholder: string;
  autoComplete?: string;
  minLength?: number;
}) {
  if (theme === "premium") {
    return (
      <label className="block">
        <span className="sr-only">{placeholder}</span>
        <input
          name={name}
          type={type}
          required
          minLength={minLength}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-11 w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] placeholder:text-white/30 focus:border-[#5E6AD2]/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#5E6AD2]/25"
        />
      </label>
    );
  }

  return (
    <label className="block">
      <span className="sr-only">{placeholder}</span>
      <span className="cyber-chamfer-sm flex h-11 items-center border border-cyber-border bg-black/35 px-3 text-sm text-cyber-text/80 transition-colors focus-within:border-cyber-green/65 focus-within:shadow-[0_0_12px_rgba(0,255,136,0.12)]">
        <span className="mr-2 text-cyber-green/80">&gt;</span>
        <input
          name={name}
          type={type}
          required
          minLength={minLength}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-full min-w-0 flex-1 bg-transparent text-cyber-text outline-none placeholder:text-cyber-text/32"
        />
      </span>
    </label>
  );
}

function ThemedButton({ children, disabled, theme }: { children: ReactNode; disabled?: boolean; theme: AppTheme }) {
  return <button disabled={disabled} className={buttonClassName(theme, disabled)}>{children}</button>;
}

function buttonClassName(theme: AppTheme, disabled?: boolean) {
  const disabledClassName = disabled ? " disabled:cursor-not-allowed disabled:opacity-55" : " disabled:cursor-not-allowed disabled:opacity-55";
  if (theme === "premium") {
    return `mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#5E6AD2] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_4px_14px_rgba(94,106,210,0.38),inset_0_1px_0_rgba(255,255,255,0.22)] hover:bg-[#6872D9] hover:shadow-[0_0_0_1px_rgba(94,106,210,0.6),0_8px_26px_rgba(94,106,210,0.42),inset_0_1px_0_rgba(255,255,255,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E6AD2]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506]${disabledClassName}`;
  }

  return `cyber-chamfer-sm mt-7 inline-flex min-h-11 w-full items-center justify-center border-2 border-cyber-green/70 bg-cyber-card/75 px-5 py-3 text-sm font-black leading-none tracking-[0.12em] text-cyber-green shadow-[0_0_10px_rgba(0,255,136,0.16)] hover:bg-cyber-green/12 hover:border-cyber-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-green${disabledClassName}`;
}

function StatusMessage({ children, tone, theme }: { children: ReactNode; tone: "info" | "success" | "error"; theme: AppTheme }) {
  const className =
    theme === "premium"
      ? {
          info: "rounded-lg border-[#5E6AD2]/30 bg-[#5E6AD2]/10 text-indigo-100",
          success: "rounded-lg border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
          error: "rounded-lg border-rose-400/30 bg-rose-500/10 text-rose-200",
        }[tone]
      : {
          info: "cyber-chamfer-sm border-cyber-cyan/35 bg-cyber-cyan/10 text-cyber-cyan/90",
          success: "cyber-chamfer-sm border-cyber-green/35 bg-cyber-green/10 text-cyber-green/90",
          error: "cyber-chamfer-sm border-[#ff3366]/45 bg-[#ff3366]/10 text-[#ff7a99]",
        }[tone];

  return <div className={`mt-4 border px-3 py-3 text-sm leading-6 ${className}`}>{children}</div>;
}
