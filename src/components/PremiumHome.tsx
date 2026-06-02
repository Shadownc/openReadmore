import Link from "next/link";
import type { ReactNode } from "react";

import { SpotlightCard } from "@/components/SpotlightCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { AppTheme } from "@/lib/theme";

type FeatureIconName = "blog" | "guide" | "record";

type Feature = {
  title: string;
  description: string;
  eyebrow: string;
  icon: FeatureIconName;
};

const features: Feature[] = [
  {
    title: "博客注册",
    description: "配置公众号名称、关键词、二维码和验证码有效期，为每个博客生成独立接入方案。",
    eyebrow: "Register",
    icon: "blog",
  },
  {
    title: "使用说明",
    description: "自动整理 HTML、Hexo 配置和公众号自动回复链接，让接入步骤可复制、可追踪。",
    eyebrow: "Integrate",
    icon: "guide",
  },
  {
    title: "浏览记录",
    description: "记录访客 IP、文章链接、解锁方式和成功状态，帮助你观察转化与异常访问。",
    eyebrow: "Observe",
    icon: "record",
  },
];

const workflowSteps = [
  ["01", "登记博客", "录入博客域名、公众号二维码和自动回复关键词。"],
  ["02", "生成代码", "复制 JS/CSS 片段，粘贴到博客主题或 Hexo 配置中。"],
  ["03", "关注解锁", "访客扫码关注公众号，使用自动回复验证码解锁全文。"],
  ["04", "回看数据", "在后台查看访问记录、成功状态和文章来源。"],
] as const;

const previewRows = [
  ["Hexo 集成片段", "已生成", "text-emerald-300"],
  ["验证码有效期", "30 分钟", "text-indigo-200"],
  ["今日解锁", "128 次", "text-sky-200"],
] as const;

const stats = [
  ["3 步", "完成博客接入"],
  ["JS/CSS", "可复制集成代码"],
  ["实时", "浏览记录追踪"],
] as const;

