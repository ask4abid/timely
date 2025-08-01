// Timely World Clock - Bundled Version
// This file combines all modules into a single file for compatibility

// Cache utility
class CacheManager {
    constructor(prefix = 'timely_', ttl = 24 * 60 * 60 * 1000) {
        this.prefix = prefix;
        this.ttl = ttl;
    }

    set(key, data) {
        try {
            const item = {
                data: data,
                timestamp: Date.now(),
                expires: Date.now() + this.ttl
            };
            localStorage.setItem(this.prefix + key, JSON.stringify(item));
            return true;
        } catch (error) {
            console.warn('Cache set failed:', error);
            return false;
        }
    }

    get(key) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            if (!item) return null;

            const parsed = JSON.parse(item);
            if (Date.now() > parsed.expires) {
                this.delete(key);
                return null;
            }

            return parsed.data;
        } catch (error) {
            console.warn('Cache get failed:', error);
            return null;
        }
    }

    delete(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.warn('Cache delete failed:', error);
            return false;
        }
    }

    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.warn('Cache clear failed:', error);
            return false;
        }
    }
}

// Logger utility
class Logger {
    constructor(level = 'info') {
        this.level = level;
        this.levels = { error: 0, warn: 1, info: 2, debug: 3 };
    }

    log(level, ...args) {
        if (this.levels[level] <= this.levels[this.level]) {
            console[level](`[Timely ${level.toUpperCase()}]`, ...args);
        }
    }

    error(...args) { this.log('error', ...args); }
    warn(...args) { this.log('warn', ...args); }
    info(...args) { this.log('info', ...args); }
    debug(...args) { this.log('debug', ...args); }
}

