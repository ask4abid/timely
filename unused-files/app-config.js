/**
 * Timely Application Configuration
 * Centralized configuration for the Timely - World Clock & Time Zone Explorer
 */

export const CONFIG = {
    // Application Info
    APP: {
        NAME: 'Timely',
        VERSION: '1.0.0',
        DESCRIPTION: 'World Clock & Time Zone Explorer',
        AUTHOR: 'Timely Team'
    },

    // Time API Configuration
    TIME_API: {
        WORLD_TIME_BASE: 'http://worldtimeapi.org/api',
        TIMEZONE_DB_BASE: 'http://api.timezonedb.com/v2.1',
        BACKUP_TIME_SOURCE: 'https://timeapi.io/api/Time/current/zone',
        TIMEOUT: 10000,
        RETRY_ATTEMPTS: 3
    },

    // Countries API Configuration (for timezone data)
    COUNTRIES_API: {
        BASE_URL: 'https://restcountries.com/v3.1',
        ENDPOINTS: {
            BY_NAME: '/name',
            ALL_COUNTRIES: '/all',
            BY_CODE: '/alpha'
        },
        TIMEOUT: 10000,
        RETRY_ATTEMPTS: 3
    },

    // UI Configuration
    UI: {
        DEFAULT_TIMEZONE: Intl.DateTimeFormat().resolvedOptions().timeZone,
        DEFAULT_COUNTRY: null, // Will be set dynamically based on user location/selection
        CLOCK_UPDATE_INTERVAL: 1000, // 1 second
        TIMEZONE_UPDATE_INTERVAL: 60000, // 1 minute
        ANIMATION_DURATION: 300,
        DEBOUNCE_DELAY: 500,
        MAX_FAVORITE_TIMEZONES: 12,
        CLOCK_FORMATS: ['12h', '24h'],
        DEFAULT_CLOCK_FORMAT: '24h'
    },

    // Time Zones Configuration
    TIMEZONES: {
        POPULAR: [
            { timezone: 'America/New_York', city: 'New York', country: 'USA', emoji: '🇺🇸' },
            { timezone: 'Europe/London', city: 'London', country: 'UK', emoji: '🇬🇧' },
            { timezone: 'Europe/Paris', city: 'Paris', country: 'France', emoji: '🇫🇷' },
            { timezone: 'Asia/Tokyo', city: 'Tokyo', country: 'Japan', emoji: '🇯🇵' },
            { timezone: 'Asia/Shanghai', city: 'Beijing', country: 'China', emoji: '��' },
            { timezone: 'Asia/Karachi', city: 'Karachi', country: 'Pakistan', emoji: '��' },
            { timezone: 'Asia/Dubai', city: 'Dubai', country: 'UAE', emoji: '��' },
            { timezone: 'Australia/Sydney', city: 'Sydney', country: 'Australia', emoji: '��' },
            { timezone: 'America/Los_Angeles', city: 'Los Angeles', country: 'USA', emoji: '��' },
            { timezone: 'Asia/Singapore', city: 'Singapore', country: 'Singapore', emoji: '��' }
        ],
        FIELDS_TO_FETCH: 'name,flags,timezones,capital,region,cca2,cca3'
    },

    // Clock Features
    CLOCK: {
        SHOW_SECONDS: true,
        SHOW_MILLISECONDS: false,
        SHOW_DATE: true,
        SHOW_TIMEZONE_OFFSET: true,
        SHOW_DST_INFO: true,
        AUTO_DETECT_TIMEZONE: true,
        THEMES: ['light', 'dark', 'auto'],
        DEFAULT_THEME: 'auto'
    },

    // Error Messages
    MESSAGES: {
        ERRORS: {
            TIMEZONE_NOT_FOUND: 'Timezone not found. Please check the timezone name.',
            COUNTRY_NOT_FOUND: 'Country not found. Please check the spelling or try a different country name.',
            NETWORK_ERROR: 'Unable to connect to the time server. Please check your internet connection.',
            TIMEOUT_ERROR: 'Request timed out. Please try again.',
            CLOCK_SYNC_ERROR: 'Failed to synchronize with time server. Using local time.',
            GENERIC_ERROR: 'An unexpected error occurred. Please try again later.'
        },
        SUCCESS: {
            TIMEZONE_LOADED: 'Timezone information loaded successfully',
            CLOCK_SYNCED: 'Clock synchronized with time server',
            COUNTRY_LOADED: 'Country information loaded successfully'
        },
        INFO: {
            WELCOME_TITLE: 'Welcome to Timely!',
            WELCOME_DESCRIPTION: 'Your ultimate world clock and timezone explorer. See current time in any city or timezone around the world.',
            WELCOME_CTA: '� Search for any city or click on popular timezones to get started!'
        }
    },

    // Analytics and Tracking
    ANALYTICS: {
        ENABLED: false,
        TRACK_EVENTS: ['timezone_search', 'country_search', 'clock_format_change', 'favorite_add'],
        SESSION_TIMEOUT: 30 * 60 * 1000 // 30 minutes
    },

    // Development Configuration
    DEV: {
        DEBUG_MODE: process?.env?.NODE_ENV === 'development',
        LOG_LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
        MOCK_API: false,
        SHOW_PERFORMANCE_METRICS: true
    },

    // Performance Configuration
    PERFORMANCE: {
        LAZY_LOAD_IMAGES: true,
        CACHE_DURATION: 10 * 60 * 1000, // 10 minutes
        MAX_CACHE_SIZE: 200, // Maximum number of cached timezones
        PRELOAD_POPULAR_TIMEZONES: true,
        BACKGROUND_SYNC: true
    },

    // Features Configuration
    FEATURES: {
        WORLD_CLOCK: true,
        TIMEZONE_CONVERTER: true,
        COUNTRY_FLAGS: true,
        TIME_DIFFERENCE_CALCULATOR: true,
        ALARM_NOTIFICATIONS: false, // Future feature
        MEETING_PLANNER: false, // Future feature
        CALENDAR_INTEGRATION: false // Future feature
    }
};

