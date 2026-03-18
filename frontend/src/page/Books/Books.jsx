import React, { useEffect, useState } from "react";
import Container from "../../components/Container/Container";
import styles from './Books.module.css';
import Navbar from "../../components/Navbar/Navbar";
import Book from "../../components/Book/Book";
import Footer from "../../components/Footer/Footer";

// Базовый URL бэкенда. Если не задан - ходим в API относительно текущего домена (`/api/...`).
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/books`)
      .then((res) => res.ok ? res.json() : Promise.reject(new Error('Ошибка загрузки')))
      .then((data) => { if (!cancelled) setBooks(Array.isArray(data) ? data : []); })
      .catch((e) => { if (!cancelled) setError(e?.message || 'Ошибка'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const bookDataList = books.map((b) => ({
    bookId: b.id,
    title: b.title,
    author: b.author || '',
    coverImage: b.coverImage || '',
    description: b.description || '',
  }));

  return (
    <>
      <Navbar/>
      <main className={styles.main}>
        <Container>
          {loading && <p className={styles.status}>Загрузка книг...</p>}
          {error && <p className={styles.statusError}>{error}</p>}
          {!loading && !error && bookDataList.length === 0 && (
            <p className={styles.status}>Книг пока нет.</p>
          )}
          {!loading && !error && bookDataList.map((el, id) => (
            <Book bookData={el} key={id} />
          ))}
        </Container>
      </main>
      <Footer/>
    </>
  );
}

export default Books;