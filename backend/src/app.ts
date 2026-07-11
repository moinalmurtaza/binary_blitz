import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize redis connection checks
import './config/redis';

// Initialize BullMQ Workers
import './jobs/submissionWorker';

// Route Imports
import authRoutes from './routes/authRoutes';
import problemRoutes from './routes/problemRoutes';
import contestRoutes from './routes/contestRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import resourceRoutes from './routes/resourceRoutes';
import adminRoutes from './routes/adminRoutes';
import scheduleRoutes from './routes/scheduleRoutes';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware configurations
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Basic rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again later.' },
});
app.use('/api/', limiter);

// API Routes mounting
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/schedule', scheduleRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Socket.IO Events handler
io.on('connection', (socket) => {
  console.log(`User connected to Socket.IO: ${socket.id}`);

  // Join a discussion room (e.g. general, contest-123)
  socket.on('join_room', (roomId: string) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });

  // Leave a discussion room
  socket.on('leave_room', (roomId: string) => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room: ${roomId}`);
  });

  // Send message event
  socket.on('send_message', (data: { roomId: string; senderName: string; message: string }) => {
    console.log(`Message in ${data.roomId} from ${data.senderName}: ${data.message}`);
    // Broadcast to room
    io.to(data.roomId).emit('receive_message', {
      senderName: data.senderName,
      message: data.message,
      createdAt: new Date(),
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Central Error Handler Middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode.`);
});

export { app, io };