// Environment-specific overrides and dynamic configuration
if (typeof window !== 'undefined') {
    // Browser environment
    CONFIG.DEV.DEBUG_MODE = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';
                           
    // Auto-detect user's timezone
    try {
        CONFIG.UI.DEFAULT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Auto-detect user's country based on timezone
        CONFIG.UI.DEFAULT_COUNTRY = detectCountryFromTimezone(CONFIG.UI.DEFAULT_TIMEZONE);
    } catch (e) {
        CONFIG.UI.DEFAULT_TIMEZONE = 'UTC';
        CONFIG.UI.DEFAULT_COUNTRY = 'unknown';
    }
}

/**
 * Detect country from timezone
 * @param {string} timezone - IANA timezone string
 * @returns {string} Country name or code
 */
function detectCountryFromTimezone(timezone) {
    const timezoneCountryMap = {
        // Asia/Pacific
        'Asia/Karachi': 'pakistan',
        'Asia/Lahore': 'pakistan', 
        'Asia/Islamabad': 'pakistan',
        'Asia/Kolkata': 'india',
        'Asia/Delhi': 'india',
        'Asia/Mumbai': 'india',
        'Asia/Dubai': 'uae',
        'Asia/Riyadh': 'saudi-arabia',
        'Asia/Tokyo': 'japan',
        'Asia/Shanghai': 'china',
        'Asia/Beijing': 'china',
        'Asia/Singapore': 'singapore',
        'Asia/Bangkok': 'thailand',
        'Asia/Seoul': 'south-korea',
        'Asia/Jakarta': 'indonesia',
        'Asia/Manila': 'philippines',
        'Asia/Dhaka': 'bangladesh',
        'Asia/Colombo': 'sri-lanka',
        
        // Europe
        'Europe/London': 'united-kingdom',
        'Europe/Paris': 'france',
        'Europe/Berlin': 'germany',
        'Europe/Madrid': 'spain',
        'Europe/Rome': 'italy',
        'Europe/Amsterdam': 'netherlands',
        'Europe/Brussels': 'belgium',
        'Europe/Vienna': 'austria',
        'Europe/Zurich': 'switzerland',
        'Europe/Stockholm': 'sweden',
        'Europe/Oslo': 'norway',
        'Europe/Copenhagen': 'denmark',
        'Europe/Helsinki': 'finland',
        'Europe/Warsaw': 'poland',
        'Europe/Prague': 'czech-republic',
        'Europe/Budapest': 'hungary',
        'Europe/Bucharest': 'romania',
        'Europe/Sofia': 'bulgaria',
        'Europe/Athens': 'greece',
        'Europe/Lisbon': 'portugal',
        'Europe/Dublin': 'ireland',
        'Europe/Moscow': 'russia',
        
        // Americas
        'America/New_York': 'united-states',
        'America/Chicago': 'united-states',
        'America/Denver': 'united-states',
        'America/Los_Angeles': 'united-states',
        'America/Phoenix': 'united-states',
        'America/Toronto': 'canada',
        'America/Vancouver': 'canada',
        'America/Montreal': 'canada',
        'America/Mexico_City': 'mexico',
        'America/Sao_Paulo': 'brazil',
        'America/Buenos_Aires': 'argentina',
        'America/Santiago': 'chile',
        'America/Lima': 'peru',
        'America/Bogota': 'colombia',
        'America/Caracas': 'venezuela',
        
        // Africa
        'Africa/Cairo': 'egypt',
        'Africa/Lagos': 'nigeria',
        'Africa/Johannesburg': 'south-africa',
        'Africa/Nairobi': 'kenya',
        'Africa/Casablanca': 'morocco',
        'Africa/Algiers': 'algeria',
        'Africa/Tunis': 'tunisia',
        
        // Australia/Oceania
        'Australia/Sydney': 'australia',
        'Australia/Melbourne': 'australia',
        'Australia/Perth': 'australia',
        'Australia/Brisbane': 'australia',
        'Australia/Adelaide': 'australia',
        'Pacific/Auckland': 'new-zealand',
        'Pacific/Fiji': 'fiji',
        'Pacific/Honolulu': 'united-states'
    };
    
    return timezoneCountryMap[timezone] || 'unknown';
}

/**
 * Update default country based on user selection
 * @param {string} country - Country name or code
 */
CONFIG.setDefaultCountry = function(country) {
    if (!Object.isFrozen(this)) {
        this.UI.DEFAULT_COUNTRY = country.toLowerCase();
        
        // Save to localStorage for persistence
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('timely-default-country', country.toLowerCase());
        }
    }
};

/**
 * Get current default country (check localStorage first)
 * @returns {string} Current default country
 */
CONFIG.getDefaultCountry = function() {
    if (typeof localStorage !== 'undefined') {
        const savedCountry = localStorage.getItem('timely-default-country');
        if (savedCountry) {
            return savedCountry;
        }
    }
    return this.UI.DEFAULT_COUNTRY || 'unknown';
};

// Load saved country preference
if (typeof localStorage !== 'undefined') {
    const savedCountry = localStorage.getItem('timely-default-country');
    if (savedCountry) {
        CONFIG.UI.DEFAULT_COUNTRY = savedCountry;
    }
}

// Freeze the configuration to prevent accidental modifications
Object.freeze(CONFIG);
