import Link from "next/link";
import type { ReactNode } from "react";

import { SpotlightCard } from "@/components/SpotlightCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { AppTheme } from "@/lib/theme";

type FeatureIconName = "blog" | "guide" | "record";
type AccentName = "green" | "cyan" | "magenta";

type Feature = {
  title: string;
  description: string;
  eyebrow: string;
  icon: FeatureIconName;
  accent: AccentName;
};

const features: Feature[] = [
  {
    title: "博客注册",
    description: "配置公众号名称、关键词、二维码和验证码有效期，为每个博客生成独立接入方案。",
    eyebrow: "模块 01 / 博客登记",
    icon: "blog",
    accent: "green",
  },
  {
    title: "使用说明",
    description: "自动整理博客主题配置和公众号自动回复链接，让接入步骤可复制、可追踪。",
    eyebrow: "模块 02 / 代码接入",
    icon: "guide",
    accent: "cyan",
  },
  {
    title: "浏览记录",
    description: "记录访客 IP、文章链接、解锁方式和成功状态，帮助你观察转化与异常访问。",
    eyebrow: "模块 03 / 数据追踪",
    icon: "record",
    accent: "magenta",
  },
];

const workflowSteps = [
  ["[01]", "登记博客", "录入博客域名、公众号二维码和自动回复关键词。", "text-cyber-green", "border-cyber-green/35"],
  ["[02]", "生成代码", "复制集成代码片段，粘贴到博客主题配置中。", "text-cyber-cyan", "border-cyber-cyan/35"],
  ["[03]", "关注解锁", "访客扫码关注公众号，使用自动回复验证码解锁全文。", "text-cyber-magenta", "border-cyber-magenta/35"],
  ["[04]", "回看数据", "在后台查看访问记录、成功状态和文章来源。", "text-cyber-green", "border-cyber-green/35"],
] as const;

const stats = [
  ["三步接入", "完成博客配置", "text-cyber-green"],
  ["代码片段", "复制即可集成", "text-cyber-cyan"],
  ["实时记录", "追踪解锁来源", "text-cyber-magenta"],
] as const;

const terminalLines = [
  ["$", "登记博客：公众号引流文章", "text-cyber-green"],
  [">", "关键词已同步：关注解锁", "text-cyber-cyan"],
  [">", "集成代码已生成：可复制", "text-cyber-green"],
  [">", "验证码有效期：30 分钟", "text-cyber-magenta"],
  [">", "今日解锁记录：128 次", "text-cyber-cyan"],
] as const;

const healthRows = [
  ["验证码", "30 分钟", "text-cyber-green"],
  ["自动回复", "已同步", "text-cyber-cyan"],
  ["访问记录", "追踪中", "text-cyber-magenta"],
  ["集成代码", "已生成", "text-cyber-green"],
] as const;

const heroTitle = "扫码关注，立即解锁";

