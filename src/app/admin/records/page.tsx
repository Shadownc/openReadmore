import { RecordsManager } from "@/components/admin/RecordsManager";
import { requireUser, isSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function RecordsPage() {
  const user = await requireUser();
  const records = await prisma.unlockRecord.findMany({
    where: isSuperAdmin(user) ? {} : { ownerId: user.id },
    include: {
      owner: { select: { id: true, email: true, name: true } },
      blog: { select: { id: true, name: true, blogId: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return (
    <RecordsManager
      currentUser={{ role: user.role }}
      initialRecords={records.map((record) => ({
        ...record,
        createdAt: record.createdAt.toISOString(),
      }))}
    />
  );
}
