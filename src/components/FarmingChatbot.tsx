import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  category?: string;
  timestamp: Date;
  demo?: boolean;
}

const FarmingChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: '👋 Hello! I\'m your AI Farming Assistant. Ask me anything about:\n\n🌾 Crop cultivation\n🐛 Pest control\n💧 Irrigation\n🌱 Soil management\n☀️ Weather-based farming\n\nHow can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const categories = [
    'General',
    'Crops',
    'Pest Control',
    'Irrigation',
    'Soil',
    'Weather',
    'Fertilizers',
    'Seeds'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      category,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      console.log('📤 Sending question to AI:', input);
      
      const response = await fetch('http://localhost:8081/api/chatbot/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input, category })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📥 Received response:', data);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.answer,
        category: data.category,
        timestamp: new Date(data.timestamp || Date.now()),
        demo: data.demo
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('❌ Chatbot error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: '⚠️ Sorry, I encountered an error connecting to the AI service. Please try again or check your connection.\n\nError: ' + (error as Error).message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    'How to control pests in wheat?',
    'Best time to plant tomatoes?',
    'How much water does rice need?',
    'Organic fertilizers for vegetables?'
  ];

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div style={{ 
      maxWidth: '900px', 
      margin: '0 auto', 
      padding: '2rem',
      fontFamily: 'system-ui'
    }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px 16px 0 0',
        padding: '1.5rem',
        color: 'white'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem' }}>🤖 AI Farming Assistant</h2>
        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
          Get instant expert advice on all your farming questions - No forms needed!
        </p>
      </div>

      <div style={{ 
        background: 'white',
        border: '1px solid #e2e8f0',
        borderTop: 'none',
        minHeight: '500px',
        maxHeight: '600px',
        overflowY: 'auto',
        padding: '1.5rem'
      }}>
        {messages.map((message) => (
          <div key={message.id} style={{ 
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{ 
              maxWidth: '75%',
              background: message.type === 'user' ? '#667eea' : '#f7fafc',
              color: message.type === 'user' ? 'white' : '#2d3748',
              padding: '1rem 1.25rem',
              borderRadius: message.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {message.type === 'bot' && (
                <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.5rem' }}>
                  🤖 AI Assistant {message.demo && '(Demo Mode)'}
                </div>
              )}
              <div style={{ 
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6',
                fontSize: '0.95rem'
              }}>
                {message.content}
              </div>
              <div style={{ 
                fontSize: '0.7rem', 
                opacity: 0.7, 
                marginTop: '0.5rem',
                textAlign: 'right'
              }}>
                {message.timestamp.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: '#718096'
          }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: '#667eea',
              animation: 'pulse 1.4s ease-in-out infinite'
            }} />
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: '#667eea',
              animation: 'pulse 1.4s ease-in-out 0.2s infinite'
            }} />
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: '#667eea',
              animation: 'pulse 1.4s ease-in-out 0.4s infinite'
            }} />
            <span style={{ marginLeft: '0.5rem' }}>AI is thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      <div style={{ 
        background: '#f7fafc', 
        padding: '1rem', 
        borderLeft: '1px solid #e2e8f0',
        borderRight: '1px solid #e2e8f0'
      }}>
        <div style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: '#4a5568' }}>
          💡 Quick Questions:
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleQuickQuestion(q)}
              style={{ 
                padding: '0.5rem 1rem', 
                background: 'white',
                border: '1px solid #cbd5e0',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#667eea'}
              onMouseOut={(e) => e.currentTarget.style.background = 'white'}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{ 
        background: 'white',
        border: '1px solid #e2e8f0',
        borderTop: 'none',
        borderRadius: '0 0 16px 16px',
        padding: '1.5rem'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.875rem', color: '#4a5568', marginBottom: '0.5rem', display: 'block' }}>
            Category:
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ 
              padding: '0.5rem', 
              border: '1px solid #cbd5e0',
              borderRadius: '8px',
              width: '200px',
              fontSize: '0.95rem'
            }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your farming question..."
            disabled={loading}
            style={{ 
              flex: 1, 
              padding: '0.875rem', 
              border: '1px solid #cbd5e0',
              borderRadius: '12px',
              fontSize: '1rem'
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{ 
              padding: '0.875rem 2rem', 
              background: loading || !input.trim() ? '#cbd5e0' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Sending...' : 'Ask AI'}
          </button>
        </div>
      </form>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FarmingChatbot;
