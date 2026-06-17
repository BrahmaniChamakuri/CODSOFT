import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const Auth = createContext();
export const useAuth = () => useContext(Auth);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem('qt');
    const u = localStorage.getItem('qu');
    if (t && u) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + t;
      setUser(JSON.parse(u));
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('qt', token);
    localStorage.setItem('qu', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('qt');
    localStorage.removeItem('qu');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return <Auth.Provider value={{ user, login, logout }}>{children}</Auth.Provider>;
}