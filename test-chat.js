// Simple test script to verify Socket.IO server is working
const io = require('socket.io-client');

const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('✅ Connected to chat server');
  
  // Test joining as a farmer
  socket.emit('join', {
    userId: 'test-farmer-1',
    username: 'Test Farmer',
    userType: 'farmer',
    avatar: 'TF'
  });
  
  // Test sending a message
  setTimeout(() => {
    socket.emit('sendMessage', {
      message: 'Hello from test farmer!',
      room: 'general'
    });
    console.log('✅ Test message sent');
  }, 1000);
  
  // Test joining as an expert
  setTimeout(() => {
    const expertSocket = io('http://localhost:3001');
    expertSocket.on('connect', () => {
      expertSocket.emit('join', {
        userId: 'test-expert-1',
        username: 'Test Expert',
        userType: 'expert',
        avatar: 'TE'
      });
      
      setTimeout(() => {
        expertSocket.emit('sendMessage', {
          message: 'Hello from test expert!',
          room: 'general'
        });
        console.log('✅ Expert message sent');
      }, 1000);
    });
  }, 2000);
});

socket.on('newMessage', (message) => {
  console.log('📨 New message received:', message);
});

socket.on('onlineUsers', (users) => {
  console.log('👥 Online users:', users.length);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from server');
});

// Clean up after 10 seconds
setTimeout(() => {
  console.log('🧹 Cleaning up test...');
  socket.disconnect();
  process.exit(0);
}, 10000);
