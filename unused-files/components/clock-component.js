/**
 * Clock Component
 * Displays live clocks for different timezones with various formats and themes
 */

import { CONFIG } from '../../config/app-config.js';
import { DOMUtils } from '../utils/dom-utils.js';
import { Logger } from '../utils/logger.js';

export class ClockComponent {
    constructor(timeService) {
        this.timeService = timeService;
        this.logger = new Logger('ClockComponent');
        this.clocks = new Map(); // Store clock instances
        this.container = null;
        this.clockFormat = CONFIG.UI.DEFAULT_CLOCK_FORMAT;
        this.theme = CONFIG.CLOCK.DEFAULT_THEME;
        
        this.init();
    }

    /**
     * Initialize the clock component
     */
    init() {
        this.container = DOMUtils.$('#clockContainer');
        if (!this.container) {
            this.logger.error('Clock container not found');
            return;
        }

        this.setupEventListeners();
        this.applyTheme();
        this.logger.info('Clock component initialized');
    }

    /**
     * Add a new clock for a timezone
     * @param {Object} timezoneData - Timezone information
     * @param {Object} options - Display options
     */
    addClock(timezoneData, options = {}) {
        const {
            showFlag = true,
            showDate = true,
            showTimezone = true,
            size = 'medium',
            position = 'append'
        } = options;

        const clockId = `clock_${timezoneData.timezone.replace(/[\/\s]/g, '_')}`;
        
        // Remove existing clock if it exists
        if (this.clocks.has(clockId)) {
            this.removeClock(clockId);
        }

        // Create clock element
        const clockElement = this.createClockElement(timezoneData, {
            clockId,
            showFlag,
            showDate,
            showTimezone,
            size
        });

        // Add to container
        if (position === 'prepend') {
            this.container.insertBefore(clockElement, this.container.firstChild);
        } else {
            this.container.appendChild(clockElement);
        }

        // Start live updates
        const updateClockId = this.timeService.startLiveClock(
            timezoneData.timezone,
            (timeInfo) => this.updateClockDisplay(clockId, timeInfo)
        );

        // Store clock reference
        this.clocks.set(clockId, {
            element: clockElement,
            timezone: timezoneData.timezone,
            updateClockId,
            options: { showFlag, showDate, showTimezone, size }
        });

        this.logger.debug(`Added clock for ${timezoneData.timezone}`);
        return clockId;
    }

    /**
     * Remove a clock
     * @param {string} clockId - Clock identifier
     */
    removeClock(clockId) {
        const clock = this.clocks.get(clockId);
        if (clock) {
            // Stop live updates
            this.timeService.stopLiveClock(clock.updateClockId);
            
            // Remove from DOM
            if (clock.element.parentNode) {
                clock.element.parentNode.removeChild(clock.element);
            }
            
            // Remove from map
            this.clocks.delete(clockId);
            
            this.logger.debug(`Removed clock: ${clockId}`);
        }
    }

    /**
     * Clear all clocks
     */
    clearAllClocks() {
        this.clocks.forEach((clock, clockId) => {
            this.removeClock(clockId);
        });
        this.logger.debug('Cleared all clocks');
    }

    /**
     * Create clock HTML element
     * @private
     */
    createClockElement(timezoneData, options) {
        const { clockId, showFlag, showDate, showTimezone, size } = options;
        
        const clockElement = DOMUtils.createElement('div', {
            className: `clock-item clock-${size}`,
            id: clockId,
            'data-timezone': timezoneData.timezone
        });

        const flagEmoji = this.getTimezoneFlag(timezoneData.timezone);
        
        clockElement.innerHTML = `
            <div class="clock-header">
                ${showFlag ? `<span class="clock-flag">${flagEmoji}</span>` : ''}
                <div class="clock-location">
                    <div class="clock-city">${this.getCityName(timezoneData.timezone)}</div>
                    ${showTimezone ? `<div class="clock-timezone">${timezoneData.timezone}</div>` : ''}
                </div>
                <button class="clock-remove" onclick="window.timely?.removeClock('${clockId}')" aria-label="Remove clock">
                    ✕
                </button>
            </div>
            
            <div class="clock-display">
                <div class="clock-time" data-time="">Loading...</div>
                ${showDate ? '<div class="clock-date" data-date="">Loading...</div>' : ''}
                <div class="clock-info">
                    <span class="clock-offset" data-offset=""></span>
                    <span class="clock-dst" data-dst=""></span>
                </div>
            </div>
            
            <div class="clock-actions">
                <button class="clock-action" onclick="window.timely?.setAsDefault('${timezoneData.timezone}')" title="Set as default timezone">
                    🏠
                </button>
                <button class="clock-action" onclick="window.timely?.compareTimes('${timezoneData.timezone}')" title="Compare with other timezones">
                    ⚖️
                </button>
            </div>
        `;

        return clockElement;
    }