export function CyberHome({ theme }: { theme: AppTheme }) {
  return (
    <main className="cyber-home relative min-h-screen overflow-hidden bg-cyber-bg text-cyber-text">
      <AmbientBackground />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 sm:px-6 lg:px-8">
        <Header theme={theme} />

        <section className="grid flex-1 items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.04fr_0.96fr] lg:gap-16 lg:py-24">
          <div className="max-w-3xl">
            <div className="cyber-chamfer-sm inline-flex items-center gap-2 border border-cyber-border/80 bg-cyber-card/70 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyber-text/78 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 animate-pulse bg-cyber-green/80 shadow-[0_0_10px_rgba(0,255,136,0.45)]" />
              系统已就绪 / 公众号引流解锁博客平台
            </div>

            <h1 className="mt-7 max-w-3xl text-2xl font-black leading-[1.12] tracking-normal text-white sm:text-3xl md:text-3xl lg:text-4xl">
              <span data-text={heroTitle} className="cyber-glitch block">
                {heroTitle}
              </span>
              <span className="cyber-spectrum mt-3 block bg-gradient-to-r from-cyber-green/85 via-white to-cyber-cyan/85 bg-size-[200%_100%] bg-clip-text text-sm text-transparent drop-shadow-[0_0_8px_rgba(0,255,136,0.1)] sm:text-base md:text-lg">
                公众号解锁系统
              </span>
            </h1>

            <p className="mt-6 max-w-2xl border-l border-cyber-border pl-4 text-sm leading-7 text-cyber-text/56 sm:text-base">
              <span className="text-cyber-green/90">&gt;</span> 后台注册博客配置，生成可复制的集成代码；访客扫码关注公众号并通过自动回复链接获取验证码后，即可解锁博客全文。
              <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-cyber-green/70" aria-hidden="true" />
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/register" variant="primary">
                启动注册
                <ArrowRightIcon />
              </ButtonLink>
              <ButtonLink href="/admin/blogs" variant="secondary">
                进入后台
              </ButtonLink>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {stats.map(([value, label, color]) => (
                <div key={label} className="cyber-chamfer-sm border border-cyber-border bg-cyber-card/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <div className={`text-sm font-bold tracking-[0.03em] ${color}`}>{value}</div>
                  <div className="mt-2 text-[11px] tracking-wider text-cyber-text/45">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <HeroPreview />
        </section>
      </div>

      <section id="features" className="relative z-10 border-t border-cyber-border/80 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            label="核心模块"
            title="把引流、验证、记录做成一个精密闭环"
            description="保留轻量接入方式，同时让后台配置、使用说明和访客记录拥有统一的赛博终端体验。"
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <SpotlightCard key={feature.title} variant="cyber" accent={feature.accent} className="p-6 md:p-7">
                <CardCorners accent={feature.accent} />
                <div className={`mb-6 flex h-12 w-12 items-center justify-center border bg-cyber-muted cyber-chamfer-sm ${accentText(feature.accent)} ${accentBorder(feature.accent)}`}>
                  <FeatureIcon name={feature.icon} />
                </div>
                <div className={`text-[11px] font-bold tracking-[0.12em] ${accentText(feature.accent)}`}>{feature.eyebrow}</div>
                <h3 className="mt-3 text-lg font-bold tracking-[0.04em] text-white">{feature.title}</h3>
                <p className="mt-4 text-sm leading-7 text-cyber-text/62">{feature.description}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="relative z-10 border-t border-cyber-border/80 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <SectionHeading
              align="left"
              label="接入流程"
              title="从一段代码到一次可追踪的关注转化"
              description="用像电路一样清晰的链路解释产品价值：内容入口、公众号关注、验证码和后台记录形成闭环。"
            />

            <div className="relative grid gap-4 sm:grid-cols-2">
              <div aria-hidden="true" className="absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyber-cyan/40 to-transparent sm:block" />
              <div aria-hidden="true" className="absolute left-8 right-8 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyber-green/35 to-transparent sm:block" />
              {workflowSteps.map(([number, title, description, color, border]) => (
                <div key={number} className={`cyber-chamfer relative border ${border} bg-cyber-card/80 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-200 motion-safe:hover:-translate-y-1`}>
                  <div className="flex items-center justify-between gap-4">
                    <span className={`font-black tracking-[0.22em] ${color}`}>{number}</span>
                    <span className="h-px flex-1 bg-gradient-to-r from-cyber-green/35 via-cyber-cyan/20 to-transparent" />
                  </div>
                  <h3 className="mt-5 text-base font-bold tracking-[0.04em] text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-cyber-text/62">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="terminal" className="relative z-10 border-t border-cyber-border/80 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            label="操作终端"
            title="一条命令链路，完成关注解锁闭环"
            description="像操作一台被授权的增长终端：注册、生成、同步、验证、记录，每一步都有可读状态。"
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
            <TerminalPanel />
            <SpotlightCard variant="cyber" accent="magenta" className="p-6">
              <CardCorners accent="magenta" />
              <p className="text-xs font-bold tracking-[0.12em] text-cyber-magenta/80">系统状态</p>
              <div className="mt-6 space-y-3">
                {healthRows.map(([label, value, color]) => (
                  <div key={label} className="cyber-chamfer-sm flex items-center justify-between border border-cyber-border bg-black/30 px-4 py-3">
                    <span className="text-xs tracking-[0.12em] text-cyber-text/45">{label}</span>
                    <span className={`text-sm font-bold tracking-[0.08em] ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-l border-cyber-border pl-4 text-sm leading-7 text-cyber-text/56">
                所有状态都被压缩成后台可读的操作记录，让内容增长不再停留在黑盒里。
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-cyber-border/80 px-5 py-20 sm:px-6 md:py-28 lg:px-8">
        <SpotlightCard variant="cyber" accent="cyan" className="mx-auto max-w-5xl p-8 text-center md:p-12">
          <CardCorners accent="cyan" />
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-bold tracking-[0.12em] text-cyber-cyan/80">准备接入</p>
            <h2 className="mt-4 bg-gradient-to-r from-cyber-green/85 via-white to-cyber-cyan/85 bg-clip-text text-2xl font-black tracking-[0.02em] text-transparent sm:text-3xl md:text-3xl lg:text-4xl">
              准备接入你的博客解锁系统？
            </h2>
            <p className="mt-5 text-sm leading-7 text-cyber-text/60 sm:text-base">
              用更有记忆点的首页承载关注解锁产品：霓虹边框、终端链路、故障标题和清晰按钮共同把访客引向注册与后台。
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/register" variant="primary">立即注册</ButtonLink>
              <ButtonLink href="/admin/blogs" variant="secondary">查看后台</ButtonLink>
            </div>
          </div>
        </SpotlightCard>
      </section>

      <footer className="relative z-10 border-t border-cyber-border/80 px-5 py-8 text-center text-xs tracking-[0.12em] text-cyber-text/40 sm:px-6 lg:px-8">
        <p>公众号引流解锁博客平台 · 为内容增长设计的解锁入口</p>
      </footer>
    </main>
  );
}

function Header({ theme }: { theme: AppTheme }) {
  return (
    <header className="pt-5">
      <div className="cyber-chamfer-sm border border-cyber-border/80 bg-black/38 px-4 py-3 shadow-[0_0_20px_rgba(0,212,255,0.05)] backdrop-blur-xl md:px-5">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group inline-flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-green">
            <span className="cyber-chamfer-sm flex h-9 w-9 items-center justify-center border border-cyber-green/45 bg-cyber-green/8 text-sm font-black text-cyber-green shadow-[0_0_12px_rgba(0,255,136,0.14)]">阅</span>
            <span className="text-sm font-black tracking-[0.08em] text-white">公众号解锁平台</span>
          </Link>

          <nav aria-label="主导航" className="hidden items-center gap-6 text-xs font-bold tracking-[0.12em] text-cyber-text/55 md:flex">
            <a className="hover:text-cyber-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-green" href="#features">功能</a>
            <a className="hover:text-cyber-cyan focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-cyan" href="#workflow">流程</a>
            <a className="hover:text-cyber-magenta focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-magenta" href="#terminal">终端</a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} variant="cyber" />
            <Link href="/admin/blogs" className="cyber-chamfer-sm inline-flex min-h-11 items-center justify-center border border-cyber-cyan/35 bg-cyber-cyan/8 px-4 py-2 text-xs font-black leading-none tracking-[0.12em] text-cyber-cyan shadow-[0_0_14px_rgba(0,212,255,0.08)] hover:bg-cyber-cyan/12 hover:text-cyber-cyan focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-cyan">
              进入后台
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_top,#10101a_0%,#0a0a0f_46%,#030307_100%)]">
      <div className="cyber-grid absolute inset-0 opacity-45" />
      <div className="cyber-scanlines absolute inset-0 opacity-35" />
      <div className="absolute left-[calc(50%-30rem)] -top-64 h-[42rem] w-[38rem] rounded-full bg-cyber-green/7 blur-[150px] homepage-ambient-float" />
      <div className="absolute left-[-22rem] top-28 h-[42rem] w-[34rem] rounded-full bg-cyber-magenta/8 blur-[130px] homepage-ambient-float homepage-ambient-float-delay" />
      <div className="absolute right-[-18rem] top-48 h-[38rem] w-[30rem] rounded-full bg-cyber-cyan/8 blur-[120px] homepage-ambient-float homepage-ambient-float-slow" />
      <div className="absolute bottom-[-24rem] left-1/2 h-[42rem] w-[56rem] -translate-x-1/2 rounded-full bg-cyber-green/5 blur-[130px] homepage-ambient-pulse" />
      <div className="absolute left-0 right-0 top-28 h-px bg-gradient-to-r from-transparent via-cyber-green/25 to-transparent" />
      <div className="absolute left-[8%] top-[18%] h-40 w-px rotate-12 bg-gradient-to-b from-transparent via-cyber-cyan/24 to-transparent" />
      <div className="absolute right-[12%] top-[34%] h-56 w-px -rotate-12 bg-gradient-to-b from-transparent via-cyber-magenta/20 to-transparent" />
    </div>
  );
}

function HeroPreview() {
  return (
    <SpotlightCard variant="cyber" accent="green" className="mx-auto w-full max-w-xl p-4 sm:p-5">
      <CardCorners accent="green" />
      <div className="cyber-terminal cyber-chamfer-sm p-4">
        <div className="flex items-center justify-between border-b border-cyber-border pb-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 bg-[#ff3366]/85 shadow-[0_0_10px_rgba(255,51,102,0.5)]" />
            <span className="h-3 w-3 bg-[#ffbd2e]/85 shadow-[0_0_10px_rgba(255,189,46,0.35)]" />
            <span className="h-3 w-3 bg-cyber-green/85 shadow-[0_0_10px_rgba(0,255,136,0.45)]" />
          </div>
          <div className="cyber-chamfer-sm border border-cyber-green/35 bg-cyber-green/10 px-3 py-1 text-xs font-black tracking-[0.12em] text-cyber-green">在线</div>
        </div>

        <div className="grid gap-4 pt-5 sm:grid-cols-[0.82fr_1.18fr]">
          <div className="cyber-chamfer-sm border border-cyber-cyan/25 bg-black/35 p-4">
            <div className="mx-auto flex h-32 w-32 items-center justify-center border border-cyber-cyan/28 bg-[radial-gradient(circle_at_50%_35%,rgba(0,212,255,0.14),rgba(0,255,136,0.06)_42%,rgba(0,0,0,0.35)_100%)] shadow-[0_0_18px_rgba(0,212,255,0.09)] cyber-chamfer-sm">
              <div className="grid grid-cols-5 gap-1.5">
                {Array.from({ length: 25 }).map((_, index) => (
                  <span key={index} className={index % 3 === 0 || index % 7 === 0 ? "h-3.5 w-3.5 bg-cyber-green/80 shadow-[0_0_8px_rgba(0,255,136,0.22)]" : "h-3.5 w-3.5 bg-cyber-text/16"} />
                ))}
              </div>
            </div>
            <p className="mt-4 text-center text-xs leading-5 tracking-[0.08em] text-cyber-text/45">公众号二维码 / 解锁节点</p>
          </div>

          <div className="space-y-3 overflow-hidden">
            <div className="text-xs font-black tracking-[0.12em] text-cyber-cyan">解锁终端</div>
            {terminalLines.map(([prompt, text, color]) => (
              <div key={text} className="flex gap-2 text-xs leading-6 sm:text-sm">
                <span className="text-cyber-green">{prompt}</span>
                <span className={`${color} break-words`}>{text}</span>
              </div>
            ))}
            <div className="cyber-chamfer-sm border border-cyber-magenta/30 bg-cyber-magenta/10 px-3 py-2 text-xs font-black tracking-[0.12em] text-cyber-magenta">记录追踪中</div>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

function TerminalPanel() {
  return (
    <SpotlightCard variant="cyber" accent="green" className="p-4 sm:p-5">
      <CardCorners accent="green" />
      <div className="cyber-terminal cyber-chamfer-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-cyber-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-[#ff3366]" />
            <span className="h-2.5 w-2.5 bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 bg-cyber-green" />
          </div>
          <span className="text-xs tracking-[0.12em] text-cyber-text/45">解锁流程控制台</span>
        </div>
        <div className="space-y-4 px-4 py-5 text-sm leading-7">
          {terminalLines.map(([prompt, text, color]) => (
            <div key={text} className="grid gap-2 sm:grid-cols-[1.5rem_1fr]">
              <span className="font-black text-cyber-green">{prompt}</span>
              <span className={`${color} break-words`}>{text}</span>
            </div>
          ))}
          <div className="border-t border-cyber-border pt-4 text-cyber-text/65">
            <span className="text-cyber-green">&gt;</span> 解锁链路已完成
            <span className="ml-2 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-cyber-green" aria-hidden="true" />
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
      <p className="text-xs font-black tracking-[0.12em] text-cyber-green/80">{label}</p>
      <h2 className="mt-4 bg-gradient-to-r from-white via-cyber-cyan/85 to-cyber-green/85 bg-clip-text text-xl font-black tracking-[0.02em] text-transparent sm:text-2xl md:text-3xl lg:text-3xl">
        {title}
      </h2>
      <p className="mt-5 text-sm leading-7 text-cyber-text/60 sm:text-base">{description}</p>
    </div>
  );
}

function ButtonLink({ href, variant, children }: { href: string; variant: "primary" | "secondary"; children: ReactNode }) {
  const className =
    variant === "primary"
      ? "cyber-chamfer-sm inline-flex min-h-11 items-center justify-center gap-2 border-2 border-cyber-green/70 bg-cyber-card/75 px-5 py-3 text-sm font-black tracking-[0.12em] text-cyber-green shadow-[0_0_10px_rgba(0,255,136,0.16)] hover:bg-cyber-green/12 hover:border-cyber-green hover:shadow-[0_0_14px_rgba(0,255,136,0.22)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-green"
      : "cyber-chamfer-sm inline-flex min-h-11 items-center justify-center gap-2 border-2 border-cyber-cyan/55 bg-cyber-card/70 px-5 py-3 text-sm font-black tracking-[0.12em] text-cyber-cyan shadow-[0_0_12px_rgba(0,212,255,0.1)] hover:bg-cyber-cyan/12 hover:border-cyber-cyan hover:shadow-[0_0_14px_rgba(0,212,255,0.16)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber-cyan";

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function CardCorners({ accent }: { accent: AccentName }) {
  const color = accentBorder(accent);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-3 z-0">
      <span className={`absolute left-0 top-0 h-5 w-5 border-l border-t ${color}`} />
      <span className={`absolute right-0 top-0 h-5 w-5 border-r border-t ${color}`} />
      <span className={`absolute bottom-0 left-0 h-5 w-5 border-b border-l ${color}`} />
      <span className={`absolute bottom-0 right-0 h-5 w-5 border-b border-r ${color}`} />
    </div>
  );
}

function accentText(accent: AccentName) {
  if (accent === "cyan") {
    return "text-cyber-cyan";
  }

  if (accent === "magenta") {
    return "text-cyber-magenta";
  }

  return "text-cyber-green";
}

function accentBorder(accent: AccentName) {
  if (accent === "cyan") {
    return "border-cyber-cyan/45";
  }

  if (accent === "magenta") {
    return "border-cyber-magenta/45";
  }

  return "border-cyber-green/45";
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
      <svg aria-hidden="true" className="h-5 w-5 drop-shadow-[0_0_5px_currentColor]" viewBox="0 0 20 20" fill="none">
        <path d="M5.5 4.5h9M5.5 8h9M5.5 11.5h5.5M4.75 16.25h7.5a2.5 2.5 0 0 0 2.5-2.5V3.75h-9.5a2.5 2.5 0 0 0-2.5 2.5v10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name === "record") {
    return (
      <svg aria-hidden="true" className="h-5 w-5 drop-shadow-[0_0_5px_currentColor]" viewBox="0 0 20 20" fill="none">
        <path d="M4 13.5 7.5 10l2.3 2.3L16 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 4.5h12v11H4z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-5 w-5 drop-shadow-[0_0_5px_currentColor]" viewBox="0 0 20 20" fill="none">
      <path d="M4.5 6.5 10 3l5.5 3.5v7A2.5 2.5 0 0 1 13 16H7a2.5 2.5 0 0 1-2.5-2.5v-7Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 16v-5h4v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
