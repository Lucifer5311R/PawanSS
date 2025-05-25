// src/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const loadUserAndTokenFromStorage = useCallback(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      try { setCurrentUser(JSON.parse(storedUser)); }
      catch (e) {
        console.error("AuthContext: Failed to parse stored user", e);
        localStorage.removeItem('user'); localStorage.removeItem('token');
        setToken(null); setCurrentUser(null);
      }
    } else { setToken(null); setCurrentUser(null); }
    setIsLoadingAuth(false);
  }, []);

  useEffect(() => { loadUserAndTokenFromStorage(); }, [loadUserAndTokenFromStorage]);

  const login = (userData, authToken) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
    setCurrentUser(userData); setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem('user'); localStorage.removeItem('token');
    setCurrentUser(null); setToken(null);
  };

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'token' || event.key === 'user') loadUserAndTokenFromStorage();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadUserAndTokenFromStorage]);

  if (isLoadingAuth) return <div>Loading authentication state...</div>; // Or your preferred loading indicator

  return (
    <AuthContext.Provider value={{ currentUser, token, login, logout, isLoggedIn: !!token, isLoadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};