    /**
     * Update clock display with new time information
     * @private
     */
    updateClockDisplay(clockId, timeInfo) {
        const clock = this.clocks.get(clockId);
        if (!clock) return;

        const element = clock.element;
        
        // Update time
        const timeElement = DOMUtils.$('.clock-time', element);
        if (timeElement) {
            timeElement.textContent = timeInfo.time;
            timeElement.setAttribute('data-time', timeInfo.timestamp);
        }

        // Update date
        const dateElement = DOMUtils.$('.clock-date', element);
        if (dateElement && timeInfo.date) {
            dateElement.textContent = timeInfo.date;
            dateElement.setAttribute('data-date', timeInfo.date);
        }

        // Update timezone offset
        const offsetElement = DOMUtils.$('.clock-offset', element);
        if (offsetElement && timeInfo.utcOffset) {
            offsetElement.textContent = timeInfo.utcOffset;
            offsetElement.setAttribute('data-offset', timeInfo.utcOffset);
        }

        // Update DST indicator
        const dstElement = DOMUtils.$('.clock-dst', element);
        if (dstElement) {
            dstElement.textContent = timeInfo.isDst ? 'DST' : '';
            dstElement.setAttribute('data-dst', timeInfo.isDst);
            dstElement.className = `clock-dst ${timeInfo.isDst ? 'dst-active' : ''}`;
        }

        // Add visual feedback for updates
        element.classList.add('clock-updated');
        setTimeout(() => {
            element.classList.remove('clock-updated');
        }, 200);
    }

    /**
     * Toggle between 12h and 24h format
     */
    toggleClockFormat() {
        this.clockFormat = this.clockFormat === '12h' ? '24h' : '12h';
        
        // Update all clocks with new format
        this.clocks.forEach((clock) => {
            // Force refresh with new format
            this.timeService.getTimeForTimezone(clock.timezone).then(timeInfo => {
                const formattedTime = this.timeService.formatTime(timeInfo.currentTime, {
                    timezone: clock.timezone,
                    format12h: this.clockFormat === '12h'
                });
                this.updateClockDisplay(clock.element.id, formattedTime);
            });
        });

        this.logger.debug(`Clock format changed to: ${this.clockFormat}`);
    }

    /**
     * Change theme
     * @param {string} theme - Theme name ('light', 'dark', 'auto')
     */
    setTheme(theme) {
        this.theme = theme;
        this.applyTheme();
        this.logger.debug(`Theme changed to: ${theme}`);
    }

    /**
     * Apply current theme
     * @private
     */
    applyTheme() {
        if (!this.container) return;

        // Remove existing theme classes
        this.container.classList.remove('theme-light', 'theme-dark', 'theme-auto');
        
        // Apply new theme
        this.container.classList.add(`theme-${this.theme}`);

        // Handle auto theme
        if (this.theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.container.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
        }
    }

    /**
     * Setup event listeners
     * @private
     */
    setupEventListeners() {
        // Theme change detection
        if (this.theme === 'auto') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener(() => this.applyTheme());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 't':
                        e.preventDefault();
                        this.toggleClockFormat();
                        break;
                    case 'd':
                        e.preventDefault();
                        this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
                        break;
                }
            }
        });
    }

    /**
     * Get city name from timezone
     * @private
     */
    getCityName(timezone) {
        const parts = timezone.split('/');
        const city = parts[parts.length - 1];
        return city.replace(/_/g, ' ');
    }

    /**
     * Get flag emoji for timezone
     * @private
     */
    getTimezoneFlag(timezone) {
        // Map common timezones to flags
        const flagMap = {
            'America/New_York': '🇺🇸',
            'America/Los_Angeles': '🇺🇸',
            'America/Chicago': '🇺🇸',
            'Europe/London': '🇬🇧',
            'Europe/Paris': '🇫🇷',
            'Europe/Berlin': '🇩🇪',
            'Europe/Rome': '🇮🇹',
            'Asia/Tokyo': '🇯🇵',
            'Asia/Shanghai': '🇨🇳',
            'Asia/Karachi': '🇵🇰',
            'Asia/Dubai': '🇦🇪',
            'Asia/Singapore': '🇸🇬',
            'Australia/Sydney': '🇦🇺',
            'Pacific/Auckland': '🇳🇿'
        };

        return flagMap[timezone] || '🌍';
    }

    /**
     * Get component statistics
     */
    getStats() {
        return {
            activeClocks: this.clocks.size,
            clockFormat: this.clockFormat,
            theme: this.theme,
            clockList: Array.from(this.clocks.keys())
        };
    }

    /**
     * Export clock configuration
     */
    exportConfiguration() {
        const config = {
            clocks: Array.from(this.clocks.values()).map(clock => ({
                timezone: clock.timezone,
                options: clock.options
            })),
            format: this.clockFormat,
            theme: this.theme,
            exportedAt: new Date().toISOString()
        };

        return config;
    }

    /**
     * Import clock configuration
     * @param {Object} config - Configuration object
     */
    async importConfiguration(config) {
        try {
            // Clear existing clocks
            this.clearAllClocks();
            
            // Set format and theme
            this.clockFormat = config.format || CONFIG.UI.DEFAULT_CLOCK_FORMAT;
            this.setTheme(config.theme || CONFIG.CLOCK.DEFAULT_THEME);
            
            // Add clocks
            for (const clockConfig of config.clocks) {
                const timeInfo = await this.timeService.getTimeForTimezone(clockConfig.timezone);
                this.addClock(timeInfo, clockConfig.options);
            }
            
            this.logger.info('Clock configuration imported successfully');
        } catch (error) {
            this.logger.error('Failed to import configuration:', error);
            throw error;
        }
    }

    /**
     * Cleanup resources
     */
    destroy() {
        this.clearAllClocks();
        this.container = null;
        this.logger.info('Clock component destroyed');
    }
}
