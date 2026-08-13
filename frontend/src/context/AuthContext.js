import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API = process.env.REACT_APP_API_URL || '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fsUser');
    return saved ? JSON.parse(saved) : null;
  });

  const setAuthHeader = (token) => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axios.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    if (user?.token) setAuthHeader(user.token);
  }, [user]);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    setUser(data);
    localStorage.setItem('fsUser', JSON.stringify(data));
    setAuthHeader(data.token);
    return data;
  };

  const register = async (name, email, password, isSubscribed) => {
    const { data } = await axios.post(`${API}/auth/register`, { name, email, password, isSubscribed });
    setUser(data);
    localStorage.setItem('fsUser', JSON.stringify(data));
    setAuthHeader(data.token);
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fsUser');
    setAuthHeader(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
