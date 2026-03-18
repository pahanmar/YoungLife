// src/page/AdminPanel/AdminPanel.jsx
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { usePermissions } from '../../context/PermissionsContext';
import PermissionsEditor from './PermissionsEditor.jsx';
import AdminBooksSection from './AdminBooksSection.jsx';
import AdminDiscipleSection from './AdminDiscipleSection.jsx';
import styles from './admin.module.css';

// Базовый URL бэкенда. Если не задан - ходим в API относительно текущего домена (`/api/...`).
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const USERS_PAGE_SIZE = 10;

// Простейший Confirm Modal (встроен)
function ConfirmModal({ open, title, message, onCancel, onConfirm, confirming }) {
  if (!open) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3 className={styles.modalTitle}>{title}</h3>
        <p className={styles.modalMessage}>{message}</p>
        <div className={styles.modalActions}>
          <button className={`${styles.btn} ${styles.ghost}`} onClick={onCancel} disabled={confirming}>
            Отмена
          </button>
          <button className={`${styles.btn} ${styles.primary}`} onClick={onConfirm} disabled={confirming}>
            {confirming ? 'Подтверждение...' : 'Подтвердить'}
          </button>
        </div>
      </div>
    </div>
  );
}

function NotAuthorizedStub() {
  return (
    <div className={styles.root} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', textAlign: 'center' }}>
      <p style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#3b4b52', maxWidth: 420 }}>
        Для доступа к данному ресурсу обратитесь к администратору
      </p>
      <div style={{ marginTop: 16 }}>
        <a href="/" style={{ color: '#9DACC7' }}>Вернуться на главную</a>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const auth = useContext(AuthContext); // ожидаем { accessToken, user, loading }
  const accessToken = auth?.accessToken;
  const { permissions } = usePermissions();

  // Проверка локальная прав доступа к '/admin' — чтобы гарантированно не рендерить панель, если запрещено
  const adminRule = permissions?.['/admin'] ?? { mode: 'all', roles: [] };

  const userRoles = (() => {
    if (!auth?.user) return [];
    if (Array.isArray(auth.user.roles)) return auth.user.roles;
    if (typeof auth.user.role === 'string') return [auth.user.role];
    return [];
  })();

  const hasAnyRole = (roles) => (roles || []).some(r => userRoles.includes(r));

  let adminAllowed = true;
  if (!adminRule || adminRule.mode === 'all') adminAllowed = true;
  else if (adminRule.mode === 'allow') adminAllowed = hasAnyRole(adminRule.roles);
  else if (adminRule.mode === 'deny') adminAllowed = !hasAnyRole(adminRule.roles);

  // Если доступ запрещён — выводим заглушку и не инициализируем fetch пользователей
  if (!adminAllowed) {
    return <NotAuthorizedStub />;
  }

  // --- Состояния для админ-панели (только если доступ разрешён) ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const [searchQuery, setSearchQuery] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [confirm, setConfirm] = useState({
    open: false,
    userId: null,
    newRole: null,
    confirming: false,
    title: '',
    message: '',
  });
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null); // null = добавление, number = редактирование
  const [addUserForm, setAddUserForm] = useState({ name: '', email: '', phone: '', password: '', role: 'user' });
  const [addUserSubmitting, setAddUserSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, userId: null, userEmail: '', confirming: false });
  const [adminSection, setAdminSection] = useState('users'); // 'users' | 'books' | 'permissions' | 'disciple'

  // Загрузка пользователей (выполняется только если есть accessToken)
  useEffect(() => {
    if (!accessToken) return;

    const ac = new AbortController();

    const load = async () => {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: ac.signal,
        });

        if (!res.ok) {
          const ct = res.headers.get('content-type') || '';
          const txt = ct.includes('application/json') ? await res.json() : await res.text();
          throw new Error(txt?.message || txt || `Status ${res.status}`);
        }

        const data = await res.json();
        const normalized = Array.isArray(data)
          ? data.map(u => ({ ...u, id: u.id ?? u._id ?? u.email }))
          : [];
        setUsers(normalized);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error(err);
        setError(err?.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => ac.abort();
  }, [accessToken]);

  const searchLower = searchQuery.trim().toLowerCase();
  const filteredUsers = searchLower
    ? users.filter(
        (u) =>
          (u.name || '').toLowerCase().includes(searchLower) ||
          (u.email || '').toLowerCase().includes(searchLower) ||
          (u.phone || '').toLowerCase().includes(searchLower)
      )
    : users;

  const totalFiltered = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / USERS_PAGE_SIZE));
  const pageSafe = Math.min(Math.max(1, userPage), totalPages);
  const paginatedUsers = filteredUsers.slice(
    (pageSafe - 1) * USERS_PAGE_SIZE,
    pageSafe * USERS_PAGE_SIZE
  );

  // Сброс на первую страницу при изменении поиска
  useEffect(() => {
    setUserPage(1);
  }, [searchQuery]);

  const openAddUser = () => {
    setEditingUserId(null);
    setAddUserForm({ name: '', email: '', phone: '', password: '', role: 'user' });
    setUserModalOpen(true);
  };

  const openEditUser = (u) => {
    setEditingUserId(u.id);
    setAddUserForm({
      name: u.name || '',
      email: u.email || '',
      phone: u.phone || '',
      password: '',
      role: ['user', 'volunteer', 'employee'].includes(u.role) ? u.role : 'user',
    });
    setUserModalOpen(true);
  };

  const closeUserModal = () => {
    if (!addUserSubmitting) {
      setUserModalOpen(false);
      setEditingUserId(null);
      setAddUserForm({ name: '', email: '', phone: '', password: '', role: 'user' });
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!accessToken) return;
    setAddUserSubmitting(true);
    setError(null);
    try {
      if (editingUserId == null) {
        const res = await fetch(`${API_URL}/api/admin/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(addUserForm),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Ошибка создания');
        setUsers((prev) => [...prev, data]);
      } else {
        const body = { name: addUserForm.name, email: addUserForm.email, phone: addUserForm.phone, role: addUserForm.role };
        if (addUserForm.password.trim() !== '') body.password = addUserForm.password;
        const res = await fetch(`${API_URL}/api/admin/users/${editingUserId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Ошибка сохранения');
        setUsers((prev) => prev.map((u) => (u.id === editingUserId ? data : u)));
      }
      closeUserModal();
    } catch (err) {
      setError(err?.message || 'Ошибка');
    } finally {
      setAddUserSubmitting(false);
    }
  };

  const openDeleteConfirm = (userId, userEmail) => {
    setDeleteConfirm({ open: true, userId, userEmail, confirming: false });
  };

  const performDelete = async () => {
    const { userId } = deleteConfirm;
    if (!userId || !accessToken) return;
    setDeleteConfirm((c) => ({ ...c, confirming: true }));
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || 'Ошибка удаления');
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setDeleteConfirm({ open: false, userId: null, userEmail: '', confirming: false });
    } catch (err) {
      setError(err?.message || 'Ошибка');
      setDeleteConfirm((c) => ({ ...c, confirming: false }));
    }
  };

  // Открываем confirm при смене роли
  const onRoleSelect = (userId, newRole) => {
    const user = users.find(u => u.id === userId);
    const name = user?.email || userId;
    setConfirm({
      open: true,
      userId,
      newRole,
      confirming: false,
      title: 'Подтвердите действие',
      message: `Изменить роль пользователя ${name} на "${newRole}"?`,
    });
  };

  const cancelConfirm = () => {
    setConfirm({ open: false, userId: null, newRole: null, confirming: false, title: '', message: '' });
  };

  const performChangeRole = async () => {
    const { userId, newRole } = confirm;
    if (!userId) return;
    if (!accessToken) {
      setError('Нет токена доступа');
      cancelConfirm();
      return;
    }

    // optimistic update
    const prevUsers = users;
    const prev = prevUsers.find(u => u.id === userId);
    const prevRole = prev?.role;

    setConfirm(c => ({ ...c, confirming: true }));
    setUpdatingIds(s => new Set(s).add(userId));
    setUsers(prevUsers.map(u => (u.id === userId ? { ...u, role: newRole } : u)));

    try {
      const res = await fetch(`${API_URL}/api/admin/users/${encodeURIComponent(userId)}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const ct = res.headers.get('content-type') || '';
        const txt = ct.includes('application/json') ? await res.json() : await res.text();
        throw new Error(txt?.message || txt || `Status ${res.status}`);
      }

      // успех
      cancelConfirm();
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to update role');
      // rollback
      setUsers(prevUsers.map(u => (u.id === userId ? { ...u, role: prevRole } : u)));
      cancelConfirm();
    } finally {
      setUpdatingIds(s => {
        const next = new Set(s);
        next.delete(userId);
        return next;
      });
    }
  };

  return (
    <div className={styles.root}>
      <header className={styles.adminHeader}>
        <h2 className={styles.header}>Панель администратора</h2>
        <nav className={styles.adminNav}>
          <Link to="/" className={styles.adminNavLink}>На сайт</Link>
          <button
            type="button"
            className={adminSection === 'users' ? styles.adminNavLinkActive : styles.adminNavLink}
            onClick={() => setAdminSection('users')}
          >
            Пользователи
          </button>
          <button
            type="button"
            className={adminSection === 'books' ? styles.adminNavLinkActive : styles.adminNavLink}
            onClick={() => setAdminSection('books')}
          >
            Книги
          </button>
          <button
            type="button"
            className={adminSection === 'disciple' ? styles.adminNavLinkActive : styles.adminNavLink}
            onClick={() => setAdminSection('disciple')}
          >
            Ученичество
          </button>
          <button
            type="button"
            className={adminSection === 'permissions' ? styles.adminNavLinkActive : styles.adminNavLink}
            onClick={() => setAdminSection('permissions')}
          >
            Доступ к маршрутам
          </button>
        </nav>
      </header>

      <div className={styles.adminContent}>
      {error && <div className={styles.error}>{error}</div>}

      {adminSection === 'users' && (
        <>
      {loading ? (
        <div className={styles.info}>Загрузка пользователей...</div>
      ) : (
        <div className={styles.card}>
          <div className={styles.cardInner}>
            <div className={styles.toolbar}>
              <h3 className={styles.toolbarTitle}>Пользователи</h3>
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Поиск по имени, email или телефону..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" className={styles.addUserBtn} onClick={openAddUser}>
                Добавить пользователя
              </button>
            </div>
            <p className={styles.toolbarHint}>На странице: до {USERS_PAGE_SIZE}. Поиск по всем пользователям.</p>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Email</th>
                  <th className={styles.th}>Имя</th>
                  <th className={styles.th}>Телефон</th>
                  <th className={styles.th}>Роль</th>
                  <th className={styles.th}>Изменить роль</th>
                  <th className={styles.th}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={styles.empty}>
                      {users.length === 0 ? 'Пользователи не найдены' : 'Нет совпадений по поиску'}
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((u) => (
                    <tr key={u.id} className={styles.tr}>
                      <td className={styles.td}>{u.email}</td>
                      <td className={styles.td}>{u.name || '-'}</td>
                      <td className={styles.td}>{u.phone || '-'}</td>
                      <td className={styles.td}>{u.role}</td>
                      <td className={styles.td}>
                        <select
                          className={styles.select}
                          value={['user', 'volunteer', 'employee'].includes(u.role) ? u.role : 'user'}
                          onChange={(e) => onRoleSelect(u.id, e.target.value)}
                          disabled={updatingIds.has(u.id)}
                        >
                          <option value="user">user</option>
                          <option value="volunteer">volunteer</option>
                          <option value="employee">employee</option>
                        </select>
                        {updatingIds.has(u.id) && <span className={styles.updating}>Обновление...</span>}
                      </td>
                      <td className={styles.td}>
                        <span className={styles.actionButtons}>
                          <button type="button" className={styles.editUserBtn} onClick={() => openEditUser(u)}>
                            Редактировать
                          </button>
                          <button
                            type="button"
                            className={styles.deleteUserBtn}
                            onClick={() => openDeleteConfirm(u.id, u.email)}
                          >
                            Удалить
                          </button>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <span className={styles.paginationLabel}>Страница:</span>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={p === pageSafe ? styles.paginationBtnActive : styles.paginationBtn}
                    onClick={() => setUserPage(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
        </>
      )}

      {adminSection === 'books' && (
        <AdminBooksSection setError={setError} />
      )}

      {adminSection === 'disciple' && (
        <AdminDiscipleSection setError={setError} />
      )}

      {adminSection === 'permissions' && (
        <div className={styles.card}>
          <div className={styles.cardInner}>
            <h3 className={styles.permissionsTitle} style={{ marginTop: 0 }}>Управление доступом к маршрутам</h3>
            <PermissionsEditor noWrapper />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={styles.adminFooter}>
        <div>Последнее обновление: {/* можно подставить дату */}</div>
        <div>Версия панели: 1.0.0</div>
      </div>
      </div>

      <ConfirmModal
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        onCancel={cancelConfirm}
        onConfirm={performChangeRole}
        confirming={confirm.confirming}
      />

      {userModalOpen && (
        <div className={styles.modalOverlay} onClick={closeUserModal}>
          <div className={`${styles.modal} ${styles.modalUser}`} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>
              {editingUserId == null ? 'Добавить пользователя' : 'Редактировать пользователя'}
            </h3>
            <form onSubmit={handleSaveUser}>
              <input
                className={styles.modalInput}
                placeholder="Имя"
                value={addUserForm.name}
                onChange={(e) => setAddUserForm((s) => ({ ...s, name: e.target.value }))}
              />
              <input
                className={styles.modalInput}
                type="email"
                placeholder="Email *"
                value={addUserForm.email}
                onChange={(e) => setAddUserForm((s) => ({ ...s, email: e.target.value }))}
                required
              />
              <input
                className={styles.modalInput}
                type="tel"
                placeholder="Телефон *"
                value={addUserForm.phone}
                onChange={(e) => setAddUserForm((s) => ({ ...s, phone: e.target.value }))}
                required
              />
              <input
                className={styles.modalInput}
                type="password"
                placeholder={editingUserId != null ? 'Новый пароль (оставьте пустым, чтобы не менять)' : 'Пароль *'}
                value={addUserForm.password}
                onChange={(e) => setAddUserForm((s) => ({ ...s, password: e.target.value }))}
                required={editingUserId == null}
              />
              <select
                className={styles.modalSelect}
                value={addUserForm.role}
                onChange={(e) => setAddUserForm((s) => ({ ...s, role: e.target.value }))}
              >
                <option value="user">user</option>
                <option value="volunteer">volunteer</option>
                <option value="employee">employee</option>
              </select>
              <div className={styles.modalActions}>
                <button type="button" className={`${styles.btn} ${styles.ghost}`} onClick={closeUserModal} disabled={addUserSubmitting}>
                  Отмена
                </button>
                <button type="submit" className={`${styles.btn} ${styles.primary}`} disabled={addUserSubmitting}>
                  {addUserSubmitting ? 'Сохранение...' : editingUserId == null ? 'Создать' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleteConfirm.open}
        title="Удалить пользователя?"
        message={`Вы уверены, что хотите удалить пользователя ${deleteConfirm.userEmail}?`}
        onCancel={() => setDeleteConfirm({ open: false, userId: null, userEmail: '', confirming: false })}
        onConfirm={performDelete}
        confirming={deleteConfirm.confirming}
      />
    </div>
  );
}