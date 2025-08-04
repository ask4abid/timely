// Enhanced UTC Implementation for Timely World Clock
// Based on official UTC standards from Wikipedia and ITU-R recommendations

class UTCTimeSystem {
    constructor() {
        // UTC offset ranges from UTC-12:00 to UTC+14:00 (as per Wikipedia)
        this.minOffset = -12;
        this.maxOffset = 14;
        
        // Current leap seconds (as of 2025 - 27 leap seconds total)
        this.leapSecondsCount = 27;
        
        // UTC reference cities that don't use daylight saving time
        this.utcReferenceCities = [
            'Accra', 'Reykjavik', 'Casablanca', 'Monrovia', 'Dakar'
        ];
        
        this.initializeUTCSystem();
    }

    initializeUTCSystem() {
        // Set up UTC time tracking
        this.utcNow = new Date();
        
        // Initialize offset calculation cache for performance
        this.offsetCache = new Map();
        
        console.log('✅ UTC Time System initialized');
        console.log(`📡 Current UTC: ${this.getCurrentUTC()}`);
        console.log(`🌍 UTC Offset Range: UTC${this.minOffset} to UTC+${this.maxOffset}`);
    }

    // Get current UTC time in ISO format
    getCurrentUTC() {
        return new Date().toISOString();
    }

    // Get UTC timestamp (milliseconds since epoch)
    getUTCTimestamp() {
        return Date.now();
    }

