import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, isSuperAdmin } from "@/lib/auth";
import { jsonError } from "@/lib/api";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return jsonError("未登录", 401);
  const { ids } = await request.json();
  if (!Array.isArray(ids) || ids.length === 0) return jsonError("请选择要删除的数据");
  await prisma.unlockRecord.deleteMany({ where: { id: { in: ids }, ...(isSuperAdmin(user) ? {} : { ownerId: user.id }) } });
  return NextResponse.json({ ok: true });
}
