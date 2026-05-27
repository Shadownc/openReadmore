import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";
import { handleApiError, jsonError } from "@/lib/api";
import { registerSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const data = registerSchema.parse(await request.json());
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) return jsonError("该邮箱已注册", 409);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: await hashPassword(data.password),
      },
    });

    await createSession(user.id);
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    return handleApiError(error);
  }
}
