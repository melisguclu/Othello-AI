import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { UserContext } from '../context/userContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // console.log('token for websocket:', token || 'no token found');

    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      auth: token ? { token } : {},
    });
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
