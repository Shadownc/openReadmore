"use client";

import Link from "next/link";
import { type FormEvent, type ReactNode, useState } from "react";

async function readApiJson(response: Response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as Record<string, string | boolean>;
  } catch {
    return { error: text };
  }
}

function AuthShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
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
            <h1 className="mt-6 bg-linear-to-r from-white via-cyber-cyan/85 to-cyber-green/85 bg-clip-text text-3xl font-black tracking-[0.02em] text-transparent lg:text-4xl">
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
            <div className="flex items-center justify-between border-b border-cyber-border pb-5">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-cyber-green/85">账号安全</p>
                <h2 className="mt-2 text-xl font-black tracking-[0.03em] text-white">{title}</h2>
              </div>
              <Link href="/login" className="cyber-chamfer-sm inline-flex min-h-10 items-center justify-center border border-cyber-border bg-black/25 px-3 text-xs font-bold leading-none tracking-[0.12em] text-cyber-text/60 hover:border-cyber-green/45 hover:text-cyber-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-green">
                登录
              </Link>
            </div>
            <p className="mt-5 text-sm leading-7 text-cyber-text/56">{description}</p>
            <div className="mt-7">{children}</div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function ForgotPasswordForm() {
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
    <AuthShell title="找回密码" description="输入注册邮箱，系统会生成一个 30 分钟内有效的密码重置链接。">
      <form onSubmit={submit}>
        <CyberInput name="email" type="email" placeholder="注册邮箱" autoComplete="email" />
        {message && <StatusMessage tone="info">{message}</StatusMessage>}
        {resetUrl && (
          <div className="cyber-chamfer-sm mt-4 break-all border border-cyber-magenta/35 bg-cyber-magenta/10 px-3 py-3 text-xs leading-6 text-cyber-text/70">
            开发环境重置链接：<Link href={resetUrl} className="text-cyber-cyan hover:text-cyber-green">{resetUrl}</Link>
          </div>
        )}
        <CyberButton disabled={loading}>{loading ? "提交中..." : "生成重置链接"}</CyberButton>
      </form>
      <div className="mt-6 text-center text-sm">
        <Link href="/login" className="text-cyber-cyan/85 hover:text-cyber-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-green">返回登录</Link>
      </div>
    </AuthShell>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
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
    <AuthShell title="重置密码" description="请输入新密码。重置成功后，原有登录状态会失效。">
      {done ? (
        <div>
          <StatusMessage tone="success">密码已重置，请使用新密码登录。</StatusMessage>
          <Link href="/login" className="cyber-chamfer-sm mt-5 inline-flex min-h-11 w-full items-center justify-center border-2 border-cyber-green/70 bg-cyber-card/75 px-5 py-3 text-sm font-black leading-none tracking-[0.12em] text-cyber-green shadow-[0_0_10px_rgba(0,255,136,0.16)] hover:bg-cyber-green/12 hover:border-cyber-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-green">
            返回登录
          </Link>
        </div>
      ) : (
        <form onSubmit={submit}>
          <div className="space-y-4">
            <CyberInput name="password" type="password" placeholder="新密码，至少 8 位" autoComplete="new-password" minLength={8} />
            <CyberInput name="confirmPassword" type="password" placeholder="确认新密码" autoComplete="new-password" minLength={8} />
          </div>
          {error && <StatusMessage tone="error">{error}</StatusMessage>}
          <CyberButton disabled={loading || !token}>{loading ? "重置中..." : "确认重置"}</CyberButton>
        </form>
      )}
      <div className="mt-6 text-center text-sm">
        <Link href="/login" className="text-cyber-cyan/85 hover:text-cyber-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-green">返回登录</Link>
      </div>
    </AuthShell>
  );
}

function CyberInput({
  name,
  type = "text",
  placeholder,
  autoComplete,
  minLength,
}: {
  name: string;
  type?: string;
  placeholder: string;
  autoComplete?: string;
  minLength?: number;
}) {
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

function CyberButton({ children, disabled }: { children: ReactNode; disabled?: boolean }) {
  return (
    <button disabled={disabled} className="cyber-chamfer-sm mt-7 inline-flex min-h-11 w-full items-center justify-center border-2 border-cyber-green/70 bg-cyber-card/75 px-5 py-3 text-sm font-black leading-none tracking-[0.12em] text-cyber-green shadow-[0_0_10px_rgba(0,255,136,0.16)] hover:bg-cyber-green/12 hover:border-cyber-green disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-green">
      {children}
    </button>
  );
}

function StatusMessage({ children, tone }: { children: ReactNode; tone: "info" | "success" | "error" }) {
  const className = {
    info: "border-cyber-cyan/35 bg-cyber-cyan/10 text-cyber-cyan/90",
    success: "border-cyber-green/35 bg-cyber-green/10 text-cyber-green/90",
    error: "border-[#ff3366]/45 bg-[#ff3366]/10 text-[#ff7a99]",
  }[tone];

  return <div className={`cyber-chamfer-sm mt-4 border px-3 py-3 text-sm leading-6 ${className}`}>{children}</div>;
}
