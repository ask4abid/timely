/**
 * Data Formatter Utility
 * Handles formatting of country data for display
 */

import { CONFIG } from '../../config/app-config.js';
import { Logger } from './logger.js';

export class DataFormatter {
    constructor() {
        this.logger = new Logger('DataFormatter');
    }

    /**
     * Format country data for display
     * @param {Object} country - Raw country data from API
     * @returns {Object} Formatted country data
     */
    formatCountryData(country) {
        if (!country) {
            throw new Error('Country data is required');
        }

        try {
            return {
                name: {
                    common: country.name?.common || 'N/A',
                    official: country.name?.official || 'N/A'
                },
                flag: {
                    svg: country.flags?.svg || '',
                    png: country.flags?.png || '',
                    alt: country.flags?.alt || `Flag of ${country.name?.common || 'Unknown'}`
                },
                capital: this._formatCapital(country.capital),
                population: this._formatPopulation(country.population),
                region: this._formatRegion(country.region, country.subregion),
                languages: this._formatLanguages(country.languages),
                currencies: this._formatCurrencies(country.currencies),
                area: this._formatArea(country.area),
                timezones: this._formatTimezones(country.timezones),
                codes: {
                    cca2: country.cca2 || '',
                    cca3: country.cca3 || ''
                }
            };
        } catch (error) {
            this.logger.error('Error formatting country data:', error);
            throw new Error('Failed to format country data');
        }
    }

    /**
     * Format capital city
     * @private
     */
    _formatCapital(capital) {
        if (!capital || !Array.isArray(capital) || capital.length === 0) {
            return 'N/A';
        }
        return capital[0];
    }

    /**
     * Format population with locale-specific formatting
     * @private
     */
    _formatPopulation(population) {
        if (!population || typeof population !== 'number') {
            return 'N/A';
        }
        
        try {
            return population.toLocaleString();
        } catch (error) {
            this.logger.warn('Error formatting population:', error);
            return population.toString();
        }
    }

    /**
     * Format region and subregion
     * @private
     */
    _formatRegion(region, subregion) {
        const regionStr = region || 'N/A';
        const subregionStr = subregion || '';
        
        if (subregionStr && subregionStr !== regionStr) {
            return `${regionStr} - ${subregionStr}`;
        }
        
        return regionStr;
    }

    /**
     * Format languages
     * @private
     */
    _formatLanguages(languages) {
        if (!languages || typeof languages !== 'object') {
            return 'N/A';
        }
        
        const languageList = Object.values(languages);
        if (languageList.length === 0) {
            return 'N/A';
        }
        
        return languageList.join(', ');
    }

    /**
     * Format currencies
     * @private
     */
    _formatCurrencies(currencies) {
        if (!currencies || typeof currencies !== 'object') {
            return 'N/A';
        }
        
        const currencyList = Object.values(currencies).map(currency => {
            const name = currency.name || 'Unknown';
            const symbol = currency.symbol ? ` (${currency.symbol})` : '';
            return `${name}${symbol}`;
        });
        
        if (currencyList.length === 0) {
            return 'N/A';
        }
        
        return currencyList.join(', ');
    }

    /**
     * Format area
     * @private
     */
    _formatArea(area) {
        if (!area || typeof area !== 'number') {
            return 'N/A';
        }
        
        try {
            return `${area.toLocaleString()} km²`;
        } catch (error) {
            this.logger.warn('Error formatting area:', error);
            return `${area} km²`;
        }
    }

    /**
     * Format timezones
     * @private
     */
    _formatTimezones(timezones) {
        if (!timezones || !Array.isArray(timezones) || timezones.length === 0) {
            return 'N/A';
        }
        
        const maxDisplay = CONFIG.COUNTRIES.MAX_TIMEZONES_DISPLAY;
        const displayTimezones = timezones.slice(0, maxDisplay);
        
        let result = displayTimezones.join(', ');
        
        if (timezones.length > maxDisplay) {
            result += ` (+${timezones.length - maxDisplay} more)`;
        }
        
        return result;
    }

    /**
     * Format search query for API
     * @param {string} query - Raw search query
     * @returns {string} Formatted query
     */
    formatSearchQuery(query) {
        if (!query || typeof query !== 'string') {
            return '';
        }
        
        return query.trim().toLowerCase();
    }

    /**
     * Format error message for display
     * @param {Error} error - Error object
     * @returns {string} User-friendly error message
     */
    formatErrorMessage(error) {
        if (!error) {
            return CONFIG.MESSAGES.ERRORS.GENERIC_ERROR;
        }
        
        // Return known error messages as-is
        const knownErrors = Object.values(CONFIG.MESSAGES.ERRORS);
        if (knownErrors.includes(error.message)) {
            return error.message;
        }
        
        // For unknown errors, return generic message
        this.logger.error('Unknown error:', error);
        return CONFIG.MESSAGES.ERRORS.GENERIC_ERROR;
    }

    /**
     * Format loading message
     * @returns {string} Random loading message
     */
    getRandomLoadingMessage() {
        const messages = CONFIG.UI.LOADING_MESSAGES;
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    }
}
