import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { jsonError } from "@/lib/api";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return jsonError("未登录", 401);
  if (user.role !== "SUPER_ADMIN") return jsonError("无权限", 403);

  const keyword = request.nextUrl.searchParams.get("keyword") || "";
  const users = await prisma.user.findMany({
    where: keyword
      ? { OR: [{ email: { contains: keyword } }, { name: { contains: keyword } }] }
      : {},
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      lastLoginAt: true,
      createdAt: true,
      _count: { select: { blogs: true, records: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ users });
}
