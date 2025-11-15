import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState({
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    condition: "Partly Cloudy",
    location: "Maharashtra, India"
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/weather/current/Mumbai');
        const data = await response.json();
        setWeatherData({
          temperature: data.temperature,
          humidity: data.humidity,
          windSpeed: Math.round(data.windSpeed * 3.6), // Convert m/s to km/h
          condition: data.description,
          location: `${data.city}, ${data.country}`
        });
      } catch (error) {
        console.log('Using demo weather data');
      }
    };
    fetchWeather();
  }, []);

  const handleQuickAction = (path: string) => {
    console.log('Navigating to:', path);
    navigate(path);
  };

  const stats = [
    { 
      title: "Total Farms", 
      value: "1,234", 
      change: "+12%", 
      icon: "🌱", 
      color: "linear-gradient(135deg, #10b981, #059669)",
      description: "Active farms registered"
    },
    { 
      title: "Community Members", 
      value: "8,567", 
      change: "+8%", 
      icon: "👥", 
      color: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      description: "Farmers in network"
    },
    { 
      title: "Questions Answered", 
      value: "2,891", 
      change: "+23%", 
      icon: "💬", 
      color: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      description: "Expert responses today"
    },
    { 
      title: "Weather Alerts", 
      value: "156", 
      change: "+5%", 
      icon: "🌧️", 
      color: "linear-gradient(135deg, #f59e0b, #d97706)",
      description: "Active weather warnings"
    }
  ];

  const quickActions = [
    { title: "Ask AI Expert", icon: "🤖", color: "linear-gradient(135deg, #6366f1, #8b5cf6)", path: "/queries" },
    { title: "Weather Updates", icon: "🌤️", color: "linear-gradient(135deg, #06b6d4, #0891b2)", path: "/weather" },
    { title: "Community Chat", icon: "💭", color: "linear-gradient(135deg, #10b981, #059669)", path: "/community" },
    { title: "Crop Health Check", icon: "🔬", color: "linear-gradient(135deg, #8b5cf6, #7c3aed)", path: "/crop-health" },
  ];

  const cropData = [
    { name: "Wheat", status: "Growing", health: 85, icon: "🌾" },
    { name: "Rice", status: "Harvesting", health: 92, icon: "🌾" },
    { name: "Cotton", status: "Flowering", health: 78, icon: "🌸" },
    { name: "Maize", status: "Planted", health: 88, icon: "🌽" },
  ];

  const cardStyle = (isSelected: boolean) => ({
    background: 'white',
    borderRadius: '16px',
    boxShadow: isSelected ? '0 20px 40px rgba(0,0,0,0.1)' : '0 4px 20px rgba(0,0,0,0.08)',
    padding: '24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: isSelected ? 'translateY(-4px)' : 'translateY(0)',
    border: '1px solid #f1f5f9'
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e8f5e8 50%, #e0f2fe 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Animations */}
      <div style={{
        position: 'absolute',
        top: '-160px',
        right: '-160px',
        width: '320px',
        height: '320px',
        background: 'rgba(34, 197, 94, 0.1)',
        borderRadius: '50%',
        animation: 'float 20s ease-in-out infinite'
      }} />
      
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h1 style={{ 
                fontSize: '3rem', 
                fontWeight: 'bold', 
                background: 'linear-gradient(135deg, #059669, #1d4ed8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
                marginBottom: '8px'
              }}>
                Field Wise Dashboard
              </h1>
              <p style={{ color: '#64748b', margin: 0, fontSize: '1.125rem' }}>
                Welcome back! Here's what's happening on your farm today.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Current Time</p>
                <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', margin: 0 }}>
                  {currentTime.toLocaleTimeString()}
                </p>
              </div>
              <button 
                onClick={() => alert('Notifications feature coming soon!')}
                style={{
                  position: 'relative',
                  padding: '12px',
                  background: 'white',
                  borderRadius: '50%',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  fontSize: '1.25rem'
                }}
              >
                🔔
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '12px',
                  height: '12px',
                  background: '#ef4444',
                  borderRadius: '50%'
                }} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px', 
          marginBottom: '32px' 
        }}>
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              style={cardStyle(selectedCard === stat.title)}
              onClick={() => setSelectedCard(selectedCard === stat.title ? null : stat.title)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: stat.color,
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px'
                }}>
                  {stat.icon}
                </div>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#10b981',
                  background: '#dcfce7',
                  padding: '4px 8px',
                  borderRadius: '12px'
                }}>
                  {stat.change}
                </span>
              </div>
              <h3 style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '500', margin: '0 0 4px 0' }}>
                {stat.title}
              </h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
                {stat.value}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', marginBottom: '32px' }}>
          {/* Weather Widget */}
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '16px',
            color: 'white',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '128px',
              height: '128px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              marginRight: '-64px',
              marginTop: '-64px'
            }} />
            <div style={{ position: 'relative', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>Weather Today</h3>
                <span style={{ fontSize: '2rem' }}>☀️</span>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>{weatherData.temperature}°C</p>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: '4px 0', textTransform: 'capitalize' }}>
                  {weatherData.condition}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                  📍 {weatherData.location}
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', textAlign: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '1.25rem', marginBottom: '4px' }}>💧</div>
                  <p style={{ fontSize: '0.75rem', margin: '0 0 2px 0' }}>Humidity</p>
                  <p style={{ fontWeight: '600', margin: 0 }}>{weatherData.humidity}%</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '1.25rem', marginBottom: '4px' }}>💨</div>
                  <p style={{ fontSize: '0.75rem', margin: '0 0 2px 0' }}>Wind</p>
                  <p style={{ fontWeight: '600', margin: 0 }}>{weatherData.windSpeed} km/h</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '1.25rem', marginBottom: '4px' }}>👁️</div>
                  <p style={{ fontSize: '0.75rem', margin: '0 0 2px 0' }}>Visibility</p>
                  <p style={{ fontWeight: '600', margin: 0 }}>10 km</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>⚡</span>
              Quick Actions
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {quickActions.map((action, index) => (
                <button
                  key={action.title}
                  onClick={() => handleQuickAction(action.path)}
                  style={{
                    background: action.color,
                    color: 'white',
                    padding: '24px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{action.icon}</div>
                      <p style={{ fontWeight: '600', fontSize: '1.125rem', margin: 0 }}>{action.title}</p>
                    </div>
                    <span style={{ fontSize: '1.5rem' }}>➤</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Crop Status & Analytics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
          {/* Crop Status */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>🌿</span>
              Crop Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cropData.map((crop, index) => (
                <div
                  key={crop.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    transition: 'background 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => alert(`${crop.name} details: ${crop.status} - ${crop.health}% health`)}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '2rem' }}>{crop.icon}</span>
                    <div>
                      <p style={{ fontWeight: '600', color: '#1f2937', margin: 0 }}>{crop.name}</p>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>{crop.status}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>{crop.health}%</p>
                    <div style={{ width: '80px', height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
                      <div
                        style={{
                          height: '100%',
                          background: 'linear-gradient(90deg, #10b981, #059669)',
                          borderRadius: '4px',
                          width: `${crop.health}%`,
                          transition: 'width 1s ease'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Preview */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>📊</span>
              Analytics Overview
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #dcfce7, #dbeafe)',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
                onClick={() => alert('Yield prediction: 15.2% increase expected this season!')}
              >
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Yield Prediction</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: '4px 0' }}>+15.2%</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Compared to last season</p>
                </div>
                <span style={{ fontSize: '3rem' }}>📈</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div 
                  style={{ textAlign: 'center', padding: '16px', background: '#fff7ed', borderRadius: '12px', cursor: 'pointer' }}
                  onClick={() => alert('Farm efficiency is at 94% - Excellent performance!')}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📊</div>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 4px 0' }}>Efficiency</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ea580c', margin: 0 }}>94%</p>
                </div>
                <div 
                  style={{ textAlign: 'center', padding: '16px', background: '#faf5ff', borderRadius: '12px', cursor: 'pointer' }}
                  onClick={() => alert('Growth rate increased by 8.5% this month!')}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚡</div>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 4px 0' }}>Growth Rate</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#9333ea', margin: 0 }}>+8.5%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <button 
          onClick={() => alert('Quick actions: Add new farm, Create report, Schedule task')}
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #10b981, #3b82f6)',
            color: 'white',
            borderRadius: '50%',
            border: 'none',
            fontSize: '2rem',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s ease',
            zIndex: 50
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          ➕
        </button>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
