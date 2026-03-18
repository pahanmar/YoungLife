import prisma from '../prismaClient.js';
import path from 'path';
import fs from 'fs';

const UPLOADS_DOCS = path.join(process.cwd(), 'uploads', 'documents');

function baseUrl(req) {
  return req.protocol + '://' + req.get('host');
}

/** Публичный список документов для скачивания */
export const listDocuments = async (req, res) => {
  const docs = await prisma.downloadDocument.findMany({
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
  });
  const base = baseUrl(req);
  const list = docs.map((d) => ({
    id: d.id,
    title: d.title,
    iconUrl: d.iconPath
      ? base + '/uploads/documents/' + path.basename(d.iconPath)
      : null,
    fileUrl: base + '/uploads/documents/' + path.basename(d.filePath),
    sortOrder: d.sortOrder,
  }));
  res.json(list);
};

/** Админ: список (то же + пути для редактирования) */
export const adminListDocuments = async (req, res) => {
  const docs = await prisma.downloadDocument.findMany({
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
  });
  const base = baseUrl(req);
  const list = docs.map((d) => ({
    id: d.id,
    title: d.title,
    iconPath: d.iconPath,
    iconUrl: d.iconPath
      ? base + '/uploads/documents/' + path.basename(d.iconPath)
      : null,
    filePath: d.filePath,
    fileUrl: base + '/uploads/documents/' + path.basename(d.filePath),
    sortOrder: d.sortOrder,
    createdAt: d.createdAt,
  }));
  res.json(list);
};

/** Админ: создать документ (новый в конец списка) */
export const createDocument = async (req, res) => {
  const { title } = req.body || {};
  if (!title || !title.trim())
    return res.status(400).json({ message: 'Укажите название' });
  if (!req.files?.file?.[0])
    return res.status(400).json({ message: 'Загрузите файл документа' });

  if (!fs.existsSync(UPLOADS_DOCS))
    fs.mkdirSync(UPLOADS_DOCS, { recursive: true });

  const file = req.files.file[0];
  const fileFilename = path.basename(file.path);

  let iconFilename = null;
  if (req.files?.icon?.[0]) {
    iconFilename = path.basename(req.files.icon[0].path);
  }

  const maxOrder = await prisma.downloadDocument
    .aggregate({ _max: { sortOrder: true } })
    .then((r) => (r._max.sortOrder != null ? r._max.sortOrder + 1 : 0));

  const doc = await prisma.downloadDocument.create({
    data: {
      title: title.trim(),
      iconPath: iconFilename,
      filePath: fileFilename,
      sortOrder: maxOrder,
    },
  });

  const base = baseUrl(req);
  res.status(201).json({
    id: doc.id,
    title: doc.title,
    iconUrl: doc.iconPath ? base + '/uploads/documents/' + doc.iconPath : null,
    fileUrl: base + '/uploads/documents/' + doc.filePath,
    sortOrder: doc.sortOrder,
    createdAt: doc.createdAt,
  });
};

/** Админ: обновить документ */
export const updateDocument = async (req, res) => {
  const { id } = req.params;
  const docId = Number(id);
  const existing = await prisma.downloadDocument.findUnique({
    where: { id: docId },
  });
  if (!existing) return res.status(404).json({ message: 'Документ не найден' });

  const { title } = req.body || {};
  const data = {};
  if (title !== undefined) data.title = String(title).trim() || existing.title;

  if (req.files?.file?.[0]) {
    data.filePath = path.basename(req.files.file[0].path);
    const oldPath = path.join(UPLOADS_DOCS, path.basename(existing.filePath));
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }
  if (req.files?.icon?.[0]) {
    data.iconPath = path.basename(req.files.icon[0].path);
    if (existing.iconPath) {
      const oldPath = path.join(UPLOADS_DOCS, path.basename(existing.iconPath));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
  }

  const doc = await prisma.downloadDocument.update({
    where: { id: docId },
    data,
  });
  const base = baseUrl(req);
  res.json({
    id: doc.id,
    title: doc.title,
    iconUrl: doc.iconPath ? base + '/uploads/documents/' + doc.iconPath : null,
    fileUrl: base + '/uploads/documents/' + doc.filePath,
    sortOrder: doc.sortOrder,
    createdAt: doc.createdAt,
  });
};

/** Админ: удалить документ */
export const deleteDocument = async (req, res) => {
  const { id } = req.params;
  const docId = Number(id);
  const doc = await prisma.downloadDocument.findUnique({
    where: { id: docId },
  });
  if (!doc) return res.status(404).json({ message: 'Документ не найден' });

  const dir = UPLOADS_DOCS;
  if (doc.iconPath) {
    const p = path.join(dir, path.basename(doc.iconPath));
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  const p = path.join(dir, path.basename(doc.filePath));
  if (fs.existsSync(p)) fs.unlinkSync(p);
  await prisma.downloadDocument.delete({ where: { id: docId } });
  res.json({ message: 'Документ удалён' });
};

/** Админ: изменить порядок — body: { order: [id, id, ...] } */
export const reorderDocuments = async (req, res) => {
  const { order } = req.body || {};
  if (!Array.isArray(order) || order.length === 0)
    return res
      .status(400)
      .json({ message: 'Укажите order — массив id в нужном порядке' });

  const ids = order.map((id) => Number(id)).filter((id) => id > 0);
  const docs = await prisma.downloadDocument.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  });
  const foundIds = new Set(docs.map((d) => d.id));
  if (ids.some((id) => !foundIds.has(id)))
    return res.status(400).json({ message: 'Некорректный список id' });

  await Promise.all(
    ids.map((id, index) =>
      prisma.downloadDocument.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  );

  const updated = await prisma.downloadDocument.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  const base = baseUrl(req);
  const list = updated.map((d) => ({
    id: d.id,
    title: d.title,
    iconPath: d.iconPath,
    iconUrl: d.iconPath
      ? base + '/uploads/documents/' + path.basename(d.iconPath)
      : null,
    filePath: d.filePath,
    fileUrl: base + '/uploads/documents/' + path.basename(d.filePath),
    sortOrder: d.sortOrder,
    createdAt: d.createdAt,
  }));
  res.json(list);
};
