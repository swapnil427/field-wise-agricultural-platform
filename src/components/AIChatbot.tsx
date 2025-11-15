import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  category?: string;
  demo?: boolean;
}

const AIChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "🌾 Hello! I'm your AI farming assistant. I can help you with crop management, pest control, irrigation, soil health, and general farming advice. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const categories = [
    { value: '', label: '🌾 General Farming' },
    { value: 'Crops', label: '🌱 Crop Management' },
    { value: 'Pest Control', label: '🐛 Pest Control' },
    { value: 'Irrigation', label: '💧 Irrigation' },
    { value: 'Soil', label: '🌍 Soil Health' },
    { value: 'Weather', label: '🌤️ Weather' },
    { value: 'Equipment', label: '🚜 Equipment' },
    { value: 'Market', label: '💰 Market Prices' }
  ];

  const quickQuestions = [
    "How to prevent wheat rust?",
    "Best time to plant tomatoes?",
    "Organic pest control methods?",
    "Soil pH testing procedures?",
    "Drip irrigation setup guide?",
    "Fertilizer recommendations for rice?"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: 'user',
      timestamp: new Date(),
      category: selectedCategory
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    console.log('🚀 Sending request to chatbot API:', text); // Debug log

    try {
      const response = await fetch('http://localhost:8081/api/chatbot/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: text,
          category: selectedCategory
        })
      });

      console.log('📡 Response status:', response.status); // Debug log

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Received response:', data); // Debug log

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.answer || 'Sorry, I couldn\'t generate a response.',
        sender: 'bot',
        timestamp: new Date(data.timestamp || new Date()),
        category: data.category,
        demo: data.demo
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error('❌ Chatbot error:', error); // Debug log
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I'm having trouble connecting right now. Error: ${error.message}. Please check if the server is running on http://localhost:8081`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
            🤖 AI Farming Assistant
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Get instant expert advice on farming, crop management, and agricultural practices
          </p>
        </div>

        {/* Main Chat Container */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '70vh'
        }}>
          {/* Category Selector */}
          <div style={{
            padding: '1rem',
            borderBottom: '1px solid #e1e8ed',
            background: '#f8f9fa'
          }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e1e8ed',
                borderRadius: '10px',
                fontSize: '1rem',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {messages.map((message) => (
              <div key={message.id} style={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}>
                {message.sender === 'bot' && (
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.2rem',
                    flexShrink: 0
                  }}>
                    🤖
                  </div>
                )}

                <div style={{
                  maxWidth: '70%',
                  padding: '1rem 1.25rem',
                  borderRadius: message.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                  background: message.sender === 'user' 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#f8f9fa',
                  color: message.sender === 'user' ? 'white' : '#2c3e50',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: message.sender === 'bot' ? '1px solid #e1e8ed' : 'none'
                }}>
                  {/* Message Content - FIXED DISPLAY */}
                  <div style={{
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    color: message.sender === 'user' ? 'white' : '#2c3e50'
                  }}>
                    {message.content}
                  </div>
                  
                  {/* Message Footer */}
                  <div style={{
                    fontSize: '0.75rem',
                    opacity: 0.7,
                    marginTop: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {message.demo && (
                        <span style={{
                          background: 'rgba(255,193,7,0.2)',
                          color: message.sender === 'user' ? 'rgba(255,255,255,0.8)' : '#856404',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.7rem'
                        }}>
                          Demo Mode
                        </span>
                      )}
                      {message.category && (
                        <span style={{
                          background: 'rgba(102,126,234,0.2)',
                          color: message.sender === 'user' ? 'rgba(255,255,255,0.8)' : '#667eea',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.7rem'
                        }}>
                          {message.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {message.sender === 'user' && (
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#28a745',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.2rem',
                    flexShrink: 0
                  }}>
                    👤
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem'
                }}>
                  🤖
                </div>
                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '20px 20px 20px 5px',
                  background: '#f8f9fa',
                  color: '#2c3e50',
                  border: '1px solid #e1e8ed'
                }}>
                  <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                    <span>AI is thinking</span>
                    <div style={{
                      display: 'flex',
                      gap: '0.25rem',
                      marginLeft: '0.5rem'
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
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && !isTyping && (
            <div style={{
              padding: '1rem',
              borderTop: '1px solid #e1e8ed',
              background: '#f8f9fa'
            }}>
              <p style={{ 
                margin: '0 0 0.75rem 0', 
                fontWeight: '600', 
                color: '#2c3e50',
                fontSize: '0.9rem'
              }}>
                💡 Try these popular questions:
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.5rem'
              }}>
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(question)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      background: 'white',
                      border: '1px solid #e1e8ed',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      color: '#667eea',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#667eea';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'white';
                      e.target.style.color = '#667eea';
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div style={{
            padding: '1rem',
            borderTop: '1px solid #e1e8ed',
            background: 'white'
          }}>
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-end'
            }}>
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask me anything about ${selectedCategory || 'farming'}...`}
                disabled={isTyping}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
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
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                style={{
                  background: (!inputMessage.trim() || isTyping) 
                    ? '#bdc3c7' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  cursor: (!inputMessage.trim() || isTyping) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  if (!isTyping && inputMessage.trim()) {
                    e.target.style.transform = 'scale(1.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {isTyping ? '⏳' : '🚀'}
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

        {/* Debug Info */}
        <div style={{
          textAlign: 'center',
          marginTop: '1rem',
          color: 'white',
          opacity: 0.8,
          fontSize: '0.8rem'
        }}>
          💡 Server: http://localhost:8081 • Messages: {messages.length} • Status: {isTyping ? 'Typing...' : 'Ready'}
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

export default AIChatbot;
