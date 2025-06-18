import { createContext, useContext, useState } from 'react';
import client from '../api/client';

const AuthContext = createContext();

const userInfo = localStorage.getItem('userInfo');
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(userInfo ? JSON.parse(userInfo) : null);
  const login = async ({ username, password }) => {
    const response = await client.post('/login', { username, password });
    setUser(response.data);
    localStorage.setItem('userInfo', JSON.stringify(response.data));
    return response;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
