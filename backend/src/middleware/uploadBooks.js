import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOADS_BOOKS = path.join(process.cwd(), 'uploads', 'books');

function safeFilename(original) {
  const ext = path.extname(original || '') || '';
  const base = (path.basename(original || 'file', ext) || 'file')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 50);
  return base + '_' + Date.now() + ext;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(UPLOADS_BOOKS))
      fs.mkdirSync(UPLOADS_BOOKS, { recursive: true });
    cb(null, UPLOADS_BOOKS);
  },
  filename: (req, file, cb) => {
    cb(null, safeFilename(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

export const uploadBookFiles = upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'bookFile', maxCount: 1 },
]);