    // Calculate UTC offset for any timezone
    calculateUTCOffset(timezone) {
        if (this.offsetCache.has(timezone)) {
            return this.offsetCache.get(timezone);
        }

        try {
            // Create a date in the target timezone
            const now = new Date();
            const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
            
            // Use Intl.DateTimeFormat to get timezone-specific time
            const targetTime = new Date(utcTime).toLocaleString('en-US', {
                timeZone: timezone,
                hour12: false,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            // Parse the target time and compare with UTC
            const targetDate = new Date(targetTime);
            const offsetMs = targetDate.getTime() - utcTime;
            const offsetHours = Math.round(offsetMs / (1000 * 60 * 60));
            
            // Ensure offset is within valid UTC range
            const clampedOffset = Math.max(this.minOffset, Math.min(this.maxOffset, offsetHours));
            
            // Cache the result for performance
            this.offsetCache.set(timezone, clampedOffset);
            
            return clampedOffset;
            
        } catch (error) {
            console.warn(`⚠️ Error calculating UTC offset for ${timezone}:`, error);
            return 0; // Default to UTC±0
        }
    }

    // Format UTC offset as per international standards (e.g., +05, -03, +00)
    formatUTCOffset(offsetHours) {
        if (offsetHours === 0) {
            return '+00'; // UTC±0 (standard notation)
        }
        
        const sign = offsetHours >= 0 ? '+' : '-';
        const absOffset = Math.abs(offsetHours);
        
        // Format as integer without decimal places (as requested)
        return `${sign}${absOffset.toString().padStart(2, '0')}`;
    }

    // Get time in specific timezone with UTC offset display
    getTimeWithUTCOffset(timezone) {
        try {
            const now = new Date();
            const offset = this.calculateUTCOffset(timezone);
            const formattedOffset = this.formatUTCOffset(offset);
            
            // Get local time in the target timezone
            const timeInTimezone = new Date(now.toLocaleString('en-US', {
                timeZone: timezone
            }));

            // Format time according to user preference
            const timeString = timeInTimezone.toLocaleTimeString('en-US', {
                hour12: false, // Use 24-hour format for international standard
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            return {
                time: timeString,
                utcOffset: formattedOffset,
                offsetValue: offset,
                timezone: timezone,
                isUTC: offset === 0,
                displayString: `${timeString} (UTC${formattedOffset})`
            };
            
        } catch (error) {
            console.error(`❌ Error getting time for ${timezone}:`, error);
            return {
                time: '--:--:--',
                utcOffset: '+00',
                offsetValue: 0,
                timezone: timezone,
                isUTC: true,
                displayString: '--:--:-- (UTC+00)'
            };
        }
    }

    // Get comprehensive timezone information
    getTimezoneInfo(timezone) {
        const timeData = this.getTimeWithUTCOffset(timezone);
        const now = new Date();
        
        return {
            ...timeData,
            date: now.toLocaleDateString('en-US', {
                timeZone: timezone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }),
            dayOfWeek: now.toLocaleDateString('en-US', {
                timeZone: timezone,
                weekday: 'long'
            }),
            isDST: this.isDaylightSavingTime(timezone),
            isBusinessHours: this.isBusinessHours(timeData.time),
            relativeToUTC: this.getRelativeTimeToUTC(timeData.offsetValue)
        };
    }

    // Check if timezone is currently observing daylight saving time
    isDaylightSavingTime(timezone) {
        try {
            const january = new Date(new Date().getFullYear(), 0, 1);
            const july = new Date(new Date().getFullYear(), 6, 1);
            
            const janOffset = this.calculateOffsetForDate(timezone, january);
            const julOffset = this.calculateOffsetForDate(timezone, july);
            
            const currentOffset = this.calculateUTCOffset(timezone);
            
            // If current offset differs from January, likely in DST
            return currentOffset !== janOffset;
            
        } catch (error) {
            return false;
        }
    }

    calculateOffsetForDate(timezone, date) {
        const utcTime = date.getTime();
        const targetTime = new Date(date.toLocaleString('en-US', {
            timeZone: timezone
        }));
        
        const offsetMs = targetTime.getTime() - utcTime;
        return Math.round(offsetMs / (1000 * 60 * 60));
    }

    // Check if time falls within typical business hours (09:00-17:00)
    isBusinessHours(timeString) {
        const [hours] = timeString.split(':').map(Number);
        return hours >= 9 && hours < 17;
    }

    // Get relative time description compared to UTC
    getRelativeTimeToUTC(offsetHours) {
        if (offsetHours === 0) {
            return 'Same as UTC';
        } else if (offsetHours > 0) {
            return `${offsetHours} hour${offsetHours !== 1 ? 's' : ''} ahead of UTC`;
        } else {
            return `${Math.abs(offsetHours)} hour${Math.abs(offsetHours) !== 1 ? 's' : ''} behind UTC`;
        }
    }

    // Convert any local time to UTC
    convertToUTC(localTime, fromTimezone) {
        try {
            const offset = this.calculateUTCOffset(fromTimezone);
            const localDate = new Date(localTime);
            const utcTime = new Date(localDate.getTime() - (offset * 60 * 60 * 1000));
            
            return {
                utcTime: utcTime.toISOString(),
                originalTime: localTime,
                fromTimezone: fromTimezone,
                offsetApplied: offset
            };
        } catch (error) {
            console.error('❌ Error converting to UTC:', error);
            return null;
        }
    }

    // Convert UTC time to any timezone
    convertFromUTC(utcTime, toTimezone) {
        try {
            const offset = this.calculateUTCOffset(toTimezone);
            const utcDate = new Date(utcTime);
            const localTime = new Date(utcDate.getTime() + (offset * 60 * 60 * 1000));
            
            return {
                localTime: localTime.toISOString(),
                utcTime: utcTime,
                toTimezone: toTimezone,
                offsetApplied: offset,
                displayTime: this.getTimeWithUTCOffset(toTimezone)
            };
        } catch (error) {
            console.error('❌ Error converting from UTC:', error);
            return null;
        }
    }

    // Get all UTC offsets in use worldwide
    getAllUTCOffsets() {
        const offsets = [];
        for (let i = this.minOffset; i <= this.maxOffset; i++) {
            // Include half-hour offsets for some regions
            offsets.push(i);
            if (i < this.maxOffset && [3, 4, 5, 6, 9, 10].includes(i)) {
                offsets.push(i + 0.5); // UTC+3:30, UTC+4:30, etc.
            }
        }
        return offsets.map(offset => this.formatUTCOffset(offset));
    }

    // Validate timezone string
    isValidTimezone(timezone) {
        try {
            Intl.DateTimeFormat(undefined, { timeZone: timezone });
            return true;
        } catch (error) {
            return false;
        }
    }

    // Get UTC time with leap second information
    getUTCWithLeapSecondInfo() {
        const utcTime = this.getCurrentUTC();
        return {
            utcTime: utcTime,
            leapSecondsTotal: this.leapSecondsCount,
            lastLeapSecond: 'December 31, 2016', // Last added leap second
            nextLeapSecond: 'To be determined by IERS',
            note: 'Leap seconds may be eliminated by 2035 (CGPM Resolution 2022)'
        };
    }

    // Performance monitoring for UTC calculations
    benchmarkUTCCalculations(timezone, iterations = 1000) {
        const startTime = performance.now();
        
        for (let i = 0; i < iterations; i++) {
            this.getTimeWithUTCOffset(timezone);
        }
        
        const endTime = performance.now();
        const avgTime = (endTime - startTime) / iterations;
        
        console.log(`⚡ UTC Calculation Benchmark for ${timezone}:`);
        console.log(`   Average time per calculation: ${avgTime.toFixed(3)}ms`);
        console.log(`   Total time for ${iterations} calculations: ${(endTime - startTime).toFixed(2)}ms`);
        
        return {
            averageTime: avgTime,
            totalTime: endTime - startTime,
            iterations: iterations,
            timezone: timezone
        };
    }

    // Clear offset cache (useful for memory management)
    clearCache() {
        this.offsetCache.clear();
        console.log('🧹 UTC offset cache cleared');
    }

    // Get system status
    getSystemStatus() {
        return {
            utcTime: this.getCurrentUTC(),
            cacheSize: this.offsetCache.size,
            leapSeconds: this.leapSecondsCount,
            offsetRange: `UTC${this.minOffset} to UTC+${this.maxOffset}`,
            referenceCities: this.utcReferenceCities,
            isOperational: true
        };
    }
}

// Initialize UTC system
window.utcSystem = new UTCTimeSystem();

// Utility functions for easy access
function getUTCOffset(timezone) {
    return window.utcSystem.formatUTCOffset(
        window.utcSystem.calculateUTCOffset(timezone)
    );
}

function getCurrentUTC() {
    return window.utcSystem.getCurrentUTC();
}

function getTimeWithOffset(timezone) {
    return window.utcSystem.getTimeWithUTCOffset(timezone);
}

function getTimezoneInfo(timezone) {
    return window.utcSystem.getTimezoneInfo(timezone);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UTCTimeSystem, getUTCOffset, getCurrentUTC, getTimeWithOffset, getTimezoneInfo };
}

console.log('🌍 Enhanced UTC Time System loaded and ready!');
console.log('📖 Based on official UTC standards from ITU-R and IERS');
console.log('⚡ Performance optimized with caching and efficient calculations');
