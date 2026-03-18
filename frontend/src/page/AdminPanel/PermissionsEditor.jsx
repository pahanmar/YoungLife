import React, { useEffect, useState, useRef } from 'react';
import { usePermissions } from '../../context/PermissionsContext';
import { useAuth } from '../../context/AuthContext';
import styles from './admin.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const MAIN_ROUTES = [
  { path: '/', label: 'Главная (/)' },
  { path: '/books', label: 'Книги (/books)' },
  { path: '/admin', label: 'Админ-панель (/admin)' },
];

// Подстраницы ученичества (без /disciple — он задаётся одной строкой «Ученичество (/disciple)» выше)
const DISCIPLE_ROUTES = [
  { path: '/disciple/nastavnichestvo-i-uchenichestvo', label: 'Наставничество и ученичество' },
  { path: '/disciple/identichnost', label: 'Идентичность и ценности' },
  { path: '/disciple/izuchenie-biblii', label: 'Изучать Библию целиком' },
  { path: '/disciple/3-p-uchenichestva', label: '3 "П" ученичества' },
  { path: '/disciple/novoe-rozhdenie', label: 'Новое рождение и новая жизнь' },
  { path: '/disciple/anatomiya-nastavnichestva', label: 'Анатомия наставничества' },
  { path: '/disciple/vidy-nastavnichestva', label: 'Два вида наставничества' },
  { path: '/disciple/zhizn-i-poklonenie', label: 'Жизнь, подражание, поклонение' },
];

const ROUTES = [...MAIN_ROUTES, { path: '/disciple', label: 'Ученичество (/disciple)' }, ...DISCIPLE_ROUTES];

const MODES = [
  { value: 'all', label: 'Доступ всем' },
  { value: 'allow', label: 'Только указанные роли' },
  { value: 'deny', label: 'Всем кроме указанных ролей' },
];

// Без admin — у админа по умолчанию доступ ко всему. Только эти три отображаем и проверяем для надписи.
const ROLES = [
  { value: 'user', label: 'User' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'employee', label: 'Employee' },
];
const ASSIGNABLE_VALUES = ROLES.map((x) => x.value);

// Для надписи на кнопке: показываем только выбранные из трёх ролей; иначе «Выберите роли»
const displayRolesText = (roles) => {
  const list = (roles || []).filter((r) => ASSIGNABLE_VALUES.includes(r));
  return list.length === 0 ? 'Выберите роли' : list.join(', ');
};

