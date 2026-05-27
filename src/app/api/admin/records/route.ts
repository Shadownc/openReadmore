import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, isSuperAdmin } from "@/lib/auth";
import { jsonError } from "@/lib/api";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return jsonError("未登录", 401);

  const keyword = request.nextUrl.searchParams.get("keyword") || "";
  const blogId = request.nextUrl.searchParams.get("blogId") || "";
  const ownerId = request.nextUrl.searchParams.get("ownerId") || "";
  const records = await prisma.unlockRecord.findMany({
    where: {
      ...(isSuperAdmin(user) ? (ownerId ? { ownerId } : {}) : { ownerId: user.id }),
      ...(blogId ? { blogId } : {}),
      ...(keyword ? { articleTitle: { contains: keyword } } : {}),
    },
    include: {
      owner: { select: { id: true, email: true, name: true } },
      blog: { select: { id: true, name: true, blogId: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ records });
}
