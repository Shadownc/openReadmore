import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "公众号引流解锁博客平台",
  description: "通过公众号自动回复验证码解锁博客全文",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full bg-white">{children}</body>
    </html>
  );
}
