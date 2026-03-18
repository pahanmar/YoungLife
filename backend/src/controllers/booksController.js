import prisma from '../prismaClient.js';
import path from 'path';
import fs from 'fs';
import { canAccessRoute } from './adminController.js';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'books');
const BOOKS_ACCESS_DENIED_MESSAGE =
  'Для доступа к данной книге обратитесь к администратору';

function safeFilename(original) {
  const ext = path.extname(original || '') || '';
  const base = path
    .basename(original || 'file', ext)
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 40);
  return base + '_' + Date.now() + ext;
}

export const listBooks = async (req, res) => {
  const books = await prisma.book.findMany({ orderBy: { createdAt: 'desc' } });
  const baseUrl = req.protocol + '://' + req.get('host');
  const list = books.map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    description: b.description,
    coverImage: b.coverPath
      ? baseUrl + '/uploads/books/' + path.basename(b.coverPath)
      : null,
    coverPath: b.coverPath,
    bookFileUrl: baseUrl + '/uploads/books/' + path.basename(b.bookFilePath),
    bookFilePath: b.bookFilePath,
    downloadMode: b.downloadMode ?? 'inherit',
    downloadRoles: b.downloadRoles ?? [],
    createdAt: b.createdAt,
  }));
  res.json(list);
};

export const getBook = async (req, res) => {
  const { id } = req.params;
  const book = await prisma.book.findUnique({ where: { id: Number(id) } });
  if (!book) return res.status(404).json({ message: 'Книга не найдена' });
  const baseUrl = req.protocol + '://' + req.get('host');
  res.json({
    id: book.id,
    title: book.title,
    author: book.author,
    description: book.description,
    coverImage: book.coverPath
      ? baseUrl + '/uploads/books/' + path.basename(book.coverPath)
      : null,
    coverPath: book.coverPath,
    bookFileUrl: baseUrl + '/uploads/books/' + path.basename(book.bookFilePath),
    bookFilePath: book.bookFilePath,
    downloadMode: book.downloadMode ?? 'inherit',
    downloadRoles: book.downloadRoles ?? [],
    createdAt: book.createdAt,
  });
};

/** Скачивание файла книги; требуется авторизация и доступ (по книге или по правилу /books) */
export const downloadBook = async (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: BOOKS_ACCESS_DENIED_MESSAGE });
  const { id } = req.params;
  const book = await prisma.book.findUnique({ where: { id: Number(id) } });
  if (!book) return res.status(404).json({ message: 'Книга не найдена' });

  let rule;
  if (book.downloadMode && book.downloadMode !== 'inherit') {
    rule = { mode: book.downloadMode, roles: book.downloadRoles || [] };
  } else {
    const rp = await prisma.routePermission.findUnique({
      where: { path: '/books' },
    });
    rule = rp ? { mode: rp.mode, roles: rp.roles || [] } : null;
  }
  if (!canAccessRoute(rule, req.user.role))
    return res.status(403).json({ message: BOOKS_ACCESS_DENIED_MESSAGE });
  const filePath = path.join(UPLOADS_DIR, path.basename(book.bookFilePath));
  if (!fs.existsSync(filePath))
    return res.status(404).json({ message: 'Файл не найден' });
  // Заголовок Content-Disposition допускает только ASCII без кавычек и переводов строк
  const raw =
    (book.title || 'book')
      .replace(/\r|\n|"/g, ' ')
      .replace(/[^\x20-\x7E]/g, '_')
      .trim()
      .slice(0, 80) || 'book';
  const filename = raw + path.extname(book.bookFilePath);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.sendFile(path.resolve(filePath));
};

const VALID_DOWNLOAD_MODES = ['inherit', 'all', 'allow', 'deny'];
const VALID_DOWNLOAD_ROLES = ['user', 'volunteer', 'employee'];

function parseDownloadRoles(v) {
  if (Array.isArray(v))
    return v.filter((r) => VALID_DOWNLOAD_ROLES.includes(r));
  if (typeof v === 'string') {
    try {
      const arr = JSON.parse(v);
      return Array.isArray(arr)
        ? arr.filter((r) => VALID_DOWNLOAD_ROLES.includes(r))
        : [];
    } catch {
      return [];
    }
  }
  return [];
}

