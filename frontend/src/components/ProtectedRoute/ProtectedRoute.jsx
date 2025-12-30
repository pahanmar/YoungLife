// src/Protected.jsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  return user ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export const RoleRoute = ({ allowedRoles = [], children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!allowedRoles.includes(user.role)) return <div>Access denied</div>;
  return children;
};