// Time Service
class TimeService {
    constructor() {
        this.cache = new CacheManager('timely_time_', 10 * 60 * 1000); // 10 min cache
        this.logger = new Logger();
        this.retryCount = 3;
        this.baseDelay = 1000;
        
        // Comprehensive country and timezone database
        this.countryTimezones = {
            // North America
            'United States (New York)': { timezone: 'America/New_York', flag: '🇺🇸', country: 'United States' },
            'United States (Los Angeles)': { timezone: 'America/Los_Angeles', flag: '🇺🇸', country: 'United States' },
            'United States (Chicago)': { timezone: 'America/Chicago', flag: '🇺🇸', country: 'United States' },
            'Canada (Toronto)': { timezone: 'America/Toronto', flag: '🇨🇦', country: 'Canada' },
            'Canada (Vancouver)': { timezone: 'America/Vancouver', flag: '🇨🇦', country: 'Canada' },
            'Mexico (Mexico City)': { timezone: 'America/Mexico_City', flag: '🇲🇽', country: 'Mexico' },
            
            // Europe
            'United Kingdom (London)': { timezone: 'Europe/London', flag: '🇬🇧', country: 'United Kingdom' },
            'France (Paris)': { timezone: 'Europe/Paris', flag: '🇫🇷', country: 'France' },
            'Germany (Berlin)': { timezone: 'Europe/Berlin', flag: '🇩🇪', country: 'Germany' },
            'Italy (Rome)': { timezone: 'Europe/Rome', flag: '🇮🇹', country: 'Italy' },
            'Spain (Madrid)': { timezone: 'Europe/Madrid', flag: '🇪🇸', country: 'Spain' },
            'Netherlands (Amsterdam)': { timezone: 'Europe/Amsterdam', flag: '🇳🇱', country: 'Netherlands' },
            'Switzerland (Zurich)': { timezone: 'Europe/Zurich', flag: '🇨🇭', country: 'Switzerland' },
            'Russia (Moscow)': { timezone: 'Europe/Moscow', flag: '🇷🇺', country: 'Russia' },
            'Turkey (Istanbul)': { timezone: 'Europe/Istanbul', flag: '🇹🇷', country: 'Turkey' },
            
            // Asia
            'Japan (Tokyo)': { timezone: 'Asia/Tokyo', flag: '🇯🇵', country: 'Japan' },
            'China (Shanghai)': { timezone: 'Asia/Shanghai', flag: '🇨🇳', country: 'China' },
            'India (Mumbai)': { timezone: 'Asia/Kolkata', flag: '🇮🇳', country: 'India' },
            'UAE (Dubai)': { timezone: 'Asia/Dubai', flag: '🇦🇪', country: 'UAE' },
            'Singapore': { timezone: 'Asia/Singapore', flag: '🇸🇬', country: 'Singapore' },
            'South Korea (Seoul)': { timezone: 'Asia/Seoul', flag: '🇰🇷', country: 'South Korea' },
            'Thailand (Bangkok)': { timezone: 'Asia/Bangkok', flag: '🇹🇭', country: 'Thailand' },
            'Malaysia (Kuala Lumpur)': { timezone: 'Asia/Kuala_Lumpur', flag: '🇲🇾', country: 'Malaysia' },
            'Indonesia (Jakarta)': { timezone: 'Asia/Jakarta', flag: '🇮🇩', country: 'Indonesia' },
            'Philippines (Manila)': { timezone: 'Asia/Manila', flag: '🇵🇭', country: 'Philippines' },
            'Hong Kong': { timezone: 'Asia/Hong_Kong', flag: '🇭🇰', country: 'Hong Kong' },
            'Taiwan (Taipei)': { timezone: 'Asia/Taipei', flag: '🇹🇼', country: 'Taiwan' },
            
            // Middle East & Africa
            'Saudi Arabia (Riyadh)': { timezone: 'Asia/Riyadh', flag: '🇸🇦', country: 'Saudi Arabia' },
            'Qatar (Doha)': { timezone: 'Asia/Qatar', flag: '🇶🇦', country: 'Qatar' },
            'Kuwait': { timezone: 'Asia/Kuwait', flag: '🇰🇼', country: 'Kuwait' },
            'Israel (Jerusalem)': { timezone: 'Asia/Jerusalem', flag: '🇮🇱', country: 'Israel' },
            'Egypt (Cairo)': { timezone: 'Africa/Cairo', flag: '🇪🇬', country: 'Egypt' },
            'South Africa (Johannesburg)': { timezone: 'Africa/Johannesburg', flag: '🇿🇦', country: 'South Africa' },
            'Nigeria (Lagos)': { timezone: 'Africa/Lagos', flag: '🇳🇬', country: 'Nigeria' },
            'Kenya (Nairobi)': { timezone: 'Africa/Nairobi', flag: '🇰🇪', country: 'Kenya' },
            
            // Oceania
            'Australia (Sydney)': { timezone: 'Australia/Sydney', flag: '🇦🇺', country: 'Australia' },
            'Australia (Melbourne)': { timezone: 'Australia/Melbourne', flag: '🇦🇺', country: 'Australia' },
            'Australia (Perth)': { timezone: 'Australia/Perth', flag: '🇦🇺', country: 'Australia' },
            'New Zealand (Auckland)': { timezone: 'Pacific/Auckland', flag: '🇳🇿', country: 'New Zealand' },
            
            // South America
            'Brazil (São Paulo)': { timezone: 'America/Sao_Paulo', flag: '🇧🇷', country: 'Brazil' },
            'Argentina (Buenos Aires)': { timezone: 'America/Argentina/Buenos_Aires', flag: '🇦🇷', country: 'Argentina' },
            'Chile (Santiago)': { timezone: 'America/Santiago', flag: '🇨🇱', country: 'Chile' },
            'Colombia (Bogota)': { timezone: 'America/Bogota', flag: '🇨🇴', country: 'Colombia' },
            'Peru (Lima)': { timezone: 'America/Lima', flag: '🇵🇪', country: 'Peru' }
        };
        
        // Quick search mapping for common city names
        this.cityMappings = {
            'london': 'United Kingdom (London)',
            'paris': 'France (Paris)',
            'tokyo': 'Japan (Tokyo)',
            'dubai': 'UAE (Dubai)',
            'new york': 'United States (New York)',
            'los angeles': 'United States (Los Angeles)',
            'sydney': 'Australia (Sydney)',
            'berlin': 'Germany (Berlin)',
            'chicago': 'United States (Chicago)',
            'shanghai': 'China (Shanghai)',
            'mumbai': 'India (Mumbai)',
            'singapore': 'Singapore',
            'seoul': 'South Korea (Seoul)',
            'bangkok': 'Thailand (Bangkok)',
            'toronto': 'Canada (Toronto)',
            'vancouver': 'Canada (Vancouver)',
            'moscow': 'Russia (Moscow)',
            'rome': 'Italy (Rome)',
            'madrid': 'Spain (Madrid)',
            'amsterdam': 'Netherlands (Amsterdam)',
            'zurich': 'Switzerland (Zurich)',
            'istanbul': 'Turkey (Istanbul)',
            'cairo': 'Egypt (Cairo)',
            'johannesburg': 'South Africa (Johannesburg)',
            'lagos': 'Nigeria (Lagos)',
            'nairobi': 'Kenya (Nairobi)',
            'melbourne': 'Australia (Melbourne)',
            'perth': 'Australia (Perth)',
            'auckland': 'New Zealand (Auckland)',
            'sao paulo': 'Brazil (São Paulo)',
            'buenos aires': 'Argentina (Buenos Aires)',
            'santiago': 'Chile (Santiago)',
            'bogota': 'Colombia (Bogota)',
            'lima': 'Peru (Lima)',
            'riyadh': 'Saudi Arabia (Riyadh)',
            'doha': 'Qatar (Doha)',
            'kuwait': 'Kuwait',
            'jerusalem': 'Israel (Jerusalem)',
            'kuala lumpur': 'Malaysia (Kuala Lumpur)',
            'jakarta': 'Indonesia (Jakarta)',
            'manila': 'Philippines (Manila)',
            'hong kong': 'Hong Kong',
            'taipei': 'Taiwan (Taipei)'
        };
    }

