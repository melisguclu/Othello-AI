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

app.set('trust proxy', 1);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

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

    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
        board: Array(8).fill(null).map(() => Array(8).fill(null)), 
        currentPlayer: 'B',
      };
      rooms[roomId].board[3][3] = 'W';
      rooms[roomId].board[3][4] = 'B';
      rooms[roomId].board[4][3] = 'B';
      rooms[roomId].board[4][4] = 'W';
    }

    if (!rooms[roomId].players.includes(socket.id)) {
      rooms[roomId].players.push(socket.id);
    }

    console.log('Players in room:', rooms[roomId].players);

    socket.emit('gameState', {
      board: rooms[roomId].board,
      currentPlayer: rooms[roomId].currentPlayer,
    });

    io.to(roomId).emit('playerJoined', rooms[roomId].players.length);
  });

  socket.on('makeMove', ({ roomId, move }) => {
    if (!rooms[roomId]) return;
    
    console.log(`Move in room ${roomId}:`, move);
    
    const { row, col, player } = move;

    rooms[roomId].board[row][col] = player;
        rooms[roomId].currentPlayer = player === 'B' ? 'W' : 'B';

    io.to(roomId).emit('receiveMove', { //send the move to all players in the room
      board: rooms[roomId].board,
      currentPlayer: rooms[roomId].currentPlayer,
    });
  });

  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);

    let userRoomId = null;
    for (const [roomId, room] of Object.entries(rooms)) {
      if (room.players.includes(socket.id)) {
        userRoomId = roomId;
        rooms[roomId].players = rooms[roomId].players.filter(id => id !== socket.id);
        break;
      }
    }

    if (userRoomId) {
      console.log(`User ${socket.id} left room ${userRoomId}`);
      io.to(userRoomId).emit('playerLeft');
    }
  });
});


// MongoDB Connection
mongoose.connect(process.env.MONGO_URL).then(() => console.log('Connected to MongoDB')).catch((err) => console.error('MongoDB Connection Error:', err));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use('/auth', authRoutes);
app.use('/games', gameRoutes);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
