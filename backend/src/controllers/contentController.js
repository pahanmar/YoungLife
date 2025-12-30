import prisma from '../prismaClient.js';

export const listContent = async (req, res) => {
  const role = req.user?.role || null;
  const all = await prisma.content.findMany();
  const filtered = all.filter(c => (c.roles.length === 0) || (role && c.roles.includes(role)));
  res.json(filtered);
};

export const createContent = async (req, res) => {
  const { title, body, roles = [] } = req.body;
  const content = await prisma.content.create({ data: { title, body, roles } });
  res.json(content);
};