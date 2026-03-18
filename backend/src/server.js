// src/server.js
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from './config.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import contentRoutes from './routes/content.js';
import booksRoutes from './routes/books.js';
import adminBooksRoutes from './routes/adminBooks.js';
import downloadDocumentsRoutes from './routes/downloadDocuments.js';
import adminDownloadDocumentsRoutes from './routes/adminDownloadDocuments.js';
import seed from '../prisma/seed.js';

const app = express();

// Нужен, если backend работает за reverse-proxy (nginx/traefik),
// чтобы корректно интерпретировать scheme/secure контекст.
app.set('trust proxy', 1);

app.use(
  cors({
    origin: config.CORS_ORIGINS,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/content', contentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/admin/books', adminBooksRoutes);
app.use('/api/download-documents', downloadDocumentsRoutes);
app.use('/api/admin/download-documents', adminDownloadDocumentsRoutes);

// health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// вспомогательная функция для логирования всех маршрутов (опционально)
function listRoutes(app) {
  try {
    const routes = [];
    app._router.stack.forEach((mw) => {
      if (mw.route) {
        routes.push({
          path: mw.route.path,
          methods: Object.keys(mw.route.methods).join(',').toUpperCase(),
        });
      } else if (mw.name === 'router' && mw.handle && mw.handle.stack) {
        mw.handle.stack.forEach((l) => {
          if (l.route)
            routes.push({
              path: l.route.path,
              methods: Object.keys(l.route.methods).join(',').toUpperCase(),
            });
        });
      }
    });
    console.log('Registered routes:');
    routes.forEach((r) => console.log(`${r.methods} ${r.path}`));
  } catch (e) {
    console.warn('listRoutes failed', e);
  }
}

const port = config.PORT || 4000;

(async () => {
  try {
    // выполнить seed (идемпотентно)
    await seed();
  } catch (e) {
    console.error('Seed error (continuing):', e);
  }

  // покажем маршруты для отладки
  listRoutes(app);

  app.listen(port, () => {
    console.log(`Server listening on ${port}`);
  });
})();
