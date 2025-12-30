// prisma/seed.js
import prismaPkg from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();
const { PrismaClient } = prismaPkg;
const prisma = new PrismaClient();

export default async function seed() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@local';
  const pwd = process.env.SEED_ADMIN_PWD || '12345678q';
  const exists = await prisma.user.findUnique({ where: { email } });
  if (!exists) {
    const passwordHash = await bcrypt.hash(pwd, 10);
    const user = await prisma.user.create({ data: { name: 'Admin', email, passwordHash, role: 'admin' }});
    console.log('Admin created', user.email);
  } else {
    console.log('Admin exists');
  }
}

// если запущен напрямую
if (process.argv[1] && process.argv[1].endsWith('prisma/seed.js')) {
  seed().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}