    async getTimezoneData(timezone) {
        try {
            // Check cache first
            const cached = this.cache.get(`timezone_${timezone}`);
            if (cached) {
                this.logger.debug('Using cached timezone data for:', timezone);
                return cached;
            }

            // Fetch from API with retry logic
            const data = await this.fetchWithRetry(`https://worldtimeapi.org/api/timezone/${timezone}`);
            
            if (data && data.datetime) {
                this.cache.set(`timezone_${timezone}`, data);
                this.logger.debug('Fetched and cached timezone data for:', timezone);
                return data;
            }

            throw new Error('Invalid timezone data received');
        } catch (error) {
            this.logger.error('Failed to get timezone data:', error);
            throw error;
        }
    }

    getCountryInfo(searchTerm) {
        // Check if it's already a country key
        if (this.countryTimezones[searchTerm]) {
            return {
                displayName: searchTerm,
                ...this.countryTimezones[searchTerm]
            };
        }
        
        // Check city mappings
        const normalized = searchTerm.toLowerCase().trim();
        const countryKey = this.cityMappings[normalized];
        
        if (countryKey && this.countryTimezones[countryKey]) {
            return {
                displayName: countryKey,
                ...this.countryTimezones[countryKey]
            };
        }
        
        // Search through country names
        const searchResults = Object.keys(this.countryTimezones).filter(key =>
            key.toLowerCase().includes(normalized) ||
            this.countryTimezones[key].country.toLowerCase().includes(normalized)
        );
        
        if (searchResults.length > 0) {
            const bestMatch = searchResults[0];
            return {
                displayName: bestMatch,
                ...this.countryTimezones[bestMatch]
            };
        }
        
        // Fallback for unknown timezones
        return {
            displayName: searchTerm,
            timezone: searchTerm,
            flag: '🌍',
            country: this.extractCountryFromTimezone(searchTerm)
        };
    }
    
    extractCountryFromTimezone(timezone) {
        if (timezone.includes('/')) {
            const parts = timezone.split('/');
            return parts[0].replace(/_/g, ' ');
        }
        return timezone.replace(/_/g, ' ');
    }
    
    getAllCountries() {
        return Object.keys(this.countryTimezones).map(key => ({
            displayName: key,
            ...this.countryTimezones[key]
        }));
    }
    
    getPopularCountries() {
        return [
            'United Kingdom (London)',
            'United States (New York)',
            'Japan (Tokyo)',
            'UAE (Dubai)',
            'France (Paris)',
            'Germany (Berlin)',
            'China (Shanghai)',
            'India (Mumbai)',
            'Australia (Sydney)',
            'Singapore'
        ].map(key => ({
            displayName: key,
            ...this.countryTimezones[key]
        }));
    }

    async getCurrentTime(timezone) {
        try {
            const data = await this.getTimezoneData(timezone);
            return new Date(data.datetime);
        } catch (error) {
            this.logger.error('Failed to get current time:', error);
            // Fallback to local time with timezone conversion
            return new Date();
        }
    }

