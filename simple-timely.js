// Timely - Simple Time.is Inspired World Clock
// Simplified version for clean interface

class SimpleTimelyApp {
    constructor() {
        this.cache = new Map();
        this.updateInterval = null;
        this.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.addedCities = new Set();
        
        // Comprehensive country and timezone database with flags
        this.countryTimezones = {
            // Popular cities (displayed by default)
            'Tokyo': { timezone: 'Asia/Tokyo', flag: '🇯🇵', country: 'Japan' },
            'Beijing': { timezone: 'Asia/Shanghai', flag: '🇨🇳', country: 'China' },
            'London': { timezone: 'Europe/London', flag: '🇬🇧', country: 'United Kingdom' },
            'Paris': { timezone: 'Europe/Paris', flag: '🇫🇷', country: 'France' },
            'New York': { timezone: 'America/New_York', flag: '🇺🇸', country: 'United States' },
            'Los Angeles': { timezone: 'America/Los_Angeles', flag: '🇺🇸', country: 'United States' },
            
            // Additional cities
            'Dubai': { timezone: 'Asia/Dubai', flag: '🇦🇪', country: 'UAE' },
            'Sydney': { timezone: 'Australia/Sydney', flag: '🇦🇺', country: 'Australia' },
            'Mumbai': { timezone: 'Asia/Kolkata', flag: '🇮🇳', country: 'India' },
            'Berlin': { timezone: 'Europe/Berlin', flag: '🇩🇪', country: 'Germany' },
            'Moscow': { timezone: 'Europe/Moscow', flag: '🇷🇺', country: 'Russia' },
            'Singapore': { timezone: 'Asia/Singapore', flag: '🇸🇬', country: 'Singapore' },
            'Bangkok': { timezone: 'Asia/Bangkok', flag: '🇹🇭', country: 'Thailand' },
            'Seoul': { timezone: 'Asia/Seoul', flag: '🇰🇷', country: 'South Korea' },
            'Toronto': { timezone: 'America/Toronto', flag: '🇨🇦', country: 'Canada' },
            'São Paulo': { timezone: 'America/Sao_Paulo', flag: '🇧🇷', country: 'Brazil' },
            'Mexico City': { timezone: 'America/Mexico_City', flag: '🇲🇽', country: 'Mexico' },
            'Istanbul': { timezone: 'Europe/Istanbul', flag: '🇹🇷', country: 'Turkey' },
            'Cairo': { timezone: 'Africa/Cairo', flag: '🇪🇬', country: 'Egypt' },
            'Lagos': { timezone: 'Africa/Lagos', flag: '🇳🇬', country: 'Nigeria' },
            'Karachi': { timezone: 'Asia/Karachi', flag: '🇵🇰', country: 'Pakistan' },
            'Jakarta': { timezone: 'Asia/Jakarta', flag: '🇮🇩', country: 'Indonesia' },
            'Manila': { timezone: 'Asia/Manila', flag: '🇵🇭', country: 'Philippines' },
            'Hong Kong': { timezone: 'Asia/Hong_Kong', flag: '🇭🇰', country: 'Hong Kong' },
            'Zurich': { timezone: 'Europe/Zurich', flag: '🇨🇭', country: 'Switzerland' },
            'Stockholm': { timezone: 'Europe/Stockholm', flag: '🇸🇪', country: 'Sweden' },
            'Amsterdam': { timezone: 'Europe/Amsterdam', flag: '🇳🇱', country: 'Netherlands' },
            'Vienna': { timezone: 'Europe/Vienna', flag: '🇦🇹', country: 'Austria' },
            'Madrid': { timezone: 'Europe/Madrid', flag: '🇪🇸', country: 'Spain' },
            'Rome': { timezone: 'Europe/Rome', flag: '🇮🇹', country: 'Italy' },
            'Athens': { timezone: 'Europe/Athens', flag: '🇬🇷', country: 'Greece' },
            'Helsinki': { timezone: 'Europe/Helsinki', flag: '🇫🇮', country: 'Finland' },
            'Oslo': { timezone: 'Europe/Oslo', flag: '🇳🇴', country: 'Norway' },
            'Copenhagen': { timezone: 'Europe/Copenhagen', flag: '🇩🇰', country: 'Denmark' },
            'Brussels': { timezone: 'Europe/Brussels', flag: '🇧🇪', country: 'Belgium' },
            'Lisbon': { timezone: 'Europe/Lisbon', flag: '🇵🇹', country: 'Portugal' },
            'Warsaw': { timezone: 'Europe/Warsaw', flag: '🇵🇱', country: 'Poland' },
            'Prague': { timezone: 'Europe/Prague', flag: '🇨🇿', country: 'Czech Republic' },
            'Budapest': { timezone: 'Europe/Budapest', flag: '🇭🇺', country: 'Hungary' },
            'Bucharest': { timezone: 'Europe/Bucharest', flag: '🇷🇴', country: 'Romania' },
            'Sofia': { timezone: 'Europe/Sofia', flag: '🇧🇬', country: 'Bulgaria' },
            'Kiev': { timezone: 'Europe/Kiev', flag: '🇺🇦', country: 'Ukraine' },
            'Tel Aviv': { timezone: 'Asia/Jerusalem', flag: '🇮🇱', country: 'Israel' },
            'Riyadh': { timezone: 'Asia/Riyadh', flag: '🇸🇦', country: 'Saudi Arabia' },
            'Kuwait': { timezone: 'Asia/Kuwait', flag: '🇰🇼', country: 'Kuwait' },
            'Doha': { timezone: 'Asia/Qatar', flag: '🇶🇦', country: 'Qatar' },
            'Manama': { timezone: 'Asia/Bahrain', flag: '🇧🇭', country: 'Bahrain' },
            'Abu Dhabi': { timezone: 'Asia/Dubai', flag: '🇦🇪', country: 'UAE' },
            'Muscat': { timezone: 'Asia/Muscat', flag: '🇴🇲', country: 'Oman' },
            'Colombo': { timezone: 'Asia/Colombo', flag: '🇱🇰', country: 'Sri Lanka' },
            'Dhaka': { timezone: 'Asia/Dhaka', flag: '🇧🇩', country: 'Bangladesh' },
            'Kathmandu': { timezone: 'Asia/Kathmandu', flag: '🇳🇵', country: 'Nepal' },
            'Almaty': { timezone: 'Asia/Almaty', flag: '🇰🇿', country: 'Kazakhstan' },
            'Tashkent': { timezone: 'Asia/Tashkent', flag: '🇺🇿', country: 'Uzbekistan' },
            'Tehran': { timezone: 'Asia/Tehran', flag: '🇮🇷', country: 'Iran' },
            'Baghdad': { timezone: 'Asia/Baghdad', flag: '🇮🇶', country: 'Iraq' },
            'Damascus': { timezone: 'Asia/Damascus', flag: '🇸🇾', country: 'Syria' },
            'Beirut': { timezone: 'Asia/Beirut', flag: '🇱🇧', country: 'Lebanon' },
            'Amman': { timezone: 'Asia/Amman', flag: '🇯🇴', country: 'Jordan' },
            'Melbourne': { timezone: 'Australia/Melbourne', flag: '🇦🇺', country: 'Australia' },
            'Perth': { timezone: 'Australia/Perth', flag: '🇦🇺', country: 'Australia' },
            'Brisbane': { timezone: 'Australia/Brisbane', flag: '🇦🇺', country: 'Australia' },
            'Adelaide': { timezone: 'Australia/Adelaide', flag: '🇦🇺', country: 'Australia' },
            'Auckland': { timezone: 'Pacific/Auckland', flag: '🇳🇿', country: 'New Zealand' },
            'Wellington': { timezone: 'Pacific/Auckland', flag: '🇳🇿', country: 'New Zealand' },
            'Fiji': { timezone: 'Pacific/Fiji', flag: '🇫🇯', country: 'Fiji' },
            'Honolulu': { timezone: 'Pacific/Honolulu', flag: '🇺🇸', country: 'Hawaii' }
        };
        
        // Popular cities to show by default (like time.is)
        this.popularCities = ['Tokyo', 'Beijing', 'Paris', 'London', 'New York', 'Los Angeles'];
    }
    
    init() {
        try {
            console.log('🕐 Initializing Simple Timely...');
            
            // Start primary clock
            this.updatePrimaryTime();
            
            // Show popular cities
            this.renderPopularCities();
            
            // Start update interval
            this.updateInterval = setInterval(() => {
                this.updatePrimaryTime();
                this.updatePopularCities();
                this.updateWorldCities();
            }, 1000);
            
            console.log('✅ Simple Timely initialized!');
            
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
            alert(`City "${cityName}" not found. Try cities like: Tokyo, London, New York, Paris, etc.`);
            return;
        }
        
        this.addedCities.add(cityName);
        this.renderWorldCities();
        
        // Clear search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
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
            
            return `
                <div class="world-city-item">
                    <span class="flag">${city.flag}</span>
                    <div class="city-name">${cityName}</div>
                    <div class="city-time">${time}</div>
                    <div class="city-date">${date}</div>
                    <button class="remove-btn" onclick="window.timelyApp.removeCityFromGrid('${cityName}')">Remove</button>
                </div>
            `;
        }).join('');
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
            return new Date().toLocaleTimeString('en-US', {
                timeZone: timezone,
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
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
