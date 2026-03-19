import prisma from '../prismaClient.js';
import bcrypt from 'bcryptjs';
import { signAccess, createRefreshString } from '../services/jwtService.js';
import config from '../config.js';
import { addDays } from './utils.js';

const COOKIE_NAME = 'refreshToken';

const SUPER_ADMIN_EMAIL = (process.env.SEED_ADMIN_EMAIL || '').trim();

export const login = async (req, res) => {
  const { email, password } = req.body;
  const loginId = (email || '').trim();
  if (!loginId || !password)
    return res
      .status(400)
      .json({ message: 'Email/телефон и пароль обязательны' });

  const isEmail = loginId.includes('@');
  const user = isEmail
    ? await prisma.user.findUnique({ where: { email: loginId } })
    : await prisma.user.findFirst({ where: { phone: loginId } });
  if (!user)
    return res.status(400).json({ message: 'Неверные учётные данные' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ message: 'Неверные учётные данные' });

  const refreshString = createRefreshString();
  const expiresAt = addDays(config.REFRESH_EXPIRES_DAYS);
  await prisma.refreshToken.create({
    data: { token: refreshString, userId: user.id, expiresAt },
  });

  const accessToken = signAccess({ id: user.id, role: user.role });
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie(COOKIE_NAME, refreshString, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: config.REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
  });
  res.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
    },
    accessToken,
  });
};

export const refresh = async (req, res) => {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ message: 'Нет refresh token' });

    const dbToken = await prisma.refreshToken.findUnique({ where: { token } });
    if (!dbToken || dbToken.revoked)
      return res.status(401).json({ message: 'Неверный refresh token' });
    if (new Date() > dbToken.expiresAt)
      return res.status(401).json({ message: 'Refresh токен истёк' });

    const user = await prisma.user.findUnique({
      where: { id: dbToken.userId },
    });
    if (!user)
      return res.status(401).json({ message: 'Пользователь не найден' });

    const accessToken = signAccess({ id: user.id, role: user.role });
    // возвращаем и accessToken, и user — чтобы фронтенд мог восстановить состояние
    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error('refresh error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (token) {
    await prisma.refreshToken.updateMany({
      where: { token },
      data: { revoked: true },
    });
    res.clearCookie(COOKIE_NAME, { path: '/', httpOnly: true });
  }
  res.json({ message: 'Выход' });
};

export const me = async (req, res) => {
  const user = req.user;
  const full = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, role: true, name: true, phone: true },
  });
  res.json({
    user: full
      ? {
          id: full.id,
          email: full.email,
          role: full.role,
          name: full.name,
          phone: full.phone,
        }
      : req.user,
  });
};
