import axios from 'axios';
import { createContext, useContext, useState, useEffect } from 'react';

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
      axios.get('/auth/profile').then(({ data }) => {
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
