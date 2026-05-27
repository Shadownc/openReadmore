import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateCaptchaCode, getCaptchaRefreshInSeconds } from "@/lib/captcha";
import { jsonError } from "@/lib/api";
import { withCors, corsOptions } from "@/lib/cors";

export function OPTIONS() {
  return corsOptions();
}

export async function GET(request: NextRequest) {
  const blogId = request.nextUrl.searchParams.get("blogId") || "";
  const blog = await prisma.registeredBlog.findUnique({ where: { blogId } });
  if (!blog || !blog.enabled) return withCors(jsonError("博客配置不存在或已禁用", 404));
  const code = generateCaptchaCode({
    blogId: blog.blogId,
    secret: blog.captchaSecret,
    intervalSeconds: blog.captchaExpiresSeconds,
  });
  return withCors(NextResponse.json({
    code,
    refreshInSeconds: getCaptchaRefreshInSeconds(blog.captchaExpiresSeconds),
    blogName: blog.name,
    officialAccountName: blog.officialAccountName,
    replyKeyword: blog.replyKeyword,
    captchaExpiresSeconds: blog.captchaExpiresSeconds,
  }));
}
