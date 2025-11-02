'use client';

import { useEffect, useState, useRef } from 'react';
import { getSocket, socketEvents, socketListeners, disconnectSocket } from '@/lib/socket-client';

interface SocketState {
  isConnected: boolean;
  error: string | null;
}

export function useSocket() {
  const [state, setState] = useState<SocketState>({
    isConnected: false,
    error: null
  });

  const socketRef = useRef(getSocket());

  useEffect(() => {
    const socket = socketRef.current;

    // Connection events
    const handleConnect = () => {
      setState(prev => ({ ...prev, isConnected: true, error: null }));
      console.log('Socket connected');
    };

    const handleDisconnect = (reason: string) => {
      setState(prev => ({ ...prev, isConnected: false, error: null }));
      console.log('Socket disconnected:', reason);
    };

    const handleError = (error: any) => {
      setState(prev => ({ ...prev, error: error.message || 'Connection error' }));
      console.error('Socket connection error:', error);
    };

    // Register event listeners
    const cleanupConnect = socketListeners.onConnect(handleConnect);
    const cleanupDisconnect = socketListeners.onDisconnect(handleDisconnect);
    const cleanupError = socketListeners.onError(handleError);

    // Cleanup on unmount
    return () => {
      cleanupConnect();
      cleanupDisconnect();
      cleanupError();
    };
  }, []);

  const reconnect = () => {
    disconnectSocket();
    socketRef.current = getSocket();
  };

  const disconnect = () => {
    disconnectSocket();
    setState({ isConnected: false, error: null });
  };

  return {
    socket: socketRef.current,
    isConnected: state.isConnected,
    error: state.error,
    reconnect,
    disconnect,
    events: socketEvents,
    listeners: socketListeners
  };
}

// Custom hook for real-time data
export function useRealtimeData<T>(event: string, initialData?: T) {
  const [data, setData] = useState<T | undefined>(initialData);
  const { socket, listeners } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = (newData: T) => {
      setData(newData);
    };

    const cleanup = listeners.onUpdate(handleUpdate);
    socket.emit('subscribe', { event });

    return () => {
      cleanup();
      socket.emit('unsubscribe', { event });
    };
  }, [socket, listeners, event]);

  return data;
}

// Custom hook for room-based communication
export function useSocketRoom(room: string) {
  const { socket, events, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join room when connected
    events.joinRoom(room);

    // Leave room on unmount
    return () => {
      events.leaveRoom(room);
    };
  }, [socket, events, room, isConnected]);

  const sendMessage = (message: string, sender: string) => {
    if (socket && isConnected) {
      events.sendMessage({ room, message, sender });
    }
  };

  return {
    sendMessage,
    isConnected
  };
}