import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// fallback demo permissions — используется если бэкенд недоступен или нет токена
const demoPermissions = {
  '/admin': { mode: 'allow', roles: ['admin'] },
  '/books': { mode: 'all', roles: [] },
  '/disciple': { mode: 'deny', roles: ['volunteer'] },
};

const PermissionsContext = createContext({
  permissions: {},
  setPermissions: () => {},
  reload: () => {},
  loading: false,
});

export const PermissionsProvider = ({ children }) => {
  const { accessToken } = useAuth();
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  // ref для предотвращения применения устаревших ответов (race conditions)
  const fetchIdRef = useRef(0);
  const abortRef = useRef(null);

  const load = async () => {
    // каждый вызов увеличивает id
    const id = ++fetchIdRef.current;

    // если нет токена — применяем локальный fallback (demo) и выходим
    if (!accessToken) {
      setPermissions(demoPermissions);
      setLoading(false);
      return;
    }

    // отменяем предыдущий fetch, если он ещё в процессе
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/admin/route-permissions`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        signal: ac.signal,
      });

      if (!res.ok) {
        // логируем код — не бросаем исключение сразу, используем demo fallback
        console.warn('[Permissions] API returned', res.status);
        setPermissions(demoPermissions);
        return;
      }

      const list = await res.json(); // ожидаем [{ path, mode, roles }]
      // защитимся если ответ не тот
      if (!Array.isArray(list)) {
        console.warn('[Permissions] unexpected payload, using demo fallback', list);
        setPermissions(demoPermissions);
        return;
      }

      // применяем только если это самый свежий fetch
      if (fetchIdRef.current === id) {
        const map = {};
        list.forEach(r => {
          if (r && r.path) map[r.path] = { mode: r.mode || 'all', roles: r.roles || [], hideFromNav: !!r.hideFromNav };
        });
        setPermissions(map);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        // отмена — игнорируем
        return;
      }
      console.error('Permissions load error', err);
      setPermissions(demoPermissions);
    } finally {
      if (fetchIdRef.current === id) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    load();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [accessToken]);

  const reload = () => load();

  return (
    <PermissionsContext.Provider value={{ permissions, setPermissions, reload, loading }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionsContext);