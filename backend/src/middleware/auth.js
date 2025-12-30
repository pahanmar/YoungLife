import { verifyAccess } from '../services/jwtService.js';
import prisma from '../prismaClient.js';

export const authMiddleware = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Нет токена' });
  const token = auth.split(' ')[1];
  try {
    const payload = verifyAccess(token);
    const user = await prisma.user.findUnique({ where: { id: Number(payload.id) } });
    if (!user) return res.status(401).json({ message: 'Пользователь не найден' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Неверный токен' });
  }
};