import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface Query {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  timestamp: Date;
  views: number;
  answers: number;
  upvotes: number;
  status: 'open' | 'answered' | 'closed';
}

const QueriesPage: React.FC = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [showNewQuery, setShowNewQuery] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Connect to queries namespace
    const socketInstance = io('http://localhost:8081/queries', { withCredentials: true });
    setSocket(socketInstance);

    // Load demo queries
    const demoQueries: Query[] = [
      {
        id: '1',
        title: 'Best time to plant wheat in North India?',
        content: 'Planning to start wheat cultivation in Punjab. What is the optimal sowing time and which varieties should I choose?',
        author: 'Rajesh Kumar',
        category: 'crops',
        tags: ['wheat', 'punjab', 'sowing'],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        views: 45,
        answers: 3,
        upvotes: 12,
        status: 'answered'
      },
      {
        id: '2',
        title: 'How to control tomato leaf curl virus?',
        content: 'My tomato plants are showing leaf curl symptoms. Need urgent help with control measures.',
        author: 'Priya Sharma',
        category: 'pests',
        tags: ['tomato', 'disease', 'virus'],
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        views: 32,
        answers: 4,
        upvotes: 8,
        status: 'open'
      },
      {
        id: '3',
        title: 'Drip irrigation setup cost?',
        content: 'Want to install drip irrigation in my 2-acre vegetable farm. What would be the approximate cost?',
        author: 'Amit Patel',
        category: 'irrigation',
        tags: ['drip', 'cost', 'vegetables'],
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        views: 67,
        answers: 5,
        upvotes: 15,
        status: 'answered'
      }
    ];

    setQueries(demoQueries);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const categories = [
    { id: 'all', name: 'All Categories', icon: '📋' },
    { id: 'crops', name: 'Crop Management', icon: '🌱' },
    { id: 'pests', name: 'Pest Control', icon: '🐛' },
    { id: 'soil', name: 'Soil Health', icon: '🌍' },
    { id: 'irrigation', name: 'Irrigation', icon: '💧' },
    { id: 'equipment', name: 'Equipment', icon: '🚜' },
    { id: 'market', name: 'Market Prices', icon: '💰' }
  ];

  const filteredQueries = queries.filter(query => {
    const matchesCategory = selectedCategory === 'all' || query.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.timestamp.getTime() - a.timestamp.getTime();
      case 'popular':
        return b.upvotes - a.upvotes;
      case 'most-viewed':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered': return 'bg-green-100 text-green-800 border-green-200';
      case 'open': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
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
            ❓ Farmer Q&A
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            opacity: 0.9
          }}>
            Ask questions, share knowledge, and help fellow farmers
          </p>
        </div>

        {/* Search and Filters */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
          }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e1e8ed',
                borderRadius: '10px',
                fontSize: '1rem'
              }}
            />
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e1e8ed',
                borderRadius: '10px',
                fontSize: '1rem',
                background: 'white'
              }}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e1e8ed',
                borderRadius: '10px',
                fontSize: '1rem',
                background: 'white'
              }}
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="most-viewed">Most Viewed</option>
            </select>

            <button
              onClick={() => setShowNewQuery(true)}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <span>➕</span>
              Ask Question
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredQueries.map(query => (
            <div
              key={query.id}
              style={{
                background: 'white',
                borderRadius: '15px',
                padding: '1.5rem',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '0.5rem'
                  }}>
                    {query.title}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    fontSize: '0.9rem',
                    color: '#7f8c8d'
                  }}>
                    <span>👤 {query.author}</span>
                    <span>🕒 {formatTimeAgo(query.timestamp)}</span>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      border: '1px solid'
                    }} className={getStatusColor(query.status)}>
                      {query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  color: '#7f8c8d',
                  fontSize: '0.9rem'
                }}>
                  <div>
                    <span>👁️ {query.views}</span>
                  </div>
                  <div>
                    <span>💬 {query.answers}</span>
                  </div>
                  <div>
                    <span>⬆️ {query.upvotes}</span>
                  </div>
                </div>
              </div>

              <p style={{
                color: '#34495e',
                marginBottom: '1rem',
                lineHeight: 1.6
              }}>
                {query.content}
              </p>

              <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                {query.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      background: '#f0f4ff',
                      color: '#667eea',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '15px',
                      fontSize: '0.8rem'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {filteredQueries.length === 0 && (
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '3rem',
              textAlign: 'center',
              color: '#7f8c8d'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                🔍
              </div>
              <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                No questions found
              </p>
              <p>
                Try adjusting your filters or ask a new question
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueriesPage;
