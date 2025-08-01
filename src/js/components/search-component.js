/**
 * Search Component
 * Handles search functionality for timezones and favorite cities
 */

import { CONFIG } from '../../config/app-config.js';
import { DOMUtils } from '../utils/dom-utils.js';
import { Logger } from '../utils/logger.js';

export class SearchComponent {
    constructor(onSearch, onRandomTimezone) {
        this.onSearch = onSearch;
        this.onRandomTimezone = onRandomTimezone;
        this.logger = new Logger('SearchComponent');
        this.cleanupFunctions = [];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderFavorites();
        this.logger.info('Search component initialized');
    }

    bindEvents() {
        // Search input event listener
        const searchInput = DOMUtils.$('#timezoneInput');
        if (searchInput) {
            const debouncedSearch = DOMUtils.debounce(() => {
                this.handleSearch();
            }, CONFIG.UI.DEBOUNCE_DELAY);

            // Enter key event
            const enterKeyCleanup = DOMUtils.addEventListerer(
                searchInput, 
                'keypress', 
                (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.handleSearch();
                    }
                }
            );
            this.cleanupFunctions.push(enterKeyCleanup);

            // Input change event (debounced)
            const inputCleanup = DOMUtils.addEventListerer(
                searchInput,
                'input',
                debouncedSearch
            );
            this.cleanupFunctions.push(inputCleanup);
        }

        // Search button event
        const searchBtn = DOMUtils.$('.search-btn');
        if (searchBtn) {
            const searchBtnCleanup = DOMUtils.addEventListerer(
                searchBtn,
                'click',
                () => this.handleSearch()
            );
            this.cleanupFunctions.push(searchBtnCleanup);
        }

