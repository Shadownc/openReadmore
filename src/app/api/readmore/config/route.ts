import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { jsonError, handleApiError } from "@/lib/api";
import { withCors, corsOptions } from "@/lib/cors";
import { evaluateReadmoreProtection } from "@/lib/readmore-rules";

export function OPTIONS() {
  return corsOptions();
}

export async function GET(request: NextRequest) {
  try {
    const blogId = request.nextUrl.searchParams.get("blogId") || "";
    const articleUrl = request.nextUrl.searchParams.get("articleUrl") || "";
    if (!blogId) return withCors(jsonError("缺少博客 ID", 400));
    const blog = await prisma.registeredBlog.findUnique({ where: { blogId } });
    if (!blog || !blog.enabled) return withCors(jsonError("博客配置不存在或已禁用", 404));
    const blogConfig = blog as typeof blog & {
      protectionMode?: string | null;
      whitelistRules?: unknown;
      protectionRules?: unknown;
      previewHeight?: number | null;
    };

    const decision = evaluateReadmoreProtection({
      protectionMode: blogConfig.protectionMode,
      whitelistRules: blogConfig.whitelistRules,
      protectionRules: blogConfig.protectionRules,
      articleUrl,
    });
    const randomBypass = decision.protected && Math.floor(Math.random() * 100) + 1 > blog.randomPercent;

    return withCors(NextResponse.json({
      ok: true,
      enabled: true,
      protected: decision.protected && !randomBypass,
      reason: randomBypass ? "random_bypass" : decision.reason,
      previewHeight: blogConfig.previewHeight || 480,
      officialAccountName: blog.officialAccountName,
      replyKeyword: blog.replyKeyword,
      qrcodeUrl: blog.qrcodeUrl,
      unlockExpiresDays: blog.unlockExpiresDays,
      captchaExpiresSeconds: blog.captchaExpiresSeconds,
      randomPercent: blog.randomPercent,
    }));
  } catch (error) {
    return withCors(handleApiError(error));
  }
}
