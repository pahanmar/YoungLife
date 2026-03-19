import prisma from '../prismaClient.js';
import bcrypt from 'bcryptjs';

const SUPER_ADMIN_EMAIL = (process.env.SEED_ADMIN_EMAIL || '').trim();
const VALID_ROLES = ['user', 'volunteer', 'employee', 'admin'];
const VALID_ROLES_ASSIGNABLE = ['user', 'volunteer', 'employee']; // без admin — админ по дефолту имеет доступ ко всему
const VALID_MODES = ['all', 'allow', 'deny'];

export const listUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    where: { email: { not: SUPER_ADMIN_EMAIL } },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });
  res.json(users);
};

export const createUser = async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email и пароль обязательны' });
  const phoneStr = phone != null ? String(phone).trim() : '';
  if (!phoneStr) return res.status(400).json({ message: 'Телефон обязателен' });
  const roleVal = role && VALID_ROLES_ASSIGNABLE.includes(role) ? role : 'user';
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists)
    return res.status(400).json({ message: 'Email уже используется' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name: name || null,
      email,
      phone: phoneStr,
      passwordHash,
      role: roleVal,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });
  res.status(201).json(user);
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const id = Number(userId);
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target)
    return res.status(404).json({ message: 'Пользователь не найден' });
  if (target.email === SUPER_ADMIN_EMAIL)
    return res
      .status(403)
      .json({ message: 'Нельзя редактировать суперадмина' });

  const { name, email, phone, password, role } = req.body;
  const data = {};

  if (name !== undefined) data.name = name === '' ? null : String(name).trim();
  if (email !== undefined) {
    const e = String(email).trim();
    if (!e)
      return res.status(400).json({ message: 'Email не может быть пустым' });
    const exists = await prisma.user.findUnique({ where: { email: e } });
    if (exists && exists.id !== id)
      return res.status(400).json({ message: 'Email уже используется' });
    data.email = e;
  }
  if (phone !== undefined) {
    const p = String(phone).trim();
    if (!p) return res.status(400).json({ message: 'Телефон обязателен' });
    data.phone = p;
  }
  if (password !== undefined && String(password).trim() !== '') {
    data.passwordHash = await bcrypt.hash(password, 10);
  }
  if (role !== undefined && VALID_ROLES_ASSIGNABLE.includes(role))
    data.role = role;

  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });
  res.json(user);
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const id = Number(userId);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
  if (user.email === SUPER_ADMIN_EMAIL)
    return res.status(403).json({ message: 'Нельзя удалить суперадмина' });
  await prisma.refreshToken.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });
  res.json({ message: 'Пользователь удалён' });
};

export const updateRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  const id = Number(userId);
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target)
    return res.status(404).json({ message: 'Пользователь не найден' });
  if (target.email === SUPER_ADMIN_EMAIL)
    return res
      .status(403)
      .json({ message: 'Нельзя изменить роль суперадмина' });
  if (!VALID_ROLES_ASSIGNABLE.includes(role))
    return res
      .status(400)
      .json({ message: 'Неверная роль (доступны: user, volunteer, employee)' });
  const user = await prisma.user.update({
    where: { id },
    data: { role },
  });
  res.json({ id: user.id, email: user.email, role: user.role });
};

export const routePermissions = async (req, res) => {
  const rows = await prisma.routePermission.findMany({
    orderBy: { path: 'asc' },
  });
  const list = rows.map((r) => ({
    path: r.path,
    mode: r.mode,
    roles: r.roles || [],
    hideFromNav: !!r.hideFromNav,
  }));
  res.json(list);
};

export const updateRoutePermission = async (req, res) => {
  const { path, mode, roles, hideFromNav } = req.body;
  if (!path || typeof path !== 'string')
    return res.status(400).json({ message: 'Укажите path' });
  if (mode !== undefined && !VALID_MODES.includes(mode))
    return res.status(400).json({ message: 'Неверный mode' });
  const rolesArray = Array.isArray(roles)
    ? roles.filter((r) => VALID_ROLES.includes(r))
    : [];
  const data = {};
  if (mode !== undefined) data.mode = mode;
  if (Array.isArray(roles)) data.roles = rolesArray;
  if (hideFromNav !== undefined) data.hideFromNav = !!hideFromNav;
  const row = await prisma.routePermission.upsert({
    where: { path: path.trim() },
    create: {
      path: path.trim(),
      mode: mode || 'all',
      roles: rolesArray,
      hideFromNav: !!hideFromNav,
    },
    update: Object.keys(data).length ? data : {},
  });
  res.json({
    path: row.path,
    mode: row.mode,
    roles: row.roles || [],
    hideFromNav: !!row.hideFromNav,
  });
};

/** Проверка доступа к маршруту по правилу (all / allow / deny) и роли пользователя. Admin всегда true. */
export function canAccessRoute(rule, userRole) {
  if (!rule) return true;
  if (userRole === 'admin') return true;
  const mode = rule.mode || 'all';
  const roles = rule.roles || [];
  if (mode === 'all') return true;
  const hasRole = roles.includes(userRole);
  if (mode === 'allow') return hasRole;
  if (mode === 'deny') return !hasRole;
  return true;
}
