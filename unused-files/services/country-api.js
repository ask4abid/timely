/**
 * CountryAPI Service
 * Handles all API interactions for country data
 */

import { CONFIG } from '../../config/app-config.js';
import { Logger } from '../utils/logger.js';
import { Cache } from '../utils/cache.js';

export class CountryAPIService {
    constructor() {
        this.baseURL = CONFIG.API.BASE_URL;
        this.timeout = CONFIG.API.TIMEOUT;
        this.retryAttempts = CONFIG.API.RETRY_ATTEMPTS;
        this.cache = new Cache(CONFIG.PERFORMANCE.CACHE_DURATION, CONFIG.PERFORMANCE.MAX_CACHE_SIZE);
        this.logger = new Logger('CountryAPIService');
    }

    /**
     * Search for a country by name
     * @param {string} countryName - The name of the country to search for
     * @returns {Promise<Object>} Country data
     */
    async searchCountryByName(countryName) {
        const cacheKey = `country_${countryName.toLowerCase()}`;
        
        // Check cache first
        const cachedData = this.cache.get(cacheKey);
        if (cachedData) {
            this.logger.info(`Cache hit for country: ${countryName}`);
            return cachedData;
        }

        try {
            const url = `${this.baseURL}${CONFIG.API.ENDPOINTS.BY_NAME}/${encodeURIComponent(countryName)}?fullText=false`;
            const response = await this._fetchWithRetry(url);
            
            if (!response.ok) {
                throw new Error(`Country not found: ${countryName}`);
            }
            
            const countries = await response.json();
            const country = countries[0]; // Get the first match
            
            // Cache the result
            this.cache.set(cacheKey, country);
            
            this.logger.info(`Successfully fetched data for country: ${countryName}`);
            return country;
            
        } catch (error) {
            this.logger.error(`Error fetching country data for ${countryName}:`, error);
            throw this._handleError(error);
        }
    }

    /**
     * Get all countries (for random selection)
     * @returns {Promise<Array>} Array of all countries
     */
    async getAllCountries() {
        const cacheKey = 'all_countries';
        
        // Check cache first
        const cachedData = this.cache.get(cacheKey);
        if (cachedData) {
            this.logger.info('Cache hit for all countries');
            return cachedData;
        }

        try {
            const url = `${this.baseURL}${CONFIG.API.ENDPOINTS.ALL_COUNTRIES}?fields=name,flags`;
            const response = await this._fetchWithRetry(url);
            
            if (!response.ok) {
                throw new Error('Failed to fetch all countries');
            }
            
            const countries = await response.json();
            
            // Cache the result for longer since this doesn't change often
            this.cache.set(cacheKey, countries, 24 * 60 * 60 * 1000); // 24 hours
            
            this.logger.info('Successfully fetched all countries');
            return countries;
            
        } catch (error) {
            this.logger.error('Error fetching all countries:', error);
            throw this._handleError(error);
        }
    }

    /**
     * Get a random country
     * @returns {Promise<Object>} Random country data
     */
    async getRandomCountry() {
        try {
            const allCountries = await this.getAllCountries();
            const randomIndex = Math.floor(Math.random() * allCountries.length);
            const randomCountry = allCountries[randomIndex];
            
            // Fetch full details for the random country
            return await this.searchCountryByName(randomCountry.name.common);
            
        } catch (error) {
            this.logger.error('Error getting random country:', error);
            throw this._handleError(error);
        }
    }

    /**
     * Preload favorite countries for better performance
     * @returns {Promise<void>}
     */
    async preloadFavorites() {
        if (!CONFIG.PERFORMANCE.PRELOAD_FAVORITES) {
            return;
        }

        this.logger.info('Preloading favorite countries...');
        
        const favoritePromises = CONFIG.COUNTRIES.FAVORITES.map(favorite => 
            this.searchCountryByName(favorite.code).catch(error => {
                this.logger.warn(`Failed to preload ${favorite.name}:`, error);
                return null;
            })
        );

        try {
            await Promise.allSettled(favoritePromises);
            this.logger.info('Favorite countries preloaded');
        } catch (error) {
            this.logger.warn('Some favorites failed to preload:', error);
        }
    }

    /**
     * Fetch with retry logic and timeout
     * @private
     */
    async _fetchWithRetry(url, attempt = 1) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            clearTimeout(timeoutId);
            return response;
            
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (attempt < this.retryAttempts && !controller.signal.aborted) {
                this.logger.warn(`Retry attempt ${attempt} for URL: ${url}`);
                await this._delay(1000 * attempt); // Exponential backoff
                return this._fetchWithRetry(url, attempt + 1);
            }
            
            throw error;
        }
    }

    /**
     * Handle and categorize errors
     * @private
     */
    _handleError(error) {
        if (error.name === 'AbortError') {
            return new Error(CONFIG.MESSAGES.ERRORS.TIMEOUT_ERROR);
        }
        
        if (error.message.includes('Country not found')) {
            return new Error(CONFIG.MESSAGES.ERRORS.COUNTRY_NOT_FOUND);
        }
        
        if (!navigator.onLine) {
            return new Error(CONFIG.MESSAGES.ERRORS.NETWORK_ERROR);
        }
        
        return new Error(CONFIG.MESSAGES.ERRORS.GENERIC_ERROR);
    }

    /**
     * Simple delay utility
     * @private
     */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Clear the cache
     */
    clearCache() {
        this.cache.clear();
        this.logger.info('Cache cleared');
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return this.cache.getStats();
    }
}
