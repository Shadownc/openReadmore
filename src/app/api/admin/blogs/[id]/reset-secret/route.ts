import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, isSuperAdmin } from "@/lib/auth";
import { jsonError } from "@/lib/api";
import { randomToken } from "@/lib/crypto";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return jsonError("未登录", 401);
  const { id } = await context.params;
  const blog = await prisma.registeredBlog.findFirst({ where: { id, ...(isSuperAdmin(user) ? {} : { ownerId: user.id }) } });
  if (!blog) return jsonError("博客不存在", 404);
  await prisma.registeredBlog.update({ where: { id }, data: { captchaSecret: randomToken(32) } });
  return NextResponse.json({ ok: true });
}
