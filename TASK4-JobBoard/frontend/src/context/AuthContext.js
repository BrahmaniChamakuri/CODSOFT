import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const Auth = createContext();
export const useAuth = () => useContext(Auth);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem('jb_token');
    const u = localStorage.getItem('jb_user');
    if (t && u) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + t;
      setUser(JSON.parse(u));
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('jb_token', token);
    localStorage.setItem('jb_user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('jb_token');
    localStorage.removeItem('jb_user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return <Auth.Provider value={{ user, login, logout }}>{children}</Auth.Provider>;
}