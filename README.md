 <img src="/frontend/public/othello.png" alt="Othello">

# Othello 🎲🎮🕹️
A web-based version of the classic board game Othello, featuring three different game modes, AI opponents, and real-time multiplayer gameplay using WebSockets. Users can register to track their game history and performance statistics.

---

## Features ✨🛠️🚀
- **Three Game Modes**:
  - **Human vs AI**: Play against one of three AI opponents.
  - **Human vs Human**: Play with another player on the same device.
  - **Play with Your Friend**: Connect with a friend on a different device using a unique room ID.
- **AI Opponents**:
  - Minimax with Alpha-Beta Pruning
  - Monte Carlo Tree Search (MCTS)
  - Random Moves
- **Real-Time Multiplayer**:
  - Players can create or join a game room using WebSockets.
  - If a player disconnects, the game waits for them to reconnect.
- **User Registration & Statistics**:
  - Users can register and track their game history.
  - View total games played, win/loss records, and AI opponent stats.
  - Monthly game activity visualized with a bar chart.
  - View the last five games with detailed mode and results.
- **Database & Hosting**:
  - Uses MongoDB to store game and user data.
  - Frontend is deployed on Vercel.
  - Backend runs on Google Cloud Run.

---

## Technologies Used 🖥️🛠️
### Backend:
- Node.js
- Express.js
- MongoDB
- Socket.io

### Frontend:
- React (with Vite)
- ShadCN (UI components)
- Recharts (data visualization)

---

## Game Modes 🎮🏆🔥

### Human vs AI 🤖🧠🎯
Play against one of three AI strategies:
- **Minimax with Alpha-Beta Pruning**: Uses a depth-limited search to make optimal moves.
- **Monte Carlo Tree Search (MCTS)**: Uses simulations to evaluate move strength.
- **Random Moves**: Selects moves randomly.

### Human vs Human (Same Device) 👫🎲🔄
Two players take turns playing on the same screen.

### Play with Your Friend (Different Devices) 🌐🔗👥
- One player creates a game room and shares the room ID.
- The second player joins using the room ID.
- WebSocket communication keeps the game in sync.
- If a player disconnects, the game waits for reconnection before continuing.

---

## Installation 📥⚙️📜
### Backend Setup
#### 1️⃣ Navigate to the backend directory:
```bash
cd backend
npm install
```

#### ️2️⃣ Create a .env file inside the backend directory with the following variables:
```env
MONGO_URL=
JWT_SECRET=
SESSION_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
```

### Frontend Setup
#### 3️⃣ Navigate to the frontend directory:
```bash
cd ../frontend
npm install
```

#### 4️⃣ Create a .env file inside the frontend directory with the following variables:
```env
VITE_API_URL=
VITE_SOCKET_URL=
```

---

## How to Run ▶️🔄🚀
#### 1️⃣ Start the Backend:
```bash
cd backend
npm start
```

#### 2️⃣ Start the Frontend:
```bash
cd frontend
npm run dev
```

   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   