import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, isSuperAdmin } from "@/lib/auth";
import { jsonError } from "@/lib/api";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return jsonError("未登录", 401);
  const { id } = await context.params;
  const record = await prisma.unlockRecord.findFirst({
    where: { id, ...(isSuperAdmin(user) ? {} : { ownerId: user.id }) },
    include: {
      owner: { select: { id: true, email: true, name: true } },
      blog: { select: { id: true, name: true, blogId: true } },
    },
  });
  if (!record) return jsonError("记录不存在", 404);
  return NextResponse.json({ record });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return jsonError("未登录", 401);
  const { id } = await context.params;
  const record = await prisma.unlockRecord.findFirst({ where: { id, ...(isSuperAdmin(user) ? {} : { ownerId: user.id }) } });
  if (!record) return jsonError("记录不存在", 404);
  await prisma.unlockRecord.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
