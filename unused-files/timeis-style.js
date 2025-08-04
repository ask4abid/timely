// Time.is Style Digital Clock JavaScript

class TimeIsStyleApp {
    constructor() {
        this.currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.currentLocation = 'Your Location';
        this.worldCities = new Set();
        this.updateInterval = null;
        
        // Popular cities like time.is
        this.popularCities = [
            { name: 'Tokyo', timezone: 'Asia/Tokyo', country: 'Japan' },
            { name: 'Beijing', timezone: 'Asia/Shanghai', country: 'China' },
            { name: 'Paris', timezone: 'Europe/Paris', country: 'France' },
            { name: 'London', timezone: 'Europe/London', country: 'United Kingdom' },
            { name: 'New York', timezone: 'America/New_York', country: 'United States' },
            { name: 'Los Angeles', timezone: 'America/Los_Angeles', country: 'United States' },
            { name: 'Dubai', timezone: 'Asia/Dubai', country: 'UAE' },
            { name: 'Sydney', timezone: 'Australia/Sydney', country: 'Australia' },
            { name: 'Mumbai', timezone: 'Asia/Kolkata', country: 'India' },
            { name: 'Singapore', timezone: 'Asia/Singapore', country: 'Singapore' }
        ];

        // City database for search
        this.cityDatabase = {
            'Tokyo': { timezone: 'Asia/Tokyo', country: 'Japan' },
            'Beijing': { timezone: 'Asia/Shanghai', country: 'China' },
            'Shanghai': { timezone: 'Asia/Shanghai', country: 'China' },
            'Paris': { timezone: 'Europe/Paris', country: 'France' },
            'London': { timezone: 'Europe/London', country: 'United Kingdom' },
            'New York': { timezone: 'America/New_York', country: 'United States' },
            'Los Angeles': { timezone: 'America/Los_Angeles', country: 'United States' },
            'Chicago': { timezone: 'America/Chicago', country: 'United States' },
            'Toronto': { timezone: 'America/Toronto', country: 'Canada' },
            'Vancouver': { timezone: 'America/Vancouver', country: 'Canada' },
            'Mexico City': { timezone: 'America/Mexico_City', country: 'Mexico' },
            'São Paulo': { timezone: 'America/Sao_Paulo', country: 'Brazil' },
            'Buenos Aires': { timezone: 'America/Argentina/Buenos_Aires', country: 'Argentina' },
            'Berlin': { timezone: 'Europe/Berlin', country: 'Germany' },
            'Rome': { timezone: 'Europe/Rome', country: 'Italy' },
            'Madrid': { timezone: 'Europe/Madrid', country: 'Spain' },
            'Amsterdam': { timezone: 'Europe/Amsterdam', country: 'Netherlands' },
            'Stockholm': { timezone: 'Europe/Stockholm', country: 'Sweden' },
            'Moscow': { timezone: 'Europe/Moscow', country: 'Russia' },
            'Istanbul': { timezone: 'Europe/Istanbul', country: 'Turkey' },
            'Cairo': { timezone: 'Africa/Cairo', country: 'Egypt' },
            'Dubai': { timezone: 'Asia/Dubai', country: 'UAE' },
            'Mumbai': { timezone: 'Asia/Kolkata', country: 'India' },
            'Delhi': { timezone: 'Asia/Kolkata', country: 'India' },
            'Bangkok': { timezone: 'Asia/Bangkok', country: 'Thailand' },
            'Singapore': { timezone: 'Asia/Singapore', country: 'Singapore' },
            'Hong Kong': { timezone: 'Asia/Hong_Kong', country: 'Hong Kong' },
            'Seoul': { timezone: 'Asia/Seoul', country: 'South Korea' },
            'Sydney': { timezone: 'Australia/Sydney', country: 'Australia' },
            'Melbourne': { timezone: 'Australia/Melbourne', country: 'Australia' },
            'Auckland': { timezone: 'Pacific/Auckland', country: 'New Zealand' },
            'Lahore': { timezone: 'Asia/Karachi', country: 'Pakistan' },
            'Karachi': { timezone: 'Asia/Karachi', country: 'Pakistan' },
            'Islamabad': { timezone: 'Asia/Karachi', country: 'Pakistan' }
        };
    }