    async fetchWithRetry(url, retries = this.retryCount) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return await response.json();
            } catch (error) {
                this.logger.warn(`Attempt ${i + 1} failed:`, error);
                if (i === retries - 1) throw error;
                await this.delay(this.baseDelay * Math.pow(2, i));
            }
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    formatTime(date, options = {}) {
        const defaults = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        return date.toLocaleTimeString('en-US', { ...defaults, ...options });
    }

    formatDate(date, options = {}) {
        const defaults = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('en-US', { ...defaults, ...options });
    }

    getTimezoneOffset(timezone) {
        try {
            const date = new Date();
            const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
            const targetTime = new Date(utc + this.getTimezoneOffsetMs(timezone));
            return targetTime.getTimezoneOffset();
        } catch (error) {
            this.logger.error('Failed to get timezone offset:', error);
            return 0;
        }
    }

    getTimezoneOffsetMs(timezone) {
        // This is a simplified version - in a real app you'd use a proper timezone library
        const timezoneOffsets = {
            'America/New_York': -5 * 3600000,
            'America/Los_Angeles': -8 * 3600000,
            'Europe/London': 0 * 3600000,
            'Europe/Paris': 1 * 3600000,
            'Asia/Tokyo': 9 * 3600000,
            'Asia/Dubai': 4 * 3600000,
            'Australia/Sydney': 11 * 3600000
        };
        return timezoneOffsets[timezone] || 0;
    }
}

// Clock Component
class ClockComponent {
    constructor(countryInfo, timeService) {
        this.countryInfo = countryInfo; // Now contains displayName, timezone, flag, country
        this.timeService = timeService;
        this.logger = new Logger();
        this.element = null;
        this.updateInterval = null;
        this.isActive = false;
    }

    async create() {
        try {
            this.element = document.createElement('div');
            this.element.className = 'clock-card';
            this.element.setAttribute('data-timezone', this.countryInfo.timezone);
            this.element.setAttribute('data-country', this.countryInfo.country);
            
            await this.render();
            this.startUpdating();
            this.isActive = true;
            
            this.logger.debug('Clock component created for:', this.countryInfo.displayName);
            return this.element;
        } catch (error) {
            this.logger.error('Failed to create clock component:', error);
            return this.createErrorElement();
        }
    }

    async render() {
        try {
            const currentTime = await this.timeService.getCurrentTime(this.countryInfo.timezone);
            const cityName = this.extractCityName(this.countryInfo.displayName);
            const countryName = this.countryInfo.country;
            const flag = this.countryInfo.flag;
            
            // Calculate time difference from user's local time
            const localTime = new Date();
            const timeDiff = this.calculateTimeDifference(currentTime, localTime);
            
            this.element.innerHTML = `
                <div class="clock-header">
                    <div class="country-info">
                        <span class="flag">${flag}</span>
                        <div class="location-details">
                            <h3 class="city-name">${cityName}</h3>
                            <span class="country-name">${countryName}</span>
                        </div>
                    </div>
                    <button class="remove-btn" aria-label="Remove ${cityName} clock" title="Remove clock">
                        ✕
                    </button>
                </div>
                <div class="clock-display">
                    <div class="time">${this.timeService.formatTime(currentTime)}</div>
                    <div class="date">${this.timeService.formatDate(currentTime, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    <div class="time-difference">${timeDiff}</div>
                </div>
                <div class="timezone-info">
                    <span class="timezone-name">${this.countryInfo.timezone}</span>
                    <span class="utc-offset">${this.getUTCOffset(currentTime)}</span>
                </div>
            `;

            // Add event listener for remove button
            const removeBtn = this.element.querySelector('.remove-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', () => this.remove());
            }

        } catch (error) {
            this.logger.error('Failed to render clock:', error);
            this.element.innerHTML = `
                <div class="clock-error">
                    <div class="country-info">
                        <span class="flag">${this.countryInfo.flag}</span>
                        <h3>${this.extractCityName(this.countryInfo.displayName)}</h3>
                    </div>
                    <p>Unable to load time</p>
                    <button class="remove-btn">✕</button>
                </div>
            `;
        }
    }

    async update() {
        if (!this.isActive || !this.element) return;

        try {
            const currentTime = await this.timeService.getCurrentTime(this.countryInfo.timezone);
            const localTime = new Date();
            const timeDiff = this.calculateTimeDifference(currentTime, localTime);
            
            const timeElement = this.element.querySelector('.time');
            const dateElement = this.element.querySelector('.date');
            const timeDiffElement = this.element.querySelector('.time-difference');
            const utcOffsetElement = this.element.querySelector('.utc-offset');
            
            if (timeElement) {
                timeElement.textContent = this.timeService.formatTime(currentTime);
            }
            if (dateElement) {
                dateElement.textContent = this.timeService.formatDate(currentTime, { 
                    weekday: 'short', month: 'short', day: 'numeric' 
                });
            }
            if (timeDiffElement) {
                timeDiffElement.textContent = timeDiff;
            }
            if (utcOffsetElement) {
                utcOffsetElement.textContent = this.getUTCOffset(currentTime);
            }
        } catch (error) {
            this.logger.error('Failed to update clock:', error);
        }
    }

    calculateTimeDifference(targetTime, localTime) {
        const diffMs = targetTime.getTime() - localTime.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((Math.abs(diffMs) % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffHours === 0 && diffMinutes === 0) {
            return 'Same time';
        }
        
        const sign = diffHours >= 0 ? '+' : '';
        if (diffMinutes === 0) {
            return `${sign}${diffHours}h`;
        } else {
            return `${sign}${diffHours}h ${diffMinutes}m`;
        }
    }
    
    getUTCOffset(date) {
        const offset = -date.getTimezoneOffset();
        const hours = Math.floor(Math.abs(offset) / 60);
        const minutes = Math.abs(offset) % 60;
        const sign = offset >= 0 ? '+' : '-';
        return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    startUpdating() {
        this.updateInterval = setInterval(() => this.update(), 1000);
    }

    stopUpdating() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    remove() {
        this.isActive = false;
        this.stopUpdating();
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        // Emit custom event for parent to handle
        const event = new CustomEvent('clockRemoved', {
            detail: { countryInfo: this.countryInfo }
        });
        document.dispatchEvent(event);
        
        this.logger.debug('Clock component removed for:', this.countryInfo.displayName);
    }

    createErrorElement() {
        const element = document.createElement('div');
        element.className = 'clock-card clock-error';
        element.innerHTML = `
            <div class="clock-header">
                <div class="country-info">
                    <span class="flag">${this.countryInfo.flag}</span>
                    <h3>${this.extractCityName(this.countryInfo.displayName)}</h3>
                </div>
                <button class="remove-btn">✕</button>
            </div>
            <div class="error-message">
                <p>Failed to load</p>
            </div>
        `;
        return element;
    }

    extractCityName(displayName) {
        // Extract city from "Country (City)" format
        const match = displayName.match(/\(([^)]+)\)/);
        if (match) {
            return match[1];
        }
        // Fallback to timezone extraction
        return displayName.split('/').pop().replace(/_/g, ' ');
    }

    destroy() {
        this.remove();
    }
}

