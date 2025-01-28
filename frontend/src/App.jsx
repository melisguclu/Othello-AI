import React from 'react';
import Game from './components/Game';
import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import Register from './auth/Register';
import Login from './auth/Login';
import Profile from './auth/Profile';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from './context/userContext';
import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <UserContextProvider>
      <SocketProvider>
        <div className="App">
          <Header />
          <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
          <Routes>
            <Route path="/" element={<Game />} />
            <Route path="/register" element={<Register />} />

            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <Footer />
        </div>
      </SocketProvider>
    </UserContextProvider>
  );
}

export default App;