export default function PermissionsEditor({ noWrapper = false }) {
  const { permissions, setPermissions, reload } = usePermissions();
  const { accessToken } = useAuth();
  const [local, setLocal] = useState({});
  const [savingPath, setSavingPath] = useState(null);
  const [openRolesPath, setOpenRolesPath] = useState(null);
  const [expandedDisciple, setExpandedDisciple] = useState(true);
  const rolesDropdownRef = useRef(null);

  useEffect(() => {
    if (!openRolesPath) return;
    const handleClickOutside = (e) => {
      if (rolesDropdownRef.current && !rolesDropdownRef.current.contains(e.target)) {
        setOpenRolesPath(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openRolesPath]);

  useEffect(() => {
    const m = {};
    ROUTES.forEach(r => {
      const p = permissions[r.path];
      m[r.path] = p ? { ...p, hideFromNav: !!p.hideFromNav } : { mode: 'all', roles: [], hideFromNav: false };
    });
    setLocal(m);
  }, [permissions]);

  const renderRouteRow = (r, isSubItem = false) => {
    const cur = local[r.path] || { mode: 'all', roles: [], hideFromNav: false };
    const showHide = isSubItem; // кнопка «Скрыть» только у подразделов
    return (
      <tr key={r.path} className={isSubItem ? styles.permissionsSubRow : undefined}>
        <td className={`${styles.routeCell} ${styles.routeLabel}`} style={isSubItem ? { paddingLeft: 28 } : undefined}>{r.label}</td>
        <td className={styles.modeCell}>
          <select
            className={styles.permissionsSelect}
            value={cur.mode}
            onChange={e => setLocal(s => ({ ...s, [r.path]: { ...cur, mode: e.target.value } }))}
          >
            {MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </td>
        <td className={styles.rolesCell} ref={openRolesPath === r.path ? rolesDropdownRef : null}>
          <button
            type="button"
            className={styles.rolesTrigger}
            onClick={() => setOpenRolesPath(openRolesPath === r.path ? null : r.path)}
            aria-expanded={openRolesPath === r.path}
            aria-haspopup="listbox"
          >
            {displayRolesText(cur.roles)}
          </button>
          {openRolesPath === r.path && (
            <div className={styles.rolesDropdown} role="listbox">
              {ROLES.map(role => (
                <label key={role.value} className={styles.rolesCheckboxLabel}>
                  <input
                    type="checkbox"
                    checked={(cur.roles || []).includes(role.value)}
                    onChange={e => {
                      const next = e.target.checked
                        ? [...(cur.roles || []), role.value]
                        : (cur.roles || []).filter(x => x !== role.value);
                      setLocal(s => ({ ...s, [r.path]: { ...cur, roles: next } }));
                    }}
                  />
                  <span>{role.label}</span>
                </label>
              ))}
              <button
                type="button"
                className={styles.rolesDropdownClose}
                onClick={() => setOpenRolesPath(null)}
              >
                Готово
              </button>
            </div>
          )}
        </td>
        <td className={styles.modeCell}>
          {showHide ? (
            <label className={styles.rolesCheckboxLabel} style={{ margin: 0 }}>
              <input
                type="checkbox"
                checked={!!cur.hideFromNav}
                onChange={e => setLocal(s => ({ ...s, [r.path]: { ...cur, hideFromNav: e.target.checked } }))}
              />
              <span>Скрыть</span>
            </label>
          ) : null}
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
  };

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
        body: JSON.stringify({ path, mode: payload.mode, roles: payload.roles, hideFromNav: payload.hideFromNav }),
      });

      if (!res.ok) {
        const ct = res.headers.get('content-type') || '';
        const txt = ct.includes('application/json') ? await res.json() : await res.text();
        throw new Error(txt?.message || txt || `Status ${res.status}`);
      }

      const updated = await res.json();
      setPermissions(prev => ({ ...prev, [updated.path]: { mode: updated.mode, roles: updated.roles || [], hideFromNav: !!updated.hideFromNav } }));
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
          <th className={styles.th}>Роли</th>
          <th className={styles.th}>Скрыть для не имеющих доступа</th>
          <th className={styles.th}></th>
        </tr>
      </thead>
      <tbody>
        {MAIN_ROUTES.map(r => renderRouteRow(r))}
        <tr>
          <td className={`${styles.routeCell} ${styles.routeLabel}`}>
            <span className={styles.discipleRouteWithArrow}>
              <span className={styles.discipleRouteLabel}>Ученичество (/disciple)</span>
              <button
              type="button"
              onClick={() => setExpandedDisciple(!expandedDisciple)}
              className={styles.discipleArrow}
              aria-expanded={expandedDisciple}
              aria-label={expandedDisciple ? 'Свернуть разделы' : 'Развернуть разделы'}
              >
                {expandedDisciple ? '▼' : '▶'}
              </button>
            </span>
          </td>
          <td className={styles.modeCell}>
            <select
              className={styles.permissionsSelect}
              value={(local['/disciple'] || {}).mode || 'all'}
              onChange={e => setLocal(s => ({ ...s, '/disciple': { ...(s['/disciple'] || { mode: 'all', roles: [], hideFromNav: false }), mode: e.target.value } }))}
            >
              {MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </td>
          <td className={styles.rolesCell} ref={openRolesPath === '/disciple' ? rolesDropdownRef : null}>
            <button
              type="button"
              className={styles.rolesTrigger}
              onClick={() => setOpenRolesPath(openRolesPath === '/disciple' ? null : '/disciple')}
              aria-expanded={openRolesPath === '/disciple'}
              aria-haspopup="listbox"
            >
              {displayRolesText((local['/disciple'] || {}).roles)}
            </button>
            {openRolesPath === '/disciple' && (
              <div className={styles.rolesDropdown} role="listbox">
                {ROLES.map(role => (
                  <label key={role.value} className={styles.rolesCheckboxLabel}>
                    <input
                      type="checkbox"
                      checked={((local['/disciple'] || {}).roles || []).includes(role.value)}
                      onChange={e => {
                        const cur = local['/disciple'] || { mode: 'all', roles: [], hideFromNav: false };
                        const next = e.target.checked ? [...(cur.roles || []), role.value] : (cur.roles || []).filter(x => x !== role.value);
                        setLocal(s => ({ ...s, '/disciple': { ...cur, roles: next } }));
                      }}
                    />
                    <span>{role.label}</span>
                  </label>
                ))}
                <button type="button" className={styles.rolesDropdownClose} onClick={() => setOpenRolesPath(null)}>Готово</button>
              </div>
            )}
          </td>
          <td className={styles.modeCell} />
          <td>
            <button
              className={`${styles.saveBtn} ${savingPath === '/disciple' ? '' : styles.primary}`}
              onClick={() => saveOne('/disciple')}
              disabled={savingPath === '/disciple'}
            >
              {savingPath === '/disciple' ? 'Сохранение...' : 'Сохранить'}
            </button>
          </td>
        </tr>
        {expandedDisciple && DISCIPLE_ROUTES.map(r => renderRouteRow(r, true))}
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