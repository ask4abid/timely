/**
 * Logger Utility
 * Provides structured logging with different levels
 */

import { CONFIG } from '../../config/app-config.js';

export class Logger {
    constructor(context = 'App') {
        this.context = context;
        this.logLevel = CONFIG.DEV.LOG_LEVEL;
        this.debugMode = CONFIG.DEV.DEBUG_MODE;
        
        // Log level hierarchy
        this.levels = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3
        };
    }

    /**
     * Log debug messages
     */
    debug(message, ...args) {
        if (this._shouldLog('debug')) {
            console.debug(`[DEBUG][${this.context}] ${message}`, ...args);
        }
    }

    /**
     * Log info messages
     */
    info(message, ...args) {
        if (this._shouldLog('info')) {
            console.info(`[INFO][${this.context}] ${message}`, ...args);
        }
    }

    /**
     * Log warning messages
     */
    warn(message, ...args) {
        if (this._shouldLog('warn')) {
            console.warn(`[WARN][${this.context}] ${message}`, ...args);
        }
    }

    /**
     * Log error messages
     */
    error(message, ...args) {
        if (this._shouldLog('error')) {
            console.error(`[ERROR][${this.context}] ${message}`, ...args);
        }
    }

    /**
     * Log performance metrics
     */
    performance(label, startTime) {
        if (this.debugMode) {
            const duration = performance.now() - startTime;
            console.log(`[PERF][${this.context}] ${label}: ${duration.toFixed(2)}ms`);
        }
    }

    /**
     * Group related log messages
     */
    group(label, collapsed = false) {
        if (this.debugMode) {
            collapsed ? console.groupCollapsed(label) : console.group(label);
        }
    }

    /**
     * End log group
     */
    groupEnd() {
        if (this.debugMode) {
            console.groupEnd();
        }
    }

    /**
     * Check if message should be logged based on level
     * @private
     */
    _shouldLog(level) {
        return this.levels[level] >= this.levels[this.logLevel];
    }
}
