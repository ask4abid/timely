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
    constructor(timezone, timeService) {
        this.timezone = timezone;
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
            this.element.setAttribute('data-timezone', this.timezone);
            
            await this.render();
            this.startUpdating();
            this.isActive = true;
            
            this.logger.debug('Clock component created for:', this.timezone);
            return this.element;
        } catch (error) {
            this.logger.error('Failed to create clock component:', error);
            return this.createErrorElement();
        }
    }

    async render() {
        try {
            const currentTime = await this.timeService.getCurrentTime(this.timezone);
            const cityName = this.extractCityName(this.timezone);
            
            this.element.innerHTML = `
                <div class="clock-header">
                    <h3 class="city-name">${cityName}</h3>
                    <button class="remove-btn" aria-label="Remove ${cityName} clock" title="Remove clock">
                        ✕
                    </button>
                </div>
                <div class="clock-display">
                    <div class="time">${this.timeService.formatTime(currentTime)}</div>
                    <div class="date">${this.timeService.formatDate(currentTime, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                </div>
                <div class="timezone-info">
                    <span class="timezone-name">${this.timezone}</span>
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
                    <h3>${this.extractCityName(this.timezone)}</h3>
                    <p>Unable to load time</p>
                    <button class="remove-btn">✕</button>
                </div>
            `;
        }
    }

    async update() {
        if (!this.isActive || !this.element) return;

        try {
            const currentTime = await this.timeService.getCurrentTime(this.timezone);
            const timeElement = this.element.querySelector('.time');
            const dateElement = this.element.querySelector('.date');
            
            if (timeElement) {
                timeElement.textContent = this.timeService.formatTime(currentTime);
            }
            if (dateElement) {
                dateElement.textContent = this.timeService.formatDate(currentTime, { 
                    weekday: 'short', month: 'short', day: 'numeric' 
                });
            }
        } catch (error) {
            this.logger.error('Failed to update clock:', error);
        }
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
            detail: { timezone: this.timezone }
        });
        document.dispatchEvent(event);
        
        this.logger.debug('Clock component removed for:', this.timezone);
    }

    createErrorElement() {
        const element = document.createElement('div');
        element.className = 'clock-card clock-error';
        element.innerHTML = `
            <div class="clock-header">
                <h3>${this.extractCityName(this.timezone)}</h3>
                <button class="remove-btn">✕</button>
            </div>
            <div class="error-message">
                <p>Failed to load</p>
            </div>
        `;
        return element;
    }

    extractCityName(timezone) {
        return timezone.split('/').pop().replace(/_/g, ' ');
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
            'America/New_York',
            'America/Los_Angeles',
            'Europe/London',
            'Europe/Paris',
            'Asia/Tokyo',
            'Asia/Dubai',
            'Australia/Sydney',
            'Asia/Shanghai',
            'America/Chicago',
            'Europe/Berlin'
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
            this.showError('Please enter a city or timezone');
            return;
        }

        const timezone = this.normalizeTimezone(input);
        this.emitTimezoneAdd(timezone);
        this.searchInput.value = '';
    }

    handleRandomTimezone() {
        const randomTimezone = this.popularTimezones[
            Math.floor(Math.random() * this.popularTimezones.length)
        ];
        this.emitTimezoneAdd(randomTimezone);
    }

    normalizeTimezone(input) {
        // Simple timezone normalization
        const cityMappings = {
            'london': 'Europe/London',
            'paris': 'Europe/Paris',
            'tokyo': 'Asia/Tokyo',
            'dubai': 'Asia/Dubai',
            'new york': 'America/New_York',
            'los angeles': 'America/Los_Angeles',
            'sydney': 'Australia/Sydney',
            'berlin': 'Europe/Berlin',
            'chicago': 'America/Chicago',
            'shanghai': 'Asia/Shanghai'
        };

        const normalized = input.toLowerCase();
        return cityMappings[normalized] || input;
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

        // Add some popular timezone buttons
        const popularCities = ['London', 'Tokyo', 'Dubai', 'New York'];
        popularCities.forEach(city => {
            const btn = document.createElement('button');
            btn.className = 'favorite-btn btn btn-secondary';
            btn.textContent = city;
            btn.addEventListener('click', () => {
                this.searchInput.value = city;
                this.handleSearch();
            });
            favoritesSection.appendChild(btn);
        });
    }

    emitTimezoneAdd(timezone) {
        const event = new CustomEvent('timezoneAdd', {
            detail: { timezone: timezone }
        });
        document.dispatchEvent(event);
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
            
            // Initialize search component
            this.searchComponent.init();
            
            // Set up event listeners
            this.attachEventListeners();
            
            // Load saved timezones
            await this.loadSavedTimezones();
            
            // Show welcome message if no clocks
            this.updateWelcomeSection();
            
            this.isInitialized = true;
            this.logger.info('Timely application initialized successfully');
            
        } catch (error) {
            this.logger.error('Failed to initialize Timely application:', error);
            throw error;
        }
    }

    attachEventListeners() {
        // Listen for timezone add events
        document.addEventListener('timezoneAdd', (event) => {
            this.handleTimezoneAdd(event.detail.timezone);
        });
        
        // Listen for clock remove events
        document.addEventListener('clockRemoved', (event) => {
            this.handleClockRemoved(event.detail.timezone);
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

    async handleTimezoneAdd(timezone) {
        try {
            if (this.clocks.has(timezone)) {
                this.logger.warn('Clock already exists for timezone:', timezone);
                return;
            }

            if (this.clocks.size >= this.maxClocks) {
                this.logger.warn('Maximum number of clocks reached');
                return;
            }

            await this.addClock(timezone);
            this.saveTimezones();
            this.updateWelcomeSection();
            
        } catch (error) {
            this.logger.error('Failed to handle timezone add:', error);
        }
    }

    handleClockRemoved(timezone) {
        this.clocks.delete(timezone);
        this.saveTimezones();
        this.updateWelcomeSection();
        this.logger.debug('Clock removed:', timezone);
    }

    async addClock(timezone) {
        try {
            const clock = new ClockComponent(timezone, this.timeService);
            const clockElement = await clock.create();
            
            const container = document.getElementById('clockContainer');
            if (!container) {
                throw new Error('Clock container not found');
            }
            
            container.appendChild(clockElement);
            this.clocks.set(timezone, clock);
            
            this.logger.debug('Clock added:', timezone);
            
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

    saveTimezones() {
        try {
            const timezones = Array.from(this.clocks.keys());
            localStorage.setItem('timely_saved_timezones', JSON.stringify(timezones));
        } catch (error) {
            this.logger.error('Failed to save timezones:', error);
        }
    }

    async loadSavedTimezones() {
        try {
            const saved = localStorage.getItem('timely_saved_timezones');
            if (!saved) return;

            const timezones = JSON.parse(saved);
            for (const timezone of timezones) {
                await this.addClock(timezone);
            }
            
            this.logger.debug('Loaded saved timezones:', timezones);
        } catch (error) {
            this.logger.error('Failed to load saved timezones:', error);
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
            timezones: Array.from(this.clocks.keys()),
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'timely-timezones.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    destroy() {
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
