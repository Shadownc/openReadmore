"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

async function readApiJson(response: Response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as Record<string, string | boolean>;
  } catch {
    return { error: text };
  }
}

function AuthShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#5f6b6f] text-white">
      <div className="absolute inset-0 bg-[url('/login-bg.svg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-slate-900/38" />
      <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-black/20 to-transparent" />
      <section className="relative z-10 flex min-h-screen items-center px-[8vw]">
        <div className="absolute left-[8.5vw] top-[17vh] select-none">
          <h1 className="text-[44px] font-light tracking-wide text-white drop-shadow-sm">OPEN-IMyself</h1>
          <p className="mt-5 text-sm tracking-wide text-white/90">专注于自媒体引流的免费开放平台</p>
        </div>
        <div className="mx-auto mt-8 w-[470px] rounded-[3px] bg-white px-[58px] pb-14 pt-8 text-slate-700 shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
          <h2 className="text-center text-xl font-normal text-slate-800">{title}</h2>
          <p className="mb-8 mt-3 text-center text-sm leading-6 text-slate-400">{description}</p>
          {children}
        </div>
        <div className="absolute bottom-9 left-0 right-0 text-center text-xs leading-7 text-white/95">
          <div>Copyright © 2022 - 2026 TechGrow 版权所有 赣ICP备 19024664号-1</div>
          <div>用户协议 | 免责声明 | 隐私政策 | 侵权投诉</div>
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
        <input name="email" type="email" required placeholder="注册邮箱" className="mb-5 h-9 w-full border border-slate-200 px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400" />
        {message && <div className="mb-4 border border-blue-100 bg-blue-50 px-3 py-2 text-sm leading-6 text-blue-600">{message}</div>}
        {resetUrl && (
          <div className="mb-4 break-all border border-amber-100 bg-amber-50 px-3 py-2 text-xs leading-6 text-amber-700">
            开发环境重置链接：<Link href={resetUrl} className="text-blue-600 hover:underline">{resetUrl}</Link>
          </div>
        )}
        <button disabled={loading} className="h-9 w-full bg-[#3f8df5] text-sm font-semibold text-white hover:bg-[#2f7ee8] disabled:opacity-60">
          {loading ? "提交中..." : "生成重置链接"}
        </button>
      </form>
      <div className="mt-7 text-center text-sm text-[#3f8df5]">
        <Link href="/login" className="hover:text-[#2f7ee8]">返回登录</Link>
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
          <div className="mb-5 border border-green-100 bg-green-50 px-3 py-3 text-sm text-green-700">密码已重置，请使用新密码登录。</div>
          <Link href="/login" className="block h-9 bg-[#3f8df5] text-center text-sm font-semibold leading-9 text-white hover:bg-[#2f7ee8]">返回登录</Link>
        </div>
      ) : (
        <form onSubmit={submit}>
          <input name="password" type="password" required minLength={8} placeholder="新密码，至少 8 位" className="mb-5 h-9 w-full border border-slate-200 px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400" />
          <input name="confirmPassword" type="password" required minLength={8} placeholder="确认新密码" className="mb-5 h-9 w-full border border-slate-200 px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400" />
          {error && <div className="mb-4 border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
          <button disabled={loading || !token} className="h-9 w-full bg-[#3f8df5] text-sm font-semibold text-white hover:bg-[#2f7ee8] disabled:opacity-60">
            {loading ? "重置中..." : "确认重置"}
          </button>
        </form>
      )}
      <div className="mt-7 text-center text-sm text-[#3f8df5]">
        <Link href="/login" className="hover:text-[#2f7ee8]">返回登录</Link>
      </div>
    </AuthShell>
  );
}
