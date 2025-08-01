/**
 * TimeService
 * Handles all time-related operations including world clock, timezone conversion, and time synchronization
 */

import { CONFIG } from '../../config/app-config.js';
import { Logger } from '../utils/logger.js';
import { Cache } from '../utils/cache.js';

export class TimeService {
    constructor() {
        this.logger = new Logger('TimeService');
        this.cache = new Cache(CONFIG.PERFORMANCE.CACHE_DURATION, CONFIG.PERFORMANCE.MAX_CACHE_SIZE);
        this.clockInterval = null;
        this.activeClocks = new Map(); // Store active clock instances
        this.timeOffset = 0; // Offset from server time
        this.lastSyncTime = null;
        
        this.init();
    }

    /**
     * Initialize the time service
     */
    async init() {
        try {
            // Sync with time server for accuracy
            await this.syncWithTimeServer();
            
            // Preload popular timezones if enabled
            if (CONFIG.PERFORMANCE.PRELOAD_POPULAR_TIMEZONES) {
                await this.preloadPopularTimezones();
            }
            
            this.logger.info('TimeService initialized successfully');
        } catch (error) {
            this.logger.warn('Failed to initialize TimeService:', error);
            // Continue with local time if sync fails
        }
    }

    /**
     * Get current time for a specific timezone
     * @param {string} timezone - IANA timezone identifier (e.g., 'America/New_York')
     * @returns {Promise<Object>} Time information
     */
    async getTimeForTimezone(timezone) {
        const cacheKey = `timezone_${timezone}`;
        
        try {
            // Check cache first
            const cachedData = this.cache.get(cacheKey);
            if (cachedData) {
                // Update the current time but keep timezone info
                return this._updateCurrentTime(cachedData);
            }

            // Fetch timezone information
            const timezoneInfo = await this._fetchTimezoneInfo(timezone);
            
            // Cache the timezone info (not the current time)
            this.cache.set(cacheKey, timezoneInfo);
            
            return this._updateCurrentTime(timezoneInfo);
            
        } catch (error) {
            this.logger.error(`Error getting time for timezone ${timezone}:`, error);
            // Fallback to browser's timezone calculation
            return this._getFallbackTime(timezone);
        }
    }

    /**
     * Get current time for multiple timezones
     * @param {Array<string>} timezones - Array of timezone identifiers
     * @returns {Promise<Array>} Array of time information
     */
    async getMultipleTimezones(timezones) {
        const promises = timezones.map(timezone => 
            this.getTimeForTimezone(timezone).catch(error => {
                this.logger.warn(`Failed to get time for ${timezone}:`, error);
                return this._getFallbackTime(timezone);
            })
        );

        return Promise.all(promises);
    }

