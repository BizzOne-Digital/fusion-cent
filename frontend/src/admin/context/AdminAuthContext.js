import React, { createContext, useContext, useState } from 'react';
import api from '../utils/api';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const s = localStorage.getItem('fsAdmin');
    return s ? JSON.parse(s) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.role !== 'admin') throw new Error('Not authorized as admin');
    setAdmin(data);
    localStorage.setItem('fsAdmin', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('fsAdmin');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
