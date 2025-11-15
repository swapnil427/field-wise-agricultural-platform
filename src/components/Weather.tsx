import React, { useState, useEffect } from 'react';

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  description: string;
  icon: string;
  windSpeed: number;
  cloudiness?: number;
  sunrise?: Date;
  sunset?: Date;
  timestamp: Date;
  demo?: boolean;
}

interface ForecastData {
  time: Date;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

const Weather: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [city, setCity] = useState('Delhi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useLocation, setUseLocation] = useState(false);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async (searchCity?: string) => {
    setLoading(true);
    setError(null);
    const targetCity = searchCity || city;

    console.log('🌤️ Fetching weather for:', targetCity);

    try {
      // Fetch current weather
      const currentResponse = await fetch(`http://localhost:8081/api/weather/current/${targetCity}`);
      console.log('📡 Weather response status:', currentResponse.status);
      
      if (!currentResponse.ok) {
        throw new Error(`HTTP ${currentResponse.status}: ${currentResponse.statusText}`);
      }
      
      const currentData = await currentResponse.json();
      console.log('✅ Weather data received:', currentData);
      setCurrentWeather(currentData);

      // Fetch forecast
      try {
        const forecastResponse = await fetch(`http://localhost:8081/api/weather/forecast/${targetCity}`);
        if (forecastResponse.ok) {
          const forecastData = await forecastResponse.json();
          setForecast(forecastData.forecast || []);
        }
      } catch (forecastError) {
        console.warn('⚠️ Forecast fetch failed:', forecastError);
        // Don't show error for forecast, just continue without it
      }

    } catch (err: any) {
      console.error('❌ Weather fetch error:', err);
      setError(`Failed to fetch weather data: ${err.message}`);
      
      // Set demo data as fallback
      setCurrentWeather({
        city: targetCity,
        country: 'IN',
        temperature: 28,
        feelsLike: 30,
        humidity: 65,
        pressure: 1013,
        description: 'partly cloudy',
        icon: '02d',
        windSpeed: 3.5,
        cloudiness: 40,
        sunrise: new Date(),
        sunset: new Date(),
        timestamp: new Date(),
        demo: true
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationWeather = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setUseLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          console.log('📍 Location coordinates:', { latitude, longitude });
          
          const response = await fetch(`http://localhost:8081/api/weather/coordinates?lat=${latitude}&lon=${longitude}`);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const data = await response.json();
          console.log('✅ Location weather data:', data);
          
          setCurrentWeather(data);
          setCity(data.city);
          setError(null);
        } catch (err: any) {
          console.error('❌ Location weather error:', err);
          setError(`Failed to fetch location weather: ${err.message}`);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('❌ Geolocation error:', error);
        setError('Unable to retrieve your location');
        setLoading(false);
        setUseLocation(false);
      }
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      setUseLocation(false);
      fetchWeatherData(city);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '🌤️';
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const getWindDirection = (speed: number) => {
    if (speed < 5) return 'Light breeze';
    if (speed < 15) return 'Moderate wind';
    if (speed < 25) return 'Strong wind';
    return 'Very strong wind';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
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
            🌤️ Weather Monitor
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            opacity: 0.9
          }}>
            Get accurate weather forecasts for better farming decisions
          </p>
        </div>

        {/* Search Section */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
        }}>
          <form onSubmit={handleSearch} style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '0.75rem 1rem',
                border: '2px solid #e1e8ed',
                borderRadius: '10px',
                fontSize: '1rem',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#74b9ff'}
              onBlur={(e) => e.target.style.borderColor = '#e1e8ed'}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#bdc3c7' : 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(116,185,255,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {loading ? '🔄 Loading...' : '🔍 Search'}
            </button>
            <button
              type="button"
              onClick={fetchLocationWeather}
              disabled={loading}
              style={{
                background: 'white',
                color: '#74b9ff',
                border: '2px solid #74b9ff',
                borderRadius: '10px',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.background = '#74b9ff';
                  e.target.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#74b9ff';
              }}
            >
              📍 Use Location
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fee',
            border: '1px solid #fcc',
            color: '#c33',
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && !currentWeather && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              animation: 'spin 2s linear infinite'
            }}>
              🌀
            </div>
            <div style={{
              fontSize: '1.2rem',
              color: '#7f8c8d'
            }}>
              Loading weather data...
            </div>
          </div>
        )}

        {/* Current Weather */}
        {currentWeather && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h2 style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.5rem',
                  color: '#2c3e50'
                }}>
                  {currentWeather.city}, {currentWeather.country}
                </h2>
                <p style={{
                  margin: '0',
                  color: '#7f8c8d',
                  textTransform: 'capitalize'
                }}>
                  {currentWeather.description}
                </p>
                {currentWeather.demo && (
                  <span style={{
                    background: '#fff3cd',
                    color: '#856404',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    marginTop: '0.5rem',
                    display: 'inline-block'
                  }}>
                    Demo Data
                  </span>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
                  {getWeatherIcon(currentWeather.icon)}
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#74b9ff'
                }}>
                  {currentWeather.temperature}°C
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: '#7f8c8d'
                }}>
                  Feels like {currentWeather.feelsLike}°C
                </div>
              </div>
            </div>

            {/* Weather Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              {[
                { label: 'Humidity', value: `${currentWeather.humidity}%`, icon: '💧' },
                { label: 'Pressure', value: `${currentWeather.pressure} hPa`, icon: '🌡️' },
                { label: 'Wind', value: `${currentWeather.windSpeed} km/h`, icon: '💨', desc: getWindDirection(currentWeather.windSpeed) },
                { label: 'Cloudiness', value: `${currentWeather.cloudiness || 0}%`, icon: '☁️' }
              ].map((item, index) => (
                <div key={index} style={{
                  background: '#f8f9fa',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    {item.icon}
                  </div>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '0.25rem'
                  }}>
                    {item.value}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#7f8c8d',
                    marginBottom: '0.25rem'
                  }}>
                    {item.label}
                  </div>
                  {item.desc && (
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#95a5a6'
                    }}>
                      {item.desc}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Sunrise/Sunset */}
            {currentWeather.sunrise && currentWeather.sunset && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginTop: '1.5rem'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌅</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                    {formatTime(new Date(currentWeather.sunrise))}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Sunrise</div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌇</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                    {formatTime(new Date(currentWeather.sunset))}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Sunset</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Forecast */}
        {forecast.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '2rem',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              margin: '0 0 1.5rem 0',
              fontSize: '1.3rem',
              color: '#2c3e50'
            }}>
              📊 24-Hour Forecast
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              overflowX: 'auto'
            }}>
              {forecast.map((item, index) => (
                <div key={index} style={{
                  background: '#f8f9fa',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                  border: '2px solid transparent',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#74b9ff';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#7f8c8d',
                    marginBottom: '0.5rem'
                  }}>
                    {formatTime(new Date(item.time))}
                  </div>
                  <div style={{
                    fontSize: '2rem',
                    marginBottom: '0.5rem'
                  }}>
                    {getWeatherIcon(item.icon)}
                  </div>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#74b9ff',
                    marginBottom: '0.5rem'
                  }}>
                    {item.temperature}°C
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#7f8c8d',
                    textTransform: 'capitalize',
                    marginBottom: '0.5rem'
                  }}>
                    {item.description}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#95a5a6'
                  }}>
                    💧 {item.humidity}% | 💨 {item.windSpeed} km/h
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Farming Tips */}
        {currentWeather && (
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '15px',
            padding: '2rem',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              fontSize: '1.3rem',
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🌾 Farming Recommendations
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              {currentWeather.temperature > 30 && (
                <div style={{
                  background: '#fff5f5',
                  border: '2px solid #fed7d7',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <strong>🌡️ High Temperature Alert:</strong>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                    Consider providing shade for crops and increase irrigation frequency.
                  </p>
                </div>
              )}
              
              {currentWeather.humidity < 40 && (
                <div style={{
                  background: '#fffaf0',
                  border: '2px solid #fbd38d',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <strong>💧 Low Humidity:</strong>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                    Monitor soil moisture closely and consider mulching to retain water.
                  </p>
                </div>
              )}

              {currentWeather.windSpeed > 20 && (
                <div style={{
                  background: '#f0fff4',
                  border: '2px solid #9ae6b4',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <strong>💨 Strong Winds:</strong>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                    Secure young plants and avoid spraying pesticides today.
                  </p>
                </div>
              )}

              <div style={{
                background: '#f7fafc',
                border: '2px solid #cbd5e0',
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <strong>📅 General Tip:</strong>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                  Perfect weather for {currentWeather.temperature > 25 ? 'summer crops like tomatoes and peppers' : 'cool-season crops like lettuce and broccoli'}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Debug Info */}
        <div style={{
          textAlign: 'center',
          marginTop: '1rem',
          color: 'white',
          opacity: 0.8,
          fontSize: '0.8rem'
        }}>
          🌐 Server: http://localhost:8081 • Status: {loading ? 'Loading...' : currentWeather ? 'Connected' : 'Ready'}
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Weather;
