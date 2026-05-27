import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { getAppUrl } from "@/lib/request";
import { signPasswordResetToken } from "@/lib/tokens";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json().catch(() => ({ email: "" }));
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user || user.status !== "ACTIVE") {
      return NextResponse.json({ ok: true, message: "如果邮箱存在，系统会生成重置链接。" });
    }

    const token = signPasswordResetToken(user.id, new Date(Date.now() + 30 * 60 * 1000));

    return NextResponse.json({
      ok: true,
      message: "开发环境已生成重置链接。正式上线时应改为发送邮件。",
      resetUrl: `${getAppUrl()}/reset-password?token=${encodeURIComponent(token)}`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
