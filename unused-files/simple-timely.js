// Timely - Simple Time            'Montreal': { timezone: 'America/Toronto', flag: '🇨🇦', country: 'Canada' },
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
            'Belize City': { timezone: 'America/Belize', flag: '🇧🇿', country: 'Belize' },s Inspired World Clock
// Simplified version for clean interface

class SimpleTimelyApp {
    constructor() {
        this.cache = new Map();
        this.updateInterval = null;
        this.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.addedCities = new Set();
        
        // Comprehensive country and timezone database with flags (100+ locations)
        this.countryTimezones = {
            // North America
            'New York': { timezone: 'America/New_York', flag: '🇺🇸', country: 'United States' },
            'Los Angeles': { timezone: 'America/Los_Angeles', flag: '��', country: 'United States' },
            'Chicago': { timezone: 'America/Chicago', flag: '��', country: 'United States' },
            'Toronto': { timezone: 'America/Toronto', flag: '��', country: 'Canada' },
            'Vancouver': { timezone: 'America/Vancouver', flag: '��', country: 'Canada' },
            'Mexico City': { timezone: 'America/Mexico_City', flag: '🇲🇽', country: 'Mexico' },
            'Miami': { timezone: 'America/New_York', flag: '🇺🇸', country: 'United States' },
            'Denver': { timezone: 'America/Denver', flag: '🇺🇸', country: 'United States' },
            'Phoenix': { timezone: 'America/Phoenix', flag: '🇺🇸', country: 'United States' },
            'Seattle': { timezone: 'America/Los_Angeles', flag: '��', country: 'United States' },
            'Montreal': { timezone: 'America/Toronto', flag: '��', country: 'Canada' },
            'Havana': { timezone: 'America/Havana', flag: '��', country: 'Cuba' },
            
            // South America
            'São Paulo': { timezone: 'America/Sao_Paulo', flag: '��', country: 'Brazil' },
            'Rio de Janeiro': { timezone: 'America/Sao_Paulo', flag: '��', country: 'Brazil' },
            'Buenos Aires': { timezone: 'America/Argentina/Buenos_Aires', flag: '��', country: 'Argentina' },
            'Lima': { timezone: 'America/Lima', flag: '��', country: 'Peru' },
            'Bogotá': { timezone: 'America/Bogota', flag: '��', country: 'Colombia' },
            'Santiago': { timezone: 'America/Santiago', flag: '🇨�', country: 'Chile' },
            'Caracas': { timezone: 'America/Caracas', flag: '��', country: 'Venezuela' },
            
            // Europe
            'London': { timezone: 'Europe/London', flag: '��', country: 'United Kingdom' },
            'Paris': { timezone: 'Europe/Paris', flag: '�🇷', country: 'France' },
            'Berlin': { timezone: 'Europe/Berlin', flag: '��', country: 'Germany' },
            'Rome': { timezone: 'Europe/Rome', flag: '��', country: 'Italy' },
            'Madrid': { timezone: 'Europe/Madrid', flag: '��', country: 'Spain' },
            'Amsterdam': { timezone: 'Europe/Amsterdam', flag: '��', country: 'Netherlands' },
            'Brussels': { timezone: 'Europe/Brussels', flag: '��', country: 'Belgium' },
            'Vienna': { timezone: 'Europe/Vienna', flag: '��', country: 'Austria' },
            'Zurich': { timezone: 'Europe/Zurich', flag: '🇨🇭', country: 'Switzerland' },
            'Stockholm': { timezone: 'Europe/Stockholm', flag: '🇸🇪', country: 'Sweden' },
            'Oslo': { timezone: 'Europe/Oslo', flag: '🇳�', country: 'Norway' },
            'Copenhagen': { timezone: 'Europe/Copenhagen', flag: '��', country: 'Denmark' },
            'Helsinki': { timezone: 'Europe/Helsinki', flag: '��', country: 'Finland' },
            'Warsaw': { timezone: 'Europe/Warsaw', flag: '��', country: 'Poland' },
            'Prague': { timezone: 'Europe/Prague', flag: '��', country: 'Czech Republic' },
            'Budapest': { timezone: 'Europe/Budapest', flag: '��', country: 'Hungary' },
            'Athens': { timezone: 'Europe/Athens', flag: '��', country: 'Greece' },
            'Lisbon': { timezone: 'Europe/Lisbon', flag: '��', country: 'Portugal' },
            'Dublin': { timezone: 'Europe/Dublin', flag: '�🇪', country: 'Ireland' },
            'Moscow': { timezone: 'Europe/Moscow', flag: '��', country: 'Russia' },
            'Istanbul': { timezone: 'Europe/Istanbul', flag: '��', country: 'Turkey' },
            'Kiev': { timezone: 'Europe/Kiev', flag: '��', country: 'Ukraine' },
            'Bucharest': { timezone: 'Europe/Bucharest', flag: '��', country: 'Romania' },
            'Sofia': { timezone: 'Europe/Sofia', flag: '🇧🇬', country: 'Bulgaria' },
            
            // Asia
            'Tokyo': { timezone: 'Asia/Tokyo', flag: '��', country: 'Japan' },
            'Beijing': { timezone: 'Asia/Shanghai', flag: '🇨🇳', country: 'China' },
            'Shanghai': { timezone: 'Asia/Shanghai', flag: '��', country: 'China' },
            'Hong Kong': { timezone: 'Asia/Hong_Kong', flag: '🇭🇰', country: 'Hong Kong' },
            'Singapore': { timezone: 'Asia/Singapore', flag: '��', country: 'Singapore' },
            'Seoul': { timezone: 'Asia/Seoul', flag: '🇰🇷', country: 'South Korea' },
            'Mumbai': { timezone: 'Asia/Kolkata', flag: '🇮�', country: 'India' },
            'Delhi': { timezone: 'Asia/Kolkata', flag: '��', country: 'India' },
            'Bangkok': { timezone: 'Asia/Bangkok', flag: '🇹🇭', country: 'Thailand' },
            'Manila': { timezone: 'Asia/Manila', flag: '��', country: 'Philippines' },
            'Jakarta': { timezone: 'Asia/Jakarta', flag: '��', country: 'Indonesia' },
            'Kuala Lumpur': { timezone: 'Asia/Kuala_Lumpur', flag: '��', country: 'Malaysia' },
            'Dubai': { timezone: 'Asia/Dubai', flag: '🇦🇪', country: 'UAE' },
            'Abu Dhabi': { timezone: 'Asia/Dubai', flag: '🇦🇪', country: 'UAE' },
            'Riyadh': { timezone: 'Asia/Riyadh', flag: '🇸🇦', country: 'Saudi Arabia' },
            'Tel Aviv': { timezone: 'Asia/Jerusalem', flag: '🇮🇱', country: 'Israel' },
            'Tehran': { timezone: 'Asia/Tehran', flag: '��', country: 'Iran' },
            'Baghdad': { timezone: 'Asia/Baghdad', flag: '🇮🇶', country: 'Iraq' },
            'Karachi': { timezone: 'Asia/Karachi', flag: '�🇰', country: 'Pakistan' },
            'Lahore': { timezone: 'Asia/Karachi', flag: '🇵🇰', country: 'Pakistan' },
            'Dhaka': { timezone: 'Asia/Dhaka', flag: '🇧🇩', country: 'Bangladesh' },
            'Colombo': { timezone: 'Asia/Colombo', flag: '🇱🇰', country: 'Sri Lanka' },
            'Kathmandu': { timezone: 'Asia/Kathmandu', flag: '🇳🇵', country: 'Nepal' },
            'Almaty': { timezone: 'Asia/Almaty', flag: '🇰🇿', country: 'Kazakhstan' },
            'Tashkent': { timezone: 'Asia/Tashkent', flag: '🇺🇿', country: 'Uzbekistan' },
            'Baku': { timezone: 'Asia/Baku', flag: '🇦🇿', country: 'Azerbaijan' },
            'Tbilisi': { timezone: 'Asia/Tbilisi', flag: '🇬🇪', country: 'Georgia' },
            'Yerevan': { timezone: 'Asia/Yerevan', flag: '��', country: 'Armenia' },
            'Beirut': { timezone: 'Asia/Beirut', flag: '��', country: 'Lebanon' },
            'Damascus': { timezone: 'Asia/Damascus', flag: '🇸🇾', country: 'Syria' },
            'Amman': { timezone: 'Asia/Amman', flag: '🇯🇴', country: 'Jordan' },
            'Kuwait': { timezone: 'Asia/Kuwait', flag: '🇰🇼', country: 'Kuwait' },
            'Doha': { timezone: 'Asia/Qatar', flag: '��', country: 'Qatar' },
            'Manama': { timezone: 'Asia/Bahrain', flag: '🇧🇭', country: 'Bahrain' },
            'Muscat': { timezone: 'Asia/Muscat', flag: '🇴🇲', country: 'Oman' },
            
            // Africa
            'Cairo': { timezone: 'Africa/Cairo', flag: '🇪🇬', country: 'Egypt' },
            'Lagos': { timezone: 'Africa/Lagos', flag: '🇳🇬', country: 'Nigeria' },
            'Nairobi': { timezone: 'Africa/Nairobi', flag: '🇰🇪', country: 'Kenya' },
            'Cape Town': { timezone: 'Africa/Johannesburg', flag: '��', country: 'South Africa' },
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
        
        // Popular cities to show by default (like time.is)
        this.popularCities = ['Tokyo', 'Beijing', 'Paris', 'London', 'New York', 'Los Angeles'];
        
        // Clock style settings
        this.clockStyle = 'digital'; // 'digital', 'analog', 'both'
        this.timeFormat = '24h'; // '12h', '24h'
        
        // Search suggestions
        this.searchSuggestions = [];
        this.isSearching = false;
    }
    
    init() {
        try {
            console.log('🕐 Initializing Enhanced Timely...');
            
            // Start primary clock
            this.updatePrimaryTime();
            
            // Show popular cities
            this.renderPopularCities();
            
            // Initialize enhanced search
            this.initializeSearch();
            
            // Add clock style controls
            this.addClockStyleControls();
            
            // Start update interval
            this.updateInterval = setInterval(() => {
                this.updatePrimaryTime();
                this.updatePopularCities();
                this.updateWorldCities();
            }, 1000);
            
            console.log('✅ Enhanced Timely initialized!');
            
        } catch (error) {
            console.error('❌ Failed to initialize:', error);
        }
    }
    
    updatePrimaryTime() {
        try {
            const now = new Date();
            const timeEl = document.getElementById('primaryTime');
            const dateEl = document.getElementById('primaryDate');
            const locationEl = document.getElementById('primaryLocation');
            
            if (timeEl) {
                timeEl.textContent = now.toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            }
            
            if (dateEl) {
                dateEl.textContent = now.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
            
            if (locationEl) {
                const cityName = this.getCityFromTimezone(this.userTimezone);
                locationEl.textContent = `Time in ${cityName} now:`;
            }
            
            // Update timezone details
            this.updateTimezoneDetails();
            
        } catch (error) {
            console.error('Failed to update primary time:', error);
        }
    }
    
    updateTimezoneDetails() {
        const detailsEl = document.getElementById('timezoneDetails');
        if (!detailsEl) return;
        
        try {
            const now = new Date();
            const offset = -now.getTimezoneOffset() / 60;
            const offsetStr = offset >= 0 ? `+${offset}` : `${offset}`;
            
            detailsEl.innerHTML = `
                <span class="sun-info">🌍 UTC${offsetStr} - ${this.userTimezone}</span>
            `;
        } catch (error) {
            console.error('Failed to update timezone details:', error);
        }
    }
    
    renderPopularCities() {
        const container = document.getElementById('popularCities');
        if (!container) return;
        
        container.innerHTML = this.popularCities.map(cityName => {
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
    }
    
    updatePopularCities() {
        const container = document.getElementById('popularCities');
        if (!container) return;
        
        const timeElements = container.querySelectorAll('.city-time');
        timeElements.forEach((el, index) => {
            const cityName = this.popularCities[index];
            const city = this.countryTimezones[cityName];
            if (city) {
                el.textContent = this.getTimeForTimezone(city.timezone);
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
        this.renderWorldCities();
        
        // Clear search input and hide suggestions
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        this.hideSuggestions();
    }
    
    showSearchSuggestions(searchTerm) {
        const suggestions = this.getSearchSuggestions(searchTerm);
        if (suggestions.length > 0) {
            this.displaySuggestions(suggestions);
        } else {
            alert(`City "${searchTerm}" not found. Try cities like: Tokyo, London, New York, Paris, Mumbai, etc.`);
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
    
    addClockStyleControls() {
        const mainContent = document.querySelector('.main-content');
        const controlsHTML = `
            <div class="clock-controls">
                <div class="style-controls">
                    <label>Clock Style:</label>
                    <select id="clockStyleSelect" onchange="window.timelyApp.changeClockStyle(this.value)">
                        <option value="digital">Digital</option>
                        <option value="analog">Analog</option>
                        <option value="both">Both</option>
                    </select>
                </div>
                <div class="format-controls">
                    <label>Time Format:</label>
                    <select id="timeFormatSelect" onchange="window.timelyApp.changeTimeFormat(this.value)">
                        <option value="24h">24 Hour</option>
                        <option value="12h">12 Hour</option>
                    </select>
                </div>
            </div>
        `;
        
        // Insert controls after accuracy notice
        const accuracyNotice = document.getElementById('accuracyNotice');
        if (accuracyNotice) {
            accuracyNotice.insertAdjacentHTML('afterend', controlsHTML);
        }
    }
    
    changeClockStyle(style) {
        this.clockStyle = style;
        this.renderWorldCities();
        this.renderPopularCities();
    }
    
    changeTimeFormat(format) {
        this.timeFormat = format;
    }
    
    removeCityFromGrid(cityName) {
        this.addedCities.delete(cityName);
        this.renderWorldCities();
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
    
    generateAnalogClock(timezone) {
        const now = new Date();
        const timeInZone = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
        
        const hours = timeInZone.getHours() % 12;
        const minutes = timeInZone.getMinutes();
        const seconds = timeInZone.getSeconds();
        
        const hourAngle = (hours * 30) + (minutes * 0.5);
        const minuteAngle = minutes * 6;
        const secondAngle = seconds * 6;
        
        return `
            <div class="analog-clock">
                <div class="clock-face">
                    <div class="hour-hand" style="transform: rotate(${hourAngle}deg)"></div>
                    <div class="minute-hand" style="transform: rotate(${minuteAngle}deg)"></div>
                    <div class="second-hand" style="transform: rotate(${secondAngle}deg)"></div>
                    <div class="center-dot"></div>
                    <div class="hour-markers">
                        ${Array.from({length: 12}, (_, i) => 
                            `<div class="marker" style="transform: rotate(${i * 30}deg)"></div>`
                        ).join('')}
                    </div>
                </div>
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
    
    updateWorldCities() {
        const container = document.getElementById('worldCitiesGrid');
        if (!container) return;
        
        const timeElements = container.querySelectorAll('.city-time');
        const dateElements = container.querySelectorAll('.city-date');
        
        Array.from(this.addedCities).forEach((cityName, index) => {
            const city = this.countryTimezones[cityName];
            if (city && timeElements[index] && dateElements[index]) {
                timeElements[index].textContent = this.getTimeForTimezone(city.timezone);
                dateElements[index].textContent = this.getDateForTimezone(city.timezone);
            }
        });
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
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.timelyApp = new SimpleTimelyApp();
        window.timelyApp.init();
    } catch (error) {
        console.error('Failed to initialize Timely:', error);
    }
});
