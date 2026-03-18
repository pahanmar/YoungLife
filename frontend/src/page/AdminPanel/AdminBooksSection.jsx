import React, { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { usePermissions } from '../../context/PermissionsContext';
import styles from './admin.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const BOOKS_MODES = [
  { value: 'all', label: 'Доступ всем' },
  { value: 'allow', label: 'Только указанные роли' },
  { value: 'deny', label: 'Всем кроме указанных ролей' },
];
const BOOK_DOWNLOAD_MODES = [
  { value: 'inherit', label: 'Как общее правило (для книг)' },
  { value: 'all', label: 'Доступ всем' },
  { value: 'allow', label: 'Только указанные роли' },
  { value: 'deny', label: 'Всем кроме указанных ролей' },
];
const BOOKS_ROLES = [
  { value: 'user', label: 'User' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'employee', label: 'Employee' },
];

export default function AdminBooksSection({ setError }) {
  const { accessToken } = useContext(AuthContext);
  const { permissions, setPermissions } = usePermissions();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | { type: 'edit', book } | { type: 'delete', book }
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    cover: null,
    bookFile: null,
    downloadMode: 'inherit',
    downloadRoles: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [openFormRoles, setOpenFormRoles] = useState(false);
  const formRolesRef = useRef(null);
  const booksAccess = permissions['/books'] || { mode: 'all', roles: [], hideFromNav: false };
  const [booksAccessLocal, setBooksAccessLocal] = useState(booksAccess);
  const [savingAccess, setSavingAccess] = useState(false);
  const [openBooksRoles, setOpenBooksRoles] = useState(false);
  const booksRolesRef = useRef(null);

  useEffect(() => {
    const p = permissions['/books'] || { mode: 'all', roles: [], hideFromNav: false };
    setBooksAccessLocal(p);
  }, [permissions['/books']]);

  useEffect(() => {
    if (!openBooksRoles) return;
    const handleClickOutside = (e) => {
      if (booksRolesRef.current && !booksRolesRef.current.contains(e.target)) setOpenBooksRoles(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openBooksRoles]);

  useEffect(() => {
    if (!openFormRoles) return;
    const handleClickOutside = (e) => {
      if (formRolesRef.current && !formRolesRef.current.contains(e.target)) setOpenFormRoles(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openFormRoles]);

  const saveBooksAccess = async () => {
    setSavingAccess(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/route-permissions`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          path: '/books',
          mode: booksAccessLocal.mode,
          roles: booksAccessLocal.roles || [],
          hideFromNav: !!booksAccessLocal.hideFromNav,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Ошибка ${res.status}`);
      }
      const updated = await res.json();
      setPermissions((prev) => ({
        ...prev,
        [updated.path]: { mode: updated.mode, roles: updated.roles || [], hideFromNav: !!updated.hideFromNav },
      }));
    } catch (err) {
      setError?.(err?.message || 'Ошибка сохранения доступа');
    } finally {
      setSavingAccess(false);
    }
  };

  const displayRolesText = (roles) => {
    const list = (roles || []).filter((r) => ['user', 'volunteer', 'employee'].includes(r));
    return list.length === 0 ? 'Выберите роли' : list.join(', ');
  };

  const loadBooks = () => {
    fetch(`${API_URL}/api/books`)
      .then((r) => r.json())
      .then((data) => setBooks(Array.isArray(data) ? data : []))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const openAdd = () => {
    setForm({
      title: '',
      author: '',
      description: '',
      cover: null,
      bookFile: null,
      downloadMode: 'inherit',
      downloadRoles: [],
    });
    setModal('add');
  };

  const openEdit = (book) => {
    setForm({
      title: book.title || '',
      author: book.author || '',
      description: book.description || '',
      cover: null,
      bookFile: null,
      downloadMode: book.downloadMode ?? 'inherit',
      downloadRoles: Array.isArray(book.downloadRoles) ? [...book.downloadRoles] : [],
    });
    setModal({ type: 'edit', book });
  };

  const openDelete = (book) => setModal({ type: 'delete', book });

  const closeModal = () => {
    setModal(null);
    setForm({
      title: '',
      author: '',
      description: '',
      cover: null,
      bookFile: null,
      downloadMode: 'inherit',
      downloadRoles: [],
    });
    setOpenFormRoles(false);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (!form.bookFile) {
      setError?.('Загрузите файл книги');
      return;
    }
    setSubmitting(true);
    setError?.(null);
    const fd = new FormData();
    fd.append('title', form.title.trim());
    fd.append('author', form.author.trim());
    fd.append('description', form.description.trim());
    fd.append('downloadMode', form.downloadMode || 'inherit');
    fd.append('downloadRoles', JSON.stringify(form.downloadRoles || []));
    if (form.cover) fd.append('cover', form.cover);
    fd.append('bookFile', form.bookFile);
    try {
      const res = await fetch(`${API_URL}/api/admin/books`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Ошибка');
      setBooks((prev) => [data, ...prev]);
      closeModal();
    } catch (err) {
      setError?.(err?.message || 'Ошибка');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !modal?.book) return;
    setSubmitting(true);
    setError?.(null);
    const fd = new FormData();
    fd.append('title', form.title.trim());
    fd.append('author', form.author.trim());
    fd.append('description', form.description.trim());
    fd.append('downloadMode', form.downloadMode || 'inherit');
    fd.append('downloadRoles', JSON.stringify(form.downloadRoles || []));
    if (form.cover) fd.append('cover', form.cover);
    if (form.bookFile) fd.append('bookFile', form.bookFile);
    try {
      const res = await fetch(`${API_URL}/api/admin/books/${modal.book.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Ошибка');
      setBooks((prev) => prev.map((b) => (b.id === data.id ? data : b)));
      closeModal();
    } catch (err) {
      setError?.(err?.message || 'Ошибка');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!modal?.book) return;
    setSubmitting(true);
    setError?.(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/books/${modal.book.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || 'Ошибка');
      }
      setBooks((prev) => prev.filter((b) => b.id !== modal.book.id));
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
          <h3 className={styles.toolbarTitle}>Книги</h3>
          <button type="button" className={styles.addUserBtn} onClick={openAdd}>
            Добавить книгу
          </button>
        </div>

        <div className={styles.booksAccessBlock}>
          <h4 className={styles.booksAccessTitle}>Кому можно скачивать книги</h4>
          <div className={styles.booksAccessRow}>
            <select
              className={styles.permissionsSelect}
              value={booksAccessLocal.mode}
              onChange={(e) => setBooksAccessLocal((s) => ({ ...s, mode: e.target.value }))}
            >
              {BOOKS_MODES.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <div className={styles.rolesCell} ref={booksRolesRef} style={{ position: 'relative' }}>
              <button
                type="button"
                className={styles.rolesTrigger}
                onClick={() => setOpenBooksRoles(!openBooksRoles)}
                aria-expanded={openBooksRoles}
              >
                {displayRolesText(booksAccessLocal.roles)}
              </button>
              {openBooksRoles && (
                <div className={styles.rolesDropdown} role="listbox">
                  {BOOKS_ROLES.map((role) => (
                    <label key={role.value} className={styles.rolesCheckboxLabel}>
                      <input
                        type="checkbox"
                        checked={(booksAccessLocal.roles || []).includes(role.value)}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...(booksAccessLocal.roles || []), role.value]
                            : (booksAccessLocal.roles || []).filter((x) => x !== role.value);
                          setBooksAccessLocal((s) => ({ ...s, roles: next }));
                        }}
                      />
                      <span>{role.label}</span>
                    </label>
                  ))}
                  <button type="button" className={styles.rolesDropdownClose} onClick={() => setOpenBooksRoles(false)}>
                    Готово
                  </button>
                </div>
              )}
            </div>
            <label className={styles.rolesCheckboxLabel} style={{ margin: 0 }}>
              <input
                type="checkbox"
                checked={!!booksAccessLocal.hideFromNav}
                onChange={(e) => setBooksAccessLocal((s) => ({ ...s, hideFromNav: e.target.checked }))}
              />
              <span>Скрыть в меню для не имеющих доступа</span>
            </label>
            <button
              type="button"
              className={`${styles.saveBtn} ${savingAccess ? '' : styles.primary}`}
              onClick={saveBooksAccess}
              disabled={savingAccess}
            >
              {savingAccess ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </div>

        {loading ? (
          <p className={styles.info}>Загрузка...</p>
        ) : books.length === 0 ? (
          <p className={styles.empty}>Книг пока нет. Добавьте первую.</p>
        ) : (
          <ul className={styles.booksList}>
            {books.map((b) => (
              <li key={b.id} className={styles.booksListItem}>
                <div className={styles.booksListInfo}>
                  {b.coverImage && (
                    <img src={b.coverImage} alt="" className={styles.booksListCover} />
                  )}
                  <div>
                    <strong>{b.title}</strong>
                    {b.author && <span className={styles.booksListAuthor}> — {b.author}</span>}
                  </div>
                </div>
                <span className={styles.actionButtons}>
                  <button type="button" className={styles.editUserBtn} onClick={() => openEdit(b)}>
                    Редактировать
                  </button>
                  <button type="button" className={styles.deleteUserBtn} onClick={() => openDelete(b)}>
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
            <h3 className={styles.modalTitle}>Добавить книгу</h3>
            <form onSubmit={handleSubmitAdd}>
              <input
                className={styles.modalInput}
                placeholder="Название *"
                value={form.title}
                onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                required
              />
              <input
                className={styles.modalInput}
                placeholder="Автор"
                value={form.author}
                onChange={(e) => setForm((s) => ({ ...s, author: e.target.value }))}
              />
              <textarea
                className={styles.modalTextarea}
                placeholder="Описание"
                value={form.description}
                onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                rows={4}
              />
              <label className={styles.modalLabel}>Разрешено скачивать</label>
              <div className={styles.booksAccessRow} style={{ marginBottom: 12 }}>
                <select
                  className={styles.permissionsSelect}
                  value={form.downloadMode || 'inherit'}
                  onChange={(e) => setForm((s) => ({ ...s, downloadMode: e.target.value }))}
                >
                  {BOOK_DOWNLOAD_MODES.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                {(form.downloadMode === 'allow' || form.downloadMode === 'deny') && (
                  <div className={styles.rolesCell} ref={formRolesRef} style={{ position: 'relative' }}>
                    <button
                      type="button"
                      className={styles.rolesTrigger}
                      onClick={() => setOpenFormRoles(!openFormRoles)}
                      aria-expanded={openFormRoles}
                    >
                      {displayRolesText(form.downloadRoles)}
                    </button>
                    {openFormRoles && (
                      <div className={styles.rolesDropdown} role="listbox">
                        {BOOKS_ROLES.map((role) => (
                          <label key={role.value} className={styles.rolesCheckboxLabel}>
                            <input
                              type="checkbox"
                              checked={(form.downloadRoles || []).includes(role.value)}
                              onChange={(e) => {
                                const next = e.target.checked
                                  ? [...(form.downloadRoles || []), role.value]
                                  : (form.downloadRoles || []).filter((x) => x !== role.value);
                                setForm((s) => ({ ...s, downloadRoles: next }));
                              }}
                            />
                            <span>{role.label}</span>
                          </label>
                        ))}
                        <button type="button" className={styles.rolesDropdownClose} onClick={() => setOpenFormRoles(false)}>
                          Готово
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <label className={styles.modalLabel}>Обложка (изображение)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm((s) => ({ ...s, cover: e.target.files?.[0] || null }))}
                className={styles.modalFile}
              />
              <label className={styles.modalLabel}>Файл книги (PDF и т.д.) *</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf"
                onChange={(e) => setForm((s) => ({ ...s, bookFile: e.target.files?.[0] || null }))}
                className={styles.modalFile}
                required={modal === 'add'}
              />
              <div className={styles.modalActions}>
                <button type="button" className={`${styles.btn} ${styles.ghost}`} onClick={closeModal} disabled={submitting}>
                  Отмена
                </button>
                <button type="submit" className={`${styles.btn} ${styles.primary}`} disabled={submitting}>
                  {submitting ? 'Создание...' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal?.type === 'edit' && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={`${styles.modal} ${styles.modalUser}`} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Редактировать книгу</h3>
            <form onSubmit={handleSubmitEdit}>
              <input
                className={styles.modalInput}
                placeholder="Название *"
                value={form.title}
                onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                required
              />
              <input
                className={styles.modalInput}
                placeholder="Автор"
                value={form.author}
                onChange={(e) => setForm((s) => ({ ...s, author: e.target.value }))}
              />
              <textarea
                className={styles.modalTextarea}
                placeholder="Описание"
                value={form.description}
                onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                rows={4}
              />
              <label className={styles.modalLabel}>Разрешено скачивать</label>
              <div className={styles.booksAccessRow} style={{ marginBottom: 12 }}>
                <select
                  className={styles.permissionsSelect}
                  value={form.downloadMode || 'inherit'}
                  onChange={(e) => setForm((s) => ({ ...s, downloadMode: e.target.value }))}
                >
                  {BOOK_DOWNLOAD_MODES.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                {(form.downloadMode === 'allow' || form.downloadMode === 'deny') && (
                  <div className={styles.rolesCell} ref={formRolesRef} style={{ position: 'relative' }}>
                    <button
                      type="button"
                      className={styles.rolesTrigger}
                      onClick={() => setOpenFormRoles(!openFormRoles)}
                      aria-expanded={openFormRoles}
                    >
                      {displayRolesText(form.downloadRoles)}
                    </button>
                    {openFormRoles && (
                      <div className={styles.rolesDropdown} role="listbox">
                        {BOOKS_ROLES.map((role) => (
                          <label key={role.value} className={styles.rolesCheckboxLabel}>
                            <input
                              type="checkbox"
                              checked={(form.downloadRoles || []).includes(role.value)}
                              onChange={(e) => {
                                const next = e.target.checked
                                  ? [...(form.downloadRoles || []), role.value]
                                  : (form.downloadRoles || []).filter((x) => x !== role.value);
                                setForm((s) => ({ ...s, downloadRoles: next }));
                              }}
                            />
                            <span>{role.label}</span>
                          </label>
                        ))}
                        <button type="button" className={styles.rolesDropdownClose} onClick={() => setOpenFormRoles(false)}>
                          Готово
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <label className={styles.modalLabel}>Новая обложка (оставьте пустым, чтобы не менять)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm((s) => ({ ...s, cover: e.target.files?.[0] || null }))}
                className={styles.modalFile}
              />
              <label className={styles.modalLabel}>Новый файл книги (оставьте пустым, чтобы не менять)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf"
                onChange={(e) => setForm((s) => ({ ...s, bookFile: e.target.files?.[0] || null }))}
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
            <h3 className={styles.modalTitle}>Удалить книгу?</h3>
            <p className={styles.modalMessage}>
              Вы уверены, что хотите удалить книгу «{modal.book?.title}»?
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
