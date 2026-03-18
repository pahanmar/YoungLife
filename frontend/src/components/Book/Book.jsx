import React, { useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import styles from './Book.module.css';
import { useAuth } from '../../context/AuthContext';

// Базовый URL бэкенда. Если не задан - ходим в API относительно текущего домена (`/api/...`).
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const ACCESS_DENIED_MESSAGE = 'Для доступа к данной книге обратитесь к администратору';

const Book = ({ bookData = {} }) => {
  const {
    title,
    author,
    coverImage,
    description,
    bookId,
  } = bookData;
  const { accessToken } = useAuth();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!bookId) return;
    setDownloading(true);
    try {
      const res = await fetch(`${API_URL}/api/books/${bookId}/download`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        credentials: 'include',
      });
      if (res.status === 403 || res.status === 401) {
        const data = await res.json().catch(() => ({}));
        alert(data?.message || ACCESS_DENIED_MESSAGE);
        return;
      }
      if (!res.ok) {
        alert('Ошибка загрузки');
        return;
      }
      const blob = await res.blob();
      const disp = res.headers.get('Content-Disposition');
      const match = disp && disp.match(/filename="?([^";\n]+)"?/);
      const filename = match ? decodeURIComponent(match[1].trim()) : (title || 'book').replace(/[^a-zA-Z0-9а-яА-ЯёЁ _-]/g, '_');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(ACCESS_DENIED_MESSAGE);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {coverImage && (
          <div className={styles.cover}>
            <img
              src={coverImage}
              alt={`Обложка книги "${title}"`}
              className={styles.coverImage}
            />
          </div>
        )}

        <div className={styles.info}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.author}>{author}</p>

          <div className={styles.description}>
            <p>{description}</p>
          </div>
        </div>
      </div>

      <div className={styles.download}>
        <button
          type="button"
          className={styles.button}
          onClick={handleDownload}
          disabled={downloading}
        >
          <FiDownload />
          {downloading ? 'Загрузка...' : 'Скачать книгу'}
        </button>
      </div>
    </div>
  );
};

export default Book;