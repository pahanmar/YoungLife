// src/page/AdminPanel/AdminPanel.jsx
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; // подстройте путь если нужно
import { usePermissions } from '../../context/PermissionsContext';
import PermissionsEditor from './PermissionsEditor.jsx';
import styles from './admin.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

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

// Простая заглушка при отсутствии доступа
function NotAuthorizedStub({ message = 'Доступ запрещён' }) {
  return (
    <div className={styles.root}>
      <h2 className={styles.header}>Панель администратора</h2>
      <div className={styles.card}>
        <div className={styles.cardInner}>
          <p style={{ fontWeight: 700, margin: 0 }}>{message}</p>
          <div style={{ marginTop: 12 }}>
            <a href="/" style={{ color: '#0b7a63' }}>Вернуться на главную</a>
          </div>
        </div>
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
    return <NotAuthorizedStub message="Доступ запрещён" />;
  }

  // --- Состояния для админ-панели (только если доступ разрешён) ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingIds, setUpdatingIds] = useState(new Set());

  // confirm dialog state
  const [confirm, setConfirm] = useState({
    open: false,
    userId: null,
    newRole: null,
    confirming: false,
    title: '',
    message: '',
  });

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
      <h2 className={styles.header}>Панель администратора</h2>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div className={styles.info}>Загрузка пользователей...</div>
      ) : (
        <div className={styles.card}>
          <div className={styles.cardInner}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Email</th>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Role</th>
                  <th className={styles.th}>Change</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className={styles.empty}>Пользователи не найдены</td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id} className={styles.tr}>
                      <td className={styles.td}>{u.email}</td>
                      <td className={styles.td}>{u.name || '-'}</td>
                      <td className={styles.td}>{u.role}</td>
                      <td className={styles.td}>
                        <select
                          className={styles.select}
                          value={u.role}
                          onChange={e => onRoleSelect(u.id, e.target.value)}
                          disabled={updatingIds.has(u.id)}
                        >
                          <option value="user">user</option>
                          <option value="volunteer">volunteer</option>
                          <option value="employee">employee</option>
                          <option value="admin">admin</option>
                        </select>
                        {updatingIds.has(u.id) && <span className={styles.updating}>Обновление...</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Permissions editor (нижняя секция) — та же карточка/внутренний паддинг */}
      <div className={styles.card}>
        <div className={styles.cardInner}>
          <h3 className={styles.permissionsTitle} style={{ marginTop: 0 }}>Управление доступом к маршрутам</h3>
          <PermissionsEditor noWrapper />
        </div>
      </div>

      {/* Footer */}
      <div className={styles.adminFooter}>
        <div>Последнее обновление: {/* можно подставить дату */}</div>
        <div>Версия панели: 1.0.0</div>
      </div>

      <ConfirmModal
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        onCancel={cancelConfirm}
        onConfirm={performChangeRole}
        confirming={confirm.confirming}
      />
    </div>
  );
}