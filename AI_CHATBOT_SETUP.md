# AI Farming Chatbot Setup Guide

## Overview
The AI Farming Chatbot provides instant expert advice on farming questions using Groq's free LLM API.

## Current Model
**Model:** `llama-3.3-70b-versatile` (Latest Groq LLaMA 3.3 model)
- Fast responses (1-2 seconds)
- High quality agricultural advice
- Understands context and follow-up questions

## Features
✅ Instant answers to farming questions
✅ Multiple categories (Crops, Pests, Irrigation, Soil, Weather)
✅ Demo mode (works without API key)
✅ Quick question templates
✅ Chat history
✅ Mobile responsive

## How to Get Free Groq API Key

### Step 1: Sign Up
1. Visit https://console.groq.com
2. Click "Sign Up" or "Get Started"
3. Sign up with Google/GitHub or email

### Step 2: Create API Key
1. After login, go to "API Keys" section
2. Click "Create API Key"
3. Give it a name (e.g., "Farming Assistant")
4. Copy the API key (starts with `gsk_...`)

### Step 3: Add to .env
```env
GROQ_API_KEY="gsk_your_actual_key_here"
```

### Step 4: Restart Server
```bash
npm run dev:full
```

## Supported Models (as of 2025)
✅ `llama-3.3-70b-versatile` - **Current (Recommended)**
✅ `llama-3.2-90b-text-preview` - Alternative
✅ `mixtral-8x7b-32768` - Fast alternative

❌ `llama-3.1-70b-versatile` - Decommissioned (old)

## Demo Mode
If API key is not configured, the chatbot works in demo mode with:
- Pre-programmed farming advice
- Category-specific responses
- General best practices

## Usage

### From Web Interface
1. Go to http://localhost:5173/queries
2. Select a category
3. Type your question or use quick questions
4. Get instant AI-powered advice

### API Endpoint
```bash
POST http://localhost:8081/api/chatbot/ask
Content-Type: application/json

{
  "question": "How to control pests in wheat?",
  "category": "Pest Control"
}
```

## Supported Categories
- **General** - General farming questions
- **Crops** - Crop cultivation and management
- **Pest Control** - Pest and disease management
- **Irrigation** - Water management
- **Soil** - Soil health and fertilization
- **Weather** - Weather-based farming
- **Fertilizers** - Nutrient management
- **Seeds** - Seed selection and treatment

## Example Questions
1. "How to increase wheat yield?"
2. "Best organic pesticides for tomatoes?"
3. "When to irrigate rice crop?"
4. "How to improve soil fertility naturally?"
5. "Weather-based crop recommendations?"

## Free Tier Limits (Groq)
✅ 30 requests per minute
✅ 14,400 requests per day
✅ More than enough for a farming community!

## Troubleshooting

### "Demo Mode" Notice
- API key not configured or invalid
- Get free key from https://console.groq.com
- Add to .env file
- Restart server

### "Model Decommissioned" Error
✅ **FIXED** - Updated to `llama-3.3-70b-versatile`
- Old model was `llama-3.1-70b-versatile`
- New model is faster and more accurate

### Slow Responses
- Groq API is usually very fast (<2 seconds)
- Check internet connection
- Try again in a few moments

### Error Messages
- Check API key is correct
- Verify server is running on port 8081
- Check browser console for details

## Benefits Over Demo Mode
**Demo Mode:**
- Fixed responses
- Limited context
- No personalization

**AI Mode (with API key):**
- Personalized answers
- Understands context
- Follows up on questions
- Latest farming knowledge
- Multi-language support (coming soon)

## Future Enhancements
🔄 Voice input for questions
🔄 Image analysis (identify pests/diseases)
🔄 Multi-language support
🔄 Save conversation history
🔄 Share answers with community
🔄 Integration with weather data
🔄 Crop-specific recommendations

## Model Updates
Check https://console.groq.com/docs/models for latest supported models.
