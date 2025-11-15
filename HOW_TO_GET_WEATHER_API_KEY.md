# How to Get OpenWeatherMap API Key (FREE)

## Step 1: Sign Up
1. Go to https://openweathermap.org/api
2. Click "Sign Up" button (top right)
3. Fill in your details:
   - Username
   - Email
   - Password
   - Agree to terms
4. Click "Create Account"

## Step 2: Verify Email
1. Check your email inbox
2. Click the verification link
3. Your account is now active

## Step 3: Get Your API Key
1. After login, go to https://home.openweathermap.org/api_keys
2. You'll see your default API key already generated
3. Copy the API key (looks like: `abc123def456ghi789jkl012mno345pq`)

## Step 4: Add to Your Project
1. Open `.env` file in your project root
2. Replace the placeholder with your actual key:
```env
VITE_OPENWEATHER_API_KEY="your_actual_api_key_here"
```
3. Save the file
4. Restart your servers: `npm run dev:full`

## Step 5: Wait for Activation (Important!)
⚠️ **New API keys take 10-120 minutes to activate!**

If you get errors immediately after adding your key:
- Wait 2 hours
- The demo mode will work in the meantime
- Check status at: https://home.openweathermap.org/api_keys

## Free Tier Limits
✅ 60 calls per minute
✅ 1,000,000 calls per month
✅ Current weather data
✅ 5-day forecast
✅ Perfect for this project!

## Demo Mode
If API key is not configured, the app shows demo weather data:
- Temperature: 28°C
- Humidity: 65%
- Wind: 3.5 m/s
- Sample forecasts

## Troubleshooting

### "Invalid API key" Error
- Wait 2 hours after creating the key
- Check you copied the entire key
- Make sure no extra spaces in .env file

### "Failed to fetch weather" Error
- Check your internet connection
- Verify .env file has VITE_OPENWEATHER_API_KEY
- Restart the server after adding the key

### Still Not Working?
The app will automatically use demo data, so you can continue using it while waiting for API activation!
