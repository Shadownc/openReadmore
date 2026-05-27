import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, isSuperAdmin } from "@/lib/auth";
import { jsonError, handleApiError } from "@/lib/api";
import { blogSchema } from "@/lib/validators";

async function findBlog(id: string, user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>) {
  return prisma.registeredBlog.findFirst({ where: { id, ...(isSuperAdmin(user) ? {} : { ownerId: user.id }) } });
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return jsonError("未登录", 401);
    const { id } = await context.params;
    const blog = await findBlog(id, user);
    if (!blog) return jsonError("博客不存在", 404);
    const data = blogSchema.parse(await request.json());
    const updated = await prisma.registeredBlog.update({
      where: { id },
      data,
      include: { owner: { select: { id: true, email: true, name: true } } },
    });
    return NextResponse.json({ blog: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return jsonError("未登录", 401);
  const { id } = await context.params;
  const blog = await findBlog(id, user);
  if (!blog) return jsonError("博客不存在", 404);
  await prisma.registeredBlog.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
