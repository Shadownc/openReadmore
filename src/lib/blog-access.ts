import { prisma } from "./db";
import type { CurrentUser } from "./types";

export function blogWhereForUser(user: CurrentUser) {
  return user.role === "SUPER_ADMIN" ? {} : { ownerId: user.id };
}

export async function getBlogForUser(blogIdOrId: string, user: CurrentUser) {
  return prisma.registeredBlog.findFirst({
    where: {
      OR: [{ id: blogIdOrId }, { blogId: blogIdOrId }],
      ...blogWhereForUser(user),
    },
    include: { owner: { select: { id: true, email: true, name: true } } },
  });
}
