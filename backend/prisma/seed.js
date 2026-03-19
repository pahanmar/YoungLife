// prisma/seed.js
import prismaPkg from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();
const { PrismaClient } = prismaPkg;
const prisma = new PrismaClient();

export default async function seed() {
  const email = (process.env.SEED_ADMIN_EMAIL || '').trim();
  const pwd = process.env.SEED_ADMIN_PWD || '';

  // В продакшене не создаём "дефолтного" админа без явных переменных окружения.
  // Это защищает от появления случайного admin@*.local.
  if (email && pwd) {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (!exists) {
      const passwordHash = await bcrypt.hash(pwd, 10);
      const user = await prisma.user.create({
        data: { name: 'Admin', email, passwordHash, role: 'admin' },
      });
      console.log('Admin created', user.email);
    } else {
      console.log('Admin exists');
    }
  } else {
    console.log(
      'Admin seed skipped (set SEED_ADMIN_EMAIL and SEED_ADMIN_PWD to create admin)'
    );
  }

  const defaultRoutes = [
    { path: '/', mode: 'all', roles: [], hideFromNav: false },
    { path: '/books', mode: 'all', roles: [], hideFromNav: false },
    { path: '/admin', mode: 'allow', roles: ['admin'], hideFromNav: false },
    { path: '/disciple', mode: 'all', roles: [], hideFromNav: false },
    {
      path: '/disciple/nastavnichestvo-i-uchenichestvo',
      mode: 'all',
      roles: [],
      hideFromNav: false,
    },
    {
      path: '/disciple/identichnost',
      mode: 'all',
      roles: [],
      hideFromNav: false,
    },
    {
      path: '/disciple/izuchenie-biblii',
      mode: 'all',
      roles: [],
      hideFromNav: false,
    },
    {
      path: '/disciple/3-p-uchenichestva',
      mode: 'all',
      roles: [],
      hideFromNav: false,
    },
    {
      path: '/disciple/novoe-rozhdenie',
      mode: 'all',
      roles: [],
      hideFromNav: false,
    },
    {
      path: '/disciple/anatomiya-nastavnichestva',
      mode: 'all',
      roles: [],
      hideFromNav: false,
    },
    {
      path: '/disciple/vidy-nastavnichestva',
      mode: 'all',
      roles: [],
      hideFromNav: false,
    },
    {
      path: '/disciple/zhizn-i-poklonenie',
      mode: 'all',
      roles: [],
      hideFromNav: false,
    },
  ];
  for (const r of defaultRoutes) {
    await prisma.routePermission.upsert({
      where: { path: r.path },
      create: r,
      update: {},
    });
  }
  console.log('Route permissions seeded');
}

// если запущен напрямую
if (process.argv[1] && process.argv[1].endsWith('prisma/seed.js')) {
  seed()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
