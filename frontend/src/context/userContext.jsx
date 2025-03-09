import { createContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const { data } = await api.get('/auth/profile');
        setUser(data);
      } catch (error) {
        setUser(null);
        localStorage.removeItem('token');
      }
    };

    if (!user) {
      checkAuth();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
