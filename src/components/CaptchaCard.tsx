"use client";

import { useCallback, useEffect, useState } from "react";
import { FrontendScrollArea } from "@/components/FrontendScrollArea";

export function CaptchaCard(props: { blogId: string; blogName: string; officialAccountName: string; replyKeyword: string; initialCode: string; initialRefreshInSeconds: number }) {
  const [code, setCode] = useState(props.initialCode);
  const [left, setLeft] = useState(props.initialRefreshInSeconds);

  const refresh = useCallback(async () => {
    const res = await fetch(`/api/readmore/captcha/current?blogId=${encodeURIComponent(props.blogId)}`);
    const json = await res.json();
    if (res.ok) {
      setCode(json.code);
      setLeft(json.refreshInSeconds);
    }
  }, [props.blogId]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLeft((value) => {
        if (value <= 1) {
          refresh();
          return 1;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  async function copy() {
    await navigator.clipboard.writeText(code);
    alert("验证码已复制");
  }

  return (
    <FrontendScrollArea variant="light">
      <main className="relative min-h-screen overflow-hidden bg-[#f5f8ff] px-4 py-10 text-slate-800">
      <div className="absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/70 blur-3xl" />
      <div className="absolute -bottom-24 right-10 h-80 w-80 rounded-full bg-indigo-200/70 blur-3xl" />
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <div className="w-full overflow-hidden rounded-[28px] border border-white/80 bg-white/90 p-8 text-center shadow-[0_30px_90px_rgba(37,99,235,0.18)] backdrop-blur">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-xl font-bold text-white shadow-lg shadow-blue-500/25">码</div>
          <div className="text-sm font-medium text-blue-500">{props.blogName}</div>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">博客解锁验证码</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">请复制验证码，回到博客弹窗输入后继续阅读全文。</p>
          <div className="mt-8 rounded-3xl bg-slate-950 px-6 py-8 font-mono text-5xl font-black tracking-[0.28em] text-white shadow-inner">{code}</div>
          <div className="mt-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">{left} 秒后自动刷新</div>
          <button onClick={copy} className="mt-6 h-11 w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 font-medium text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30">复制验证码</button>
          <div className="mt-7 rounded-2xl border border-green-100 bg-green-50/80 p-4 text-left text-sm leading-7 text-green-700">
            公众号：<b>{props.officialAccountName}</b><br />
            回复关键词：<b>{props.replyKeyword}</b><br />
            如果验证码过期，请等待页面自动刷新后复制新的验证码。
          </div>
        </div>
      </div>
      </main>
    </FrontendScrollArea>
  );
}
