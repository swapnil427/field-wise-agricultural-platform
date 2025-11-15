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
  cloudiness: number;
  sunrise: Date;
  sunset: Date;
  timestamp: Date;
}

interface ForecastItem {
  time: Date;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [city, setCity] = useState('Mumbai');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useLocation, setUseLocation] = useState(false);

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8081/api/weather/current/${cityName}`);
      const data = await response.json();
      
      if (!response.ok) {
        // If API fails, use demo data
        if (data.error === 'Invalid API key' || data.error.includes('API')) {
          setError('⚠️ Weather API key not configured. Showing demo data for ' + cityName);
          setWeather(getDemoWeather(cityName));
          return;
        }
        throw new Error(data.error || 'City not found');
      }
      
      setWeather({
        ...data,
        sunrise: new Date(data.sunrise),
        sunset: new Date(data.sunset),
        timestamp: new Date(data.timestamp)
      });
    } catch (err: any) {
      console.error('Weather fetch error:', err);
      setError('⚠️ Using demo weather data. To use real data, get a free API key from openweathermap.org');
      setWeather(getDemoWeather(cityName));
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async (cityName: string) => {
    try {
      const response = await fetch(`http://localhost:8081/api/weather/forecast/${cityName}`);
      if (!response.ok) {
        // Use demo forecast
        setForecast(getDemoForecast());
        return;
      }
      const data = await response.json();
      setForecast(data.forecast.map((item: any) => ({
        ...item,
        time: new Date(item.time)
      })));
    } catch (err) {
      console.error('Forecast error:', err);
      setForecast(getDemoForecast());
    }
  };

  // Demo weather data
  const getDemoWeather = (cityName: string): WeatherData => ({
    city: cityName,
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
    timestamp: new Date()
  });

  const getDemoForecast = (): ForecastItem[] => {
    const now = new Date();
    return Array.from({ length: 8 }, (_, i) => ({
      time: new Date(now.getTime() + i * 3 * 60 * 60 * 1000),
      temperature: 25 + Math.floor(Math.random() * 8),
      description: ['clear sky', 'few clouds', 'scattered clouds', 'broken clouds'][i % 4],
      icon: ['01d', '02d', '03d', '04d'][i % 4],
      humidity: 60 + Math.floor(Math.random() * 20),
      windSpeed: 2 + Math.random() * 3
    }));
  };

  const fetchWeatherByLocation = () => {
    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `http://localhost:8081/api/weather/coordinates?lat=${latitude}&lon=${longitude}`
            );
            if (!response.ok) {
              throw new Error('Failed to fetch weather');
            }
            const data = await response.json();
            setWeather({
              ...data,
              timestamp: new Date(data.timestamp),
              sunrise: new Date(),
              sunset: new Date(),
              pressure: 0,
              cloudiness: 0
            });
            setCity(data.city);
            setUseLocation(true);
            setError(null);
          } catch (err: any) {
            setError(err.message || 'Failed to fetch weather');
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setError('Location access denied');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation not supported');
    }
  };

  useEffect(() => {
    fetchWeather(city);
    fetchForecast(city);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
      fetchForecast(city);
      setUseLocation(false);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div style={{ 
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: '2rem',
      fontFamily: 'system-ui'
    }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '2rem',
        color: 'white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '2rem' }}>🌤️ Weather Updates</h2>
        
        <form onSubmit={handleSearch} style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '2rem' 
        }}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
          <button
            type="submit"
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: '#48bb78', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Search
          </button>
          <button
            type="button"
            onClick={fetchWeatherByLocation}
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: '#4299e1', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            📍 My Location
          </button>
        </form>

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '3rem' }}>🔄</div>
            <p>Loading weather data...</p>
          </div>
        )}

        {error && (
          <div style={{ 
            background: 'rgba(255,255,255,0.2)', 
            padding: '1rem', 
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        {weather && !loading && (
          <div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img 
                    src={getWeatherIcon(weather.icon)} 
                    alt={weather.description}
                    style={{ width: '100px', height: '100px' }}
                  />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '3rem', fontWeight: 'bold' }}>
                      {weather.temperature}°C
                    </h3>
                    <p style={{ margin: '0.5rem 0', textTransform: 'capitalize', fontSize: '1.2rem' }}>
                      {weather.description}
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: '1.5rem', margin: '1rem 0 0 0' }}>
                  📍 {weather.city}, {weather.country}
                </p>
                <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: '0.5rem 0' }}>
                  Feels like {weather.feelsLike}°C
                </p>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '1rem' 
              }}>
                <div style={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  padding: '1rem', 
                  borderRadius: '8px' 
                }}>
                  <div style={{ fontSize: '2rem' }}>💧</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Humidity</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{weather.humidity}%</div>
                </div>
                
                <div style={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  padding: '1rem', 
                  borderRadius: '8px' 
                }}>
                  <div style={{ fontSize: '2rem' }}>💨</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Wind Speed</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{weather.windSpeed} m/s</div>
                </div>
                
                <div style={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  padding: '1rem', 
                  borderRadius: '8px' 
                }}>
                  <div style={{ fontSize: '2rem' }}>🌡️</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Pressure</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{weather.pressure} hPa</div>
                </div>
                
                <div style={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  padding: '1rem', 
                  borderRadius: '8px' 
                }}>
                  <div style={{ fontSize: '2rem' }}>☁️</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Cloudiness</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{weather.cloudiness}%</div>
                </div>
              </div>
            </div>

            {forecast.length > 0 && (
              <div style={{ 
                background: 'rgba(255,255,255,0.1)', 
                borderRadius: '12px', 
                padding: '1.5rem' 
              }}>
                <h3 style={{ margin: '0 0 1rem 0' }}>📅 3-Hour Forecast</h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                  gap: '1rem' 
                }}>
                  {forecast.map((item, index) => (
                    <div key={index} style={{ 
                      background: 'rgba(255,255,255,0.1)', 
                      padding: '1rem', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        {item.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <img 
                        src={getWeatherIcon(item.icon)} 
                        alt={item.description}
                        style={{ width: '50px', height: '50px' }}
                      />
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                        {item.temperature}°C
                      </div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.8, textTransform: 'capitalize' }}>
                        {item.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        background: '#f7fafc', 
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ marginTop: 0 }}>🌾 Farming Tips Based on Weather</h3>
        {weather && (
          <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.8' }}>
            {weather.temperature > 30 && (
              <li>☀️ High temperature: Ensure adequate irrigation for crops</li>
            )}
            {weather.humidity > 70 && (
              <li>💧 High humidity: Watch for fungal diseases, apply preventive measures</li>
            )}
            {weather.windSpeed > 5 && (
              <li>💨 Strong winds: Secure greenhouse structures and support tall crops</li>
            )}
            {weather.description.includes('rain') && (
              <li>🌧️ Rain expected: Delay fertilizer application, check drainage systems</li>
            )}
            {weather.temperature < 15 && (
              <li>🥶 Cool temperature: Protect sensitive crops, consider frost protection</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;
