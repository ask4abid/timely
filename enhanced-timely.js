// Timely - Enhanced World Clock with Smart Search and Multiple Clock Styles
// Clean version with proper Unicode support and featured clocks editing

class SimpleTimelyApp {
    constructor() {
        this.cache = new Map();
        this.updateInterval = null;
        this.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.addedCities = new Set();
        
        // Open Source Time & Location APIs Configuration
        this.apis = {
            // Time APIs (Free & Open Source)
            time: {
                worldtime: 'http://worldtimeapi.org/api/timezone/',
                browser: true // IANA timezone database fallback
            },
            // Location APIs (Free & No Key Required)
            location: {
                ipapi: 'http://ip-api.com/json/',
                ipinfo: 'https://ipinfo.io/json'
            }
        };
        
        // Comprehensive country and timezone database with flags (120+ locations)
        this.countryTimezones = {
            // North America
            'New York': { timezone: 'America/New_York', flag: '🇺🇸', country: 'United States' },
            'Los Angeles': { timezone: 'America/Los_Angeles', flag: '🇺🇸', country: 'United States' },
            'Chicago': { timezone: 'America/Chicago', flag: '🇺🇸', country: 'United States' },
            'Toronto': { timezone: 'America/Toronto', flag: '🇨🇦', country: 'Canada' },
            'Vancouver': { timezone: 'America/Vancouver', flag: '🇨🇦', country: 'Canada' },
            'Mexico City': { timezone: 'America/Mexico_City', flag: '🇲🇽', country: 'Mexico' },
            'Miami': { timezone: 'America/New_York', flag: '🇺🇸', country: 'United States' },
            'Denver': { timezone: 'America/Denver', flag: '🇺🇸', country: 'United States' },
            'Phoenix': { timezone: 'America/Phoenix', flag: '🇺🇸', country: 'United States' },
            'Seattle': { timezone: 'America/Los_Angeles', flag: '🇺🇸', country: 'United States' },
            'Montreal': { timezone: 'America/Toronto', flag: '🇨🇦', country: 'Canada' },
            'Havana': { timezone: 'America/Havana', flag: '🇨🇺', country: 'Cuba' },
            'Jamaica': { timezone: 'America/Jamaica', flag: '🇯🇲', country: 'Jamaica' },
            'Kingston': { timezone: 'America/Jamaica', flag: '🇯🇲', country: 'Jamaica' },
            'Port of Spain': { timezone: 'America/Port_of_Spain', flag: '🇹🇹', country: 'Trinidad and Tobago' },
            'Barbados': { timezone: 'America/Barbados', flag: '🇧🇧', country: 'Barbados' },
            'San Juan': { timezone: 'America/Puerto_Rico', flag: '🇵🇷', country: 'Puerto Rico' },
            'Santo Domingo': { timezone: 'America/Santo_Domingo', flag: '🇩🇴', country: 'Dominican Republic' },
            'Guatemala City': { timezone: 'America/Guatemala', flag: '🇬🇹', country: 'Guatemala' },
            'San Salvador': { timezone: 'America/El_Salvador', flag: '🇸🇻', country: 'El Salvador' },
            'Tegucigalpa': { timezone: 'America/Tegucigalpa', flag: '🇭🇳', country: 'Honduras' },
            'Managua': { timezone: 'America/Managua', flag: '🇳🇮', country: 'Nicaragua' },
            'San José': { timezone: 'America/Costa_Rica', flag: '🇨🇷', country: 'Costa Rica' },
            'Panama City': { timezone: 'America/Panama', flag: '🇵🇦', country: 'Panama' },
            'Belize City': { timezone: 'America/Belize', flag: '🇧🇿', country: 'Belize' },
            
            // South America
            'São Paulo': { timezone: 'America/Sao_Paulo', flag: '🇧🇷', country: 'Brazil' },
            'Rio de Janeiro': { timezone: 'America/Sao_Paulo', flag: '🇧🇷', country: 'Brazil' },
            'Buenos Aires': { timezone: 'America/Argentina/Buenos_Aires', flag: '🇦🇷', country: 'Argentina' },
            'Lima': { timezone: 'America/Lima', flag: '🇵🇪', country: 'Peru' },
            'Bogotá': { timezone: 'America/Bogota', flag: '🇨🇴', country: 'Colombia' },
            'Santiago': { timezone: 'America/Santiago', flag: '🇨🇱', country: 'Chile' },
            'Caracas': { timezone: 'America/Caracas', flag: '🇻🇪', country: 'Venezuela' },
            
            // Europe
            'London': { timezone: 'Europe/London', flag: '🇬🇧', country: 'United Kingdom' },
            'Paris': { timezone: 'Europe/Paris', flag: '🇫🇷', country: 'France' },
            'Berlin': { timezone: 'Europe/Berlin', flag: '🇩🇪', country: 'Germany' },
            'Rome': { timezone: 'Europe/Rome', flag: '🇮🇹', country: 'Italy' },
            'Madrid': { timezone: 'Europe/Madrid', flag: '🇪🇸', country: 'Spain' },
            'Amsterdam': { timezone: 'Europe/Amsterdam', flag: '🇳🇱', country: 'Netherlands' },
            'Brussels': { timezone: 'Europe/Brussels', flag: '🇧🇪', country: 'Belgium' },
            'Vienna': { timezone: 'Europe/Vienna', flag: '🇦🇹', country: 'Austria' },
            'Zurich': { timezone: 'Europe/Zurich', flag: '🇨🇭', country: 'Switzerland' },
            'Stockholm': { timezone: 'Europe/Stockholm', flag: '🇸🇪', country: 'Sweden' },
            'Oslo': { timezone: 'Europe/Oslo', flag: '🇳🇴', country: 'Norway' },
            'Copenhagen': { timezone: 'Europe/Copenhagen', flag: '🇩🇰', country: 'Denmark' },
            'Helsinki': { timezone: 'Europe/Helsinki', flag: '🇫🇮', country: 'Finland' },
            'Warsaw': { timezone: 'Europe/Warsaw', flag: '🇵🇱', country: 'Poland' },
            'Prague': { timezone: 'Europe/Prague', flag: '🇨🇿', country: 'Czech Republic' },
            'Budapest': { timezone: 'Europe/Budapest', flag: '🇭🇺', country: 'Hungary' },
            'Athens': { timezone: 'Europe/Athens', flag: '🇬🇷', country: 'Greece' },
            'Lisbon': { timezone: 'Europe/Lisbon', flag: '🇵🇹', country: 'Portugal' },
            'Dublin': { timezone: 'Europe/Dublin', flag: '🇮🇪', country: 'Ireland' },
            'Moscow': { timezone: 'Europe/Moscow', flag: '🇷🇺', country: 'Russia' },
            'Istanbul': { timezone: 'Europe/Istanbul', flag: '🇹🇷', country: 'Turkey' },
            'Kiev': { timezone: 'Europe/Kiev', flag: '🇺🇦', country: 'Ukraine' },
            'Bucharest': { timezone: 'Europe/Bucharest', flag: '🇷🇴', country: 'Romania' },
            'Sofia': { timezone: 'Europe/Sofia', flag: '🇧🇬', country: 'Bulgaria' },
            
            // Asia
            'Tokyo': { timezone: 'Asia/Tokyo', flag: '🇯🇵', country: 'Japan' },
            'Beijing': { timezone: 'Asia/Shanghai', flag: '🇨🇳', country: 'China' },
            'Shanghai': { timezone: 'Asia/Shanghai', flag: '🇨🇳', country: 'China' },
            'Hong Kong': { timezone: 'Asia/Hong_Kong', flag: '🇭🇰', country: 'Hong Kong' },
            'Singapore': { timezone: 'Asia/Singapore', flag: '🇸🇬', country: 'Singapore' },
            'Seoul': { timezone: 'Asia/Seoul', flag: '🇰🇷', country: 'South Korea' },
            'Mumbai': { timezone: 'Asia/Kolkata', flag: '🇮🇳', country: 'India' },
            'Delhi': { timezone: 'Asia/Kolkata', flag: '🇮🇳', country: 'India' },
            'Bangkok': { timezone: 'Asia/Bangkok', flag: '🇹🇭', country: 'Thailand' },
            'Manila': { timezone: 'Asia/Manila', flag: '🇵🇭', country: 'Philippines' },
            'Jakarta': { timezone: 'Asia/Jakarta', flag: '🇮🇩', country: 'Indonesia' },
            'Kuala Lumpur': { timezone: 'Asia/Kuala_Lumpur', flag: '🇲🇾', country: 'Malaysia' },
            'Dubai': { timezone: 'Asia/Dubai', flag: '🇦🇪', country: 'UAE' },
            'Abu Dhabi': { timezone: 'Asia/Dubai', flag: '🇦🇪', country: 'UAE' },
            'Riyadh': { timezone: 'Asia/Riyadh', flag: '🇸🇦', country: 'Saudi Arabia' },
            'Tel Aviv': { timezone: 'Asia/Jerusalem', flag: '🇮🇱', country: 'Israel' },
            'Tehran': { timezone: 'Asia/Tehran', flag: '🇮🇷', country: 'Iran' },
            'Baghdad': { timezone: 'Asia/Baghdad', flag: '🇮🇶', country: 'Iraq' },
            'Karachi': { timezone: 'Asia/Karachi', flag: '🇵🇰', country: 'Pakistan' },
            'Lahore': { timezone: 'Asia/Karachi', flag: '🇵🇰', country: 'Pakistan' },
            'Dhaka': { timezone: 'Asia/Dhaka', flag: '🇧🇩', country: 'Bangladesh' },
            'Colombo': { timezone: 'Asia/Colombo', flag: '🇱🇰', country: 'Sri Lanka' },
            'Kathmandu': { timezone: 'Asia/Kathmandu', flag: '🇳🇵', country: 'Nepal' },
            'Almaty': { timezone: 'Asia/Almaty', flag: '🇰🇿', country: 'Kazakhstan' },
            'Tashkent': { timezone: 'Asia/Tashkent', flag: '🇺🇿', country: 'Uzbekistan' },
            'Baku': { timezone: 'Asia/Baku', flag: '🇦🇿', country: 'Azerbaijan' },
            'Tbilisi': { timezone: 'Asia/Tbilisi', flag: '🇬🇪', country: 'Georgia' },
            'Yerevan': { timezone: 'Asia/Yerevan', flag: '🇦🇲', country: 'Armenia' },
            'Beirut': { timezone: 'Asia/Beirut', flag: '🇱🇧', country: 'Lebanon' },
            'Damascus': { timezone: 'Asia/Damascus', flag: '🇸🇾', country: 'Syria' },
            'Amman': { timezone: 'Asia/Amman', flag: '🇯🇴', country: 'Jordan' },
            'Kuwait': { timezone: 'Asia/Kuwait', flag: '🇰🇼', country: 'Kuwait' },
            'Doha': { timezone: 'Asia/Qatar', flag: '🇶🇦', country: 'Qatar' },
            'Manama': { timezone: 'Asia/Bahrain', flag: '🇧🇭', country: 'Bahrain' },
            'Muscat': { timezone: 'Asia/Muscat', flag: '🇴🇲', country: 'Oman' },
            
            // Africa
            'Cairo': { timezone: 'Africa/Cairo', flag: '🇪🇬', country: 'Egypt' },
            'Lagos': { timezone: 'Africa/Lagos', flag: '🇳🇬', country: 'Nigeria' },
            'Nairobi': { timezone: 'Africa/Nairobi', flag: '🇰🇪', country: 'Kenya' },
            'Cape Town': { timezone: 'Africa/Johannesburg', flag: '🇿🇦', country: 'South Africa' },
            'Johannesburg': { timezone: 'Africa/Johannesburg', flag: '🇿🇦', country: 'South Africa' },
            'Casablanca': { timezone: 'Africa/Casablanca', flag: '🇲🇦', country: 'Morocco' },
            'Tunis': { timezone: 'Africa/Tunis', flag: '🇹🇳', country: 'Tunisia' },
            'Algiers': { timezone: 'Africa/Algiers', flag: '🇩🇿', country: 'Algeria' },
            'Addis Ababa': { timezone: 'Africa/Addis_Ababa', flag: '🇪🇹', country: 'Ethiopia' },
            'Accra': { timezone: 'Africa/Accra', flag: '🇬🇭', country: 'Ghana' },
            'Dakar': { timezone: 'Africa/Dakar', flag: '🇸🇳', country: 'Senegal' },
            'Kinshasa': { timezone: 'Africa/Kinshasa', flag: '🇨🇩', country: 'DRC' },
            
            // Oceania
            'Sydney': { timezone: 'Australia/Sydney', flag: '🇦🇺', country: 'Australia' },
            'Melbourne': { timezone: 'Australia/Melbourne', flag: '🇦🇺', country: 'Australia' },
            'Brisbane': { timezone: 'Australia/Brisbane', flag: '🇦🇺', country: 'Australia' },
            'Perth': { timezone: 'Australia/Perth', flag: '🇦🇺', country: 'Australia' },
            'Adelaide': { timezone: 'Australia/Adelaide', flag: '🇦🇺', country: 'Australia' },
            'Auckland': { timezone: 'Pacific/Auckland', flag: '🇳🇿', country: 'New Zealand' },
            'Wellington': { timezone: 'Pacific/Auckland', flag: '🇳🇿', country: 'New Zealand' },
            'Fiji': { timezone: 'Pacific/Fiji', flag: '🇫🇯', country: 'Fiji' },
            'Honolulu': { timezone: 'Pacific/Honolulu', flag: '🇺🇸', country: 'Hawaii' },
            'Guam': { timezone: 'Pacific/Guam', flag: '🇬🇺', country: 'Guam' },
            
            // Additional Cities
            'Reykjavik': { timezone: 'Atlantic/Reykjavik', flag: '🇮🇸', country: 'Iceland' },
            'Greenland': { timezone: 'America/Godthab', flag: '🇬🇱', country: 'Greenland' },
            'Azores': { timezone: 'Atlantic/Azores', flag: '🇵🇹', country: 'Portugal' },
            'Canary Islands': { timezone: 'Atlantic/Canary', flag: '🇪🇸', country: 'Spain' },
            'Madeira': { timezone: 'Atlantic/Madeira', flag: '🇵🇹', country: 'Portugal' }
        };
        
        // Popular cities to show by default (like time.is) - Now editable!
        this.popularCities = ['Tokyo', 'Beijing', 'Paris', 'London', 'New York', 'Los Angeles'];
        
        // Clock style settings
        this.clockStyle = 'digital'; // 'digital', 'analog', 'both'
        this.timeFormat = '24h'; // '12h', '24h'
        
        // Search suggestions
        this.searchSuggestions = [];
        this.isSearching = false;
        this.isEditingPopular = false;
        this.clockStyle = 'digital'; // Initialize clock style
        this.timeFormat = '24h'; // Initialize time format
        this.currentPrimaryCity = 'Local Time';
        this.currentPrimaryTimezone = this.userTimezone;
        this.activeSection = 'popular';
        this.locationPickerOpen = false;
    }
    
