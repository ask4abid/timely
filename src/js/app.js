/**
 * Timely - World Clock Application
 * Main application entry point for timezone and world clock functionality
 * 
 * Features:
 * - Real-time world clocks for multiple timezones
 * - Timezone search and management
 * - Time conversion between zones
 * - Favorite timezone quick access
 * - Mobile-responsive design
 * 
 * @author Timely Development Team
 * @version 2.0.0
 */

// Import all necessary modules
import { Logger } from './utils/logger.js';
import { DOMUtils } from './utils/dom-utils.js';
import { SearchComponent } from './components/search-component.js';
import { ClockComponent } from './components/clock-component.js';
import { TimeService } from './services/time-service.js';
import { CONFIG } from '../config/app-config.js';

/**
 * Main Timely Application Class
 * Orchestrates all components and manages application state
 */
export class TimelyApp {
    constructor() {
        this.logger = new Logger('TimelyApp');
        this.timeService = new TimeService();
        this.searchComponent = null;
        this.clockComponents = new Map(); // Track active clocks
        this.isInitialized = false;
        
        // Performance tracking
        this.performanceMetrics = {
            startTime: performance.now(),
            clocksAdded: 0,
            randomRequests: 0,
            searchCount: 0
        };
        
        // Bind methods to maintain context
        this.handleTimezoneAdd = this.handleTimezoneAdd.bind(this);
        this.handleClockRemove = this.handleClockRemove.bind(this);
        this.handleRandomTimezone = this.handleRandomTimezone.bind(this);
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            this.logger.info('Initializing Timely application...');
            this.logger.group('App Initialization');
            
            const initStartTime = performance.now();
            
            // Wait for DOM to be ready
            await this.waitForDOM();
            
            // Initialize core services
            await this.timeService.initialize();
            
            // Setup UI components
            await this.initializeComponents();
            
            // Setup error handling
            this.setupErrorHandling();
            
            // Setup periodic cleanup
            this.setupPeriodicCleanup();
            
            // Setup welcome screen
            this.setupWelcomeScreen();
            
            // Load favorite timezones if any
            this.loadFavoriteTimezones();
            
            this.isInitialized = true;
            
            this.logger.performance('App initialization', initStartTime);
            this.logger.groupEnd();
            this.logger.info('Timely application initialized successfully');
            
        } catch (error) {
            this.logger.error('Failed to initialize application:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Wait for DOM to be ready
     * @private
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve, { once: true });
            } else {
                resolve();
            }
        });
    }

    /**
     * Initialize all components
     * @private
     */
    async initializeComponents() {
        // Initialize search component
        this.searchComponent = new SearchComponent(
            (timezone) => this.handleTimezoneAdd(timezone),
            () => this.handleRandomTimezone()
        );

        // Setup clock container and welcome section
        this.clockContainer = document.getElementById('clockContainer');
        this.welcomeSection = document.getElementById('welcomeSection');

        // Setup event listeners
        this.setupEventListeners();
        
        this.logger.debug('Components initialized');
    }

    /**
     * Setup global event listeners
     * @private
     */
    setupEventListeners() {
        // Search button
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = document.getElementById('timezoneInput')?.value.trim();
                if (query) {
                    this.handleTimezoneAdd(query);
                }
            });
        }

        // Random button
        const randomBtn = document.querySelector('.random-btn');
        if (randomBtn) {
            randomBtn.addEventListener('click', this.handleRandomTimezone);
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && event.target.id === 'timezoneInput') {
                event.preventDefault();
                const query = event.target.value.trim();
                if (query) {
                    this.handleTimezoneAdd(query);
                }
            }
        });

        // Handle visibility change for clock updates
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.refreshAllClocks();
            }
        });

        // Update clocks every minute
        setInterval(() => {
            this.refreshAllClocks();
        }, 60000);
    }

    /**
     * Setup welcome screen content
     * @private
     */
    setupWelcomeScreen() {
        if (!this.welcomeSection) return;

        this.welcomeSection.innerHTML = `
            <div class="welcome-content">
                <div class="welcome-icon">🕐</div>
                <h2>Welcome to Timely</h2>
                <p>Your ultimate world clock and timezone companion</p>
                <div class="welcome-features">
                    <div class="feature">
                        <span class="feature-icon">🌍</span>
                        <span>Multiple world clocks</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">🔍</span>
                        <span>Search any city or timezone</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">⏰</span>
                        <span>Real-time updates</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">💾</span>
                        <span>Save favorite timezones</span>
                    </div>
                </div>
                <p class="welcome-hint">
                    <strong>Get started:</strong> Search for a city above or try one of the quick access buttons
                </p>
            </div>
        `;
    }

    /**
     * Load favorite timezones from config
     * @private
     */
    loadFavoriteTimezones() {
        if (CONFIG.TIMEZONES?.FAVORITES?.length > 0) {
            CONFIG.TIMEZONES.FAVORITES.forEach(timezone => {
                this.addClock(timezone, false); // Don't show loading for favorites
            });
        }
    }

    /**
     * Handle adding a new timezone/clock
     */
    async handleTimezoneAdd(query) {
        if (!query) return;

        try {
            this.logger.info(`Adding clock for: ${query}`);
            await this.addClock(query, true);
            
            // Clear search input
            const timezoneInput = document.getElementById('timezoneInput');
            if (timezoneInput) {
                timezoneInput.value = '';
            }

            // Track metrics
            this.performanceMetrics.clocksAdded++;
            this.performanceMetrics.searchCount++;
            
        } catch (error) {
            this.logger.error('Failed to add timezone:', error);
            this.showErrorMessage(`Could not add clock for "${query}". Please try a different city or timezone.`);
        }
    }

    /**
     * Add a clock for the specified timezone
     */
    async addClock(timezone, showLoading = true) {
        // Hide welcome section if it's visible
        if (this.welcomeSection) {
            this.welcomeSection.style.display = 'none';
        }

        // Show clock container
        if (this.clockContainer) {
            this.clockContainer.style.display = 'grid';
        }

        // Create clock component
        const clockComponent = new ClockComponent(timezone, {
            onRemove: this.handleClockRemove,
            showLoading: showLoading
        });

        // Add to container
        const clockElement = await clockComponent.render();
        if (this.clockContainer && clockElement) {
            this.clockContainer.appendChild(clockElement);
            
            // Store reference
            const clockId = clockComponent.getId();
            this.clockComponents.set(clockId, clockComponent);
            
            // Start the clock
            await clockComponent.start();
        }
    }

    /**
     * Handle clock removal
     */
    handleClockRemove(clockId) {
        const clockComponent = this.clockComponents.get(clockId);
        if (clockComponent) {
            clockComponent.destroy();
            this.clockComponents.delete(clockId);
        }

        // Show welcome screen if no clocks remain
        if (this.clockComponents.size === 0) {
            if (this.clockContainer) {
                this.clockContainer.style.display = 'none';
            }
            if (this.welcomeSection) {
                this.welcomeSection.style.display = 'block';
            }
        }
    }

    /**
     * Handle random timezone request
     */
    async handleRandomTimezone() {
        try {
            this.logger.info('Getting random timezone...');
            const randomTimezone = await this.timeService.getRandomTimezone();
            
            if (randomTimezone) {
                await this.handleTimezoneAdd(randomTimezone);
                this.performanceMetrics.randomRequests++;
            }
        } catch (error) {
            this.logger.error('Failed to get random timezone:', error);
            this.showErrorMessage('Could not get a random timezone. Please try again.');
        }
    }

    /**
     * Refresh all active clocks
     */
    refreshAllClocks() {
        this.clockComponents.forEach(clockComponent => {
            clockComponent.refresh();
        });
    }

    /**
     * Setup global error handling
     * @private
     */
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            this.logger.error('Global error:', event.error);
            this.showErrorMessage('An unexpected error occurred');
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.logger.error('Unhandled promise rejection:', event.reason);
            this.showErrorMessage('A network error occurred');
        });
    }

    /**
     * Setup periodic cleanup tasks
     * @private
     */
    setupPeriodicCleanup() {
        // Cleanup expired cache entries every 10 minutes
        setInterval(() => {
            const cleaned = this.timeService.cache?.cleanup();
            if (cleaned > 0) {
                this.logger.debug(`Cleaned ${cleaned} expired cache entries`);
            }
        }, 10 * 60 * 1000);
    }

    /**
     * Show error message to user
     */
    showErrorMessage(message) {
        // Create and show error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--error-color);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 300px;
            font-size: 14px;
            line-height: 1.4;
        `;

        document.body.appendChild(errorDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    /**
     * Handle initialization error
     * @private
     */
    handleInitializationError(error) {
        const errorMessage = `
            <div style="text-align: center; padding: 50px; color: #dc3545;">
                <h2>❌ Application Failed to Load</h2>
                <p>Sorry, there was an error initializing Timely.</p>
                <p>Please refresh the page to try again.</p>
                <button onclick="window.location.reload()" style="
                    padding: 10px 20px; 
                    background: #007bff; 
                    color: white; 
                    border: none; 
                    border-radius: 5px; 
                    cursor: pointer;
                    margin-top: 15px;
                ">
                    🔄 Refresh Page
                </button>
                <details style="margin-top: 20px; text-align: left;">
                    <summary>Technical Details</summary>
                    <pre style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin-top: 10px;">
${error.message}
${error.stack || ''}
                    </pre>
                </details>
            </div>
        `;
        
        document.body.innerHTML = errorMessage;
    }

    /**
     * Get application metrics
     */
    getMetrics() {
        const cacheStats = this.timeService.getCacheStats?.() || {};
        const uptime = performance.now() - this.performanceMetrics.startTime;
        
        return {
            uptime: Math.round(uptime),
            clocksAdded: this.performanceMetrics.clocksAdded,
            randomRequests: this.performanceMetrics.randomRequests,
            searchCount: this.performanceMetrics.searchCount,
            activeClocks: this.clockComponents.size,
            cache: cacheStats,
            isInitialized: this.isInitialized
        };
    }

    /**
     * Export current timezone data
     */
    exportTimezoneData() {
        if (this.clockComponents.size === 0) {
            this.logger.warn('No timezone data to export');
            return null;
        }

        const timezones = Array.from(this.clockComponents.values()).map(clock => ({
            timezone: clock.timezone,
            currentTime: clock.getCurrentTime(),
            displayName: clock.getDisplayName()
        }));

        const exportData = {
            timezones: timezones,
            exportedAt: new Date().toISOString(),
            source: 'Timely World Clock App'
        };

        // Create downloadable JSON file
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `timely-timezone-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        this.logger.info(`Exported data for ${timezones.length} timezones`);
    }

    /**
     * Clear application cache
     */
    clearCache() {
        this.timeService.clearCache?.();
        this.logger.info('Application cache cleared');
    }

    /**
     * Cleanup and destroy the application
     */
    destroy() {
        this.logger.info('Destroying Timely application...');
        
        // Destroy all clock components
        this.clockComponents.forEach(clockComponent => {
            clockComponent.destroy();
        });
        this.clockComponents.clear();

        // Destroy search component
        if (this.searchComponent) {
            this.searchComponent.destroy();
        }

        // Clean up time service
        if (this.timeService) {
            this.timeService.cleanup?.();
        }

        this.isInitialized = false;
        this.logger.info('Timely app destroyed');
    }
}

// Global error recovery function
window.recoverApp = function() {
    if (window.timelyApp) {
        window.timelyApp.destroy();
    }
    
    window.timelyApp = new TimelyApp();
    window.timelyApp.init();
};

// Initialize the application when DOM is ready
function initializeApp() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
        return;
    }

    // Prevent double initialization
    if (window.timelyApp) {
        return;
    }

    // Create and initialize app
    window.timelyApp = new TimelyApp();
    window.timelyApp.init().catch(error => {
        console.error('Failed to initialize Timely app:', error);
    });
}

// Start the application
initializeApp();

// Export for debugging purposes
if (typeof window !== 'undefined') {
    window.TimelyApp = TimelyApp;
}
