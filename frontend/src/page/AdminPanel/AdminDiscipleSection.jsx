import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import styles from './admin.module.css';

// Базовый URL бэкенда. Если не задан - ходим в API относительно текущего домена (`/api/...`).
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export default function AdminDiscipleSection({ setError }) {
  const { accessToken } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | { type: 'edit', doc } | { type: 'delete', doc }
  const [form, setForm] = useState({
    title: '',
    icon: null,
    file: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [reordering, setReordering] = useState(false);

  const loadDocuments = () => {
    fetch(`${API_URL}/api/admin/download-documents`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    })
      .then((r) => r.json())
      .then((data) => setDocuments(Array.isArray(data) ? data : []))
      .catch(() => setDocuments([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDocuments();
  }, [accessToken]);

  const openAdd = () => {
    setForm({ title: '', icon: null, file: null });
    setModal('add');
  };

  const openEdit = (doc) => {
    setForm({
      title: doc.title || '',
      icon: null,
      file: null,
    });
    setModal({ type: 'edit', doc });
  };

  const openDelete = (doc) => setModal({ type: 'delete', doc });

  const closeModal = () => {
    setModal(null);
    setForm({ title: '', icon: null, file: null });
  };

  const moveDocument = async (index, direction) => {
    if (direction === 'up' && index <= 0) return;
    if (direction === 'down' && index >= documents.length - 1) return;
    const newOrder = [...documents];
    const swap = direction === 'up' ? index - 1 : index + 1;
    [newOrder[index], newOrder[swap]] = [newOrder[swap], newOrder[index]];
    const orderIds = newOrder.map((d) => d.id);
    setReordering(true);
    setError?.(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/download-documents/reorder`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ order: orderIds }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Ошибка');
      }
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : newOrder);
    } catch (err) {
      setError?.(err?.message || 'Ошибка');
    } finally {
      setReordering(false);
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (!form.file) {
      setError?.('Загрузите файл документа');
      return;
    }
    setSubmitting(true);
    setError?.(null);
    const fd = new FormData();
    fd.append('title', form.title.trim());
    if (form.icon) fd.append('icon', form.icon);
    fd.append('file', form.file);
    try {
      const res = await fetch(`${API_URL}/api/admin/download-documents`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Ошибка');
      setDocuments((prev) => [...prev, data].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
      loadDocuments();
      closeModal();
    } catch (err) {
      setError?.(err?.message || 'Ошибка');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !modal?.doc) return;
    setSubmitting(true);
    setError?.(null);
    const fd = new FormData();
    fd.append('title', form.title.trim());
    if (form.icon) fd.append('icon', form.icon);
    if (form.file) fd.append('file', form.file);
    try {
      const res = await fetch(`${API_URL}/api/admin/download-documents/${modal.doc.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Ошибка');
      setDocuments((prev) =>
        prev.map((d) => (d.id === data.id ? data : d)).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      );
      closeModal();
    } catch (err) {
      setError?.(err?.message || 'Ошибка');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!modal?.doc) return;
    setSubmitting(true);
    setError?.(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/download-documents/${modal.doc.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Ошибка');
      }
      setDocuments((prev) => prev.filter((d) => d.id !== modal.doc.id));
      closeModal();
    } catch (err) {
      setError?.(err?.message || 'Ошибка');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardInner}>
        <div className={styles.toolbar}>
          <h3 className={styles.toolbarTitle}>Документы для скачивания</h3>
          <button type="button" className={styles.addUserBtn} onClick={openAdd}>
            Добавить документ
          </button>
        </div>
        <p className={styles.toolbarHint}>Документы отображаются на странице «Ученичество» в блоке «Документы для скачивания».</p>
        {loading ? (
          <p className={styles.info}>Загрузка...</p>
        ) : documents.length === 0 ? (
          <p className={styles.empty}>Документов пока нет. Добавьте первый.</p>
        ) : (
          <ul className={styles.booksList}>
            {documents.map((d, index) => (
              <li key={d.id} className={styles.booksListItem}>
                <span className={styles.docOrderArrows}>
                  <button
                    type="button"
                    className={styles.arrowBtn}
                    onClick={() => moveDocument(index, 'up')}
                    disabled={reordering || index === 0}
                    aria-label="Поднять выше"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={styles.arrowBtn}
                    onClick={() => moveDocument(index, 'down')}
                    disabled={reordering || index === documents.length - 1}
                    aria-label="Опустить ниже"
                  >
                    ↓
                  </button>
                </span>
                <div className={styles.booksListInfo}>
                  {d.iconUrl && (
                    <img src={d.iconUrl} alt="" className={styles.booksListCover} style={{ width: 36, height: 36, objectFit: 'contain' }} />
                  )}
                  <div>
                    <strong>{d.title}</strong>
                  </div>
                </div>
                <span className={styles.actionButtons}>
                  <button type="button" className={styles.editUserBtn} onClick={() => openEdit(d)}>
                    Редактировать
                  </button>
                  <button type="button" className={styles.deleteUserBtn} onClick={() => openDelete(d)}>
                    Удалить
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {modal === 'add' && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={`${styles.modal} ${styles.modalUser}`} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Добавить документ</h3>
            <form onSubmit={handleSubmitAdd}>
              <input
                className={styles.modalInput}
                placeholder="Название *"
                value={form.title}
                onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                required
              />
              <label className={styles.modalLabel}>Иконка для кнопки (изображение)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm((s) => ({ ...s, icon: e.target.files?.[0] || null }))}
                className={styles.modalFile}
              />
              <label className={styles.modalLabel}>Файл документа *</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword"
                onChange={(e) => setForm((s) => ({ ...s, file: e.target.files?.[0] || null }))}
                className={styles.modalFile}
                required
              />
              <div className={styles.modalActions}>
                <button type="button" className={`${styles.btn} ${styles.ghost}`} onClick={closeModal} disabled={submitting}>
                  Отмена
                </button>
                <button type="submit" className={`${styles.btn} ${styles.primary}`} disabled={submitting}>
                  {submitting ? 'Добавление...' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal?.type === 'edit' && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={`${styles.modal} ${styles.modalUser}`} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Редактировать документ</h3>
            <form onSubmit={handleSubmitEdit}>
              <input
                className={styles.modalInput}
                placeholder="Название *"
                value={form.title}
                onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                required
              />
              <label className={styles.modalLabel}>Новая иконка (оставьте пустым, чтобы не менять)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm((s) => ({ ...s, icon: e.target.files?.[0] || null }))}
                className={styles.modalFile}
              />
              <label className={styles.modalLabel}>Новый файл (оставьте пустым, чтобы не менять)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword"
                onChange={(e) => setForm((s) => ({ ...s, file: e.target.files?.[0] || null }))}
                className={styles.modalFile}
              />
              <div className={styles.modalActions}>
                <button type="button" className={`${styles.btn} ${styles.ghost}`} onClick={closeModal} disabled={submitting}>
                  Отмена
                </button>
                <button type="submit" className={`${styles.btn} ${styles.primary}`} disabled={submitting}>
                  {submitting ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal?.type === 'delete' && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Удалить документ?</h3>
            <p className={styles.modalMessage}>
              Вы уверены, что хотите удалить документ «{modal.doc?.title}»?
            </p>
            <div className={styles.modalActions}>
              <button type="button" className={`${styles.btn} ${styles.ghost}`} onClick={closeModal} disabled={submitting}>
                Отмена
              </button>
              <button type="button" className={`${styles.btn} ${styles.primary}`} onClick={handleDelete} disabled={submitting}>
                {submitting ? 'Удаление...' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