    async init() {
        try {
            console.log('🕐 Initializing Time.is Style Clock...');
            
            // Detect user location
            await this.detectUserLocation();
            
            // Add some default world cities
            this.popularCities.slice(0, 6).forEach(city => {
                this.worldCities.add(city.name);
            });
            
            // Start time updates
            this.updatePrimaryTime();
            this.updateWorldTimes();
            this.renderPopularCities();
            
            // Setup search functionality
            this.setupCitySearch();
            
            // Start update interval
            this.updateInterval = setInterval(() => {
                this.updatePrimaryTime();
                this.updateWorldTimes();
            }, 1000);
            
            console.log('✅ Time.is Style Clock initialized!');
        } catch (error) {
            console.error('Failed to initialize app:', error);
        }
    }

    async detectUserLocation() {
        try {
            // Try to get user's timezone from browser
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            this.currentTimezone = timezone;
            
            // Extract city name from timezone if possible
            const parts = timezone.split('/');
            if (parts.length > 1) {
                this.currentLocation = parts[parts.length - 1].replace(/_/g, ' ');
            }
            
            // Update location display
            document.getElementById('locationName').textContent = this.currentLocation;
            document.getElementById('defaultLocation').textContent = this.currentLocation;
            
        } catch (error) {
            console.error('Could not detect location:', error);
        }
    }

