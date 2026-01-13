const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity in this project
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/loanease', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Make io accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const loanRoutes = require('./routes/loanRoutes');
const offerRoutes = require('./routes/offerRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/loan-offers', offerRoutes);
app.use('/api/users', userRoutes);

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('New client connected: ' + socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
