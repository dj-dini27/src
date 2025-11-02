import { io, Socket } from 'socket.io-client';

// Socket.IO configuration
const getSocketConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    url: process.env.SOCKET_IO_URL || (isDevelopment ? 'http://localhost:3000' : ''),
    path: process.env.SOCKET_IO_PATH || '/socket.io',
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    maxReconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
    forceNew: false,
  };
};

// Socket.IO client instance
let socket: Socket | null = null;

// Get socket instance
export function getSocket(): Socket {
  if (!socket) {
    const config = getSocketConfig();
    socket = io(config.url, {
      path: config.path,
      autoConnect: config.autoConnect,
      reconnection: config.reconnection,
      reconnectionDelay: config.reconnectionDelay,
      reconnectionAttempts: config.reconnectionAttempts,
      maxReconnectionAttempts: config.maxReconnectionAttempts,
      transports: config.transports,
    });

    // Connection event listeners
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from Socket.IO server:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected to Socket.IO server after', attemptNumber, 'attempts');
    });
  }

  return socket;
}

// Disconnect socket
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// Reconnect socket
export function reconnectSocket(): void {
  disconnectSocket();
  socket = getSocket();
}

// Socket event emitters
export const socketEvents = {
  // Join room
  joinRoom: (room: string) => {
    const socket = getSocket();
    socket.emit('join-room', { room });
  },

  // Leave room
  leaveRoom: (room: string) => {
    const socket = getSocket();
    socket.emit('leave-room', { room });
  },

  // Send message
  sendMessage: (data: { room: string; message: string; sender: string }) => {
    const socket = getSocket();
    socket.emit('send-message', data);
  },

  // Send notification
  sendNotification: (data: { userId: string; title: string; message: string }) => {
    const socket = getSocket();
    socket.emit('send-notification', data);
  },

  // Attendance update
  updateAttendance: (data: { type: string; data: any }) => {
    const socket = getSocket();
    socket.emit('attendance-update', data);
  },

  // Real-time updates
  sendUpdate: (data: { type: string; payload: any }) => {
    const socket = getSocket();
    socket.emit('real-time-update', data);
  }
};

// Socket event listeners
export const socketListeners = {
  // Listen for messages
  onMessage: (callback: (data: any) => void) => {
    const socket = getSocket();
    socket.on('new-message', callback);
    return () => socket.off('new-message', callback);
  },

  // Listen for notifications
  onNotification: (callback: (data: any) => void) => {
    const socket = getSocket();
    socket.on('notification', callback);
    return () => socket.off('notification', callback);
  },

  // Listen for attendance updates
  onAttendanceUpdate: (callback: (data: any) => void) => {
    const socket = getSocket();
    socket.on('attendance-update', callback);
    return () => socket.off('attendance-update', callback);
  },

  // Listen for real-time updates
  onUpdate: (callback: (data: any) => void) => {
    const socket = getSocket();
    socket.on('real-time-update', callback);
    return () => socket.off('real-time-update', callback);
  },

  // Listen for connection events
  onConnect: (callback: () => void) => {
    const socket = getSocket();
    socket.on('connect', callback);
    return () => socket.off('connect', callback);
  },

  onDisconnect: (callback: (reason: string) => void) => {
    const socket = getSocket();
    socket.on('disconnect', callback);
    return () => socket.off('disconnect', callback);
  },

  onError: (callback: (error: any) => void) => {
    const socket = getSocket();
    socket.on('connect_error', callback);
    return () => socket.off('connect_error', callback);
  }
};

// Custom hook for Socket.IO
export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  return {
    socket: getSocket(),
    isConnected,
    disconnect: disconnectSocket,
    reconnect: reconnectSocket,
    events: socketEvents,
    listeners: socketListeners
  };
}

// Export default socket instance
export default getSocket;