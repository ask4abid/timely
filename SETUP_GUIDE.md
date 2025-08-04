# Timely Setup Guide

## 🔧 Configuration Required

### 1. Google Authentication Setup

To enable Google Sign-In functionality:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create or select a project**
3. **Enable Google Sign-In API**:
   - Go to APIs & Services > Library
   - Search for "Google Sign-In API" or "Google Identity"
   - Click Enable

4. **Create OAuth 2.0 Credentials**:
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add your authorized origins:
     - For local development: `http://localhost:3000`
     - For production: `https://yourdomain.com`

5. **Update the Client ID**:
   - Copy your Client ID
   - Edit `src/js/optimized-auth.js`
   - Replace `YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com` with your actual Client ID

### 2. Search API Enhancement

The app now includes multiple free APIs for enhanced city search:

#### 🌍 REST Countries API (Free, No Key Required)
- **URL**: https://restcountries.com/
- **Features**: Country data, capitals, timezones
- **Rate Limit**: None specified
- **Status**: ✅ Already integrated

#### 🗺️ GeoNames API (Free with Registration)
- **URL**: http://www.geonames.org/
- **Features**: City search, coordinates, timezones
- **Setup**:
  1. Register at: http://www.geonames.org/login
  2. Get your username
  3. Replace `demo` with your username in `enhanced-timely.js` (line ~1945)
- **Rate Limit**: 1000 requests/day (free), 30,000/day (paid)

#### 🌐 IP Geolocation APIs (Free, No Key Required)
- **ip-api.com**: Used for auto-detecting user location
- **ipinfo.io**: Backup location detection
- **Rate Limit**: Reasonable for personal use

### 3. Optional: WorldTime API
- **URL**: http://worldtimeapi.org/
- **Features**: Current time by timezone
- **Rate Limit**: None specified
- **Status**: ✅ Already integrated as fallback

## 🚀 Quick Start

1. **Install a local server** (if not already running):
   ```bash
   npm install -g live-server
   ```

2. **Run the application**:
   ```bash
   cd d:\Personal\timely
   live-server --port=3000
   ```

3. **Open in browser**: http://localhost:3000

## 🔍 Search Features

### Local Database
- **195+ world capitals** included
- **Major cities** for each continent
- **Instant search** with no API calls needed

### API Enhancement
- **REST Countries**: Finds capitals and country data
- **GeoNames**: Finds cities by name with coordinates
- **Smart fallback**: Always works even if APIs are down

### Search Capabilities
- Type any city name or country
- Smart matching with typo tolerance
- Multiple data sources combined
- Real-time suggestions with flags
- API source indicators

## 🛠️ Troubleshooting

### Google Sign-In Not Working
1. Check console for errors
2. Verify Client ID is correct
3. Ensure domain is in authorized origins
4. Check if Google Sign-In API is enabled

### Search API Issues
1. **GeoNames**: Register for free username
2. **CORS Issues**: Use HTTPS in production
3. **Rate Limits**: Implement request caching (already included)

### General Issues
1. Clear browser cache
2. Check console for JavaScript errors
3. Ensure all files are properly loaded
4. Test with a simple HTTP server

## 📱 Features

### ✅ Working Features
- UTC time display with whole numbers
- 195+ world capitals database
- Global header search
- Smart city matching
- Real-time time updates
- Local storage for user preferences
- Responsive design
- Multiple clock styles

### 🔧 Requires Setup
- Google Sign-In (need Client ID)
- Enhanced API search (optional GeoNames username)

### 🌟 Fully Free & Open Source
- REST Countries API
- IP geolocation APIs
- WorldTime API
- Local city database

## 📊 API Status

You can monitor API status in the browser console:
- ✅ API calls successful
- ⚠️ API fallback to local database
- ❌ API errors (still functional with local data)

The application is designed to work perfectly even if all external APIs fail, using the comprehensive local database of 195+ world capitals.
