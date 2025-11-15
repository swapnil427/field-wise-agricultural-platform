import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  room: string;
  timestamp: Date;
  reactions?: any[];
  status: string;
  type?: string;
  file?: any;
}

interface User {
  id: string;
  name: string;
  socketId: string;
  joinedAt: Date;
  status: string;
  avatar?: string;
}

const CommunityChat: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [selectedRoom, setSelectedRoom] = useState('general');
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showUserSetup, setShowUserSetup] = useState(true);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('👤');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const rooms = [
    { id: 'general', name: 'General Discussion', icon: '💬', description: 'Open chat for all users' },
    { id: 'crops', name: 'Crop Management', icon: '🌱', description: 'Discuss farming techniques' },
    { id: 'market', name: 'Market Prices', icon: '💰', description: 'Share market information' },
    { id: 'weather', name: 'Weather Updates', icon: '🌤️', description: 'Weather-related discussions' },
    { id: 'expert-qa', name: 'Expert Q&A', icon: '👨‍🏫', description: 'Direct questions to experts' },
    { id: 'equipment', name: 'Equipment Help', icon: '🚜', description: 'Machinery and tools discussion' }
  ];

  const avatars = ['👤', '👨‍🌾', '👩‍🌾', '🧑‍🌾', '👨‍💼', '👩‍💼', '🧑‍💻', '👨‍🔬', '👩‍🔬'];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentUser && !socket) {
      initializeSocket();
    }
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeSocket = () => {
    console.log('🔌 Initializing socket connection...');
    setConnectionError(null);
    
    const socketInstance = io('http://localhost:8081', { 
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
    
    socketInstance.on('connect', () => {
      console.log('✅ Connected to server:', socketInstance.id);
      setIsConnected(true);
      setConnectionError(null);
      
      // Join user to the chat
      if (currentUser) {
        console.log('👤 Joining user to chat:', currentUser.name);
        socketInstance.emit('user_join', {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          room: selectedRoom
        });
      }
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason);
      setIsConnected(false);
      setConnectionError(`Disconnected: ${reason}`);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('🔥 Connection error:', error);
      setConnectionError(`Connection failed: ${error.message}`);
      setIsConnected(false);
    });

    socketInstance.on('server:welcome', (data) => {
      console.log('🎉 Server welcome:', data);
    });

    socketInstance.on('receive_message', (message: Message) => {
      console.log('📨 Received message:', message);
      // Ensure message has proper timestamp
      const formattedMessage = {
        ...message,
        timestamp: new Date(message.timestamp)
      };
      setMessages(prev => [...prev, formattedMessage]);
    });

    socketInstance.on('user_joined', (user: User) => {
      console.log('👋 User joined:', user);
      setMessages(prev => [...prev, {
        id: `system_${Date.now()}`,
        content: `${user.name} joined the chat`,
        userId: 'system',
        userName: 'System',
        room: selectedRoom,
        timestamp: new Date(),
        status: 'sent',
        type: 'system'
      }]);
    });

    socketInstance.on('online_users', (users: User[]) => {
      console.log('👥 Online users:', users);
      setOnlineUsers(users);
    });

    socketInstance.on('user_typing', (data: { userName: string }) => {
      console.log('⌨️ User typing:', data);
      setTypingUsers(prev => {
        if (!prev.includes(data.userName) && data.userName !== currentUser?.name) {
          return [...prev, data.userName];
        }
        return prev;
      });
    });

    socketInstance.on('user_stop_typing', (data: { userName: string }) => {
      console.log('⏹️ User stopped typing:', data);
      setTypingUsers(prev => prev.filter(user => user !== data.userName));
    });

    socketInstance.on('room_users', (users: User[]) => {
      console.log('🏠 Room users:', users);
      setOnlineUsers(users);
    });

    setSocket(socketInstance);
  };

  const handleUserSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      const user: User = {
        id: `user_${Date.now()}`,
        name: userName.trim(),
        socketId: '',
        joinedAt: new Date(),
        status: 'online',
        avatar: userAvatar
      };
      console.log('🆕 Creating user:', user);
      setCurrentUser(user);
      setShowUserSetup(false);
    }
  };

  const sendMessage = () => {
    if (socket && inputMessage.trim() && currentUser && isConnected) {
      console.log('📤 Sending message:', inputMessage.trim());
      
      // Add message to local state immediately for better UX
      const tempMessage: Message = {
        id: `temp_${Date.now()}`,
        content: inputMessage.trim(),
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        room: selectedRoom,
        timestamp: new Date(),
        status: 'sending',
        reactions: []
      };
      
      setMessages(prev => [...prev, tempMessage]);
      
      socket.emit('send_message', {
        content: inputMessage.trim(),
        room: selectedRoom
      });
      
      setInputMessage('');
    } else {
      console.log('❌ Cannot send message:', { 
        hasSocket: !!socket, 
        hasMessage: !!inputMessage.trim(), 
        hasUser: !!currentUser,
        isConnected 
      });
      
      if (!isConnected) {
        setConnectionError('Not connected to server. Please refresh the page.');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTyping = () => {
    if (socket && currentUser && isConnected) {
      socket.emit('typing_start');
      
      // Stop typing after 3 seconds
      setTimeout(() => {
        if (socket) {
          socket.emit('typing_stop');
        }
      }, 3000);
    }
  };

  const changeRoom = (roomId: string) => {
    if (socket && roomId !== selectedRoom && isConnected) {
      console.log('🏠 Changing room to:', roomId);
      socket.emit('join_room', roomId);
      setSelectedRoom(roomId);
      setMessages([]); // Clear messages when changing rooms
      setTypingUsers([]);
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // User setup screen
  if (showUserSetup) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '3rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center'
        }}>
          <h2 style={{
            margin: '0 0 1rem 0',
            fontSize: '2rem',
            color: '#2c3e50'
          }}>
            👥 Join Community Chat
          </h2>
          <p style={{
            color: '#7f8c8d',
            marginBottom: '2rem'
          }}>
            Connect with fellow farmers and agricultural experts
          </p>

          <form onSubmit={handleUserSetup}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#2c3e50'
              }}>
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name..."
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e1e8ed',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e1e8ed'}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#2c3e50'
              }}>
                Choose Avatar
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem'
              }}>
                {avatars.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setUserAvatar(avatar)}
                    style={{
                      padding: '0.75rem',
                      border: `2px solid ${userAvatar === avatar ? '#667eea' : '#e1e8ed'}`,
                      borderRadius: '10px',
                      background: userAvatar === avatar ? '#f0f4ff' : 'white',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(102,126,234,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              💬 Start Chatting
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: 'white'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700',
            margin: '0 0 0.5rem 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            👥 Community Chat
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            opacity: 0.9
          }}>
            Connect with farmers and experts worldwide
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: isConnected ? 'rgba(39, 174, 96, 0.2)' : 'rgba(231, 76, 60, 0.2)',
              color: isConnected ? '#27ae60' : '#e74c3c',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem'
            }}>
              👤 {currentUser?.name}
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem'
            }}>
              👥 {onlineUsers.length} online
            </div>
          </div>
          
          {/* Connection Error */}
          {connectionError && (
            <div style={{
              background: 'rgba(231, 76, 60, 0.2)',
              color: '#e74c3c',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              marginTop: '1rem',
              fontSize: '0.9rem'
            }}>
              ⚠️ {connectionError}
            </div>
          )}
        </div>

        {/* Main Chat Container */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 768 ? '300px 1fr 250px' : '1fr',
          gap: '1.5rem',
          height: '70vh'
        }}>
          {/* Rooms Sidebar */}
          {window.innerWidth > 768 && (
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '1.5rem',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              overflowY: 'auto'
            }}>
              <h3 style={{
                margin: '0 0 1rem 0',
                color: '#2c3e50',
                fontSize: '1.1rem'
              }}>
                📋 Chat Rooms
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => changeRoom(room.id)}
                    style={{
                      padding: '1rem',
                      border: 'none',
                      borderRadius: '10px',
                      background: selectedRoom === room.id ? '#667eea' : '#f8f9fa',
                      color: selectedRoom === room.id ? 'white' : '#2c3e50',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedRoom !== room.id) {
                        e.target.style.background = '#e9ecef';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedRoom !== room.id) {
                        e.target.style.background = '#f8f9fa';
                      }
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.25rem'
                    }}>
                      <span style={{ fontSize: '1.2rem' }}>{room.icon}</span>
                      <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{room.name}</span>
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      opacity: 0.8,
                      marginLeft: '2rem'
                    }}>
                      {room.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Chat Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #e1e8ed',
              background: '#f8f9fa',
              borderRadius: '15px 15px 0 0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>
                  {rooms.find(r => r.id === selectedRoom)?.icon}
                </span>
                <div>
                  <h3 style={{ margin: '0', color: '#2c3e50', fontSize: '1.1rem' }}>
                    {rooms.find(r => r.id === selectedRoom)?.name}
                  </h3>
                  <p style={{ margin: '0', color: '#7f8c8d', fontSize: '0.9rem' }}>
                    {rooms.find(r => r.id === selectedRoom)?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {messages.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  color: '#7f8c8d',
                  padding: '3rem',
                  fontSize: '1rem'
                }}>
                  💬 No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: message.type === 'system' ? '#95a5a6' : '#f0f4ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      flexShrink: 0
                    }}>
                      {message.type === 'system' ? '🤖' : (message.userAvatar || '👤')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.25rem'
                      }}>
                        <span style={{
                          fontWeight: '600',
                          color: '#2c3e50',
                          fontSize: '0.9rem'
                        }}>
                          {message.userName}
                        </span>
                        <span style={{
                          fontSize: '0.8rem',
                          color: '#95a5a6'
                        }}>
                          {formatTime(message.timestamp)}
                        </span>
                        {message.status === 'sending' && (
                          <span style={{
                            fontSize: '0.8rem',
                            color: '#f39c12'
                          }}>
                            Sending...
                          </span>
                        )}
                      </div>
                      <div style={{
                        background: message.type === 'system' ? '#ecf0f1' : '#f8f9fa',
                        padding: '0.75rem',
                        borderRadius: '10px',
                        color: '#2c3e50',
                        lineHeight: '1.4',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word'
                      }}>
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#7f8c8d',
                  fontSize: '0.9rem',
                  fontStyle: 'italic'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '0.25rem'
                  }}>
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#667eea',
                          animation: `typing-dot 1.5s infinite ${i * 0.2}s`
                        }}
                      />
                    ))}
                  </div>
                  {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div style={{
              padding: '1rem',
              borderTop: '1px solid #e1e8ed'
            }}>
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-end'
              }}>
                <textarea
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message #${rooms.find(r => r.id === selectedRoom)?.name}...`}
                  disabled={!isConnected}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '2px solid #e1e8ed',
                    borderRadius: '20px',
                    fontSize: '1rem',
                    resize: 'none',
                    minHeight: '48px',
                    maxHeight: '120px',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e1e8ed'}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || !isConnected}
                  style={{
                    background: (!inputMessage.trim() || !isConnected) 
                      ? '#bdc3c7' 
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    cursor: (!inputMessage.trim() || !isConnected) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    transition: 'all 0.3s ease',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    if (isConnected && inputMessage.trim()) {
                      e.target.style.transform = 'scale(1.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  🚀
                </button>
              </div>
              <div style={{
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                color: '#7f8c8d',
                textAlign: 'center'
              }}>
                Press Enter to send, Shift+Enter for new line
              </div>
            </div>
          </div>

          {/* Online Users Sidebar */}
          {window.innerWidth > 768 && (
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '1.5rem',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              overflowY: 'auto'
            }}>
              <h3 style={{
                margin: '0 0 1rem 0',
                color: '#2c3e50',
                fontSize: '1.1rem'
              }}>
                👥 Online Users ({onlineUsers.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {onlineUsers.map((user) => (
                  <div key={user.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    background: user.id === currentUser?.id ? '#f0f4ff' : '#f8f9fa',
                    borderRadius: '10px',
                    border: user.id === currentUser?.id ? '2px solid #667eea' : '1px solid transparent'
                  }}>
                    <div style={{
                      position: 'relative',
                      fontSize: '1.5rem'
                    }}>
                      {user.avatar || '👤'}
                      <div style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        width: '8px',
                        height: '8px',
                        background: '#27ae60',
                        borderRadius: '50%',
                        border: '2px solid white'
                      }} />
                    </div>
                    <div>
                      <div style={{
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        color: '#2c3e50'
                      }}>
                        {user.name}
                        {user.id === currentUser?.id && ' (You)'}
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: '#7f8c8d'
                      }}>
                        Online
                      </div>
                    </div>
                  </div>
                ))}
                {onlineUsers.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    color: '#7f8c8d',
                    padding: '2rem',
                    fontSize: '0.9rem'
                  }}>
                    No users online
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Debug Info */}
        <div style={{
          textAlign: 'center',
          marginTop: '1rem',
          color: 'white',
          opacity: 0.8,
          fontSize: '0.8rem'
        }}>
          🔌 Server: http://localhost:8081 • Room: {selectedRoom} • Messages: {messages.length}
        </div>
      </div>

      <style>
        {`
          @keyframes typing-dot {
            0%, 20% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
            80%, 100% { transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default CommunityChat;
