"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { ThemeToggle } from "@/components/ThemeToggle";
import type { AppTheme } from "@/lib/theme";

export function AuthForm({ mode, theme }: { mode: "login" | "register"; theme: AppTheme }) {
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
                {isLogin ? "欢迎回来 / 继续管理你的解锁链路" : "创建账号 / 开始接入你的博客"}
              </p>
              <h1 className="mt-6 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-3xl font-semibold leading-tight tracking-[-0.03em] text-transparent lg:text-4xl">
                {isLogin ? "登录后台，查看访问与解锁记录" : "注册账号，生成公众号解锁入口"}
              </h1>
              <p className="mt-5 border-l border-white/[0.08] pl-4 text-sm leading-7 text-[#8A8F98]">
                后台用于配置博客、生成集成代码、同步公众号关键词，并记录每一次访问与解锁状态。
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="relative mx-auto w-full max-w-md overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.08] to-white/[0.025] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_24px_80px_rgba(0,0,0,0.45),0_0_80px_rgba(94,106,210,0.12)] backdrop-blur-xl sm:p-8">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-5">
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.24em] text-[#6872D9]">{isLogin ? "用户登录" : "用户注册"}</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">{isLogin ? "进入管理后台" : "创建平台账号"}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle theme={theme} variant="premium" />
                  <Link href="/" className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] px-3 text-xs font-medium text-white/65 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E6AD2]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506]">
                    首页
                  </Link>
                </div>
              </div>

              <div className="mt-7 space-y-4">
                {!isLogin && <PremiumInput name="name" placeholder="昵称" autoComplete="name" />}
                <PremiumInput name="email" type="email" placeholder="邮箱" autoComplete="email" />
                <PremiumInput name="password" type="password" placeholder="密码" autoComplete={isLogin ? "current-password" : "new-password"} />

                {isLogin && (
                  <div className="grid gap-3 sm:grid-cols-[1fr_130px]">
                    <PremiumInput name="captcha" placeholder="验证码" autoComplete="off" />
                    <button type="button" onClick={() => setCaptchaVersion((value) => value + 1)} className="flex h-11 items-center justify-center overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.04] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] hover:border-[#5E6AD2]/45 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E6AD2]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506]" title="点击刷新验证码">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/api/auth/captcha?v=${captchaVersion}`} alt="验证码" className="h-full w-full object-contain" />
                    </button>
                  </div>
                )}
              </div>

              {error && <div className="mt-5 rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm leading-6 text-rose-200">{error}</div>}

              <button disabled={loading} className="mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#5E6AD2] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_4px_14px_rgba(94,106,210,0.38),inset_0_1px_0_rgba(255,255,255,0.22)] hover:bg-[#6872D9] hover:shadow-[0_0_0_1px_rgba(94,106,210,0.6),0_8px_26px_rgba(94,106,210,0.42),inset_0_1px_0_rgba(255,255,255,0.24)] disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E6AD2]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506]">
                {loading ? "处理中..." : isLogin ? "登录" : "注册"}
              </button>

              <div className="mt-6 flex items-center justify-between text-sm">
                <Link href="/forgot-password" className="text-white/45 hover:text-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E6AD2]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506]">找回密码</Link>
                <Link href={isLogin ? "/register" : "/login"} className="text-indigo-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E6AD2]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506]">
                  {isLogin ? "注册新账号" : "返回登录"}
                </Link>
              </div>
            </div>
          </form>
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
              {isLogin ? "欢迎回来 / 继续管理你的解锁链路" : "创建账号 / 开始接入你的博客"}
            </p>
            <h1 className="mt-6 bg-gradient-to-r from-white via-cyber-cyan/85 to-cyber-green/85 bg-clip-text text-3xl font-black tracking-[0.02em] text-transparent lg:text-4xl">
              {isLogin ? "登录后台，查看访问与解锁记录" : "注册账号，生成公众号解锁入口"}
            </h1>
            <p className="mt-5 border-l border-cyber-border pl-4 text-sm leading-7 text-cyber-text/56">
              后台用于配置博客、生成集成代码、同步公众号关键词，并记录每一次访问与解锁状态。
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="cyber-card cyber-chamfer relative mx-auto w-full max-w-md p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-3">
            <span className="absolute left-0 top-0 h-5 w-5 border-l border-t border-cyber-green/45" />
            <span className="absolute right-0 top-0 h-5 w-5 border-r border-t border-cyber-cyan/45" />
            <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-cyber-cyan/35" />
            <span className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-cyber-green/35" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between gap-3 border-b border-cyber-border pb-5">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-cyber-green/85">{isLogin ? "用户登录" : "用户注册"}</p>
                <h2 className="mt-2 text-xl font-black tracking-[0.03em] text-white">{isLogin ? "进入管理后台" : "创建平台账号"}</h2>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle theme={theme} variant="cyber" />
                <Link href="/" className="cyber-chamfer-sm inline-flex min-h-10 items-center justify-center border border-cyber-border bg-black/25 px-3 text-xs font-bold leading-none tracking-[0.12em] text-cyber-text/60 hover:border-cyber-green/45 hover:text-cyber-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-green">
                  首页
                </Link>
              </div>
            </div>

            <div className="mt-7 space-y-4">
              {!isLogin && <CyberInput name="name" placeholder="昵称" autoComplete="name" />}
              <CyberInput name="email" type="email" placeholder="邮箱" autoComplete="email" />
              <CyberInput name="password" type="password" placeholder="密码" autoComplete={isLogin ? "current-password" : "new-password"} />

              {isLogin && (
                <div className="grid gap-3 sm:grid-cols-[1fr_130px]">
                  <CyberInput name="captcha" placeholder="验证码" autoComplete="off" />
                  <button type="button" onClick={() => setCaptchaVersion((value) => value + 1)} className="cyber-chamfer-sm flex h-11 items-center justify-center overflow-hidden border border-cyber-border bg-black/35 p-1 hover:border-cyber-cyan/45 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-cyan" title="点击刷新验证码">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/api/auth/captcha?v=${captchaVersion}`} alt="验证码" className="h-full w-full object-contain" />
                  </button>
                </div>
              )}
            </div>

            {error && <div className="cyber-chamfer-sm mt-5 border border-[#ff3366]/45 bg-[#ff3366]/10 px-3 py-2 text-sm leading-6 text-[#ff7a99]">{error}</div>}

            <button disabled={loading} className="cyber-chamfer-sm mt-7 inline-flex min-h-11 w-full items-center justify-center border-2 border-cyber-green/70 bg-cyber-card/75 px-5 py-3 text-sm font-black leading-none tracking-[0.12em] text-cyber-green shadow-[0_0_10px_rgba(0,255,136,0.16)] hover:bg-cyber-green/12 hover:border-cyber-green disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-green">
              {loading ? "处理中..." : isLogin ? "登录" : "注册"}
            </button>

            <div className="mt-6 flex items-center justify-between text-sm">
              <Link href="/forgot-password" className="text-cyber-text/50 hover:text-cyber-cyan focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-cyan">找回密码</Link>
              <Link href={isLogin ? "/register" : "/login"} className="text-cyber-cyan/85 hover:text-cyber-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-green">
                {isLogin ? "注册新账号" : "返回登录"}
              </Link>
            </div>
          </div>
        </form>
      </section>
    </main>
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

function CyberInput({
  name,
  type = "text",
  placeholder,
  autoComplete,
}: {
  name: string;
  type?: string;
  placeholder: string;
  autoComplete?: string;
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
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-full min-w-0 flex-1 bg-transparent text-cyber-text outline-none placeholder:text-cyber-text/32"
        />
      </span>
    </label>
  );
}

function PremiumInput({
  name,
  type = "text",
  placeholder,
  autoComplete,
}: {
  name: string;
  type?: string;
  placeholder: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="sr-only">{placeholder}</span>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-11 w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] placeholder:text-white/30 focus:border-[#5E6AD2]/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#5E6AD2]/25"
      />
    </label>
  );
}
