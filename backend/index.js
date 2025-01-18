const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes'); 
const cookieParser = require('cookie-parser');
const gameRoutes = require('./routes/gameRoutes');


const app = express();

//database connection
mongoose.connect(process.env.MONGO_URL).then(() => console.log('Connected to MongoDB')).catch((error) => console.error('Could not connect to MongoDB', error));

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRoutes);
app.use('/games', gameRoutes);

const port = 8000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
