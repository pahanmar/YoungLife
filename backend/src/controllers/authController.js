import prisma from '../prismaClient.js';
import bcrypt from 'bcryptjs';
import { signAccess, createRefreshString } from '../services/jwtService.js';
import config from '../config.js';
import { addDays } from './utils.js';

const COOKIE_NAME = 'refreshToken';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email и пароль обязательны' });
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ message: 'Email уже используется' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash } });

  const refreshString = createRefreshString();
  const expiresAt = addDays(config.REFRESH_EXPIRES_DAYS);
  await prisma.refreshToken.create({ data: { token: refreshString, userId: user.id, expiresAt } });

  const accessToken = signAccess({ id: user.id, role: user.role });
  res.cookie(COOKIE_NAME, refreshString, { httpOnly: true, sameSite: 'lax', maxAge: config.REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000 });
  res.json({ user: { id: user.id, email: user.email, role: user.role, name: user.name }, accessToken });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email и пароль обязательны' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: 'Неверные учётные данные' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ message: 'Неверные учётные данные' });

  const refreshString = createRefreshString();
  const expiresAt = addDays(config.REFRESH_EXPIRES_DAYS);
  await prisma.refreshToken.create({ data: { token: refreshString, userId: user.id, expiresAt } });

  const accessToken = signAccess({ id: user.id, role: user.role });
  res.cookie(COOKIE_NAME, refreshString, { httpOnly: true, sameSite: 'lax', maxAge: config.REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000 });
  res.json({ user: { id: user.id, email: user.email, role: user.role, name: user.name }, accessToken });
};

export const refresh = async (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ message: 'Нет refresh token' });
  const dbToken = await prisma.refreshToken.findUnique({ where: { token } });
  if (!dbToken || dbToken.revoked) return res.status(401).json({ message: 'Неверный refresh token' });
  if (new Date() > dbToken.expiresAt) return res.status(401).json({ message: 'Refresh токен истёк' });

  const user = await prisma.user.findUnique({ where: { id: dbToken.userId } });
  if (!user) return res.status(401).json({ message: 'Пользователь не найден' });

  const accessToken = signAccess({ id: user.id, role: user.role });
  res.json({ accessToken });
};

export const logout = async (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (token) {
    await prisma.refreshToken.updateMany({ where: { token }, data: { revoked: true } });
    res.clearCookie(COOKIE_NAME);
  }
  res.json({ message: 'Выход' });
};

export const me = async (req, res) => {
  const user = req.user;
  res.json({ user: { id: user.id, email: user.email, role: user.role, name: user.name } });
};