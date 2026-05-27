import { prisma } from "@/lib/db";
import { generateCaptchaCode, getCaptchaRefreshInSeconds } from "@/lib/captcha";
import { notFound } from "next/navigation";
import { CaptchaCard } from "@/components/CaptchaCard";

export default async function CaptchaGeneratePage({ searchParams }: { searchParams: Promise<{ blogId?: string }> }) {
  const { blogId = "" } = await searchParams;
  const blog = await prisma.registeredBlog.findUnique({ where: { blogId } });
  if (!blog || !blog.enabled) notFound();
  const code = generateCaptchaCode({ blogId: blog.blogId, secret: blog.captchaSecret, intervalSeconds: blog.captchaExpiresSeconds });
  return <CaptchaCard blogId={blog.blogId} blogName={blog.name} officialAccountName={blog.officialAccountName} replyKeyword={blog.replyKeyword} initialCode={code} initialRefreshInSeconds={getCaptchaRefreshInSeconds(blog.captchaExpiresSeconds)} />;
}
