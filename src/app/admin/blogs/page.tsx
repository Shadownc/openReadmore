import { BlogsManager } from "@/components/admin/BlogsManager";
import { requireUser, isSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  const user = await requireUser();
  const blogs = await prisma.registeredBlog.findMany({
    where: isSuperAdmin(user) ? {} : { ownerId: user.id },
    include: { owner: { select: { id: true, email: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <BlogsManager
      currentUser={{ role: user.role }}
      initialBlogs={blogs.map((blog) => ({
        ...blog,
        createdAt: blog.createdAt.toISOString(),
        updatedAt: blog.updatedAt.toISOString(),
      }))}
    />
  );
}