        // Random timezone button event
        const randomBtn = DOMUtils.$('.random-btn');
        if (randomBtn) {
            const randomBtnCleanup = DOMUtils.addEventListerer(
                randomBtn,
                'click',
                () => this.handleRandomTimezone()
            );
            this.cleanupFunctions.push(randomBtnCleanup);
        }
    }

    renderFavorites() {
        const favoritesContainer = DOMUtils.$('.favorites-section');
        if (!favoritesContainer) {
            this.logger.warn('Favorites container not found');
            return;
        }

        // Clear existing favorites (except label)
        const existingFavorites = DOMUtils.$$('.favorite-timezone', favoritesContainer);
        existingFavorites.forEach(btn => btn.remove());

        // Render favorite timezone buttons
        CONFIG.TIMEZONES.FAVORITES.forEach(favorite => {
            const button = DOMUtils.createElement('button', {
                className: 'favorite-timezone',
                'data-timezone': favorite.code,
                'aria-label': `Add ${favorite.name} clock`
            }, `${favorite.emoji} ${favorite.name}`);

            // Add click event
            const favoriteCleanup = DOMUtils.addEventListerer(
                button,
                'click',
                () => this.handleFavoriteClick(favorite.code, favorite.name)
            );
            this.cleanupFunctions.push(favoriteCleanup);

            favoritesContainer.appendChild(button);
        });

        this.logger.debug('Favorites rendered');
    }

    handleSearch() {
        const searchInput = DOMUtils.$('#timezoneInput');
        if (!searchInput) {
            this.logger.error('Search input not found');
            return;
        }

        const query = searchInput.value.trim();
        if (!query) {
            this.showSearchError('Please enter a city or timezone name');
            return;
        }

        this.logger.info(`Searching for timezone: ${query}`);
        this.onSearch(query);
    }

    handleRandomTimezone() {
        this.logger.info('Random timezone triggered');
        this.onRandomTimezone();
    }

    handleFavoriteClick(timezone, name) {
        this.logger.info(`Favorite timezone clicked: ${timezone}`);
        this.updateSearchInput(name);
        this.onSearch(timezone);
    }

    updateSearchInput(value) {
        const searchInput = DOMUtils.$('#timezoneInput');
        if (searchInput) {
            searchInput.value = value;
        }
    }

    showSearchError(message) {
        // Create temporary error message
        const errorElement = DOMUtils.createElement('div', {
            className: 'search-error',
            style: 'color: var(--error-color); font-size: 14px; margin-top: 5px;'
        }, message);

        const searchContainer = DOMUtils.$('.search-container');
        if (searchContainer) {
            // Remove existing error
            const existingError = DOMUtils.$('.search-error');
            if (existingError) {
                existingError.remove();
            }

            searchContainer.appendChild(errorElement);

            // Auto-remove after 3 seconds
            setTimeout(() => {
                if (errorElement.parentNode) {
                    errorElement.remove();
                }
            }, 3000);
        }
    }

    /**
     * Enable/disable search functionality
     */
    setEnabled(enabled) {
        const searchInput = DOMUtils.$('#timezoneInput');
        const searchBtn = DOMUtils.$('.search-btn');
        const randomBtn = DOMUtils.$('.random-btn');
        const favoriteButtons = DOMUtils.$$('.favorite-timezone');

        [searchInput, searchBtn, randomBtn, ...favoriteButtons].forEach(element => {
            if (element) {
                element.disabled = !enabled;
            }
        });
    }

    /**
     * Focus on search input
     */
    focus() {
        const searchInput = DOMUtils.$('#timezoneInput');
        if (searchInput) {
            searchInput.focus();
        }
    }

    /**
     * Clear search input
     */
    clearSearch() {
        const searchInput = DOMUtils.$('#timezoneInput');
        if (searchInput) {
            searchInput.value = '';
        }
    }

    /**
     * Get current search query
     */
    getCurrentQuery() {
        const searchInput = DOMUtils.$('#timezoneInput');
        return searchInput ? searchInput.value.trim() : '';
    }

    /**
     * Show search suggestions
     */
    showSuggestions(suggestions) {
        const searchContainer = DOMUtils.$('.search-container');
        if (!searchContainer) return;

        // Remove existing suggestions
        const existingSuggestions = DOMUtils.$('.search-suggestions');
        if (existingSuggestions) {
            existingSuggestions.remove();
        }

        if (!suggestions || suggestions.length === 0) return;

        // Create suggestions dropdown
        const suggestionsElement = DOMUtils.createElement('div', {
            className: 'search-suggestions',
            style: `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid var(--gray-medium);
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-light);
                z-index: 1000;
                max-height: 200px;
                overflow-y: auto;
            `
        });

        suggestions.forEach(suggestion => {
            const suggestionItem = DOMUtils.createElement('div', {
                className: 'suggestion-item',
                style: `
                    padding: 10px 15px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                    transition: background 0.2s;
                `,
                'data-timezone': suggestion.timezone
            }, `${suggestion.city}, ${suggestion.country || suggestion.region}`);

            // Add hover effect
            suggestionItem.addEventListener('mouseenter', () => {
                suggestionItem.style.background = '#f8f9fa';
            });
            suggestionItem.addEventListener('mouseleave', () => {
                suggestionItem.style.background = 'white';
            });

            // Add click event
            const suggestionCleanup = DOMUtils.addEventListerer(
                suggestionItem,
                'click',
                () => {
                    this.updateSearchInput(suggestion.city);
                    this.onSearch(suggestion.timezone);
                    this.hideSuggestions();
                }
            );
            this.cleanupFunctions.push(suggestionCleanup);

            suggestionsElement.appendChild(suggestionItem);
        });

        // Position the suggestions container relatively
        searchContainer.style.position = 'relative';
        searchContainer.appendChild(suggestionsElement);
    }

    /**
     * Hide search suggestions
     */
    hideSuggestions() {
        const suggestions = DOMUtils.$('.search-suggestions');
        if (suggestions) {
            suggestions.remove();
        }
    }

    /**
     * Cleanup event listeners
     */
    destroy() {
        this.cleanupFunctions.forEach(cleanup => cleanup());
        this.cleanupFunctions = [];
        this.hideSuggestions();
        this.logger.info('Search component destroyed');
    }
}
