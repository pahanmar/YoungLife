import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../api/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await authService.refresh(); // ожидаем { user?, accessToken? }
        if (data?.user) setUser(data.user);
        if (data?.accessToken) setAccessTokenState(data.accessToken);
      } catch (e) {
        setUser(null);
        setAccessTokenState(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const register = async ({ name, email, password }) => {
    const data = await authService.register({ name, email, password });
    if (data?.user) setUser(data.user);
    if (data?.accessToken) setAccessTokenState(data.accessToken);
    return data;
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    if (data?.user) setUser(data.user);
    if (data?.accessToken) setAccessTokenState(data.accessToken);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setAccessTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, setUser, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);