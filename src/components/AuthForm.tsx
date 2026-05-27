"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaVersion, setCaptchaVersion] = useState(0);
  const isLogin = mode === "login";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(json.error || "操作失败");
      setCaptchaVersion((value) => value + 1);
      return;
    }
    router.push("/admin/blogs");
    router.refresh();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#5f6b6f] text-white">
      <div className="absolute inset-0 bg-[url('/login-bg.svg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-slate-900/38" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_42%,rgba(255,255,255,0.10),transparent_0_19%,transparent_42%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-black/20 to-transparent" />

      <section className="relative z-10 flex min-h-screen items-center px-[8vw]">
        <div className="absolute left-[8.5vw] top-[17vh] select-none">
          <h1 className="text-[44px] font-light tracking-wide text-white drop-shadow-sm">OPEN-IMyself</h1>
          <p className="mt-5 text-sm tracking-wide text-white/90">专注于自媒体引流的免费开放平台</p>
        </div>

        <form onSubmit={onSubmit} className="mx-auto mt-8 w-[470px] rounded-[3px] bg-white px-[58px] pb-14 pt-8 text-slate-700 shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
          <h2 className="mb-8 text-center text-xl font-normal text-slate-800">{isLogin ? "用户登录" : "用户注册"}</h2>
          {!isLogin && (
            <input name="name" required placeholder="昵称" className="mb-5 h-9 w-full border border-slate-200 px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400" />
          )}
          <input name="email" type="email" required placeholder="邮箱" className="mb-5 h-9 w-full border border-slate-200 px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400" />
          <input name="password" type="password" required placeholder="密码" className="mb-5 h-9 w-full border border-slate-200 px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400" />
          {isLogin && (
            <div className="mb-8 flex items-center gap-5">
              <input name="captcha" required placeholder="验证码" className="h-9 min-w-0 flex-1 border border-slate-200 px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400" />
              <button type="button" onClick={() => setCaptchaVersion((value) => value + 1)} className="h-9 w-[130px] overflow-hidden bg-slate-100" title="点击刷新验证码">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/auth/captcha?v=${captchaVersion}`} alt="验证码" className="h-full w-full object-contain" />
              </button>
            </div>
          )}
          {!isLogin && <div className="mb-8" />}
          {error && <div className="mb-4 border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
          <button disabled={loading} className="h-9 w-full bg-[#3f8df5] text-sm font-semibold text-white hover:bg-[#2f7ee8] disabled:opacity-60">
            {loading ? "处理中..." : isLogin ? "登录" : "注册"}
          </button>
          <div className="mt-7 flex justify-between text-sm text-[#3f8df5]">
            <Link href="/forgot-password" className="hover:text-[#2f7ee8]">找回密码</Link>
            <Link href={isLogin ? "/register" : "/login"} className="hover:text-[#2f7ee8]">{isLogin ? "注册新账号" : "返回登录"}</Link>
          </div>
        </form>

        <div className="absolute bottom-9 left-0 right-0 text-center text-xs leading-7 text-white/95">
          <div>Copyright © 2022 - 2026 TechGrow 版权所有 赣ICP备 19024664号-1</div>
          <div>用户协议 | 免责声明 | 隐私政策 | 侵权投诉</div>
        </div>
      </section>
    </main>
  );
}
