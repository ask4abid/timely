/**
 * Cache Utility
 * Provides in-memory caching with TTL and size limits
 */

import { Logger } from './logger.js';

export class Cache {
    constructor(defaultTTL = 5 * 60 * 1000, maxSize = 100) {
        this.cache = new Map();
        this.defaultTTL = defaultTTL;
        this.maxSize = maxSize;
        this.logger = new Logger('Cache');
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            evictions: 0
        };
    }

    /**
     * Get item from cache
     * @param {string} key - Cache key
     * @returns {any|null} Cached value or null if not found/expired
     */
    get(key) {
        const item = this.cache.get(key);
        
        if (!item) {
            this.stats.misses++;
            return null;
        }
        
        // Check if item has expired
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            this.stats.misses++;
            this.logger.debug(`Cache item expired: ${key}`);
            return null;
        }
        
        this.stats.hits++;
        this.logger.debug(`Cache hit: ${key}`);
        return item.value;
    }

    /**
     * Set item in cache
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} ttl - Time to live in milliseconds (optional)
     */
    set(key, value, ttl = this.defaultTTL) {
        // Evict items if cache is full
        if (this.cache.size >= this.maxSize) {
            this._evictLRU();
        }
        
        const expiry = Date.now() + ttl;
        this.cache.set(key, {
            value,
            expiry,
            lastAccessed: Date.now()
        });
        
        this.stats.sets++;
        this.logger.debug(`Cache set: ${key} (TTL: ${ttl}ms)`);
    }

    /**
     * Delete item from cache
     * @param {string} key - Cache key
     */
    delete(key) {
        const deleted = this.cache.delete(key);
        if (deleted) {
            this.logger.debug(`Cache delete: ${key}`);
        }
        return deleted;
    }

    /**
     * Clear all cache items
     */
    clear() {
        this.cache.clear();
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            evictions: 0
        };
        this.logger.debug('Cache cleared');
    }

    /**
     * Check if key exists in cache
     * @param {string} key - Cache key
     * @returns {boolean}
     */
    has(key) {
        const item = this.cache.get(key);
        if (!item) return false;
        
        // Check if expired
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return false;
        }
        
        return true;
    }

    /**
     * Get cache size
     * @returns {number}
     */
    size() {
        return this.cache.size;
    }

    /**
     * Get cache statistics
     * @returns {Object}
     */
    getStats() {
        const hitRate = this.stats.hits + this.stats.misses > 0 
            ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2)
            : 0;
            
        return {
            ...this.stats,
            hitRate: `${hitRate}%`,
            size: this.cache.size,
            maxSize: this.maxSize
        };
    }

    /**
     * Cleanup expired items
     */
    cleanup() {
        const now = Date.now();
        let cleanedCount = 0;
        
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiry) {
                this.cache.delete(key);
                cleanedCount++;
            }
        }
        
        if (cleanedCount > 0) {
            this.logger.debug(`Cleaned up ${cleanedCount} expired cache items`);
        }
        
        return cleanedCount;
    }

    /**
     * Evict least recently used item
     * @private
     */
    _evictLRU() {
        let oldestKey = null;
        let oldestTime = Date.now();
        
        for (const [key, item] of this.cache.entries()) {
            if (item.lastAccessed < oldestTime) {
                oldestTime = item.lastAccessed;
                oldestKey = key;
            }
        }
        
        if (oldestKey) {
            this.cache.delete(oldestKey);
            this.stats.evictions++;
            this.logger.debug(`Evicted LRU item: ${oldestKey}`);
        }
    }
}
