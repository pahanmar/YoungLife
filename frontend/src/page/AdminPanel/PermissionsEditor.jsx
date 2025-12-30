import React, { useEffect, useState } from 'react';
import { usePermissions } from '../../context/PermissionsContext';
import { useAuth } from '../../context/AuthContext';
import styles from './admin.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const ROUTES = [
  { path: '/', label: 'Главная (/)' },
  { path: '/books', label: 'Books (/books)' },
  { path: '/disciple', label: 'Disciple (/disciple)' },
  { path: '/admin', label: 'Admin Panel (/admin)' },
];

const MODES = [
  { value: 'all', label: 'Доступ всем' },
  { value: 'allow', label: 'Только указанные роли' },
  { value: 'deny', label: 'Всем кроме указанных ролей' },
];

export default function PermissionsEditor({ noWrapper = false }) {
  const { permissions, setPermissions, reload } = usePermissions();
  const { accessToken } = useAuth();
  const [local, setLocal] = useState({});
  const [savingPath, setSavingPath] = useState(null);

  useEffect(() => {
    const m = {};
    ROUTES.forEach(r => {
      m[r.path] = permissions[r.path] ? { ...permissions[r.path] } : { mode: 'all', roles: [] };
    });
    setLocal(m);
  }, [permissions]);

  const saveOne = async (path) => {
    const payload = local[path];
    if (!payload) return;
    setSavingPath(path);
    try {
      if (!accessToken) {
        setPermissions(prev => ({ ...prev, [path]: payload }));
        setSavingPath(null);
        return;
      }

      const res = await fetch(`${API_URL}/api/admin/route-permissions`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ path, mode: payload.mode, roles: payload.roles }),
      });

      if (!res.ok) {
        const ct = res.headers.get('content-type') || '';
        const txt = ct.includes('application/json') ? await res.json() : await res.text();
        throw new Error(txt?.message || txt || `Status ${res.status}`);
      }

      const updated = await res.json(); // ожидаем { path, mode, roles }
      setPermissions(prev => ({ ...prev, [updated.path]: { mode: updated.mode, roles: updated.roles || [] } }));
    } catch (err) {
      console.error('Save permission error', err);
      alert('Ошибка при сохранении: ' + (err?.message || 'unknown'));
    } finally {
      setSavingPath(null);
    }
  };

  const table = (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>Маршрут</th>
          <th className={styles.th}>Режим</th>
          <th className={styles.th}>Роли (через запятую)</th>
          <th className={styles.th}></th>
        </tr>
      </thead>
      <tbody>
        {ROUTES.map(r => {
          const cur = local[r.path] || { mode: 'all', roles: [] };
          return (
            <tr key={r.path}>
              <td className={`${styles.routeCell} ${styles.routeLabel}`}>{r.label}</td>
              <td className={styles.modeCell}>
                <select
                  className={styles.permissionsSelect}
                  value={cur.mode}
                  onChange={e => setLocal(s => ({ ...s, [r.path]: { ...cur, mode: e.target.value } }))}
                >
                  {MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </td>
              <td className={styles.rolesCell}>
                <input
                  className={styles.permissionsInput}
                  placeholder="admin,volunteer"
                  value={(cur.roles || []).join(',')}
                  onChange={e => setLocal(s => ({ ...s, [r.path]: { ...cur, roles: e.target.value.split(',').map(x => x.trim()).filter(Boolean) } }))}
                />
              </td>
              <td>
                <button
                  className={`${styles.saveBtn} ${savingPath === r.path ? '' : styles.primary}`}
                  onClick={() => saveOne(r.path)}
                  disabled={savingPath === r.path}
                >
                  {savingPath === r.path ? 'Сохранение...' : 'Сохранить'}
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  if (noWrapper) {
    return (
      <>
        {table}
        <div className={styles.permissionsFooter}>
          <div><button className={styles.reloadBtn} onClick={reload}>Обновить из сервера</button></div>
          <div style={{ color: '#7b8b8f', fontSize: 13 }}>Последнее обновление:</div>
        </div>
      </>
    );
  }

  return (
    <div className={styles.permissionsCard}>
      <h3 className={styles.permissionsTitle}>Управление доступом к маршрутам</h3>
      {table}
      <div className={styles.permissionsFooter}>
        <div><button className={styles.reloadBtn} onClick={reload}>Обновить из сервера</button></div>
        <div style={{ color: '#7b8b8f', fontSize: 13 }}>Последнее обновление:</div>
      </div>
    </div>
  );
}