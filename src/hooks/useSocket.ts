import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Message {
  id: string;
  content: string;
  userName: string;
  userAvatar?: string;
  timestamp: Date;
  reactions?: Array<{ emoji: string; userName: string; userId: string }>;

}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
}

export const useSocket = () => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
    
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Connected to server:', socket.id);
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setConnected(false);
    });

    socket.on('server:welcome', (data) => {
      console.log('🎉 Server welcome:', data);
    });

    // Message handling
    socket.on('receive_message', (message: any) => {
      setMessages(prev => [...prev, { 
        ...message, 
        timestamp: new Date(message.timestamp) 
      }]);
    });

    // User management
    socket.on('user_joined', (user: User) => {
      setOnlineUsers(prev => {
        const exists = prev.find(u => u.id === user.id);
        if (exists) return prev;
        return [...prev, user];
      });
    });

    socket.on('user_left', (user: User) => {
      setOnlineUsers(prev => prev.filter(u => u.id !== user.id));
    });

    socket.on('online_users', (users: User[]) => {
      setOnlineUsers(users);
    });

    // Typing indicators
    socket.on('user_typing', (data: { userName: string }) => {
      setTypingUsers(prev => {
        if (!prev.includes(data.userName)) {
          return [...prev, data.userName];
        }
        return prev;
      });
    });

    socket.on('user_stop_typing', (data: { userName: string }) => {
      setTypingUsers(prev => prev.filter(name => name !== data.userName));
    });

    // Reactions
    socket.on('message_reaction', (reaction: any) => {
      setMessages(prev => prev.map(msg => {
        if (msg.id === reaction.messageId) {
          const reactions = msg.reactions || [];
          const existingReaction = reactions.find(r => 
            r.emoji === reaction.emoji && r.userId === reaction.userId
          );
          
          if (existingReaction) return msg;
          
          return {
            ...msg,
            reactions: [...reactions, {
              emoji: reaction.emoji,
              userName: reaction.userName,
              userId: reaction.userId
            }]
          };
        }
        return msg;
      }));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const joinCommunity = useCallback((user: { id: string; name: string; avatar?: string }) => {
    if (socketRef.current) {
      socketRef.current.emit('user_join', {
        ...user,
        room: 'general'
      });
    }
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (socketRef.current && content.trim()) {
      socketRef.current.emit('send_message', { content: content.trim() });
    }
  }, []);

  const startTyping = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('typing_start');
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Auto-stop typing after 3 seconds
      typingTimeoutRef.current = setTimeout(() => {
        if (socketRef.current) {
          socketRef.current.emit('typing_stop');
        }
      }, 3000);
    }
  }, []);

  const stopTyping = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('typing_stop');
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);

  const addReaction = useCallback((messageId: string, emoji: string) => {
    if (socketRef.current) {
      socketRef.current.emit('add_reaction', {
        messageId,
        emoji
      });
    }
  }, []);

  const sendPrivateMessage = useCallback((recipientId: string, content: string) => {
    if (socketRef.current && content.trim()) {
      socketRef.current.emit('send_private_message', {
        recipientId,
        content: content.trim()
      });
    }
  }, []);

  return {
    connected,
    messages,
    onlineUsers,
    typingUsers,
    joinCommunity,
    sendMessage,
    startTyping,
    stopTyping,
    addReaction,
    sendPrivateMessage
  };
};