    /**
     * Search for timezones by city or country name
     * @param {string} query - Search query
     * @returns {Array} Matching timezones
     */
    searchTimezones(query) {
        const searchTerm = query.toLowerCase().trim();
        
        // Get all IANA timezones (this would normally come from a timezone database)
        const allTimezones = this._getAllTimezones();
        
        return allTimezones.filter(tz => 
            tz.city.toLowerCase().includes(searchTerm) ||
            tz.country.toLowerCase().includes(searchTerm) ||
            tz.timezone.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * Calculate time difference between two timezones
     * @param {string} timezone1 - First timezone
     * @param {string} timezone2 - Second timezone
     * @returns {Promise<Object>} Time difference information
     */
    async calculateTimeDifference(timezone1, timezone2) {
        try {
            const [time1, time2] = await Promise.all([
                this.getTimeForTimezone(timezone1),
                this.getTimeForTimezone(timezone2)
            ]);

            const diff = time1.timestamp - time2.timestamp;
            const hours = Math.floor(Math.abs(diff) / (1000 * 60 * 60));
            const minutes = Math.floor((Math.abs(diff) % (1000 * 60 * 60)) / (1000 * 60));

            return {
                timezone1: time1,
                timezone2: time2,
                difference: {
                    hours,
                    minutes,
                    ahead: diff > 0 ? timezone1 : timezone2,
                    formatted: `${hours}h ${minutes}m`
                }
            };
        } catch (error) {
            this.logger.error('Error calculating time difference:', error);
            throw new Error('Failed to calculate time difference');
        }
    }

    /**
     * Start a live clock for a timezone
     * @param {string} timezone - Timezone identifier
     * @param {Function} callback - Callback function to receive time updates
     * @returns {string} Clock ID for stopping the clock
     */
    startLiveClock(timezone, callback) {
        const clockId = `${timezone}_${Date.now()}`;
        
        const updateClock = async () => {
            try {
                const timeInfo = await this.getTimeForTimezone(timezone);
                callback(timeInfo);
            } catch (error) {
                this.logger.error(`Clock update failed for ${timezone}:`, error);
                callback(this._getFallbackTime(timezone));
            }
        };

        // Initial update
        updateClock();

        // Set up interval for updates
        const interval = setInterval(updateClock, CONFIG.UI.CLOCK_UPDATE_INTERVAL);
        
        this.activeClocks.set(clockId, {
            timezone,
            interval,
            callback
        });

        this.logger.debug(`Started live clock for ${timezone} with ID: ${clockId}`);
        return clockId;
    }

    /**
     * Stop a live clock
     * @param {string} clockId - Clock ID returned from startLiveClock
     */
    stopLiveClock(clockId) {
        const clock = this.activeClocks.get(clockId);
        if (clock) {
            clearInterval(clock.interval);
            this.activeClocks.delete(clockId);
            this.logger.debug(`Stopped live clock: ${clockId}`);
        }
    }

    /**
     * Stop all active clocks
     */
    stopAllClocks() {
        this.activeClocks.forEach((clock, clockId) => {
            clearInterval(clock.interval);
        });
        this.activeClocks.clear();
        this.logger.debug('Stopped all live clocks');
    }

    /**
     * Get user's current timezone
     * @returns {string} User's timezone
     */
    getUserTimezone() {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch (error) {
            this.logger.warn('Failed to detect user timezone:', error);
            return 'UTC';
        }
    }

    /**
     * Format time according to user preferences
     * @param {Date} date - Date object
     * @param {Object} options - Formatting options
     * @returns {Object} Formatted time strings
     */
    formatTime(date, options = {}) {
        const {
            timezone = 'UTC',
            format12h = CONFIG.UI.DEFAULT_CLOCK_FORMAT === '12h',
            showSeconds = CONFIG.CLOCK.SHOW_SECONDS,
            showDate = CONFIG.CLOCK.SHOW_DATE,
            locale = 'en-US'
        } = options;

        try {
            const timeOptions = {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: format12h
            };

            if (showSeconds) {
                timeOptions.second = '2-digit';
            }

            const dateOptions = {
                timeZone: timezone,
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };

            return {
                time: date.toLocaleTimeString(locale, timeOptions),
                date: showDate ? date.toLocaleDateString(locale, dateOptions) : null,
                timezone: timezone,
                timestamp: date.getTime()
            };
        } catch (error) {
            this.logger.error('Error formatting time:', error);
            return {
                time: date.toLocaleTimeString(),
                date: showDate ? date.toLocaleDateString() : null,
                timezone: timezone,
                timestamp: date.getTime()
            };
        }
    }

    /**
     * Sync with time server for accuracy
     * @private
     */
    async syncWithTimeServer() {
        try {
            const startTime = performance.now();
            
            // Use multiple time sources for reliability
            const timeAPIs = [
                'https://worldtimeapi.org/api/timezone/UTC',
                'https://timeapi.io/api/Time/current/zone?timeZone=UTC'
            ];

            let serverTime = null;
            
            for (const api of timeAPIs) {
                try {
                    const response = await fetch(api, { 
                        timeout: 5000,
                        headers: { 'Accept': 'application/json' }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        serverTime = new Date(data.datetime || data.dateTime);
                        break;
                    }
                } catch (error) {
                    this.logger.warn(`Failed to sync with ${api}:`, error);
                }
            }

            if (serverTime) {
                const networkLatency = (performance.now() - startTime) / 2;
                const localTime = new Date();
                this.timeOffset = serverTime.getTime() - localTime.getTime() + networkLatency;
                this.lastSyncTime = Date.now();
                
                this.logger.info(`Time synchronized. Offset: ${this.timeOffset}ms`);
            }
        } catch (error) {
            this.logger.warn('Time synchronization failed:', error);
        }
    }

    /**
     * Get accurate current time (accounting for server sync)
     * @private
     */
    _getAccurateTime() {
        const now = new Date();
        if (this.timeOffset !== 0) {
            return new Date(now.getTime() + this.timeOffset);
        }
        return now;
    }

    /**
     * Fetch timezone information from API
     * @private
     */
    async _fetchTimezoneInfo(timezone) {
        try {
            const response = await fetch(
                `https://worldtimeapi.org/api/timezone/${timezone}`,
                { timeout: CONFIG.TIME_API.TIMEOUT }
            );

            if (!response.ok) {
                throw new Error(`Timezone API error: ${response.status}`);
            }

            const data = await response.json();
            
            return {
                timezone: data.timezone,
                utcOffset: data.utc_offset,
                isDst: data.dst,
                dstOffset: data.dst_offset,
                rawOffset: data.raw_offset,
                abbreviation: data.abbreviation,
                region: this._parseTimezoneRegion(timezone)
            };
        } catch (error) {
            throw new Error(`Failed to fetch timezone info: ${error.message}`);
        }
    }

    /**
     * Update current time for cached timezone info
     * @private
     */
    _updateCurrentTime(timezoneInfo) {
        const now = this._getAccurateTime();
        const formatted = this.formatTime(now, { 
            timezone: timezoneInfo.timezone,
            showSeconds: true,
            showDate: true 
        });

        return {
            ...timezoneInfo,
            ...formatted,
            currentTime: now,
            localTimeString: now.toLocaleString(),
            utcTime: new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
        };
    }

    /**
     * Get fallback time using browser's Intl API
     * @private
     */
    _getFallbackTime(timezone) {
        try {
            const now = this._getAccurateTime();
            const formatted = this.formatTime(now, { timezone });
            
            return {
                timezone,
                region: this._parseTimezoneRegion(timezone),
                ...formatted,
                currentTime: now,
                isFallback: true
            };
        } catch (error) {
            this.logger.error('Fallback time calculation failed:', error);
            const now = new Date();
            return {
                timezone: 'UTC',
                time: now.toLocaleTimeString(),
                date: now.toLocaleDateString(),
                timestamp: now.getTime(),
                error: true
            };
        }
    }

    /**
     * Parse timezone region from timezone identifier
     * @private
     */
    _parseTimezoneRegion(timezone) {
        const parts = timezone.split('/');
        return {
            continent: parts[0] || 'Unknown',
            city: parts[1]?.replace(/_/g, ' ') || 'Unknown',
            region: parts[2]?.replace(/_/g, ' ') || null
        };
    }

    /**
     * Get all available timezones (this would normally come from a database)
     * @private
     */
    _getAllTimezones() {
        // This is a simplified list. In production, you'd use a comprehensive timezone database
        return CONFIG.TIMEZONES.POPULAR.map(tz => ({
            timezone: tz.timezone,
            city: tz.city,
            country: tz.country,
            emoji: tz.emoji
        }));
    }

    /**
     * Preload popular timezones
     * @private
     */
    async preloadPopularTimezones() {
        this.logger.info('Preloading popular timezones...');
        
        const timezones = CONFIG.TIMEZONES.POPULAR.map(tz => tz.timezone);
        
        try {
            await this.getMultipleTimezones(timezones);
            this.logger.info('Popular timezones preloaded successfully');
        } catch (error) {
            this.logger.warn('Failed to preload some timezones:', error);
        }
    }

    /**
     * Get service statistics
     */
    getStats() {
        return {
            activeClocks: this.activeClocks.size,
            cacheStats: this.cache.getStats(),
            timeOffset: this.timeOffset,
            lastSyncTime: this.lastSyncTime,
            userTimezone: this.getUserTimezone()
        };
    }

    /**
     * Cleanup resources
     */
    destroy() {
        this.stopAllClocks();
        this.cache.clear();
        this.logger.info('TimeService destroyed');
    }
}
