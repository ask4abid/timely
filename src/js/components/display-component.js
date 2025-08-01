/**
 * Display Component
 * Handles the display of country information and flags
 */

import { CONFIG } from '../../config/app-config.js';
import { DOMUtils } from '../utils/dom-utils.js';
import { DataFormatter } from '../utils/data-formatter.js';
import { Logger } from '../utils/logger.js';

export class DisplayComponent {
    constructor() {
        this.logger = new Logger('DisplayComponent');
        this.formatter = new DataFormatter();
        this.displayContainer = DOMUtils.$('#flagDisplay');
        
        if (!this.displayContainer) {
            throw new Error('Display container not found');
        }

        this.init();
    }

    init() {
        this.showWelcomeMessage();
        this.logger.info('Display component initialized');
    }

    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        const welcomeHTML = `
            <div class="welcome-message">
                <h2>${CONFIG.MESSAGES.INFO.WELCOME_TITLE}</h2>
                <p>${CONFIG.MESSAGES.INFO.WELCOME_DESCRIPTION}</p>
                <p>${CONFIG.MESSAGES.INFO.WELCOME_CTA}</p>
            </div>
        `;
        
        this.displayContainer.innerHTML = welcomeHTML;
        this.logger.debug('Welcome message displayed');
    }

    /**
     * Show loading state
     */
    showLoading() {
        const loadingMessage = this.formatter.getRandomLoadingMessage();
        this.displayContainer.innerHTML = `
            <div class="loading">${loadingMessage}</div>
        `;
        this.logger.debug('Loading state displayed');
    }

    /**
     * Show error message
     */
    showError(error) {
        const errorMessage = this.formatter.formatErrorMessage(error);
        
        const errorHTML = `
            <div class="error">
                <h3>❌ Error</h3>
                <p>${errorMessage}</p>
                <button class="btn btn-primary mt-2" onclick="window.flagExplorer.getRandomCountry()">
                    🎲 Try a Random Country
                </button>
            </div>
        `;
        
        this.displayContainer.innerHTML = errorHTML;
        this.logger.debug('Error displayed:', errorMessage);
    }

    /**
     * Display country information
     */
    displayCountry(countryData) {
        try {
            const formattedData = this.formatter.formatCountryData(countryData);
            const countryHTML = this.generateCountryHTML(formattedData);
            
            this.displayContainer.innerHTML = countryHTML;
            
            // Handle flag image loading
            this.handleFlagImageLoading(formattedData);
            
            this.logger.info(`Country displayed: ${formattedData.name.common}`);
            
        } catch (error) {
            this.logger.error('Error displaying country:', error);
            this.showError(error);
        }
    }

    /**
     * Generate HTML for country display
     * @private
     */
    generateCountryHTML(data) {
        return `
            <div class="country-info">
                <div class="country-name">${DOMUtils.sanitizeHTML(data.name.common)}</div>
                
                ${this.generateFlagHTML(data.flag)}
                
                <div class="country-details">
                    ${this.generateDetailItem('Official Name', data.name.official)}
                    ${this.generateDetailItem('Capital', data.capital)}
                    ${this.generateDetailItem('Population', data.population)}
                    ${this.generateDetailItem('Region', data.region)}
                    ${this.generateDetailItem('Languages', data.languages)}
                    ${this.generateDetailItem('Currencies', data.currencies)}
                    ${this.generateDetailItem('Area', data.area)}
                    ${this.generateDetailItem('Timezones', data.timezones)}
                </div>
            </div>
        `;
    }

    /**
     * Generate flag image HTML with error handling
     * @private
     */
    generateFlagHTML(flagData) {
        const flagSrc = flagData.svg || flagData.png;
        if (!flagSrc) {
            return '<div class="flag-placeholder">Flag not available</div>';
        }

        return `
            <img 
                src="${flagSrc}" 
                alt="${DOMUtils.sanitizeHTML(flagData.alt)}" 
                class="flag-image"
                loading="${CONFIG.PERFORMANCE.LAZY_LOAD_IMAGES ? 'lazy' : 'eager'}"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
            >
            <div class="flag-error" style="display: none; padding: 20px; background: #f8f9fa; border-radius: 8px; color: #666;">
                🏳️ Flag image could not be loaded
            </div>
        `;
    }

    /**
     * Generate detail item HTML
     * @private
     */
    generateDetailItem(label, value) {
        return `
            <div class="detail-item">
                <span class="detail-label">${DOMUtils.sanitizeHTML(label)}:</span>
                <span class="detail-value">${DOMUtils.sanitizeHTML(value)}</span>
            </div>
        `;
    }

    /**
     * Handle flag image loading with fallback
     * @private
     */
    handleFlagImageLoading(data) {
        const flagImage = DOMUtils.$('.flag-image', this.displayContainer);
        if (!flagImage) return;

        // Add loading indicator
        flagImage.style.opacity = '0.5';
        
        const handleLoad = () => {
            flagImage.style.opacity = '1';
            this.logger.debug(`Flag image loaded for ${data.name.common}`);
        };

        const handleError = () => {
            this.logger.warn(`Flag image failed to load for ${data.name.common}`);
            flagImage.style.display = 'none';
            
            // Show fallback
            const flagError = flagImage.nextElementSibling;
            if (flagError) {
                flagError.style.display = 'block';
            }
        };

        flagImage.addEventListener('load', handleLoad, { once: true });
        flagImage.addEventListener('error', handleError, { once: true });
    }

    /**
     * Animate content change
     */
    animateContentChange(callback) {
        if (!this.displayContainer) return;

        // Fade out
        this.displayContainer.style.opacity = '0.5';
        this.displayContainer.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            callback();
            
            // Fade in
            this.displayContainer.style.opacity = '1';
            this.displayContainer.style.transform = 'translateY(0)';
        }, CONFIG.UI.ANIMATION_DURATION / 2);
    }

    /**
     * Add custom CSS for animations
     */
    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #flagDisplay {
                transition: opacity ${CONFIG.UI.ANIMATION_DURATION}ms ease, 
                           transform ${CONFIG.UI.ANIMATION_DURATION}ms ease;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Scroll to display area
     */
    scrollToDisplay() {
        DOMUtils.scrollToElement(this.displayContainer, {
            behavior: 'smooth',
            block: 'start'
        });
    }

    /**
     * Get current displayed country
     */
    getCurrentCountry() {
        const countryNameElement = DOMUtils.$('.country-name', this.displayContainer);
        return countryNameElement ? countryNameElement.textContent : null;
    }

    /**
     * Check if display is showing error
     */
    isShowingError() {
        return !!DOMUtils.$('.error', this.displayContainer);
    }

    /**
     * Check if display is showing loading
     */
    isShowingLoading() {
        return !!DOMUtils.$('.loading', this.displayContainer);
    }
}
