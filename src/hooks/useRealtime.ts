import React, { useState, useEffect } from 'react';

interface UseRealtimeOptions {
  endpoint?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface RealtimeData {
  type: string;
  data?: any;
  timestamp: string;
}

export const useRealtime = (options: UseRealtimeOptions = {}) => {
  const {
    endpoint = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/functions/v1/realtime-websocket`,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5
  } = options;

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<RealtimeData | null>(null);
  const [reconnectCount, setReconnectCount] = useState(0);

  const connect = () => {
    try {
      const ws = new WebSocket(endpoint);
      
      ws.onopen = () => {
        console.log('Real-time connection established');
        setIsConnected(true);
        setReconnectCount(0);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch (error) {
          console.error('Failed to parse real-time message:', error);
        }
      };

      ws.onclose = () => {
        console.log('Real-time connection closed');
        setIsConnected(false);
        
        // Attempt reconnection
        if (reconnectCount < maxReconnectAttempts) {
          setTimeout(() => {
            setReconnectCount(prev => prev + 1);
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        console.error('Real-time connection error:', error);
        setIsConnected(false);
      };

      setSocket(ws);
    } catch (error) {
      console.error('Failed to establish real-time connection:', error);
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.close();
      setSocket(null);
      setIsConnected(false);
    }
  };

  const sendMessage = (message: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn('Cannot send message: WebSocket not connected');
    }
  };

  const subscribe = (channel: string) => {
    sendMessage({
      type: 'subscribe',
      channel
    });
  };

  const trackEvent = (event: string, data?: any) => {
    sendMessage({
      type: 'analytics_event',
      event,
      data,
      eventId: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    });
  };

  const sendNotification = (title: string, message: string, severity: 'info' | 'warning' | 'error' = 'info') => {
    sendMessage({
      type: 'notification',
      title,
      message,
      severity
    });
  };

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    subscribe,
    trackEvent,
    sendNotification,
    reconnectCount
  };
};