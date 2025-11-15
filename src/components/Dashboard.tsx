import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  city: string;
}

interface SensorData {
  soilMoisture: number;
  temperature: number;
  humidity: number;
  ph: number;
}

const Dashboard: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch weather data
    fetchWeatherData();
    
    // Simulate sensor data
    setSensorData({
      soilMoisture: 65,
      temperature: 24,
      humidity: 70,
      ph: 6.8
    });

    // Simulate alerts
    setAlerts([
      {
        id: 1,
        type: 'warning',
        title: 'Soil Moisture Low',
        message: 'Field A needs irrigation',
        timestamp: new Date()
      },
      {
        id: 2,
        type: 'info',
        title: 'Weather Update',
        message: 'Rain expected tomorrow',
        timestamp: new Date()
      }
    ]);
  }, []);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/weather/current/Delhi');
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      // Set demo data
      setWeatherData({
        temperature: 28,
        humidity: 65,
        description: 'partly cloudy',
        city: 'Delhi'
      });
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'error': return '🚨';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      case 'error': return 'border-red-500 bg-red-50';
      case 'info': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
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
            🌾 Farm Dashboard
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            opacity: 0.9
          }}>
            Monitor your farm's health and performance in real-time
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {[
            { 
              title: '🔬 Crop Analysis', 
              description: 'Analyze crop diseases',
              path: '/crop-health',
              color: 'from-green-400 to-green-600'
            },
            { 
              title: '🌤️ Weather Monitor', 
              description: 'Check weather forecasts',
              path: '/weather',
              color: 'from-blue-400 to-blue-600'
            },
            { 
              title: '👥 Community', 
              description: 'Connect with farmers',
              path: '/community',
              color: 'from-purple-400 to-purple-600'
            },
            { 
              title: '🤖 AI Assistant', 
              description: 'Get farming advice',
              path: '/chatbot',
              color: 'from-orange-400 to-orange-600'
            }
          ].map((action, index) => (
            <Link
              key={index}
              to={action.path}
              style={{
                background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
                backgroundImage: `linear-gradient(135deg, ${action.color.includes('green') ? '#4ade80, #16a34a' : 
                  action.color.includes('blue') ? '#60a5fa, #2563eb' :
                  action.color.includes('purple') ? '#a78bfa, #7c3aed' : '#fb923c, #ea580c'})`,
                color: 'white',
                padding: '1.5rem',
                borderRadius: '15px',
                textDecoration: 'none',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
            >
              <h3 style={{ 
                margin: '0 0 0.5rem 0', 
                fontSize: '1.2rem',
                fontWeight: '600' 
              }}>
                {action.title}
              </h3>
              <p style={{ 
                margin: '0', 
                opacity: 0.9,
                fontSize: '0.95rem'
              }}>
                {action.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Weather Card */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '1.5rem',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🌤️ Weather Conditions
            </h3>
            
            {weatherData ? (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3498db' }}>
                      {weatherData.temperature}°C
                    </div>
                    <div style={{ color: '#7f8c8d', textTransform: 'capitalize' }}>
                      {weatherData.description}
                    </div>
                  </div>
                  <div style={{ fontSize: '3rem' }}>
                    🌤️
                  </div>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  fontSize: '0.9rem'
                }}>
                  <div>
                    <span style={{ color: '#7f8c8d' }}>Humidity:</span>
                    <div style={{ fontWeight: '600' }}>{weatherData.humidity}%</div>
                  </div>
                  <div>
                    <span style={{ color: '#7f8c8d' }}>Location:</span>
                    <div style={{ fontWeight: '600' }}>{weatherData.city}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#7f8c8d' }}>
                Loading weather data...
              </div>
            )}
          </div>

          {/* Sensor Data Card */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '1.5rem',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📡 Sensor Readings
            </h3>
            
            {sensorData && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
              }}>
                {[
                  { label: 'Soil Moisture', value: `${sensorData.soilMoisture}%`, icon: '💧', color: '#3498db' },
                  { label: 'Temperature', value: `${sensorData.temperature}°C`, icon: '🌡️', color: '#e74c3c' },
                  { label: 'Humidity', value: `${sensorData.humidity}%`, icon: '💨', color: '#9b59b6' },
                  { label: 'Soil pH', value: sensorData.ph.toString(), icon: '⚗️', color: '#f39c12' }
                ].map((item, index) => (
                  <div key={index} style={{
                    background: '#f8f9fa',
                    padding: '1rem',
                    borderRadius: '10px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                      {item.icon}
                    </div>
                    <div style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: '600', 
                      color: item.color,
                      marginBottom: '0.25rem'
                    }}>
                      {item.value}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <Link 
              to="/network"
              style={{
                display: 'block',
                marginTop: '1rem',
                padding: '0.75rem',
                background: '#667eea',
                color: 'white',
                textAlign: 'center',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'background 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#5a67d8'}
              onMouseLeave={(e) => e.target.style.background = '#667eea'}
            >
              📊 View Network Dashboard
            </Link>
          </div>

          {/* Alerts Card */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '1.5rem',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            gridColumn: 'span 1'
          }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🚨 Recent Alerts
            </h3>
            
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {alerts.map((alert) => (
                <div key={alert.id} style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '2px solid',
                  borderLeftWidth: '4px'
                }} className={getAlertColor(alert.type)}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>
                      {getAlertIcon(alert.type)}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: '600', 
                        marginBottom: '0.25rem',
                        color: '#2c3e50'
                      }}>
                        {alert.title}
                      </div>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: '#7f8c8d',
                        marginBottom: '0.5rem'
                      }}>
                        {alert.message}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#95a5a6' }}>
                        {alert.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '1.5rem',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📊 Farm Statistics
            </h3>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                { label: 'Total Fields', value: '5', trend: '+2 this month', color: '#27ae60' },
                { label: 'Active Sensors', value: '12', trend: 'All operational', color: '#3498db' },
                { label: 'Crop Health Score', value: '94%', trend: '+5% this week', color: '#f39c12' },
                { label: 'Water Usage', value: '2,340L', trend: '-12% vs last month', color: '#e74c3c' }
              ].map((stat, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                      {stat.label}
                    </div>
                    <div style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: '600', 
                      color: stat.color 
                    }}>
                      {stat.value}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#95a5a6',
                    textAlign: 'right'
                  }}>
                    {stat.trend}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{
          marginTop: '2rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <Link 
            to="/queries"
            style={{
              background: 'white',
              color: '#667eea',
              padding: '1rem 2rem',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: '600',
              border: '2px solid #667eea',
              transition: 'all 0.3s ease'
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
            ❓ Ask Questions
          </Link>
          
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '25px',
              border: '2px solid rgba(255,255,255,0.3)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
            }}
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
