import React from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from '../../page/AdminPanel/admin.module.css'; // можно использовать общий css или свой

// Небольшая заглушка для неавторизованных пользователей
function NotAuthorized({ message = 'Доступ запрещён', showHome = true }) {
  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginTop: 0 }}>Панель администратора</h2>
      <div style={{
        background: '#fff',
        borderRadius: 10,
        boxShadow: '0 6px 18px rgba(10,20,30,0.06)',
        padding: 20,
        color: '#3b4b52'
      }}>
        <p style={{ fontWeight: 600, margin: 0 }}>{message}</p>
        {showHome && (
          <div style={{ marginTop: 12 }}>
            <a href="/" style={{ color: '#0b7a63' }}>Вернуться на главную</a>
          </div>
        )}
      </div>
    </div>
  );
}

/*
  rule: { mode: 'all' | 'allow' | 'deny', roles: [] }
  - mode 'all' => доступ всем
  - mode 'allow' => доступ только указанным ролям
  - mode 'deny' => доступ всем кроме указанных ролей
*/
export default function RouteGuard({ rule = { mode: 'all', roles: [] }, children }) {
  const { user, loading } = useAuth(); // предполагаем user.role или user?.roles
  // Пока идёт загрузка аутентификации — можно показать заглушку или спиннер
  if (loading) {
    return <div style={{ padding: 20 }}>Проверка доступа...</div>;
  }

  const userRoles = (() => {
    if (!user) return [];
    // поддерживаем как строку role, так и массив roles
    if (Array.isArray(user.roles)) return user.roles;
    if (typeof user.role === 'string') return [user.role];
    return [];
  })();

  const hasAnyRole = (roles) => roles.some(r => userRoles.includes(r));

  let allowed = true;
  if (!rule || rule.mode === 'all') {
    allowed = true;
  } else if (rule.mode === 'allow') {
    // доступ только если у пользователя есть хотя бы одна из указанных ролей
    allowed = hasAnyRole(rule.roles || []);
  } else if (rule.mode === 'deny') {
    // доступ запрещён если у пользователя есть любая из указанных ролей
    allowed = !(hasAnyRole(rule.roles || []));
  }

  if (!allowed) {
    // Показываем простую чистую заглушку без контента админ-панели
    return <NotAuthorized message="Доступ запрещён" />;
  }

  // Разрешён — рендерим children (админ-панель)
  return <>{children}</>;
}