export function PremiumHome({ theme }: { theme: AppTheme }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050506] text-[#EDEDEF]">
      <AmbientBackground />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 lg:px-8">
        <Header theme={theme} />

        <section className="grid flex-1 items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#5E6AD2]/30 bg-[#5E6AD2]/10 px-3.5 py-2 text-xs font-medium tracking-wide text-indigo-100 shadow-[0_0_40px_rgba(94,106,210,0.16)] backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6872D9] shadow-[0_0_16px_rgba(104,114,217,0.9)]" />
              公众号引流解锁博客平台
            </div>

            <h1 className="mt-7 max-w-4xl text-3xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-4xl md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-b from-white via-white/95 to-white/65 bg-clip-text text-transparent">
                给博客添加
              </span>
              <span className="homepage-gradient-text block bg-gradient-to-r from-[#5E6AD2] via-indigo-300 to-[#5E6AD2] bg-[length:200%_100%] bg-clip-text text-transparent motion-reduce:animate-none">
                关注公众号解锁体验
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#8A8F98] sm:text-base">
              后台注册博客配置，生成可复制的 JS/CSS 集成代码；访客扫码关注公众号并通过自动回复链接获取验证码后，即可解锁博客全文。
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/register" variant="primary">
                注册账号
                <ArrowRightIcon />
              </ButtonLink>
              <ButtonLink href="/admin/blogs" variant="secondary">
                进入后台
              </ButtonLink>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3 border-t border-white/[0.06] pt-6">
              {stats.map(([value, label]) => (
                <div key={label}>
                  <div className="text-base font-semibold tracking-tight text-white sm:text-xl">{value}</div>
                  <div className="mt-1 text-xs leading-5 text-white/45">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <HeroPreview />
        </section>
      </div>

      <section id="features" className="relative z-10 border-t border-white/[0.06] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            label="Core Modules"
            title="把引流、验证、记录做成一个精密闭环"
            description="保留轻量接入方式，同时让后台配置、使用说明和访客记录拥有统一的产品体验。"
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <SpotlightCard key={feature.title} className="p-6 md:p-7">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-indigo-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_12px_30px_rgba(0,0,0,0.3)]">
                  <FeatureIcon name={feature.icon} />
                </div>
                <div className="text-xs font-mono uppercase tracking-[0.22em] text-[#5E6AD2]">{feature.eyebrow}</div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">{feature.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#8A8F98]">{feature.description}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="relative z-10 border-t border-white/[0.06] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <SectionHeading
              align="left"
              label="Workflow"
              title="从一段代码到一次可追踪的关注转化"
              description="首页用更明确的流程语言解释产品价值：用户知道从哪里开始，也知道后台能看到什么。"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {workflowSteps.map(([number, title, description]) => (
                <div key={number} className="group rounded-2xl border border-white/[0.06] bg-white/[0.035] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:border-[#5E6AD2]/35 motion-safe:hover:bg-white/[0.06]">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-xs tracking-[0.24em] text-white/35">{number}</span>
                    <span className="h-px flex-1 bg-gradient-to-r from-[#5E6AD2]/50 to-transparent" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#8A8F98]">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/[0.06] px-6 py-20 md:py-28 lg:px-8">
        <SpotlightCard className="mx-auto max-w-5xl p-8 text-center md:p-12" spotlightColor="rgba(94, 106, 210, 0.2)">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#6872D9]">Ready to launch</p>
            <h2 className="mt-4 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl md:text-4xl">
              用更高级的首页承载你的博客解锁产品
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#8A8F98] sm:text-base">
              暗色环境光、玻璃卡片和精确交互共同营造 premium developer tools 的软件感，同时保持接入路径清晰直接。
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/register" variant="primary">立即注册</ButtonLink>
              <ButtonLink href="/admin/blogs" variant="secondary">查看后台</ButtonLink>
            </div>
          </div>
        </SpotlightCard>
      </section>

      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-8 text-center text-sm text-white/40 lg:px-8">
        <p>公众号引流解锁博客平台 · 为内容增长设计的精密入口</p>
      </footer>
    </main>
  );
}

function Header({ theme }: { theme: AppTheme }) {
  return (
    <header className="pt-5">
      <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.035] px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur-xl md:px-5">
        <Link href="/" className="group inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E6AD2]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506]">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5E6AD2] text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_10px_28px_rgba(94,106,210,0.35),inset_0_1px_0_rgba(255,255,255,0.22)]">R</span>
          <span className="text-sm font-semibold tracking-tight text-white">openReadmore</span>
        </Link>

        <nav aria-label="主导航" className="hidden items-center gap-6 text-sm text-white/55 md:flex">
          <a className="rounded-md hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E6AD2]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506]" href="#features">功能</a>
          <a className="rounded-md hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E6AD2]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506]" href="#workflow">流程</a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} variant="premium" />
          <Link href="/admin/blogs" className="rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E6AD2]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506]">
            进入后台
          </Link>
        </div>
      </div>
    </header>
  );
}

function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_top,#0a0a0f_0%,#050506_48%,#020203_100%)]">
      <div className="absolute left-[calc(50%-27rem)] -top-112 h-288 w-216 rounded-full bg-[#5E6AD2]/25 blur-[150px] homepage-ambient-float" />
      <div className="absolute left-[-22rem] top-32 h-[42rem] w-[34rem] rounded-full bg-fuchsia-500/12 blur-[120px] homepage-ambient-float homepage-ambient-float-delay" />
      <div className="absolute right-[-18rem] top-48 h-[38rem] w-[30rem] rounded-full bg-blue-500/12 blur-[110px] homepage-ambient-float homepage-ambient-float-slow" />
      <div className="absolute bottom-[-26rem] left-1/2 h-[42rem] w-[56rem] -translate-x-1/2 rounded-full bg-[#5E6AD2]/10 blur-[120px] homepage-ambient-pulse" />
      <div className="absolute inset-0 opacity-[0.018] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="absolute inset-0 opacity-[0.22] [background-image:radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_34%)]" />
    </div>
  );
}

