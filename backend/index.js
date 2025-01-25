const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.IO Setup
const rooms = {};
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('joinRoom', (roomId) => {
    if (!roomId) {
      console.error('Room ID is missing');
      return;
    }
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    const room = io.sockets.adapter.rooms.get(roomId);
    const players = room ? room.size : 0;

    io.to(roomId).emit('playerJoined', players);
  });

  socket.on('makeMove', ({ roomId, move }) => {
    console.log(`Move in room ${roomId}:`, move);
    socket.to(roomId).emit('receiveMove', move);
  });

  socket.on('leaveRoom', (roomId) => {
    if (roomId) {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
  });
});


// MongoDB Connection
mongoose.connect(process.env.MONGO_URL).then(() => console.log('Connected to MongoDB')).catch((err) => console.error('MongoDB Connection Error:', err));

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use('/auth', authRoutes);
app.use('/games', gameRoutes);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
