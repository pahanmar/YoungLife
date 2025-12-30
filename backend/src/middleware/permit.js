export const permit = (...allowed) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Не аутентифицирован' });
  if (allowed.includes(req.user.role)) return next();
  return res.status(403).json({ message: 'Доступ запрещён' });
};