// Timely - Modern Sleek UI JavaScript

class ModernTimelyApp {
    constructor() {
        this.cache = new Map();
        this.updateInterval = null;
        this.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.addedCities = new Set();
        this.currentTheme = 'light';
        
        // Popular cities for world clocks
        this.popularCities = [
            { name: 'London', timezone: 'Europe/London', flag: '🇬🇧' },
            { name: 'New York', timezone: 'America/New_York', flag: '🇺🇸' },
            { name: 'Tokyo', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
            { name: 'Sydney', timezone: 'Australia/Sydney', flag: '🇦🇺' },
            { name: 'Dubai', timezone: 'Asia/Dubai', flag: '🇦🇪' },
            { name: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬' }
        ];

        // Comprehensive city database
        this.cityDatabase = {
            // Major cities with timezone info
            'London': { timezone: 'Europe/London', country: 'United Kingdom', flag: '🇬🇧' },
            'New York': { timezone: 'America/New_York', country: 'United States', flag: '🇺🇸' },
            'Los Angeles': { timezone: 'America/Los_Angeles', country: 'United States', flag: '🇺🇸' },
            'Chicago': { timezone: 'America/Chicago', country: 'United States', flag: '🇺🇸' },
            'Toronto': { timezone: 'America/Toronto', country: 'Canada', flag: '🇨🇦' },
            'Vancouver': { timezone: 'America/Vancouver', country: 'Canada', flag: '🇨🇦' },
            'Mexico City': { timezone: 'America/Mexico_City', country: 'Mexico', flag: '🇲🇽' },
            'São Paulo': { timezone: 'America/Sao_Paulo', country: 'Brazil', flag: '🇧🇷' },
            'Buenos Aires': { timezone: 'America/Argentina/Buenos_Aires', country: 'Argentina', flag: '🇦🇷' },
            'Paris': { timezone: 'Europe/Paris', country: 'France', flag: '🇫🇷' },
            'Berlin': { timezone: 'Europe/Berlin', country: 'Germany', flag: '🇩🇪' },
            'Rome': { timezone: 'Europe/Rome', country: 'Italy', flag: '🇮🇹' },
            'Madrid': { timezone: 'Europe/Madrid', country: 'Spain', flag: '🇪🇸' },
            'Amsterdam': { timezone: 'Europe/Amsterdam', country: 'Netherlands', flag: '🇳🇱' },
            'Stockholm': { timezone: 'Europe/Stockholm', country: 'Sweden', flag: '🇸🇪' },
            'Moscow': { timezone: 'Europe/Moscow', country: 'Russia', flag: '🇷🇺' },
            'Istanbul': { timezone: 'Europe/Istanbul', country: 'Turkey', flag: '🇹🇷' },
            'Cairo': { timezone: 'Africa/Cairo', country: 'Egypt', flag: '🇪🇬' },
            'Cape Town': { timezone: 'Africa/Cape_Town', country: 'South Africa', flag: '🇿🇦' },
            'Lagos': { timezone: 'Africa/Lagos', country: 'Nigeria', flag: '🇳🇬' },
            'Dubai': { timezone: 'Asia/Dubai', country: 'UAE', flag: '🇦🇪' },
            'Mumbai': { timezone: 'Asia/Kolkata', country: 'India', flag: '🇮🇳' },
            'Delhi': { timezone: 'Asia/Kolkata', country: 'India', flag: '🇮🇳' },
            'Bangkok': { timezone: 'Asia/Bangkok', country: 'Thailand', flag: '🇹🇭' },
            'Singapore': { timezone: 'Asia/Singapore', country: 'Singapore', flag: '🇸🇬' },
            'Kuala Lumpur': { timezone: 'Asia/Kuala_Lumpur', country: 'Malaysia', flag: '🇲🇾' },
            'Jakarta': { timezone: 'Asia/Jakarta', country: 'Indonesia', flag: '🇮🇩' },
            'Manila': { timezone: 'Asia/Manila', country: 'Philippines', flag: '🇵🇭' },
            'Hong Kong': { timezone: 'Asia/Hong_Kong', country: 'Hong Kong', flag: '🇭🇰' },
            'Beijing': { timezone: 'Asia/Shanghai', country: 'China', flag: '🇨🇳' },
            'Shanghai': { timezone: 'Asia/Shanghai', country: 'China', flag: '🇨🇳' },
            'Seoul': { timezone: 'Asia/Seoul', country: 'South Korea', flag: '🇰🇷' },
            'Tokyo': { timezone: 'Asia/Tokyo', country: 'Japan', flag: '🇯🇵' },
            'Sydney': { timezone: 'Australia/Sydney', country: 'Australia', flag: '🇦🇺' },
            'Melbourne': { timezone: 'Australia/Melbourne', country: 'Australia', flag: '🇦🇺' },
            'Perth': { timezone: 'Australia/Perth', country: 'Australia', flag: '🇦🇺' },
            'Auckland': { timezone: 'Pacific/Auckland', country: 'New Zealand', flag: '🇳🇿' }
        };
    }

    async init() {
        try {
            console.log('🕐 Initializing Modern Timely App...');
            
            // Initialize theme
            this.initializeTheme();
            
            // Start time updates
            this.updateLocalTime();
            this.renderWorldClocks();
            
            // Start update interval
            this.updateInterval = setInterval(() => {
                this.updateLocalTime();
                this.updateWorldClockTimes();
            }, 1000);
            
            console.log('✅ Modern Timely initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize app:', error);
        }
    }

    updateLocalTime() {
        const now = new Date();
        
        // Update main time display
        const timeEl = document.getElementById('primaryTime');
        const periodEl = document.getElementById('timePeriod');
        const dateEl = document.getElementById('primaryDate');
        
        if (timeEl) {
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            timeEl.textContent = timeString;
        }
        
        if (periodEl) {
            const period = now.toLocaleTimeString('en-US', {
                hour12: true,
                hour: 'numeric'
            }).includes('AM') ? 'AM' : 'PM';
            periodEl.textContent = period;
        }
        
        if (dateEl) {
            const dateString = now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            dateEl.textContent = dateString;
        }
        
        // Update sun times (simplified)
        const sunriseEl = document.getElementById('sunriseTime');
        const sunsetEl = document.getElementById('sunsetTime');
        
        if (sunriseEl) sunriseEl.textContent = '06:30';
        if (sunsetEl) sunsetEl.textContent = '18:45';
    }

    renderWorldClocks() {
        const grid = document.getElementById('worldClocksGrid');
        if (!grid) return;
        
        // Add some popular cities by default
        this.popularCities.forEach(city => {
            this.addedCities.add(city.name);
        });
        
        this.updateWorldClockGrid();
    }

    updateWorldClockGrid() {
        const grid = document.getElementById('worldClocksGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        Array.from(this.addedCities).forEach(cityName => {
            const cityData = this.cityDatabase[cityName];
            if (!cityData) return;
            
            const card = this.createWorldClockCard(cityName, cityData);
            grid.appendChild(card);
        });
    }

    createWorldClockCard(cityName, cityData) {
        const card = document.createElement('div');
        card.className = 'world-clock-card fade-in';
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            timeZone: cityData.timezone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const dateString = now.toLocaleDateString('en-US', {
            timeZone: cityData.timezone,
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        
        // Calculate time offset
        const localOffset = now.getTimezoneOffset();
        const cityTime = new Date(now.toLocaleString('en-US', { timeZone: cityData.timezone }));
        const cityOffset = (now.getTime() - cityTime.getTime()) / (1000 * 60 * 60);
        const offsetString = cityOffset >= 0 ? `+${Math.abs(cityOffset)}h` : `-${Math.abs(cityOffset)}h`;
        
        card.innerHTML = `
            <div class="world-clock-header">
                <div class="city-name">${cityData.flag} ${cityName}</div>
                <div class="time-offset">${offsetString}</div>
            </div>
            <div class="world-clock-time">${timeString}</div>
            <div class="world-clock-date">${dateString}</div>
        `;
        
        return card;
    }

    updateWorldClockTimes() {
        const cards = document.querySelectorAll('.world-clock-card');
        cards.forEach((card, index) => {
            const cityName = Array.from(this.addedCities)[index];
            const cityData = this.cityDatabase[cityName];
            if (!cityData) return;
            
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                timeZone: cityData.timezone,
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const timeEl = card.querySelector('.world-clock-time');
            if (timeEl) timeEl.textContent = timeString;
        });
    }

    // Theme Management
    initializeTheme() {
        const savedTheme = localStorage.getItem('timely-theme') || 'light';
        this.currentTheme = savedTheme;
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }
        
        this.updateThemeIcon();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        
        if (this.currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        localStorage.setItem('timely-theme', this.currentTheme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
        }
    }

    // Modal Management
    toggleLocationPicker() {
        const overlay = document.getElementById('locationPickerOverlay');
        if (overlay) {
            overlay.classList.toggle('active');
            if (overlay.classList.contains('active')) {
                this.populateLocationList();
            }
        }
    }

    populateLocationList() {
        const citiesList = document.getElementById('citiesList');
        if (!citiesList) return;
        
        citiesList.innerHTML = '';
        
        Object.entries(this.cityDatabase).forEach(([cityName, cityData]) => {
            const cityItem = document.createElement('div');
            cityItem.className = 'city-item';
            cityItem.onclick = () => this.selectLocation(cityName);
            
            cityItem.innerHTML = `
                <div class="city-info">
                    <div class="city-primary">${cityData.flag} ${cityName}</div>
                    <div class="city-secondary">${cityData.country}</div>
                </div>
            `;
            
            citiesList.appendChild(cityItem);
        });
    }

    selectLocation(cityName) {
        const locationNameEl = document.getElementById('locationName');
        if (locationNameEl) {
            locationNameEl.textContent = cityName;
        }
        this.toggleLocationPicker();
    }

    openCitySearch() {
        const overlay = document.getElementById('addCityOverlay');
        if (overlay) {
            overlay.classList.add('active');
            this.populateSearchSuggestions();
        }
    }

    closeAddCityModal() {
        const overlay = document.getElementById('addCityOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    populateSearchSuggestions() {
        const suggestions = document.getElementById('searchSuggestions');
        if (!suggestions) return;
        
        suggestions.innerHTML = '';
        
        Object.entries(this.cityDatabase).forEach(([cityName, cityData]) => {
            if (!this.addedCities.has(cityName)) {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'city-item';
                suggestionItem.onclick = () => this.addCity(cityName);
                
                suggestionItem.innerHTML = `
                    <div class="city-info">
                        <div class="city-primary">${cityData.flag} ${cityName}</div>
                        <div class="city-secondary">${cityData.country}</div>
                    </div>
                `;
                
                suggestions.appendChild(suggestionItem);
            }
        });
    }

    addCity(cityName) {
        this.addedCities.add(cityName);
        this.updateWorldClockGrid();
        this.closeAddCityModal();
    }

    // Tool Functions (Placeholders)
    openWorldMap() {
        alert('World Map feature coming soon!');
    }

    openMeetingPlanner() {
        alert('Meeting Planner feature coming soon!');
    }

    openConverter() {
        alert('Time Converter feature coming soon!');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    window.timelyApp = new ModernTimelyApp();
    await window.timelyApp.init();
});
