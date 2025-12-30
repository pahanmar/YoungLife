import prisma from '../prismaClient.js';

export const listUsers = async (req, res) => {
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, createdAt: true }});
  res.json(users);
};

export const updateRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  if (!['user','volunteer','employee','admin'].includes(role)) return res.status(400).json({ message: 'Неверная роль' });
  const user = await prisma.user.update({ where: { id: Number(userId) }, data: { role } });
  res.json({ id: user.id, email: user.email, role: user.role });
};