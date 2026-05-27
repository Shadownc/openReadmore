import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f8ff] px-6 py-16 text-slate-800">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-200/60 blur-3xl" />
      <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-indigo-200/70 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[30px] border border-white/70 bg-white/85 p-10 shadow-[0_30px_100px_rgba(37,99,235,0.15)] backdrop-blur md:p-14">
          <div className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">公众号引流解锁博客平台</div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl">给博客添加关注公众号验证码解锁弹窗</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            后台注册博客配置，生成可复制的 JS/CSS 集成代码；访客扫码关注公众号并通过自动回复链接获取验证码后，即可解锁博客全文。
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/admin/blogs" className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:shadow-xl">进入后台</Link>
            <Link href="/register" className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-medium text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600">注册账号</Link>
          </div>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ["博客注册", "配置公众号名称、关键词、二维码和验证码有效期。"],
            ["使用说明", "生成 HTML、Hexo 配置和公众号自动回复链接。"],
            ["浏览记录", "记录访客 IP、文章链接、解锁方式和成功状态。"],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(37,99,235,0.12)]">
              <div className="mb-4 h-10 w-10 rounded-xl bg-blue-50" />
              <h2 className="font-bold text-slate-950">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