// Search Component
class SearchComponent {
    constructor(timeService) {
        this.timeService = timeService;
        this.logger = new Logger();
        this.searchInput = null;
        this.searchBtn = null;
        this.randomBtn = null;
        this.isInitialized = false;
        
        this.popularTimezones = [
            'United Kingdom (London)',
            'United States (New York)',
            'Japan (Tokyo)',
            'UAE (Dubai)',
            'France (Paris)',
            'Germany (Berlin)',
            'China (Shanghai)',
            'India (Mumbai)',
            'Australia (Sydney)',
            'Singapore'
        ];
    }

    init() {
        try {
            this.searchInput = document.getElementById('timezoneInput');
            this.searchBtn = document.querySelector('.search-btn');
            this.randomBtn = document.querySelector('.random-btn');
            
            if (!this.searchInput || !this.searchBtn || !this.randomBtn) {
                throw new Error('Required search elements not found');
            }

            this.attachEventListeners();
            this.setupFavorites();
            this.isInitialized = true;
            
            this.logger.debug('Search component initialized');
        } catch (error) {
            this.logger.error('Failed to initialize search component:', error);
            throw error;
        }
    }

    attachEventListeners() {
        // Search button click
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        
        // Enter key in search input
        this.searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.handleSearch();
            }
        });
        
        // Random button click
        this.randomBtn.addEventListener('click', () => this.handleRandomTimezone());
        
        // Input validation
        this.searchInput.addEventListener('input', () => this.validateInput());
    }

    handleSearch() {
        const input = this.searchInput.value.trim();
        if (!input) {
            this.showError('Please enter a city or country');
            return;
        }

        const countryInfo = this.timeService.getCountryInfo(input);
        this.emitCountryAdd(countryInfo);
        this.searchInput.value = '';
    }

    handleRandomTimezone() {
        const randomCountry = this.popularTimezones[
            Math.floor(Math.random() * this.popularTimezones.length)
        ];
        const countryInfo = this.timeService.getCountryInfo(randomCountry);
        this.emitCountryAdd(countryInfo);
    }

    emitCountryAdd(countryInfo) {
        const event = new CustomEvent('countryAdd', {
            detail: { countryInfo: countryInfo }
        });
        document.dispatchEvent(event);
    }

    validateInput() {
        const input = this.searchInput.value.trim();
        if (input.length > 50) {
            this.searchInput.value = input.substring(0, 50);
        }
    }

    setupFavorites() {
        const favoritesSection = document.querySelector('.favorites-section');
        if (!favoritesSection) return;

        // Add popular country/city buttons with flags
        const popularCountries = this.timeService.getPopularCountries();
        const displayCountries = popularCountries.slice(0, 6); // Show first 6
        
        displayCountries.forEach(countryInfo => {
            const btn = document.createElement('button');
            btn.className = 'favorite-btn btn btn-secondary';
            btn.innerHTML = `${countryInfo.flag} ${this.extractCityName(countryInfo.displayName)}`;
            btn.addEventListener('click', () => {
                this.emitCountryAdd(countryInfo);
            });
            favoritesSection.appendChild(btn);
        });
    }
    
    extractCityName(displayName) {
        const match = displayName.match(/\(([^)]+)\)/);
        return match ? match[1] : displayName;
    }

    showError(message) {
        // Simple error display - you could make this more sophisticated
        this.searchInput.style.borderColor = '#ff4757';
        setTimeout(() => {
            this.searchInput.style.borderColor = '';
        }, 3000);
        
        this.logger.warn('Search error:', message);
    }

    destroy() {
        // Clean up event listeners if needed
        this.isInitialized = false;
        this.logger.debug('Search component destroyed');
    }
}

