import { UsersManager } from "@/components/admin/UsersManager";
import { requireSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  await requireSuperAdmin();
  const users = await prisma.user.findMany({
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
  return (
    <UsersManager
      initialUsers={users.map((user) => ({
        ...user,
        lastLoginAt: user.lastLoginAt?.toISOString() || null,
        createdAt: user.createdAt.toISOString(),
      }))}
    />
  );
}
