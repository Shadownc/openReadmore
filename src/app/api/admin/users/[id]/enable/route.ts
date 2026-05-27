import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { jsonError } from "@/lib/api";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return jsonError("未登录", 401);
  if (user.role !== "SUPER_ADMIN") return jsonError("无权限", 403);
  const { id } = await context.params;
  await prisma.user.update({ where: { id }, data: { status: "ACTIVE" } });
  return NextResponse.json({ ok: true });
}