// Main Application
class TimelyApp {
    constructor() {
        this.timeService = new TimeService();
        this.searchComponent = new SearchComponent(this.timeService);
        this.logger = new Logger();
        this.clocks = new Map();
        this.isInitialized = false;
        this.maxClocks = 12;
    }

    async init() {
        try {
            this.logger.info('Initializing Timely World Clock Application...');
            
            // Initialize main clock first
            await this.initMainClock();
            
            // Initialize popular times display
            this.initPopularTimes();
            
            // Initialize search component
            this.searchComponent.init();
            
            // Set up event listeners
            this.attachEventListeners();
            
            // Load saved countries
            await this.loadSavedCountries();
            
            // Show welcome message if no clocks
            this.updateWelcomeSection();
            
            this.isInitialized = true;
            this.logger.info('Timely application initialized successfully');
            
        } catch (error) {
            this.logger.error('Failed to initialize Timely application:', error);
            throw error;
        }
    }

    async initMainClock() {
        try {
            // Detect user's timezone and location
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const locationInfo = this.timeService.getCountryInfo(userTimezone) || {
                displayName: 'Your Location',
                timezone: userTimezone,
                flag: '🌍',
                country: 'Local Time'
            };

            // Update main clock display
            await this.updateMainClock(locationInfo);
            
            // Start main clock updates
            this.startMainClockUpdates(locationInfo);
            
            this.logger.debug('Main clock initialized for:', userTimezone);
        } catch (error) {
            this.logger.error('Failed to initialize main clock:', error);
            // Fallback to system time
            this.updateMainClockFallback();
        }
    }

