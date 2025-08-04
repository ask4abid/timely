# 🗄️ Timely Database System Documentation

## Overview

Timely uses **IndexedDB** (browser's built-in database) for local user data storage with JSON export capabilities for easy profile management and backup.

## Database Structure

### Database Name: `TimelyUserDB`
**Version:** 1.0

### Object Stores

#### 1. **users** Store
Primary store for user accounts and profiles.

**Schema:**
```javascript
{
  id: number,              // Auto-increment primary key
  username: string,        // Display name
  email: string,          // Unique email address (indexed)
  password: string,       // Hashed password (SHA-256)
  createdAt: string,      // ISO timestamp
  lastLogin: string,      // ISO timestamp
  isActive: boolean,      // Account status
  profile: {
    name: string,         // Full name
    timezone: string,     // IANA timezone
    theme: string,        // 'light' | 'dark' | 'auto'
    favoriteCity: string, // Primary city name
    worldClocks: [        // Array of saved cities
      {
        name: string,     // City name
        timezone: string, // IANA timezone
        country: string,  // Country name
        flag: string,     // Flag emoji
        addedAt: string   // ISO timestamp
      }
    ],
    preferences: {
      notifications: boolean,
      autoDetectLocation: boolean,
      format24h: boolean
    }
  }
}
```

**Indexes:**
- `email` (unique)
- `username` (non-unique)

#### 2. **preferences** Store
User-specific application preferences.

**Schema:**
```javascript
{
  userId: number,         // Foreign key to users.id
  theme: string,
  language: string,
  notifications: boolean,
  autoLocation: boolean,
  format24h: boolean,
  updatedAt: string
}
```

#### 3. **sessions** Store
Active user sessions for authentication.

**Schema:**
```javascript
{
  token: string,          // Primary key (session token)
  userId: number,         // Foreign key to users.id
  createdAt: string,      // ISO timestamp
  expiresAt: string,      // ISO timestamp
  userAgent: string       // Browser info
}
```

## API Methods

### Authentication

#### `signUp(userData)`
Creates a new user account.

**Parameters:**
- `name`: User's full name
- `email`: Email address
- `password`: Plain text password (will be hashed)
- `confirmPassword`: Password confirmation

**Returns:**
```javascript
{
  success: boolean,
  user?: User,
  error?: string
}
```

#### `signIn(credentials)`
Authenticates an existing user.

**Parameters:**
- `email`: User's email
- `password`: Plain text password
- `rememberMe`: Boolean for extended session

**Returns:**
```javascript
{
  success: boolean,
  user?: User,
  error?: string
}
```

#### `signOut()`
Ends current session and clears local storage.

### User Management

#### `getCurrentUser()`
Returns the currently authenticated user or null.

#### `updateUserPreferences(preferences)`
Updates user preferences in the database.

#### `addWorldClock(city)`
Adds a city to user's world clock collection.

#### `removeWorldClock(cityName)`
Removes a city from user's world clock collection.

### Data Export/Import

#### `exportUserData()`
Exports all user data as JSON for backup.

**Export Format:**
```javascript
{
  version: "1.0",
  exportedAt: "2024-03-15T10:30:00.000Z",
  users: [User[]],        // Sanitized user data
  sessions: [Session[]],
  stats: {
    totalUsers: number,
    activeUsers: number
  }
}
```

#### `downloadUserData()`
Triggers download of user data as JSON file.

## Security Features

### Password Security
- **Hashing**: SHA-256 with salt
- **Minimum Length**: 8 characters
- **Storage**: Only hashed passwords stored

### Session Management
- **Token-based**: Secure random tokens
- **Expiration**: 24 hours (default) or 30 days (remember me)
- **Auto-cleanup**: Expired sessions automatically removed

### Data Validation
- **Email Format**: RFC 5322 compliant
- **Unique Constraints**: Email addresses must be unique
- **Input Sanitization**: XSS prevention

## Local Storage

### Browser Storage Usage
- **IndexedDB**: Primary data storage
- **localStorage**: Session tokens only
- **No Cookies**: Pure client-side storage

### Data Persistence
- Data persists across browser sessions
- Survives browser restart
- Domain-specific (not shared across sites)

## Backup & Recovery

### Automatic Backup
- JSON export generated on user registration
- World clock changes trigger data export
- Downloadable backup files

### Manual Backup
Users can manually export data via:
1. Profile page → Data Management
2. Download JSON backup file
3. Import on other devices/browsers

### Data Migration
```bash
# Export from Device A
1. Go to Profile → Data Management
2. Click "Export Profile Data"
3. Save JSON file

# Import to Device B
1. Go to Profile → Data Management
2. Click "Import Data"
3. Select JSON file
```

## Development Usage

### Initialize Database
```javascript
const auth = new TimelyAuth();
await auth.initDatabase();
```

### Check User Status
```javascript
if (auth.isLoggedIn()) {
  const user = auth.getCurrentUser();
  console.log('Logged in as:', user.email);
}
```

### Add World Clock
```javascript
await auth.addWorldClock({
  name: 'Tokyo',
  timezone: 'Asia/Tokyo',
  country: 'Japan',
  flag: '🇯🇵'
});
```

### Update Preferences
```javascript
await auth.updateUserPreferences({
  theme: 'dark',
  format24h: true,
  notifications: false
});
```

## Database Management

### Viewing Data
Use browser DevTools:
1. F12 → Application tab
2. Storage → IndexedDB
3. TimelyUserDB → Browse stores

### Clearing Data
```javascript
// Clear all user data
await auth.clearAllData();

// Delete specific user
await auth.deleteAccount();
```

### Database Reset
```javascript
// Delete entire database (development only)
indexedDB.deleteDatabase('TimelyUserDB');
```

## Error Handling

### Common Errors
- `User already exists`: Email already registered
- `Invalid credentials`: Wrong email/password
- `Session expired`: Token no longer valid
- `Database error`: IndexedDB access issues

### Error Recovery
- Automatic session cleanup
- Graceful fallback to guest mode
- Data integrity checks

## Performance

### Optimization Features
- Indexed queries (email, username)
- Lazy loading of world clocks
- Efficient session management
- Minimal data transfer

### Storage Limits
- **IndexedDB**: ~1GB per domain (varies by browser)
- **Typical Usage**: <100KB per user
- **Scalability**: Thousands of users supported

## Browser Compatibility

### Supported Browsers
- ✅ Chrome 23+
- ✅ Firefox 10+
- ✅ Safari 7+
- ✅ Edge 12+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Fallback Strategy
- Feature detection for IndexedDB
- Graceful degradation to localStorage
- Guest mode for unsupported browsers

## Privacy & Compliance

### Data Collection
- **Minimal Data**: Only essential profile information
- **No Tracking**: No third-party analytics
- **Local Storage**: Data never leaves user's device

### GDPR Compliance
- User consent for data processing
- Right to export data (JSON download)
- Right to deletion (account deletion)
- Data portability (import/export)

### Data Retention
- Active users: Indefinite local storage
- Inactive sessions: Auto-cleanup after expiration
- Deleted accounts: Immediate data removal

## Production Deployment

### For Web Hosting
1. Upload all files to web server
2. Ensure HTTPS (required for IndexedDB)
3. Set proper CORS headers
4. Configure Content-Security-Policy

### For Desktop App (Electron)
1. Package with Electron
2. IndexedDB works natively
3. Access to file system for enhanced backups

### For Mobile App (Cordova/PhoneGap)
1. IndexedDB supported in WebView
2. Native file system access
3. Automatic cloud sync possible

---

**🔒 Security Note**: This implementation is designed for client-side storage. For production applications with server-side requirements, consider implementing proper backend authentication with JWT tokens and secure password hashing (bcrypt).
