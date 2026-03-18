import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOADS_DOCS = path.join(process.cwd(), 'uploads', 'documents');

function safeFilename(original) {
  const ext = path.extname(original || '') || '';
  const base = (path.basename(original || 'file', ext) || 'file')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 50);
  return base + '_' + Date.now() + ext;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(UPLOADS_DOCS))
      fs.mkdirSync(UPLOADS_DOCS, { recursive: true });
    cb(null, UPLOADS_DOCS);
  },
  filename: (req, file, cb) => {
    cb(null, safeFilename(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
});

export const uploadDocumentFiles = upload.fields([
  { name: 'icon', maxCount: 1 },
  { name: 'file', maxCount: 1 },
]);
