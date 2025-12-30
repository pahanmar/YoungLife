import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
(async () => {
  try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`;
    console.log('tables:', tables);
    const raw = await prisma.$queryRaw`SELECT * FROM "RefreshToken" LIMIT 5`;
    console.log('raw RefreshToken rows:', raw);
    const rt_prisma = await prisma.refreshToken.findMany({ take: 5 });
    console.log('prisma.refreshToken.findMany:', rt_prisma);
    await prisma.$disconnect();
    process.exit(0);
  } catch (e) {
    console.error('ERROR:', e);
    await prisma.$disconnect();
    process.exit(1);
  }
})();