    updatePrimaryTime() {
        const now = new Date();
        
        // Format time as individual digits like time.is
        const timeString = now.toLocaleTimeString('en-US', {
            timeZone: this.currentTimezone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const [hours, minutes, seconds] = timeString.split(':');
        
        // Update individual digit elements with animation
        this.updateDigit('h1', hours[0]);
        this.updateDigit('h2', hours[1]);
        this.updateDigit('m1', minutes[0]);
        this.updateDigit('m2', minutes[1]);
        this.updateDigit('s1', seconds[0]);
        this.updateDigit('s2', seconds[1]);
        
        // Update date display
        this.updateDateDisplay(now);
        
        // Update sun times (simplified)
        this.updateSunTimes();
    }

    updateDigit(digitId, newValue) {
        const digitEl = document.getElementById(digitId);
        if (digitEl && digitEl.textContent !== newValue) {
            digitEl.textContent = newValue;
            digitEl.classList.add('changed');
            setTimeout(() => {
                digitEl.classList.remove('changed');
            }, 300);
        }
    }

    updateDateDisplay(date) {
        const dateEl = document.getElementById('dateText');
        if (dateEl) {
            const options = {
                timeZone: this.currentTimezone,
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            };
            
            const dateString = date.toLocaleDateString('en-US', options);
            const weekNumber = this.getWeekNumber(date);
            
            dateEl.textContent = `${dateString}, week ${weekNumber}`;
        }
    }

    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    updateSunTimes() {
        // Simplified sun times calculation
        const now = new Date();
        const month = now.getMonth();
        
        // Approximate sunrise/sunset times based on season
        let sunrise, sunset;
        if (month >= 3 && month <= 8) { // Spring/Summer
            sunrise = "05:30";
            sunset = "19:30";
        } else { // Fall/Winter
            sunrise = "06:30";
            sunset = "18:30";
        }
        
        const sunriseEl = document.getElementById('sunriseTime');
        const sunsetEl = document.getElementById('sunsetTime');
        const dayLengthEl = document.getElementById('dayLength');
        
        if (sunriseEl) sunriseEl.textContent = sunrise;
        if (sunsetEl) sunsetEl.textContent = sunset;
        
        // Calculate day length
        if (dayLengthEl) {
            const [sHour, sMin] = sunrise.split(':').map(Number);
            const [eHour, eMin] = sunset.split(':').map(Number);
            const totalMinutes = (eHour * 60 + eMin) - (sHour * 60 + sMin);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            dayLengthEl.textContent = `${hours}h ${minutes}m`;
        }
    }

    updateWorldTimes() {
        const grid = document.getElementById('worldTimeGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        Array.from(this.worldCities).forEach(cityName => {
            const cityData = this.cityDatabase[cityName];
            if (!cityData) return;
            
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                timeZone: cityData.timezone,
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const dateString = now.toLocaleDateString('en-US', {
                timeZone: cityData.timezone,
                month: 'short',
                day: 'numeric'
            });
            
            const item = document.createElement('div');
            item.className = 'world-time-item';
            item.innerHTML = `
                <div class="world-time-city">${cityName}</div>
                <div class="world-time-digits">${timeString}</div>
                <div class="world-time-date">${dateString}</div>
            `;
            
            grid.appendChild(item);
        });
    }

    renderPopularCities() {
        const citiesList = document.getElementById('popularCitiesList');
        if (!citiesList) return;
        
        citiesList.innerHTML = '';
        
        this.popularCities.forEach(city => {
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'city-link';
            link.textContent = city.name;
            link.onclick = (e) => {
                e.preventDefault();
                this.addCityToWorld(city.name);
            };
            
            citiesList.appendChild(link);
        });
    }

    setupCitySearch() {
        const searchInput = document.getElementById('citySearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performCitySearch(e.target.value);
            });
        }
    }

    performCitySearch(query) {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) return;
        
        if (query.length < 2) {
            resultsContainer.innerHTML = '';
            return;
        }
        
        const results = Object.entries(this.cityDatabase)
            .filter(([cityName, cityData]) => 
                cityName.toLowerCase().includes(query.toLowerCase()) ||
                cityData.country.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 10);
        
        resultsContainer.innerHTML = '';
        
        results.forEach(([cityName, cityData]) => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.onclick = () => {
                this.addCityToWorld(cityName);
                this.closeCitySearch();
            };
            
            item.innerHTML = `
                <div class="result-city">${cityName}</div>
                <div class="result-country">${cityData.country}</div>
            `;
            
            resultsContainer.appendChild(item);
        });
    }

    addCityToWorld(cityName) {
        this.worldCities.add(cityName);
        this.updateWorldTimes();
    }

    showCitySearch() {
        const modal = document.getElementById('citySearchModal');
        if (modal) {
            modal.classList.add('active');
            document.getElementById('citySearchInput').focus();
        }
    }

    closeCitySearch() {
        const modal = document.getElementById('citySearchModal');
        if (modal) {
            modal.classList.remove('active');
            document.getElementById('citySearchInput').value = '';
            document.getElementById('searchResults').innerHTML = '';
        }
    }

    setAsDefault() {
        localStorage.setItem('timely-default-timezone', this.currentTimezone);
        localStorage.setItem('timely-default-location', this.currentLocation);
        alert(`${this.currentLocation} time has been set as default!`);
    }

    addToFavorites() {
        const favorites = JSON.parse(localStorage.getItem('timely-favorites') || '[]');
        const favorite = {
            name: this.currentLocation,
            timezone: this.currentTimezone
        };
        
        if (!favorites.some(f => f.timezone === this.currentTimezone)) {
            favorites.push(favorite);
            localStorage.setItem('timely-favorites', JSON.stringify(favorites));
            alert(`${this.currentLocation} added to favorites!`);
        } else {
            alert(`${this.currentLocation} is already in favorites!`);
        }
    }
}

// Initialize the app
const timelyApp = new TimeIsStyleApp();

document.addEventListener('DOMContentLoaded', async () => {
    await timelyApp.init();
});

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('citySearchModal');
    if (e.target === modal) {
        timelyApp.closeCitySearch();
    }
});
