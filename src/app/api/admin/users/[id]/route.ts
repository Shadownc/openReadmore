import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { jsonError } from "@/lib/api";

async function requireSuper() {
  const user = await getCurrentUser();
  if (!user) return { error: jsonError("未登录", 401) };
  if (user.role !== "SUPER_ADMIN") return { error: jsonError("无权限", 403) };
  return { user };
}

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireSuper();
  if (auth.error) return auth.error;
  const { id } = await context.params;
  const target = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      lastLoginAt: true,
      createdAt: true,
      blogs: { orderBy: { createdAt: "desc" }, take: 20 },
      records: { orderBy: { createdAt: "desc" }, take: 20 },
      _count: { select: { blogs: true, records: true } },
    },
  });
  if (!target) return jsonError("用户不存在", 404);
  return NextResponse.json({ user: target });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireSuper();
  if (auth.error) return auth.error;
  const { id } = await context.params;
  if (auth.user.id === id) return jsonError("不能删除自己", 400);
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