    async updateMainClock(locationInfo) {
        try {
            const currentTime = await this.timeService.getCurrentTime(locationInfo.timezone);
            
            const mainTimeEl = document.getElementById('mainTime');
            const mainDateEl = document.getElementById('mainDate');
            const mainLocationEl = document.getElementById('mainLocation');
            
            if (mainTimeEl) {
                mainTimeEl.textContent = this.timeService.formatTime(currentTime);
            }
            
            if (mainDateEl) {
                mainDateEl.textContent = this.timeService.formatDate(currentTime, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
            
            if (mainLocationEl) {
                const cityName = this.extractCityFromTimezone(locationInfo.timezone);
                mainLocationEl.innerHTML = `
                    <span class="location-flag">${locationInfo.flag}</span>
                    Time in ${cityName}
                `;
            }
        } catch (error) {
            this.logger.error('Failed to update main clock:', error);
        }
    }

    updateMainClockFallback() {
        const now = new Date();
        const mainTimeEl = document.getElementById('mainTime');
        const mainDateEl = document.getElementById('mainDate');
        const mainLocationEl = document.getElementById('mainLocation');
        
        if (mainTimeEl) {
            mainTimeEl.textContent = this.timeService.formatTime(now);
        }
        
        if (mainDateEl) {
            mainDateEl.textContent = this.timeService.formatDate(now);
        }
        
        if (mainLocationEl) {
            mainLocationEl.innerHTML = `
                <span class="location-flag">🌍</span>
                Local Time
            `;
        }
    }

    startMainClockUpdates(locationInfo) {
        // Update main clock every second
        this.mainClockInterval = setInterval(async () => {
            await this.updateMainClock(locationInfo);
        }, 1000);
    }

    extractCityFromTimezone(timezone) {
        const parts = timezone.split('/');
        if (parts.length > 1) {
            return parts[parts.length - 1].replace(/_/g, ' ');
        }
        return timezone.replace(/_/g, ' ');
    }

    initPopularTimes() {
        try {
            const popularTimesGrid = document.getElementById('popularTimesGrid');
            if (!popularTimesGrid) return;

            // Get popular countries for quick time display
            const popularCountries = this.timeService.getPopularCountries().slice(0, 6);
            
            popularCountries.forEach(countryInfo => {
                const timeItem = this.createPopularTimeItem(countryInfo);
                popularTimesGrid.appendChild(timeItem);
            });

            // Start updating popular times
            this.startPopularTimesUpdates(popularCountries);
            
            this.logger.debug('Popular times initialized');
        } catch (error) {
            this.logger.error('Failed to initialize popular times:', error);
        }
    }

    createPopularTimeItem(countryInfo) {
        const item = document.createElement('div');
        item.className = 'popular-time-item';
        item.setAttribute('data-timezone', countryInfo.timezone);
        
        const cityName = this.extractCityFromTimezone(countryInfo.timezone);
        
        item.innerHTML = `
            <span class="popular-time-flag">${countryInfo.flag}</span>
            <div class="popular-time-details">
                <div class="popular-time-city">${cityName}</div>
                <div class="popular-time-time">--:--</div>
            </div>
        `;
        
        // Add click handler to add as full clock
        item.addEventListener('click', () => {
            this.handleCountryAdd(countryInfo);
        });
        
        return item;
    }

    startPopularTimesUpdates(popularCountries) {
        const updatePopularTimes = async () => {
            for (const countryInfo of popularCountries) {
                try {
                    const currentTime = await this.timeService.getCurrentTime(countryInfo.timezone);
                    const timeElement = document.querySelector(
                        `[data-timezone="${countryInfo.timezone}"] .popular-time-time`
                    );
                    if (timeElement) {
                        timeElement.textContent = this.timeService.formatTime(currentTime);
                    }
                } catch (error) {
                    this.logger.warn('Failed to update popular time for:', countryInfo.timezone);
                }
            }
        };

        // Initial update
        updatePopularTimes();
        
        // Update every 30 seconds (less frequent than main clock)
        this.popularTimesInterval = setInterval(updatePopularTimes, 30000);
    }

    attachEventListeners() {
        // Listen for country add events
        document.addEventListener('countryAdd', (event) => {
            this.handleCountryAdd(event.detail.countryInfo);
        });
        
        // Listen for clock remove events
        document.addEventListener('clockRemoved', (event) => {
            this.handleClockRemoved(event.detail.countryInfo);
        });
        
        // Page visibility change (pause/resume updates)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAllClocks();
            } else {
                this.resumeAllClocks();
            }
        });
    }

    async handleCountryAdd(countryInfo) {
        try {
            const key = countryInfo.displayName;
            if (this.clocks.has(key)) {
                this.logger.warn('Clock already exists for:', countryInfo.displayName);
                return;
            }

            if (this.clocks.size >= this.maxClocks) {
                this.logger.warn('Maximum number of clocks reached');
                return;
            }

            await this.addClock(countryInfo);
            this.saveCountries();
            this.updateWelcomeSection();
            
        } catch (error) {
            this.logger.error('Failed to handle country add:', error);
        }
    }

    handleClockRemoved(countryInfo) {
        const key = countryInfo.displayName;
        this.clocks.delete(key);
        this.saveCountries();
        this.updateWelcomeSection();
        this.logger.debug('Clock removed:', countryInfo.displayName);
    }

    async addClock(countryInfo) {
        try {
            const clock = new ClockComponent(countryInfo, this.timeService);
            const clockElement = await clock.create();
            
            const container = document.getElementById('clockContainer');
            if (!container) {
                throw new Error('Clock container not found');
            }
            
            container.appendChild(clockElement);
            this.clocks.set(countryInfo.displayName, clock);
            
            this.logger.debug('Clock added:', countryInfo.displayName);
            
        } catch (error) {
            this.logger.error('Failed to add clock:', error);
            throw error;
        }
    }

    updateWelcomeSection() {
        const welcomeSection = document.getElementById('welcomeSection');
        if (!welcomeSection) return;

        if (this.clocks.size === 0) {
            welcomeSection.style.display = 'block';
            welcomeSection.innerHTML = `
                <div class="welcome-content">
                    <h2>🌍 Welcome to Timely</h2>
                    <p>Your ultimate world clock companion. Add cities to track time across the globe.</p>
                    <div class="welcome-actions">
                        <p><strong>Get started:</strong></p>
                        <ul>
                            <li>Search for a city in the box above</li>
                            <li>Click "Random" for a surprise timezone</li>
                            <li>Use quick access buttons for popular cities</li>
                        </ul>
                    </div>
                </div>
            `;
        } else {
            welcomeSection.style.display = 'none';
        }
    }

    saveCountries() {
        try {
            const countries = Array.from(this.clocks.keys());
            localStorage.setItem('timely_saved_countries', JSON.stringify(countries));
        } catch (error) {
            this.logger.error('Failed to save countries:', error);
        }
    }

    async loadSavedCountries() {
        try {
            const saved = localStorage.getItem('timely_saved_countries');
            if (!saved) return;

            const countryNames = JSON.parse(saved);
            for (const countryName of countryNames) {
                const countryInfo = this.timeService.getCountryInfo(countryName);
                await this.addClock(countryInfo);
            }
            
            this.logger.debug('Loaded saved countries:', countryNames);
        } catch (error) {
            this.logger.error('Failed to load saved countries:', error);
        }
    }

    pauseAllClocks() {
        this.clocks.forEach(clock => clock.stopUpdating());
    }

    resumeAllClocks() {
        this.clocks.forEach(clock => clock.startUpdating());
    }

    refreshAllClocks() {
        this.clocks.forEach(clock => clock.update());
    }

    clearCache() {
        this.timeService.cache.clear();
        this.logger.info('Cache cleared');
    }

    getMetrics() {
        return {
            activeclocks: this.clocks.size,
            maxClocks: this.maxClocks,
            isInitialized: this.isInitialized,
            cachedTimezones: Object.keys(localStorage).filter(key => key.startsWith('timely_time_')).length
        };
    }

    exportTimezoneData() {
        const data = {
            countries: Array.from(this.clocks.keys()),
            exportDate: new Date().toISOString(),
            version: '1.0.1'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'timely-countries.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    destroy() {
        // Clear intervals
        if (this.mainClockInterval) {
            clearInterval(this.mainClockInterval);
        }
        if (this.popularTimesInterval) {
            clearInterval(this.popularTimesInterval);
        }
        
        this.clocks.forEach(clock => clock.destroy());
        this.clocks.clear();
        this.searchComponent.destroy();
        this.isInitialized = false;
        this.logger.info('Timely application destroyed');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🕐 Initializing Timely World Clock...');
        
        window.timelyApp = new TimelyApp();
        await window.timelyApp.init();
        
        // Development tools (only in debug mode)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            window.appMetrics = () => console.table(window.timelyApp.getMetrics());
            window.clearAppCache = () => window.timelyApp.clearCache();
            window.exportData = () => window.timelyApp.exportTimezoneData();
            console.log('%cTimely World Clock Debug Mode', 'color: #667eea; font-size: 16px; font-weight: bold;');
            console.log('Available debug commands: appMetrics(), clearAppCache(), exportData()');
        }
        
        console.log('✅ Timely loaded successfully!');
        
    } catch (error) {
        console.error('❌ Failed to initialize Timely:', error);
        
        // Fallback error display
        const welcomeSection = document.getElementById('welcomeSection');
        if (welcomeSection) {
            welcomeSection.innerHTML = `
                <div class="error">
                    <h3>❌ Application Error</h3>
                    <p>Sorry, Timely failed to load. Please refresh the page to try again.</p>
                    <details>
                        <summary>Error Details</summary>
                        <pre>${error.message}</pre>
                    </details>
                    <button onclick="window.location.reload()" class="btn btn-primary" style="margin-top: 15px;">
                        🔄 Refresh Page
                    </button>
                </div>
            `;
        }
    }
});
