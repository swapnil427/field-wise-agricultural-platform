# Weather Feature Setup

## Overview
The Weather feature provides real-time weather information and forecasts for farmers using the OpenWeatherMap API.

## Setup Instructions

### 1. Get OpenWeatherMap API Key
1. Go to https://openweathermap.org/api
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your API key

### 2. Add API Key to .env
```env
VITE_OPENWEATHER_API_KEY="your_actual_api_key_here"
VITE_OPENWEATHER_BASE_URL="https://api.openweathermap.org/data/2.5"
```

### 3. Features Available

#### ✅ Current Weather
- Temperature (°C)
- Feels like temperature
- Weather description
- Humidity percentage
- Wind speed
- Atmospheric pressure
- Cloudiness
- Sunrise/Sunset times

#### ✅ 3-Hour Forecast
- 24-hour forecast in 3-hour intervals
- Temperature predictions
- Weather conditions
- Wind and humidity data

#### ✅ Location Features
- Search by city name
- Use current GPS location
- Support for international cities

#### ✅ Farming Tips
- Temperature-based irrigation advice
- Humidity-based disease warnings
- Wind-based structural warnings
- Rain-based fertilizer timing
- Frost protection alerts

## API Endpoints

### Server Endpoints (Port 8081)
```
GET /api/weather/current/:city
GET /api/weather/forecast/:city
GET /api/weather/coordinates?lat=&lon=
```

## Usage

### From Community Page
Add Weather widget to any page:
```tsx
import WeatherWidget from '@/components/WeatherWidget';

<WeatherWidget />
```

### Standalone Weather Page
Access via: `http://localhost:5173/weather`

## Testing

1. Start servers: `npm run dev:full`
2. Visit: http://localhost:5173/weather
3. Try searching for cities:
   - Mumbai
   - New Delhi
   - Bangalore
   - Your location (click "My Location")

## Free Tier Limits
- 60 calls/minute
- 1,000,000 calls/month
- Perfect for this application

## Future Enhancements
- 🔄 7-day forecast
- 🔄 Weather alerts
- 🔄 Historical weather data
- 🔄 Soil moisture predictions
- 🔄 Crop-specific recommendations
- 🔄 Weather-based notifications
