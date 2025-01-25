import { createContext, useState, useEffect } from 'react';

import { api } from '../lib/api';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  // useEffect(() => {
  //   if (!user) {
  //     axios.get('/auth/profile').then(({ data }) => {
  //       setUser(data);
  //     });
  //   }
  // }, [user]);

  useEffect(() => {
    if (!user) {
      api.get('/auth/profile').then(({ data }) => {
        setUser(data);
      });
    }
  }, [user, setUser]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
