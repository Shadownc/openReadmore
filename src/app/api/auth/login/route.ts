import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";
import { handleApiError, jsonError } from "@/lib/api";
import { verifyLoginCaptcha } from "@/lib/login-captcha";
import { loginSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const data = loginSchema.parse(await request.json());
    if (!(await verifyLoginCaptcha(data.captcha))) {
      return jsonError("验证码错误或已过期", 400);
    }
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await verifyPassword(data.password, user.passwordHash))) {
      return jsonError("邮箱或密码错误", 401);
    }
    if (user.status !== "ACTIVE") return jsonError("账号已被禁用", 403);

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await createSession(user.id);
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    return handleApiError(error);
  }
}
