import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import exchangeRoutes from './routes/exchangeRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import Message from './models/Message.js';
import { Server } from 'socket.io';

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || '*' }
});

app.use(cors()); // Allow all origins
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public
app.use(express.json({ limit: '10mb' }));

// Logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/exchanges', exchangeRoutes); // Public access to see skills
app.use('/api/chat', chatRoutes);

// WebSocket
io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('send-message', async ({ roomId, userId, text }) => {
    try {
      const messageData = { roomId, senderId: userId, text };

      // Save to DB
      const savedMessage = await Message.create(messageData);

      // Emit to room with formatted data matching frontend expectations
      const messageToEmit = {
        userId: savedMessage.senderId,
        text: savedMessage.text,
        timestamp: savedMessage.timestamp
      };

      io.to(roomId).emit('receive-message', messageToEmit);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté');
  });
});

const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== 'production') {
  server.listen(PORT, () =>
    console.log(`Serveur démarré sur http://localhost:${PORT}`)
  );
}

export default app;