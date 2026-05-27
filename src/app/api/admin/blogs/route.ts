import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, isSuperAdmin } from "@/lib/auth";
import { jsonError, handleApiError } from "@/lib/api";
import { blogSchema } from "@/lib/validators";
import { generateBlogId } from "@/lib/blog-id";
import { randomToken } from "@/lib/crypto";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return jsonError("未登录", 401);
  const keyword = request.nextUrl.searchParams.get("keyword") || "";
  const ownerId = request.nextUrl.searchParams.get("ownerId") || undefined;
  const blogs = await prisma.registeredBlog.findMany({
    where: {
      ...(isSuperAdmin(user) ? (ownerId ? { ownerId } : {}) : { ownerId: user.id }),
      ...(keyword ? { name: { contains: keyword } } : {}),
    },
    include: { owner: { select: { id: true, email: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ blogs });
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return jsonError("未登录", 401);
    const data = blogSchema.parse(await request.json());
    const blog = await prisma.registeredBlog.create({
      data: {
        ...data,
        ownerId: user.id,
        blogId: generateBlogId(),
        captchaSecret: randomToken(32),
      },
      include: { owner: { select: { id: true, email: true, name: true } } },
    });
    return NextResponse.json({ blog });
  } catch (error) {
    return handleApiError(error);
  }
}
