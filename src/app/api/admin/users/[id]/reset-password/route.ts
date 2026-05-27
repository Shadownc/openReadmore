import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import { jsonError } from "@/lib/api";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return jsonError("未登录", 401);
  if (user.role !== "SUPER_ADMIN") return jsonError("无权限", 403);
  const { id } = await context.params;
  const { password } = await request.json();
  if (typeof password !== "string" || password.length < 8) return jsonError("新密码至少 8 位");
  await prisma.user.update({ where: { id }, data: { passwordHash: await hashPassword(password) } });
  await prisma.session.deleteMany({ where: { userId: id } });
  return NextResponse.json({ ok: true });
}