    // Auto-detect user location using open-source APIs
    async detectUserLocation() {
        try {
            console.log('🌍 Detecting location using open-source APIs...');
            
            // Try ip-api.com first (free, no key required)
            try {
                const response = await fetch(this.apis.location.ipapi);
                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'success' && data.timezone) {
                        console.log(`📍 Location detected: ${data.city}, ${data.country} (${data.timezone})`);
                        return {
                            city: data.city,
                            country: data.country,
                            timezone: data.timezone,
                            countryCode: data.countryCode
                        };
                    }
                }
            } catch (error) {
                console.warn('⚠️ ip-api.com failed, trying backup...');
            }
            
            // Fallback to ipinfo.io
            try {
                const response = await fetch(this.apis.location.ipinfo);
                if (response.ok) {
                    const data = await response.json();
                    if (data.timezone) {
                        console.log(`📍 Location detected: ${data.city}, ${data.country} (${data.timezone})`);
                        return {
                            city: data.city,
                            country: data.country,
                            timezone: data.timezone,
                            countryCode: data.country
                        };
                    }
                }
            } catch (error) {
                console.warn('⚠️ ipinfo.io failed, using browser timezone');
            }
            
            // Ultimate fallback: browser timezone
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            console.log(`🌐 Using browser timezone: ${timezone}`);
            return { timezone, city: 'Local Time', country: 'Local' };
            
        } catch (error) {
            console.error('❌ Location detection failed:', error);
            return { timezone: this.userTimezone, city: 'Local Time', country: 'Local' };
        }
    }
    
    // Get accurate time using WorldTimeAPI (open source)
    async getAccurateTime(timezone) {
        try {
            const response = await fetch(`${this.apis.time.worldtime}${timezone}`);
            if (response.ok) {
                const data = await response.json();
                return new Date(data.datetime);
            }
        } catch (error) {
            console.warn('⚠️ WorldTimeAPI unavailable, using browser time');
        }
        
        // Fallback to browser time with timezone
        return new Date();
    }
    
    async init() {
        try {
            console.log('🕐 Initializing Enhanced Timely with Open Source APIs...');
            
            // Initialize theme from localStorage
            this.initializeTheme();
            
            // Auto-detect user location
            const location = await this.detectUserLocation();
            if (location.city !== 'Local Time') {
                this.userTimezone = location.timezone;
                console.log(`🎯 Auto-detected timezone: ${location.timezone}`);
            }
            
            // Start primary clock
            this.updatePrimaryTime();
            
            // Initialize digital clock
            this.updateDigitalClock();
            
            // Show popular cities
            this.renderPopularCities();
            
            // Initialize enhanced search
            this.initializeSearch();
            
            // Initialize modern interface
            this.initializeModernInterface();
            
            // Start update interval
            this.updateInterval = setInterval(() => {
                this.updatePrimaryTime();
                this.updateDigitalClock();
                this.updatePopularCities();
                this.updateWorldCities();
            }, 1000);
            
            console.log('✅ Enhanced Timely initialized with open-source APIs!');
            
        } catch (error) {
            console.error('❌ Failed to initialize:', error);
        }
    }
    
    updatePrimaryTime() {
        try {
            // Use current primary location instead of user timezone
            const displayTimezone = this.currentPrimaryTimezone || this.userTimezone;
            const displayCity = this.currentPrimaryCity || this.getCityFromTimezone(this.userTimezone);
            
            const timeEl = document.getElementById('primaryTime');
            const dateEl = document.getElementById('primaryDate');
            const locationTitleEl = document.getElementById('locationTitle');
            const locationSubtitleEl = document.getElementById('locationSubtitle');
            const sunTimesEl = document.getElementById('sunInfo');
            
            if (timeEl) {
                const time = this.getTimeForTimezone(displayTimezone);
                timeEl.textContent = time;
            }
            
            if (dateEl) {
                const date = this.getDateForTimezone(displayTimezone);
                const weekNumber = this.getWeekNumber(new Date());
                dateEl.textContent = `${date}, week ${weekNumber}`;
            }
            
            if (locationTitleEl) {
                locationTitleEl.textContent = `Time in ${displayCity} now`;
            }
            
            if (locationSubtitleEl) {
                locationSubtitleEl.textContent = this.getTimezoneInfo(displayTimezone);
            }
            
            if (sunTimesEl) {
                // Calculate approximate sunrise/sunset (simplified)
                const sunrise = "06:30";
                const sunset = "18:45";
                const dayLength = "12h 15m";
                sunTimesEl.textContent = `↑ ${sunrise} ↓ ${sunset} (${dayLength})`;
            }
            
            // Update time difference grid with current primary timezone
            this.updateTimeDifferenceGrid();
            
            // Update country information
            this.updateCountryInfo();
            
            // Update city tiles if they exist
            if (this.activeSection === 'popular') {
                this.updateCityTiles();
            }
            
        } catch (error) {
            console.error('Failed to update primary time:', error);
        }
    }
    
    updateCityTiles() {
        const grid = document.getElementById('citiesGrid');
        if (!grid) return;
        
        const timeElements = grid.querySelectorAll('.city-time');
        const dateElements = grid.querySelectorAll('.city-date');
        
        Array.from(this.addedCities).forEach((cityName, index) => {
            const city = this.countryTimezones[cityName];
            if (city && timeElements[index] && dateElements[index]) {
                timeElements[index].textContent = this.getTimeForTimezone(city.timezone);
                dateElements[index].textContent = this.getDateForTimezone(city.timezone);
            }
        });
    }
    
    // Digital Clock Methods
    updateDigitalClock() {
        try {
            const displayTimezone = this.currentPrimaryTimezone || this.userTimezone;
            const displayCity = this.currentPrimaryCity || this.getCityFromTimezone(this.userTimezone);
            
            const digitalTimeEl = document.getElementById('digitalTime');
            const digitalDateEl = document.getElementById('digitalDate');
            const digitalLocationEl = document.getElementById('digitalClockLocation');
            const digitalTimezoneEl = document.getElementById('digitalTimezone');
            
            if (digitalTimeEl) {
                const time = this.getTimeForTimezone(displayTimezone);
                digitalTimeEl.textContent = time;
            }
            
            if (digitalDateEl) {
                const date = new Date().toLocaleDateString('en-US', {
                    timeZone: displayTimezone,
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                digitalDateEl.textContent = date;
            }
            
            if (digitalLocationEl) {
                digitalLocationEl.textContent = displayCity;
            }
            
            if (digitalTimezoneEl) {
                const timezoneInfo = this.getTimezoneInfo(displayTimezone);
                digitalTimezoneEl.textContent = timezoneInfo;
            }
        } catch (error) {
            console.error('Failed to update digital clock:', error);
        }
    }
    
    // Theme Toggle Methods
    initializeTheme() {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('timely-theme') || 'light';
        this.currentTheme = savedTheme;
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            this.updateThemeIcon();
        }
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        
        if (this.currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Save theme preference
        localStorage.setItem('timely-theme', this.currentTheme);
        
        // Update theme icon
        this.updateThemeIcon();
    }
    
    updateThemeIcon() {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
        }
    }
    
    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }
    
    updateTimeDifferenceGrid() {
        const gridEl = document.getElementById('timeDiffGrid');
        if (!gridEl) return;
        
        const popularCitiesForDiff = [
            'Los Angeles', 'Chicago', 'New York', 'Toronto', 'London', 
            'Paris', 'Dubai', 'Mumbai', 'Shanghai', 'Tokyo', 'Sydney'
        ];
        
        const html = popularCitiesForDiff.map(cityName => {
            const city = this.countryTimezones[cityName];
            if (!city) return '';
            
            const time = this.getTimeForTimezone(city.timezone);
            const timeDiff = this.calculateTimeDifference(city.timezone);
            
            // Format the time difference nicely
            let diffDisplay = timeDiff;
            if (timeDiff === "0") {
                diffDisplay = "Same time";
            } else if (timeDiff.startsWith("+")) {
                diffDisplay = `${timeDiff} hours ahead`;
            } else if (timeDiff.startsWith("-")) {
                diffDisplay = `${Math.abs(parseInt(timeDiff))} hours behind`;
            }
            
            return `
                <div class="time-diff-item">
                    <span class="diff-city">${city.flag} ${cityName}</span>
                    <span class="diff-time">${diffDisplay}</span>
                </div>
            `;
        }).join('');
        
        gridEl.innerHTML = html;
    }
    
    calculateTimeDifference(targetTimezone) {
        try {
            const now = new Date();
            const userTime = new Date(now.toLocaleString("en-US", {timeZone: this.currentPrimaryTimezone || this.userTimezone}));
            const targetTime = new Date(now.toLocaleString("en-US", {timeZone: targetTimezone}));
            
            const diffMs = targetTime.getTime() - userTime.getTime();
            const diffHours = Math.round(diffMs / (1000 * 60 * 60));
            
            if (diffHours === 0) {
                return "0";
            } else if (diffHours > 0) {
                return `+${diffHours}`;
            } else {
                return `${diffHours}`; // Already has minus sign
            }
        } catch (error) {
            console.warn('Error calculating time difference:', error);
            return "−";
        }
    }
    
    updateCountryInfo() {
        const sectionEl = document.getElementById('countryInfoSection');
        if (!sectionEl) return;
        
        const cityName = this.getCityFromTimezone(this.currentPrimaryTimezone || this.userTimezone);
        const countryData = this.getCountryDataForCity(cityName);
        
        if (!countryData) {
            sectionEl.style.display = 'none';
            return;
        }
        
        const utcOffset = this.getUTCOffset(this.currentPrimaryTimezone || this.userTimezone);
        
        sectionEl.style.display = 'block';
        sectionEl.innerHTML = `
            <h2>Time zone info for ${cityName}</h2>
            <div class="country-details">
                <div class="country-detail-item">
                    <span class="detail-label">UTC</span>
                    <span class="detail-value">${utcOffset}</span>
                </div>
                <div class="country-detail-item">
                    <span class="detail-label">Time Zone</span>
                    <span class="detail-value">${this.currentPrimaryTimezone || this.userTimezone}</span>
                </div>
                <div class="country-detail-item">
                    <span class="detail-label">Country</span>
                    <span class="detail-value">${countryData.flag} ${countryData.country}</span>
                </div>
                <div class="country-detail-item">
                    <span class="detail-label">Continent</span>
                    <span class="detail-value">${this.getContinentFromTimezone(this.currentPrimaryTimezone || this.userTimezone)}</span>
                </div>
            </div>
        `;
    }
    
    getCountryDataForCity(cityName) {
        return this.countryTimezones[cityName] || null;
    }
    
    getUTCOffset(timezone) {
        try {
            const now = new Date();
            const utcTime = new Date(now.toLocaleString("en-US", {timeZone: "UTC"}));
            const localTime = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
            
            // Calculate offset in milliseconds and convert to hours
            const offsetMs = localTime.getTime() - utcTime.getTime();
            const offsetHours = Math.round(offsetMs / (1000 * 60 * 60));
            
            // Return clean digit format with plus/minus signs
            if (offsetHours === 0) {
                return "0";
            } else if (offsetHours > 0) {
                return `+${offsetHours}`;
            } else {
                return `${offsetHours}`; // Already has minus sign
            }
        } catch (error) {
            console.warn('Error calculating UTC offset:', error);
            return "0";
        }
    }
    
    getContinentFromTimezone(timezone) {
        const continent = timezone.split('/')[0];
        const continentMap = {
            'America': 'North America',
            'Europe': 'Europe',
            'Asia': 'Asia',
            'Africa': 'Africa',
            'Australia': 'Australia',
            'Pacific': 'Pacific',
            'Atlantic': 'Atlantic',
            'Indian': 'Indian Ocean'
        };
        return continentMap[continent] || continent;
    }
    
    updateTimezoneDetails() {
        const detailsEl = document.getElementById('timezoneDetails');
        if (!detailsEl) return;
        
        try {
            const now = new Date();
            const offset = -now.getTimezoneOffset() / 60;
            const offsetStr = offset >= 0 ? `+${offset}` : `${offset}`;
            
            detailsEl.innerHTML = `
                <span class="sun-info">🌍 ${offsetStr} - ${this.userTimezone}</span>
            `;
        } catch (error) {
            console.error('Failed to update timezone details:', error);
        }
    }
    
    renderPopularCities() {
        const container = document.getElementById('popularCities');
        if (!container) return;
        
        const citiesHTML = this.popularCities.map(cityName => {
            const city = this.countryTimezones[cityName];
            if (!city) return '';
            
            const time = this.getTimeForTimezone(city.timezone);
            
            return `
                <a href="#" class="popular-city" onclick="event.preventDefault(); window.timelyApp.addCityToGrid('${cityName}')">
                    <span class="city-flag">${city.flag}</span>
                    <span class="city-name">${cityName}</span>
                    <span class="city-time">${time}</span>
                </a>
            `;
        }).join('');
        
        container.innerHTML = `
            <div class="popular-cities-list">
                ${citiesHTML}
            </div>
        `;
    }
    
    updatePopularCities() {
        const container = document.getElementById('popularCities');
        if (!container) return;
        
        const timeElements = container.querySelectorAll('.city-time');
        timeElements.forEach((el, index) => {
            if (index < this.popularCities.length) {
                const cityName = this.popularCities[index];
                const city = this.countryTimezones[cityName];
                if (city) {
                    el.textContent = this.getTimeForTimezone(city.timezone);
                }
            }
        });
    }
    
    addCityToGrid(cityName) {
        if (this.addedCities.has(cityName)) {
            console.log(`${cityName} already added`);
            return;
        }
        
        const city = this.findCityByName(cityName);
        if (!city) {
            this.showSearchSuggestions(cityName);
            return;
        }
        
        this.addedCities.add(cityName);
        this.renderWorldClockCards(); // Use new card interface
        
        // Clear search input and hide suggestions
        const searchInput = document.getElementById('citySearchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        this.hideCitySearchSuggestions();
    }
    
    showSearchSuggestions(searchTerm) {
        const suggestions = this.getSearchSuggestions(searchTerm);
        if (suggestions.length > 0) {
            this.displaySuggestions(suggestions);
        } else {
            alert(`City "${searchTerm}" not found. Try cities like: Tokyo, London, New York, Paris, Mumbai, Jamaica, etc.`);
        }
    }
    
    getSearchSuggestions(searchTerm) {
        const normalizedSearch = searchTerm.toLowerCase().trim();
        const suggestions = [];
        
        for (const [cityName, cityData] of Object.entries(this.countryTimezones)) {
            if (cityName.toLowerCase().includes(normalizedSearch) || 
                cityData.country.toLowerCase().includes(normalizedSearch)) {
                suggestions.push({ name: cityName, ...cityData });
            }
            if (suggestions.length >= 8) break; // Limit suggestions
        }
        
        return suggestions;
    }
    
    displaySuggestions(suggestions) {
        // Remove existing suggestions
        this.hideSuggestions();
        
        const searchContainer = document.querySelector('.simple-search-container');
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'search-suggestions';
        suggestionsDiv.innerHTML = suggestions.map(city => 
            `<div class="suggestion-item" onclick="window.timelyApp.addCityToGrid('${city.name}')">
                <span class="suggestion-flag">${city.flag}</span>
                <span class="suggestion-name">${city.name}</span>
                <span class="suggestion-country">${city.country}</span>
            </div>`
        ).join('');
        
        searchContainer.appendChild(suggestionsDiv);
    }
    
    hideSuggestions() {
        const suggestions = document.querySelector('.search-suggestions');
        if (suggestions) {
            suggestions.remove();
        }
    }
    
    initializeSearch() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;
        
        // Enhanced search with real-time suggestions
        searchInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            if (value.length >= 2) {
                const suggestions = this.getSearchSuggestions(value);
                if (suggestions.length > 0) {
                    this.displaySuggestions(suggestions);
                } else {
                    this.hideSuggestions();
                }
            } else {
                this.hideSuggestions();
            }
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.simple-search-container')) {
                this.hideSuggestions();
            }
        });
    }
    
    // Modern Interface Methods
    initializeModernInterface() {
        this.renderWorldClockCards();
        this.initializeLocationPicker();
        this.initializeCitySearch();
        this.populateDefaultCities();
    }
    
    populateDefaultCities() {
        // Add some default popular cities
        const defaultCities = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Dubai'];
        defaultCities.forEach(city => {
            if (!this.addedCities.has(city)) {
                this.addedCities.add(city);
            }
        });
        this.renderWorldClockCards();
    }
    
    renderWorldClockCards() {
        const container = document.getElementById('worldClockCards');
        if (!container) return;
        
        const citiesToShow = Array.from(this.addedCities);
        
        if (citiesToShow.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🌍</div>
                    <h3>No cities added yet</h3>
                    <p>Add your first city to start tracking world times!</p>
                    <button class="action-btn primary" onclick="window.timelyApp.openCitySearch()">
                        <span class="btn-icon">+</span>
                        Add Your First City
                    </button>
                </div>
            `;
            return;
        }
        
        const html = citiesToShow.map(cityName => {
            const city = this.countryTimezones[cityName];
            if (!city) return '';
            
            const time = this.getTimeForTimezone(city.timezone);
            const date = this.getDateForTimezone(city.timezone);
            const utcOffset = this.getUTCOffset(city.timezone);
            
            return `
                <div class="clock-card">
                    <div class="card-header">
                        <div class="city-info">
                            <span class="city-flag">${city.flag}</span>
                            <div class="city-details">
                                <h3>${cityName}</h3>
                                <p>${city.country}</p>
                            </div>
                        </div>
                        <div class="card-actions">
                            <button class="icon-btn" onclick="window.timelyApp.setPrimaryLocation('${cityName}', '${city.timezone}')" title="Set as primary">
                                🏠
                            </button>
                            <button class="icon-btn" onclick="window.timelyApp.showCityCountryDetails('${cityName}')" title="Country details">
                                ℹ️
                            </button>
                            <button class="icon-btn" onclick="window.timelyApp.removeCityFromGrid('${cityName}')" title="Remove">
                                ×
                            </button>
                        </div>
                    </div>
                    <div class="time-display">
                        <div class="current-time">${time}</div>
                        <div class="current-date">${date}</div>
                        <div class="timezone-info">UTC${utcOffset}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
    }
    
    openCitySearch() {
        const searchSection = document.getElementById('searchSection');
        if (searchSection) {
            searchSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                document.getElementById('citySearchInput')?.focus();
            }, 500);
        }
    }
    
    performSearch() {
        const input = document.getElementById('citySearchInput');
        if (input && input.value.trim()) {
            this.addCityToGrid(input.value.trim());
            input.value = '';
            this.hideCitySearchSuggestions();
        }
    }
    
    showCountryDetails() {
        // Show country details for the primary location
        const cityName = this.currentPrimaryCity || 'New York';
        this.showCityCountryDetails(cityName);
    }
    
    showCityCountryDetails(cityName) {
        const city = this.countryTimezones[cityName];
        if (!city) return;
        
        // Hide main content and show country details page
        const mainSections = document.querySelectorAll('.world-clocks-section, .features-section');
        mainSections.forEach(section => section.style.display = 'none');
        
        const countryPage = document.getElementById('countryDetailsPage');
        if (countryPage) {
            countryPage.style.display = 'block';
            this.populateCountryDetails(cityName, city);
        }
    }
    
    hideCountryDetails() {
        // Show main content and hide country details page
        const mainSections = document.querySelectorAll('.world-clocks-section, .features-section');
        mainSections.forEach(section => section.style.display = 'block');
        
        const countryPage = document.getElementById('countryDetailsPage');
        if (countryPage) {
            countryPage.style.display = 'none';
        }
    }
    
    populateCountryDetails(cityName, city) {
        const pageTitle = document.getElementById('countryPageTitle');
        const infoCard = document.getElementById('countryInfoCard');
        const showcase = document.getElementById('citiesShowcase');
        
        if (pageTitle) {
            pageTitle.textContent = `${city.country} - Time Zone Details`;
        }
        
        if (infoCard) {
            const currentTime = this.getTimeForTimezone(city.timezone);
            const utcOffset = this.getUTCOffset(city.timezone);
            const continent = this.getContinentFromTimezone(city.timezone);
            
            infoCard.innerHTML = `
                <div class="country-flag-display">${city.flag}</div>
                <h2 style="text-align: center; margin: 0 0 20px 0; font-size: 2.5rem;">${city.country}</h2>
                <p style="text-align: center; font-size: 1.2rem; opacity: 0.9; margin-bottom: 30px;">
                    Current time in ${cityName}: ${currentTime}
                </p>
                <div class="country-stats">
                    <div class="stat-item">
                        <div class="stat-value">UTC${utcOffset}</div>
                        <div class="stat-label">Time Zone Offset</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${continent}</div>
                        <div class="stat-label">Continent</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${city.timezone}</div>
                        <div class="stat-label">IANA Time Zone</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${cityName}</div>
                        <div class="stat-label">Reference City</div>
                    </div>
                </div>
            `;
        }
        
        if (showcase) {
            this.populateCitiesShowcase(city.country);
        }
    }
    
    populateCitiesShowcase(countryName) {
        const showcase = document.getElementById('citiesShowcase');
        if (!showcase) return;
        
        // Get all cities for this country
        const countryCities = Object.keys(this.countryTimezones).filter(cityName => 
            this.countryTimezones[cityName].country === countryName
        );
        
        // Predefined city lists for popular countries
        const cityLists = {
            'United States': [
                'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 
                'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
                'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle',
                'Denver', 'Washington DC', 'Boston', 'El Paso', 'Nashville', 'Detroit', 'Miami'
            ],
            'Jamaica': [
                'Kingston', 'Spanish Town', 'Portmore', 'Montego Bay', 'May Pen', 'Mandeville',
                'Old Harbour', 'Savanna-la-Mar', 'Ocho Rios', 'Port Antonio', 'Linstead',
                'Half Way Tree', 'Saint Ann\'s Bay', 'Constant Spring', 'Port Maria', 'Yallahs',
                'Bog Walk', 'Bull Savannah', 'Ewarton', 'Falmouth', 'Hayes', 'Morant Bay',
                'Old Harbour Bay', 'Santa Cruz', 'Stony Hill'
            ],
            'United Kingdom': [
                'London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Sheffield',
                'Edinburgh', 'Bristol', 'Cardiff', 'Leicester', 'Coventry', 'Bradford', 'Belfast',
                'Nottingham', 'Hull', 'Newcastle', 'Stoke-on-Trent', 'Southampton', 'Derby',
                'Portsmouth', 'Brighton', 'Plymouth', 'Northampton', 'Reading', 'Luton'
            ],
            'Canada': [
                'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Mississauga',
                'Winnipeg', 'Quebec City', 'Hamilton', 'Brampton', 'Surrey', 'Laval', 'Halifax',
                'London', 'Markham', 'Vaughan', 'Gatineau', 'Longueuil', 'Burnaby', 'Saskatoon',
                'Kitchener', 'Windsor', 'Regina', 'Richmond', 'Richmond Hill'
            ],
            'Australia': [
                'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle',
                'Canberra', 'Sunshine Coast', 'Wollongong', 'Geelong', 'Hobart', 'Townsville',
                'Cairns', 'Darwin', 'Toowoomba', 'Ballarat', 'Bendigo', 'Albury', 'Launceston',
                'Mackay', 'Rockhampton', 'Bunbury', 'Bundaberg', 'Coffs Harbour'
            ]
        };
        
        const citiesToShow = cityLists[countryName] || countryCities;
        
        if (citiesToShow.length === 0) {
            showcase.innerHTML = `
                <div class="cities-title">Cities in ${countryName}</div>
                <div class="cities-cloud">
                    <p style="text-align: center; color: #666; font-size: 1.1rem;">
                        No additional cities available for this country.
                    </p>
                </div>
            `;
            return;
        }
        
        const shuffledCities = [...citiesToShow].sort(() => Math.random() - 0.5);
        
        showcase.innerHTML = `
            <div class="cities-title">The ${shuffledCities.length} largest cities in<br><strong>${countryName}</strong></div>
            <div class="cities-cloud">
                ${shuffledCities.map(cityName => 
                    `<span class="city-bubble" onclick="window.timelyApp.addCityFromCountryPage('${cityName}')">${cityName}</span>`
                ).join(' ')}
            </div>
        `;
    }
    
    addCityFromCountryPage(cityName) {
        // Add city to the world clock if it exists in our database
        if (this.countryTimezones[cityName]) {
            this.addCityToGrid(cityName);
            // Show success feedback
            const bubble = event.target;
            const originalText = bubble.textContent;
            bubble.textContent = '✓ Added!';
            bubble.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
            bubble.style.color = 'white';
            
            setTimeout(() => {
                bubble.textContent = originalText;
                bubble.style.background = '';
                bubble.style.color = '';
            }, 2000);
        } else {
            // Show that this city is not available in our time zone database
            const bubble = event.target;
            const originalText = bubble.textContent;
            bubble.textContent = 'Not available';
            bubble.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            bubble.style.color = 'white';
            
            setTimeout(() => {
                bubble.textContent = originalText;
                bubble.style.background = '';
                bubble.style.color = '';
            }, 2000);
        }
    }
    
    toggleLocationPicker() {
        this.locationPickerOpen = !this.locationPickerOpen;
        const overlay = document.getElementById('locationPickerOverlay');
        
        if (this.locationPickerOpen) {
            overlay.classList.add('active');
            this.populateLocationPicker();
            // Focus search input
            setTimeout(() => {
                document.getElementById('locationSearchInput').focus();
            }, 300);
        } else {
            overlay.classList.remove('active');
        }
    }
    
    populateLocationPicker() {
        const grid = document.getElementById('locationGrid');
        const popularCities = [
            'New York', 'London', 'Tokyo', 'Sydney', 'Dubai', 'Los Angeles',
            'Paris', 'Singapore', 'Hong Kong', 'Mumbai', 'São Paulo', 'Toronto'
        ];
        
        const html = popularCities.map(cityName => {
            const city = this.countryTimezones[cityName];
            if (!city) return '';
            
            return `
                <div class="location-item" onclick="window.timelyApp.setPrimaryLocation('${cityName}', '${city.timezone}')">
                    <span class="flag">${city.flag}</span>
                    <span class="city-name">${cityName}</span>
                </div>
            `;
        }).join('');
        
        grid.innerHTML = html;
    }
    
    setPrimaryLocation(cityName, timezone) {
        this.currentPrimaryCity = cityName;
        this.currentPrimaryTimezone = timezone;
        
        // Update the main clock display
        const titleEl = document.getElementById('locationTitle');
        const subtitleEl = document.getElementById('locationSubtitle');
        
        if (titleEl) titleEl.textContent = `Time in ${cityName} now`;
        if (subtitleEl) subtitleEl.textContent = this.getTimezoneInfo(timezone);
        
        // Close the picker
        this.toggleLocationPicker();
        
        // Update the giant clock immediately
        this.updatePrimaryTimeForLocation();
    }
    
    updatePrimaryTimeForLocation() {
        const timeEl = document.getElementById('primaryTime');
        const dateEl = document.getElementById('primaryDate');
        const sunTimesEl = document.getElementById('sunInfo');
        
        if (timeEl) {
            const time = this.getTimeForTimezone(this.currentPrimaryTimezone);
            timeEl.textContent = time;
        }
        
        if (dateEl) {
            const date = this.getDateForTimezone(this.currentPrimaryTimezone);
            const weekNumber = this.getWeekNumber(new Date());
            dateEl.textContent = `${date}, week ${weekNumber}`;
        }
        
        if (sunTimesEl) {
            // Simple sunrise/sunset calculation
            const sunrise = "06:30";
            const sunset = "18:45";
            const dayLength = "12h 15m";
            sunTimesEl.textContent = `↑ ${sunrise} ↓ ${sunset} (${dayLength})`;
        }
    }
    
    showSection(sectionName) {
        this.activeSection = sectionName;
        
        // Update tile states
        document.querySelectorAll('.quick-tile').forEach(tile => {
            tile.classList.remove('active');
        });
        
        // Update content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        if (sectionName === 'popular') {
            document.querySelector('.popular-tile')?.classList.add('active');
            document.getElementById('popularSection')?.classList.add('active');
            this.renderCityTiles();
        } else if (sectionName === 'add') {
            document.querySelector('.add-tile')?.classList.add('active');
            document.getElementById('addCitySection')?.classList.add('active');
        } else if (sectionName === 'business') {
            document.querySelector('.business-tile')?.classList.add('active');
            document.getElementById('businessSection')?.classList.add('active');
            this.renderBusinessHours();
        } else if (sectionName === 'timezone') {
            document.querySelector('.timezone-tile')?.classList.add('active');
            document.getElementById('timezoneSection')?.classList.add('active');
            this.renderTimezoneOverview();
        }
    }
    
    openCitySearch() {
        this.showSection('add');
        setTimeout(() => {
            document.getElementById('citySearchInput')?.focus();
        }, 100);
    }
    
    showPopularCities() {
        this.showSection('popular');
    }
    
    showBusinessHours() {
        this.showSection('business');
    }
    
    showTimezoneMap() {
        this.showSection('timezone');
    }
    
    renderCityTiles() {
        const grid = document.getElementById('citiesGrid');
        if (!grid) return;
        
        const citiesToShow = Array.from(this.addedCities).slice(0, 8); // Show max 8 tiles
        
        if (citiesToShow.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🌍</div>
                    <h3>No cities added yet</h3>
                    <p>Add your first city to get started!</p>
                    <button class="action-btn primary" onclick="window.timelyApp.openCitySearch()">Add City</button>
                </div>
            `;
            return;
        }
        
        const html = citiesToShow.map(cityName => {
            const city = this.countryTimezones[cityName];
            if (!city) return '';
            
            const time = this.getTimeForTimezone(city.timezone);
            const date = this.getDateForTimezone(city.timezone);
            
            return `
                <div class="city-tile">
                    <div class="city-tile-header">
                        <span class="city-flag">${city.flag}</span>
                        <div class="city-info">
                            <h3>${cityName}</h3>
                            <p>${city.country}</p>
                        </div>
                    </div>
                    <div class="city-time-display">
                        <div class="city-time">${time}</div>
                        <div class="city-date">${date}</div>
                    </div>
                    <div class="city-actions">
                        <button class="action-btn primary" onclick="window.timelyApp.setPrimaryLocation('${cityName}', '${city.timezone}')">
                            Set Primary
                        </button>
                        <button class="action-btn" onclick="window.timelyApp.removeCityFromGrid('${cityName}')">
                            Remove
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        grid.innerHTML = html;
    }
    
    renderBusinessHours() {
        const grid = document.getElementById('businessGrid');
        if (!grid) return;
        
        const businessCities = ['New York', 'London', 'Tokyo', 'Sydney', 'Dubai', 'Singapore'];
        
        const html = businessCities.map(cityName => {
            const city = this.countryTimezones[cityName];
            if (!city) return '';
            
            const time = this.getTimeForTimezone(city.timezone);
            const hour = parseInt(time.split(':')[0]);
            const isBusinessHours = hour >= 9 && hour <= 17;
            
            return `
                <div class="business-card">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <span style="font-size: 1.5rem;">${city.flag}</span>
                        <strong>${cityName}</strong>
                    </div>
                    <div style="font-size: 1.2rem; margin: 10px 0;">${time}</div>
                    <span class="business-status ${isBusinessHours ? 'open' : 'closed'}">
                        ${isBusinessHours ? '🟢 Business Hours' : '🔴 After Hours'}
                    </span>
                </div>
            `;
        }).join('');
        
        grid.innerHTML = html;
    }
    
    renderTimezoneOverview() {
        const overview = document.getElementById('timezoneOverview');
        if (!overview) return;
        
        const timezones = [
            { name: 'Pacific Time', offset: '-8', cities: ['Los Angeles', 'Seattle'] },
            { name: 'Mountain Time', offset: '-7', cities: ['Denver', 'Phoenix'] },
            { name: 'Central Time', offset: '-6', cities: ['Chicago', 'Dallas'] },
            { name: 'Eastern Time', offset: '-5', cities: ['New York', 'Miami'] },
            { name: 'Greenwich Mean Time', offset: '0', cities: ['London', 'Dublin'] },
            { name: 'Central European Time', offset: '+1', cities: ['Paris', 'Berlin'] },
            { name: 'Eastern European Time', offset: '+2', cities: ['Cairo', 'Helsinki'] },
            { name: 'Moscow Time', offset: '+3', cities: ['Moscow', 'Istanbul'] },
            { name: 'Gulf Standard Time', offset: '+4', cities: ['Dubai', 'Abu Dhabi'] },
            { name: 'India Standard Time', offset: '+5', cities: ['Mumbai', 'Delhi'] },
            { name: 'China Standard Time', offset: '+8', cities: ['Beijing', 'Shanghai'] },
            { name: 'Japan Standard Time', offset: '+9', cities: ['Tokyo', 'Osaka'] },
            { name: 'Australian Eastern Time', offset: '+10', cities: ['Sydney', 'Melbourne'] }
        ];
        
        const html = timezones.map(tz => `
            <div class="timezone-card">
                <div class="timezone-offset">${tz.offset}</div>
                <div class="timezone-name">${tz.name}</div>
                <div style="margin-top: 10px; color: #888; font-size: 0.8rem;">
                    ${tz.cities.join(', ')}
                </div>
            </div>
        `).join('');
        
        overview.innerHTML = html;
    }
    
    initializeLocationPicker() {
        const searchInput = document.getElementById('locationSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterLocationPicker(e.target.value);
            });
        }
    }
    
    filterLocationPicker(query) {
        const grid = document.getElementById('locationGrid');
        const items = grid.querySelectorAll('.location-item');
        
        items.forEach(item => {
            const cityName = item.querySelector('.city-name').textContent.toLowerCase();
            if (cityName.includes(query.toLowerCase())) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    initializeCitySearch() {
        const searchInput = document.getElementById('citySearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleCitySearch(e.target.value);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = e.target.value.trim();
                    if (query) {
                        this.addCityToGrid(query);
                        e.target.value = '';
                        this.hideCitySearchSuggestions();
                    }
                }
            });
        }
    }
    
    handleCitySearch(query) {
        if (query.length < 2) {
            this.hideCitySearchSuggestions();
            return;
        }
        
        const suggestions = Object.keys(this.countryTimezones)
            .filter(city => city.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 8);
        
        this.showCitySearchSuggestions(suggestions);
    }
    
    showCitySearchSuggestions(suggestions) {
        const container = document.getElementById('searchSuggestions');
        if (!container) return;
        
        if (suggestions.length === 0) {
            container.classList.remove('active');
            return;
        }
        
        const html = suggestions.map(cityName => {
            const city = this.countryTimezones[cityName];
            return `
                <div class="suggestion-item" onclick="window.timelyApp.selectCityFromSuggestion('${cityName}')">
                    <span style="font-size: 1.2rem;">${city.flag}</span>
                    <div>
                        <strong>${cityName}</strong>
                        <div style="font-size: 0.8rem; color: #666;">${city.country}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
        container.classList.add('active');
    }
    
    hideCitySearchSuggestions() {
        const container = document.getElementById('searchSuggestions');
        if (container) {
            container.classList.remove('active');
        }
    }
    
    selectCityFromSuggestion(cityName) {
        this.addCityToGrid(cityName);
        document.getElementById('citySearchInput').value = '';
        this.hideCitySearchSuggestions();
    }
    
    // Feature card methods (placeholders for future implementation)
    openWorldMap() {
        alert('🌍 World Map feature coming soon!');
    }
    
    openMeetingPlanner() {
        alert('📅 Meeting Planner feature coming soon!');
    }
    
    openConverter() {
        alert('🔄 Time Converter feature coming soon!');
    }
    
    removeCityFromGrid(cityName) {
        this.addedCities.delete(cityName);
        this.renderWorldClockCards(); // Use new card interface
    }
    
    renderWorldCities() {
        const container = document.getElementById('worldCitiesGrid');
        if (!container) return;
        
        if (this.addedCities.size === 0) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = Array.from(this.addedCities).map(cityName => {
            const city = this.countryTimezones[cityName];
            if (!city) return '';
            
            const now = new Date();
            const time = this.getTimeForTimezone(city.timezone);
            const date = this.getDateForTimezone(city.timezone);
            
            let clockDisplay = '';
            
            if (this.clockStyle === 'digital' || this.clockStyle === 'both') {
                clockDisplay += `<div class="digital-time">${time}</div>`;
            }
            
            if (this.clockStyle === 'analog' || this.clockStyle === 'both') {
                clockDisplay += this.generateAnalogClock(city.timezone);
            }
            
            return `
                <div class="world-city-item ${this.clockStyle}">
                    <span class="flag">${city.flag}</span>
                    <div class="city-name">${cityName}</div>
                    <div class="clock-container">
                        ${clockDisplay}
                    </div>
                    <div class="city-date">${date}</div>
                    <div class="city-timezone">${this.getTimezoneInfo(city.timezone)}</div>
                    <button class="remove-btn" onclick="window.timelyApp.removeCityFromGrid('${cityName}')">×</button>
                </div>
            `;
        }).join('');
    }
    
    updateWorldCities() {
        // Update the modern clock cards
        this.updateWorldClockCards();
        
        // Legacy support for old interface
        const container = document.getElementById('worldCitiesGrid');
        if (!container) return;
        
        const digitalTimeElements = container.querySelectorAll('.digital-time');
        const dateElements = container.querySelectorAll('.city-date');
        
        Array.from(this.addedCities).forEach((cityName, index) => {
            const city = this.countryTimezones[cityName];
            if (city) {
                if (digitalTimeElements[index]) {
                    digitalTimeElements[index].textContent = this.getTimeForTimezone(city.timezone);
                }
                if (dateElements[index]) {
                    dateElements[index].textContent = this.getDateForTimezone(city.timezone);
                }
                
                // Update analog clocks
                const analogClocks = container.querySelectorAll('.analog-clock');
                if (analogClocks[index]) {
                    const clockFace = analogClocks[index].querySelector('.clock-face');
                    if (clockFace) {
                        clockFace.innerHTML = this.generateAnalogClockFace(city.timezone);
                    }
                }
            }
        });
    }
    
    updateWorldClockCards() {
        const container = document.getElementById('worldClockCards');
        if (!container) return;
        
        const timeElements = container.querySelectorAll('.current-time');
        const dateElements = container.querySelectorAll('.current-date');
        const timezoneElements = container.querySelectorAll('.timezone-info');
        
        Array.from(this.addedCities).forEach((cityName, index) => {
            const city = this.countryTimezones[cityName];
            if (city && timeElements[index] && dateElements[index] && timezoneElements[index]) {
                timeElements[index].textContent = this.getTimeForTimezone(city.timezone);
                dateElements[index].textContent = this.getDateForTimezone(city.timezone);
                timezoneElements[index].textContent = `UTC${this.getUTCOffset(city.timezone)}`;
            }
        });
    }
    
    generateAnalogClock(timezone) {
        return `
            <div class="analog-clock">
                <div class="clock-face">
                    ${this.generateAnalogClockFace(timezone)}
                </div>
            </div>
        `;
    }
    
    generateAnalogClockFace(timezone) {
        const now = new Date();
        const timeInZone = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
        
        const hours = timeInZone.getHours() % 12;
        const minutes = timeInZone.getMinutes();
        const seconds = timeInZone.getSeconds();
        
        const hourAngle = (hours * 30) + (minutes * 0.5);
        const minuteAngle = minutes * 6;
        const secondAngle = seconds * 6;
        
        return `
            <div class="hour-hand" style="transform: rotate(${hourAngle}deg)"></div>
            <div class="minute-hand" style="transform: rotate(${minuteAngle}deg)"></div>
            <div class="second-hand" style="transform: rotate(${secondAngle}deg)"></div>
            <div class="center-dot"></div>
            <div class="hour-markers">
                ${Array.from({length: 12}, (_, i) => 
                    `<div class="marker" style="transform: rotate(${i * 30}deg)"></div>`
                ).join('')}
            </div>
        `;
    }
    
    getTimezoneInfo(timezone) {
        try {
            const now = new Date();
            const timeInZone = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
            const offset = (timeInZone.getTime() - now.getTime()) / (1000 * 60 * 60);
            const offsetStr = offset >= 0 ? `+${Math.abs(offset)}` : `-${Math.abs(offset)}`;
            return `UTC${offsetStr}`;
        } catch (error) {
            return 'UTC';
        }
    }
    
    getTimeForTimezone(timezone) {
        try {
            const options = {
                timeZone: timezone,
                hour12: this.timeFormat === '12h',
                hour: '2-digit',
                minute: '2-digit'
            };
            
            if (this.clockStyle === 'digital' || this.clockStyle === 'both') {
                options.second = '2-digit';
            }
            
            return new Date().toLocaleTimeString('en-US', options);
        } catch (error) {
            return '??:??';
        }
    }
    
    getDateForTimezone(timezone) {
        try {
            return new Date().toLocaleDateString('en-US', {
                timeZone: timezone,
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return '---';
        }
    }
    
    findCityByName(searchName) {
        const normalizedSearch = searchName.toLowerCase().trim();
        
        // Direct match
        for (const [cityName, cityData] of Object.entries(this.countryTimezones)) {
            if (cityName.toLowerCase() === normalizedSearch) {
                return { name: cityName, ...cityData };
            }
        }
        
        // Partial match
        for (const [cityName, cityData] of Object.entries(this.countryTimezones)) {
            if (cityName.toLowerCase().includes(normalizedSearch) || 
                cityData.country.toLowerCase().includes(normalizedSearch)) {
                return { name: cityName, ...cityData };
            }
        }
        
        return null;
    }
    
    getCityFromTimezone(timezone) {
        // Try to find a city name from timezone
        for (const [cityName, cityData] of Object.entries(this.countryTimezones)) {
            if (cityData.timezone === timezone) {
                return cityName;
            }
        }
        
        // Fallback to timezone name
        return timezone.split('/').pop().replace(/_/g, ' ');
    }
    
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Global function to add city from search
function addCityFromSearch() {
    const input = document.getElementById('searchInput');
    const city = input.value.trim();
    if (city && window.timelyApp) {
        window.timelyApp.addCityToGrid(city);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🚀 Starting Timely with Open Source APIs...');
        window.timelyApp = new SimpleTimelyApp();
        await window.timelyApp.init();
    } catch (error) {
        console.error('Failed to initialize Timely:', error);
    }
});