function HeroPreview() {
  return (
    <SpotlightCard className="mx-auto w-full max-w-xl p-4 sm:p-5" spotlightColor="rgba(104, 114, 217, 0.18)">
      <div className="rounded-[1.35rem] border border-white/[0.06] bg-[#08080b]/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]/80" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]/80" />
          </div>
          <div className="rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1 text-xs text-white/45">dashboard.preview</div>
        </div>

        <div className="grid gap-4 pt-5 sm:grid-cols-[0.78fr_1.22fr]">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.18),rgba(94,106,210,0.16)_42%,rgba(255,255,255,0.04)_100%)] shadow-[0_20px_55px_rgba(0,0,0,0.35)]">
              <div className="grid grid-cols-3 gap-1.5">
                {Array.from({ length: 9 }).map((_, index) => (
                  <span key={index} className="h-4 w-4 rounded-[4px] bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.18)]" />
                ))}
              </div>
            </div>
            <p className="mt-4 text-center text-xs leading-5 text-white/45">公众号二维码与验证码自动回复链路</p>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-[#5E6AD2]/25 bg-[#5E6AD2]/10 p-4 shadow-[0_0_40px_rgba(94,106,210,0.12)]">
              <div className="text-xs font-mono uppercase tracking-[0.24em] text-indigo-200/70">Active Blog</div>
              <div className="mt-3 text-base font-semibold tracking-tight text-white">微信公众号 · 全文解锁</div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.07]">
                <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-[#5E6AD2] to-indigo-300 shadow-[0_0_18px_rgba(94,106,210,0.55)]" />
              </div>
            </div>

            {previewRows.map(([label, value, color]) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.035] px-4 py-3">
                <span className="text-sm text-white/55">{label}</span>
                <span className={`text-sm font-medium ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

function SectionHeading({
  label,
  title,
  description,
  align = "center",
}: {
  label: string;
  title: string;
  description: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-xl"}>
      <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#6872D9]">{label}</p>
      <h2 className="mt-4 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl md:text-4xl">
        {title}
      </h2>
      <p className="mt-5 text-sm leading-7 text-[#8A8F98] sm:text-base">{description}</p>
    </div>
  );
}

function ButtonLink({ href, variant, children }: { href: string; variant: "primary" | "secondary"; children: ReactNode }) {
  const className =
    variant === "primary"
      ? "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#5E6AD2] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_4px_14px_rgba(94,106,210,0.38),inset_0_1px_0_rgba(255,255,255,0.22)] hover:bg-[#6872D9] hover:shadow-[0_0_0_1px_rgba(94,106,210,0.6),0_8px_26px_rgba(94,106,210,0.42),inset_0_1px_0_rgba(255,255,255,0.24)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E6AD2]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506]"
      : "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.05] px-5 py-3 text-sm font-semibold text-[#EDEDEF] shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_12px_35px_rgba(0,0,0,0.18)] hover:border-white/[0.12] hover:bg-white/[0.08] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E6AD2]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506]";

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 8h9m0 0-3.4-3.4M12.5 8l-3.4 3.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeatureIcon({ name }: { name: FeatureIconName }) {
  if (name === "guide") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 20 20" fill="none">
        <path d="M5.5 4.5h9M5.5 8h9M5.5 11.5h5.5M4.75 16.25h7.5a2.5 2.5 0 0 0 2.5-2.5V3.75h-9.5a2.5 2.5 0 0 0-2.5 2.5v10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name === "record") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 20 20" fill="none">
        <path d="M4 13.5 7.5 10l2.3 2.3L16 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 4.5h12v11H4z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 20 20" fill="none">
      <path d="M4.5 6.5 10 3l5.5 3.5v7A2.5 2.5 0 0 1 13 16H7a2.5 2.5 0 0 1-2.5-2.5v-7Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 16v-5h4v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
