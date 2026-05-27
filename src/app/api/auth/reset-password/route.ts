import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { handleApiError, jsonError } from "@/lib/api";
import { verifyPasswordResetToken } from "@/lib/tokens";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json().catch(() => ({ token: "", password: "" }));
    if (typeof token !== "string" || !token) return jsonError("重置链接无效");
    if (typeof password !== "string" || password.length < 8) return jsonError("新密码至少 8 位");

    const payload = verifyPasswordResetToken(token);
    if (!payload) return jsonError("重置链接无效或已过期");

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.status !== "ACTIVE") return jsonError("重置链接无效或已过期");

    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(password) } }),
      prisma.session.deleteMany({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
