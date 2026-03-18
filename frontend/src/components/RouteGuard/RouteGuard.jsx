import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../context/PermissionsContext';
import styles from '../../page/AdminPanel/admin.module.css';

function NotAuthorized({ showHome = true }) {
  return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        padding: 20,
        textAlign: 'center'
      }}>
      <p style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 600,
          color: '#3b4b52',
          maxWidth: 420
        }}>
        Для доступа к данному ресурсу обратитесь к администратору
      </p>
      {showHome && (
        <div style={{ marginTop: 16 }}>
          <a href="/" style={{ color: '#9DACC7' }}>Вернуться на главную</a>
        </div>
      )}
    </div>
  );
}

/*
  rule: { mode: 'all' | 'allow' | 'deny', roles: [] }
  path: если передан — правило берётся из permissions[path] при каждом рендере (актуальные права)
*/
function getRule(permissions, path) {
  const p = permissions[path];
  return p ? { ...p, roles: p.roles || [] } : { mode: 'all', roles: [] };
}

export default function RouteGuard({ rule: ruleProp, path: pathProp, children }) {
  const { user, loading } = useAuth();
  const { permissions } = usePermissions();
  const rule = pathProp != null ? getRule(permissions, pathProp) : (ruleProp ?? { mode: 'all', roles: [] });

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
    return <NotAuthorized />;
  }

  // Разрешён — рендерим children (админ-панель)
  return <>{children}</>;
}