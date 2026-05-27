import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { jsonError } from "@/lib/api";
import { getRequestIp, getUserAgent } from "@/lib/request";
import { withCors, corsOptions } from "@/lib/cors";

export function OPTIONS() {
  return corsOptions();
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const blogId = String(body.blogId || "");
  const blog = await prisma.registeredBlog.findUnique({ where: { blogId } });
  if (!blog || !blog.enabled) return withCors(jsonError("博客配置不存在或已禁用", 404));
  const record = await prisma.unlockRecord.create({
    data: {
      blogId: blog.blogId,
      registeredId: blog.id,
      ownerId: blog.ownerId,
      visitorId: body.visitorId ? String(body.visitorId) : null,
      ip: getRequestIp(request),
      userAgent: getUserAgent(request),
      articleUrl: body.articleUrl ? String(body.articleUrl) : "",
      articleTitle: body.articleTitle ? String(body.articleTitle) : "",
      randomPercent: blog.randomPercent,
      success: false,
    },
  });
  return withCors(NextResponse.json({ recordId: record.id }));
}
