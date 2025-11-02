import { Server as NetServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { config } from './config';

// Socket.IO server instance
let io: any = null;

// Initialize Socket.IO server for development
export function initializeSocketIO(server: NetServer) {
  if (!config.enableSocketIO) {
    console.log('Socket.IO is disabled');
    return null;
  }

  try {
    // Dynamic import Socket.IO only when needed
    const { Server: SocketIOServer } = require('socket.io');
    
    io = new Server(server, {
      path: config.socketPath,
      cors: {
        origin: config.isDevelopment 
          ? ['http://localhost:3000', 'http://localhost:3001']
          : [config.frontendUrl],
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    // Socket.IO connection handling
    io.on('connection', (socket: any) => {
      console.log(`Socket connected: ${socket.id}`);

      // Join room
      socket.on('join-room', ({ room }: { room: string }) => {
        socket.join(room);
        console.log(`Socket ${socket.id} joined room: ${room}`);
        socket.emit('joined-room', { room, success: true });
      });

      // Leave room
      socket.on('leave-room', ({ room }: { room: string }) => {
        socket.leave(room);
        console.log(`Socket ${socket.id} left room: ${room}`);
        socket.emit('left-room', { room, success: true });
      });

      // Send message
      socket.on('send-message', (data: any) => {
        const { room, message, sender } = data;
        io.to(room).emit('new-message', {
          id: Date.now(),
          message,
          sender,
          timestamp: new Date().toISOString()
        });
      });

      // Send notification
      socket.on('send-notification', (data: any) => {
        const { userId, title, message } = data;
        io.to(`user-${userId}`).emit('notification', {
          id: Date.now(),
          title,
          message,
          timestamp: new Date().toISOString()
        });
      });

      // Attendance update
      socket.on('attendance-update', (data: any) => {
        const { type, payload } = data;
        io.emit('attendance-update', {
          type,
          payload,
          timestamp: new Date().toISOString()
        });
      });

      // Real-time updates
      socket.on('real-time-update', (data: any) => {
        const { type, payload } = data;
        io.emit('real-time-update', {
          type,
          payload,
          timestamp: new Date().toISOString()
        });
      });

      // Handle disconnection
      socket.on('disconnect', (reason: string) => {
        console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`);
      });

      // Handle errors
      socket.on('error', (error: any) => {
        console.error(`Socket error for ${socket.id}:`, error);
      });
    });

    console.log('Socket.IO server initialized successfully');
    return io;

  } catch (error) {
    console.error('Failed to initialize Socket.IO server:', error);
    return null;
  }
}

// Get Socket.IO server instance
export function getSocketIO() {
  return io;
}

// Close Socket.IO server
export function closeSocketIO() {
  if (io) {
    io.close();
    io = null;
    console.log('Socket.IO server closed');
  }
}

// Socket.IO helper functions
export const socketHelpers = {
  // Send to specific room
  sendToRoom: (room: string, event: string, data: any) => {
    if (io) {
      io.to(room).emit(event, data);
    }
  },

  // Send to specific user
  sendToUser: (userId: string, event: string, data: any) => {
    if (io) {
      io.to(`user-${userId}`).emit(event, data);
    }
  },

  // Broadcast to all clients
  broadcast: (event: string, data: any) => {
    if (io) {
      io.emit(event, data);
    }
  },

  // Send to all except sender
  broadcastExcept: (socketId: string, event: string, data: any) => {
    if (io) {
      io.except(socketId).emit(event, data);
    }
  }
};

export default io;