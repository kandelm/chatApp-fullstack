const http = require('http');
const app = require('./app');
const { sequelize } = require('./models');
require('dotenv').config();

const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });
const jwt = require('jsonwebtoken');
const online = new Map();

// Socket.io auth
io.use((socket, next) => {
  const token = socket.handshake.auth && socket.handshake.auth.token;
  if (!token) return next(new Error('Auth error'));
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    socket.user = payload;
    next();
  } catch (err) {
    return next(new Error('Auth error'));
  }
});

// Socket.io events
io.on('connection', (socket) => {
  const userId = socket.user.id;
  const arr = online.get(userId) || [];
  arr.push(socket.id);
  online.set(userId, arr);

  socket.on('joinConversation', (conversationId) => socket.join(`conv_${conversationId}`));
  socket.on('sendMessage', (msg) => io.to(`conv_${msg.conversationId}`).emit('newMessage', msg));

  socket.on('disconnect', () => {
    const arr = online.get(userId) || [];
    const idx = arr.indexOf(socket.id);
    if (idx !== -1) arr.splice(idx, 1);
    if (arr.length) online.set(userId, arr);
    else online.delete(userId);
  });
});

// Retry logic for Sequelize
const connectDB = async () => {
  let connected = false;
  while (!connected) {
    try {
      await sequelize.sync();
      connected = true;
    } catch (err) {
      console.log('Sequelize not ready, retrying in 3s...');
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
};

connectDB().then(() => {
  const port = process.env.PORT || 4000;
  server.listen(port, '0.0.0.0', () => console.log('Server listening on', port));
});
