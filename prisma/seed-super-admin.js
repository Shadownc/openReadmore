const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.SUPER_ADMIN_PASSWORD || 'admin123456';
  const name = process.env.SUPER_ADMIN_NAME || '超级管理员';
  const existing = await prisma.user.findUnique({ where: { email } });
  const passwordHash = await bcrypt.hash(password, 12);

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { name, passwordHash, role: 'SUPER_ADMIN', status: 'ACTIVE' },
    });
  } else {
    await prisma.user.create({
      data: { email, name, passwordHash, role: 'SUPER_ADMIN', status: 'ACTIVE' },
    });
  }

  console.log(`Super admin is ready: ${email}`);
}

main().finally(() => prisma.$disconnect());
