/**
 * DOM Utilities
 * Helper functions for DOM manipulation and event handling
 */

import { Logger } from './logger.js';

export class DOMUtils {
    constructor() {
        this.logger = new Logger('DOMUtils');
    }

    /**
     * Query selector with error handling
     * @param {string} selector - CSS selector
     * @param {Element} context - Context element (default: document)
     * @returns {Element|null}
     */
    static $(selector, context = document) {
        try {
            return context.querySelector(selector);
        } catch (error) {
            console.error(`Invalid selector: ${selector}`, error);
            return null;
        }
    }

    /**
     * Query all with error handling
     * @param {string} selector - CSS selector
     * @param {Element} context - Context element (default: document)
     * @returns {NodeList}
     */
    static $$(selector, context = document) {
        try {
            return context.querySelectorAll(selector);
        } catch (error) {
            console.error(`Invalid selector: ${selector}`, error);
            return [];
        }
    }

    /**
     * Create element with attributes and content
     * @param {string} tag - HTML tag name
     * @param {Object} attributes - Element attributes
     * @param {string|Element} content - Element content
     * @returns {Element}
     */
    static createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else {
                element.setAttribute(key, value);
            }
        });
        
        // Set content
        if (typeof content === 'string') {
            element.textContent = content;
        } else if (content instanceof Element) {
            element.appendChild(content);
        }
        
        return element;
    }

    /**
     * Add event listener with cleanup tracking
     * @param {Element|string} element - Element or selector
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     * @returns {Function} Cleanup function
     */
    static addEventListerer(element, event, handler, options = {}) {
        const target = typeof element === 'string' ? DOMUtils.$(element) : element;
        
        if (!target) {
            console.warn(`Element not found for event: ${event}`);
            return () => {};
        }
        
        target.addEventListener(event, handler, options);
        
        // Return cleanup function
        return () => target.removeEventListener(event, handler, options);
    }

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    static throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if element is visible in viewport
     * @param {Element} element - Element to check
     * @returns {boolean}
     */
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Smooth scroll to element
     * @param {Element|string} element - Element or selector
     * @param {Object} options - Scroll options
     */
    static scrollToElement(element, options = {}) {
        const target = typeof element === 'string' ? DOMUtils.$(element) : element;
        
        if (!target) {
            console.warn('Element not found for scroll');
            return;
        }
        
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
            ...options
        });
    }

    /**
     * Show/hide element with animation
     * @param {Element|string} element - Element or selector
     * @param {boolean} show - Show or hide
     * @param {string} animation - Animation class
     */
    static toggleElement(element, show, animation = '') {
        const target = typeof element === 'string' ? DOMUtils.$(element) : element;
        
        if (!target) {
            console.warn('Element not found for toggle');
            return;
        }
        
        if (show) {
            target.style.display = '';
            target.classList.remove('hidden');
            if (animation) target.classList.add(animation);
        } else {
            target.classList.add('hidden');
            if (animation) target.classList.remove(animation);
        }
    }

    /**
     * Sanitize HTML content
     * @param {string} html - HTML content to sanitize
     * @returns {string} Sanitized HTML
     */
    static sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }
}
