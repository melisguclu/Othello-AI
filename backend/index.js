const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const gameRoutes = require('./routes/gameRoutes');
const attachUser = require('./middleware/attach-user');

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

  socket.on('joinRoom', (roomId) => {
    if (!roomId) {
      return;
    }
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
        board: Array(8).fill(null).map(() => Array(8).fill(null)), 
        currentPlayer: 'B',
        playerColors: {}, 
      };
      rooms[roomId].board[3][3] = 'W';
      rooms[roomId].board[3][4] = 'B';
      rooms[roomId].board[4][3] = 'B';
      rooms[roomId].board[4][4] = 'W';
    }

    let assignedColor = rooms[roomId].players.length === 0 ? 'B' : 'W';
    rooms[roomId].players.push(socket.id);
    rooms[roomId].playerColors[socket.id] = assignedColor;

    socket.emit('gameState', {
      board: rooms[roomId].board,
      currentPlayer: rooms[roomId].currentPlayer,
      assignedColor
    });

    io.to(roomId).emit('playerJoined', rooms[roomId].players.length);
  });

  socket.on('makeMove', ({ roomId, move, playerId }) => {
    if (!rooms[roomId]) return;
    
    const { row, col, player } = move;

    if (rooms[roomId].playerColors[playerId] !== player) {
      return;
    }
  
    rooms[roomId].board[row][col] = player;
    rooms[roomId].currentPlayer = player === 'B' ? 'W' : 'B';
    rooms[roomId].latestDisc = {row, col}

    io.to(roomId).emit('receiveMove', {
      board: rooms[roomId].board,
      currentPlayer: rooms[roomId].currentPlayer,
      latestDisc: rooms[roomId].latestDisc,
    });
  });

  socket.on('disconnect', () => {
    let userRoomId = null;
    for (const [roomId, room] of Object.entries(rooms)) {
      if (room.players.includes(socket.id)) {
        userRoomId = roomId;
        rooms[roomId].players = rooms[roomId].players.filter(id => id !== socket.id);
        delete rooms[roomId].playerColors[socket.id]; 
        break;
      }
    }

    if (userRoomId) {
      io.to(userRoomId).emit('playerLeft');
    }
  });
});


// MongoDB Connection
mongoose.connect(process.env.MONGO_URL).then(() => console.log('Connected to MongoDB')).catch((err) => console.error('MongoDB Connection Error:', err));

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: false }));

app.use(attachUser);

app.use('/auth', authRoutes);
app.use('/games', gameRoutes);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
