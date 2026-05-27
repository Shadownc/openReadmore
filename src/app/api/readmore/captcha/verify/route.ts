import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyCaptchaCode } from "@/lib/captcha";
import { jsonError, handleApiError } from "@/lib/api";
import { getRequestIp, getUserAgent } from "@/lib/request";
import { randomToken, sha256 } from "@/lib/crypto";
import { signUnlockToken } from "@/lib/tokens";
import { withCors, corsOptions } from "@/lib/cors";

export function OPTIONS() {
  return corsOptions();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const blogId = String(body.blogId || "");
    const code = String(body.code || "");
    const articleUrl = body.articleUrl ? String(body.articleUrl) : "";
    const articleTitle = body.articleTitle ? String(body.articleTitle) : "";
    const visitorId = body.visitorId ? String(body.visitorId) : randomToken(12);
    const blog = await prisma.registeredBlog.findUnique({ where: { blogId } });
    if (!blog || !blog.enabled) return withCors(jsonError("博客配置不存在或已禁用", 404));

    const success = verifyCaptchaCode({
      blogId: blog.blogId,
      secret: blog.captchaSecret,
      intervalSeconds: blog.captchaExpiresSeconds,
      code,
    });

    await prisma.unlockRecord.create({
      data: {
        blogId: blog.blogId,
        registeredId: blog.id,
        ownerId: blog.ownerId,
        visitorId,
        ip: getRequestIp(request),
        userAgent: getUserAgent(request),
        articleUrl,
        articleTitle,
        randomPercent: blog.randomPercent,
        success,
      },
    });

    if (!success) return withCors(jsonError("验证码错误或已过期", 400));

    const expireAt = new Date(Date.now() + blog.unlockExpiresDays * 24 * 60 * 60 * 1000);
    const token = signUnlockToken({ blogId: blog.blogId, visitorId, expireAt });
    await prisma.accessGrant.create({
      data: {
        blogId: blog.blogId,
        registeredId: blog.id,
        visitorId,
        tokenHash: sha256(token),
        expireAt,
      },
    });

    return withCors(NextResponse.json({ ok: true, visitorId, token, expireAt: expireAt.toISOString() }));
  } catch (error) {
    return withCors(handleApiError(error));
  }
}