export const createBook = async (req, res) => {
  const { title, author, description, downloadMode, downloadRoles } =
    req.body || {};
  if (!title || !title.trim())
    return res.status(400).json({ message: 'Укажите название книги' });
  if (!req.files?.bookFile?.[0])
    return res.status(400).json({ message: 'Загрузите файл книги' });

  if (!fs.existsSync(UPLOADS_DIR))
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  const bookFile = req.files.bookFile[0];
  const bookFilename = path.basename(bookFile.path);

  let coverFilename = null;
  if (req.files?.cover?.[0]) {
    coverFilename = path.basename(req.files.cover[0].path);
  }

  const mode = VALID_DOWNLOAD_MODES.includes(downloadMode)
    ? downloadMode
    : 'inherit';
  const roles = parseDownloadRoles(downloadRoles);

  const book = await prisma.book.create({
    data: {
      title: title.trim(),
      author: author ? String(author).trim() || null : null,
      description: description ? String(description).trim() || null : null,
      coverPath: coverFilename,
      bookFilePath: bookFilename,
      downloadMode: mode,
      downloadRoles: roles,
    },
  });
  const baseUrl = req.protocol + '://' + req.get('host');
  res.status(201).json({
    id: book.id,
    title: book.title,
    author: book.author,
    description: book.description,
    coverImage: book.coverPath
      ? baseUrl + '/uploads/books/' + book.coverPath
      : null,
    bookFileUrl: baseUrl + '/uploads/books/' + book.bookFilePath,
    downloadMode: book.downloadMode,
    downloadRoles: book.downloadRoles || [],
    createdAt: book.createdAt,
  });
};

export const updateBook = async (req, res) => {
  const { id } = req.params;
  const bookId = Number(id);
  const existing = await prisma.book.findUnique({ where: { id: bookId } });
  if (!existing) return res.status(404).json({ message: 'Книга не найдена' });

  const { title, author, description, downloadMode, downloadRoles } =
    req.body || {};
  const data = {};
  if (title !== undefined) data.title = String(title).trim() || existing.title;
  if (author !== undefined) data.author = String(author).trim() || null;
  if (description !== undefined)
    data.description = String(description).trim() || null;
  if (downloadMode !== undefined && VALID_DOWNLOAD_MODES.includes(downloadMode))
    data.downloadMode = downloadMode;
  if (downloadRoles !== undefined)
    data.downloadRoles = parseDownloadRoles(downloadRoles);

  if (req.files?.bookFile?.[0]) {
    data.bookFilePath = path.basename(req.files.bookFile[0].path);
    const oldPath = path.join(
      UPLOADS_DIR,
      path.basename(existing.bookFilePath)
    );
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }
  if (req.files?.cover?.[0]) {
    data.coverPath = path.basename(req.files.cover[0].path);
    if (existing.coverPath) {
      const oldPath = path.join(UPLOADS_DIR, path.basename(existing.coverPath));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
  }

  const book = await prisma.book.update({ where: { id: bookId }, data });
  const baseUrl = req.protocol + '://' + req.get('host');
  res.json({
    id: book.id,
    title: book.title,
    author: book.author,
    description: book.description,
    coverImage: book.coverPath
      ? baseUrl + '/uploads/books/' + book.coverPath
      : null,
    bookFileUrl: baseUrl + '/uploads/books/' + book.bookFilePath,
    downloadMode: book.downloadMode,
    downloadRoles: book.downloadRoles || [],
    createdAt: book.createdAt,
  });
};

export const deleteBook = async (req, res) => {
  const { id } = req.params;
  const bookId = Number(id);
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) return res.status(404).json({ message: 'Книга не найдена' });
  const dir = UPLOADS_DIR;
  if (book.coverPath) {
    const p = path.join(dir, path.basename(book.coverPath));
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  const p = path.join(dir, path.basename(book.bookFilePath));
  if (fs.existsSync(p)) fs.unlinkSync(p);
  await prisma.book.delete({ where: { id: bookId } });
  res.json({ message: 'Книга удалена' });
};
