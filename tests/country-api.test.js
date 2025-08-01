/**
 * Tests for CountryAPIService
 */

import { CountryAPIService } from '../src/js/services/country-api.js';

// Mock the config and dependencies
jest.mock('../config/app-config.js', () => ({
    CONFIG: {
        API: {
            BASE_URL: 'https://restcountries.com/v3.1',
            ENDPOINTS: {
                BY_NAME: '/name',
                ALL_COUNTRIES: '/all'
            },
            TIMEOUT: 10000,
            RETRY_ATTEMPTS: 3
        },
        PERFORMANCE: {
            CACHE_DURATION: 5 * 60 * 1000,
            MAX_CACHE_SIZE: 100,
            PRELOAD_FAVORITES: false
        },
        COUNTRIES: {
            FAVORITES: [
                { code: 'pakistan', name: 'Pakistan', emoji: '🇵🇰' }
            ]
        },
        MESSAGES: {
            ERRORS: {
                COUNTRY_NOT_FOUND: 'Country not found',
                NETWORK_ERROR: 'Network error',
                TIMEOUT_ERROR: 'Timeout error',
                GENERIC_ERROR: 'Generic error'
            }
        }
    }
}));

describe('CountryAPIService', () => {
    let apiService;
    
    beforeEach(() => {
        apiService = new CountryAPIService();
    });

    describe('searchCountryByName', () => {
        it('should fetch country data successfully', async () => {
            const mockCountryData = {
                name: { common: 'Pakistan', official: 'Islamic Republic of Pakistan' },
                flags: { svg: 'https://example.com/flag.svg' },
                population: 220892331
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => [mockCountryData]
            });

            const result = await apiService.searchCountryByName('pakistan');
            
            expect(fetch).toHaveBeenCalledWith(
                'https://restcountries.com/v3.1/name/pakistan?fullText=false',
                expect.any(Object)
            );
            expect(result).toEqual(mockCountryData);
        });

        it('should handle country not found error', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 404
            });

            await expect(apiService.searchCountryByName('nonexistent'))
                .rejects.toThrow('Country not found');
        });

        it('should use cached data when available', async () => {
            const mockCountryData = {
                name: { common: 'Pakistan' }
            };

            // First call - should fetch
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => [mockCountryData]
            });

            await apiService.searchCountryByName('pakistan');
            
            // Second call - should use cache
            const result = await apiService.searchCountryByName('pakistan');
            
            expect(fetch).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockCountryData);
        });
    });

    describe('getAllCountries', () => {
        it('should fetch all countries successfully', async () => {
            const mockCountries = [
                { name: { common: 'Pakistan' } },
                { name: { common: 'India' } }
            ];

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockCountries
            });

            const result = await apiService.getAllCountries();
            
            expect(fetch).toHaveBeenCalledWith(
                'https://restcountries.com/v3.1/all?fields=name,flags',
                expect.any(Object)
            );
            expect(result).toEqual(mockCountries);
        });
    });

    describe('getRandomCountry', () => {
        it('should return a random country', async () => {
            const mockCountries = [
                { name: { common: 'Pakistan' } },
                { name: { common: 'India' } }
            ];
            
            const mockCountryDetail = {
                name: { common: 'Pakistan' },
                population: 220892331
            };

            // Mock getAllCountries
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockCountries
            });

            // Mock searchCountryByName
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => [mockCountryDetail]
            });

            const result = await apiService.getRandomCountry();
            
            expect(result).toEqual(mockCountryDetail);
            expect(fetch).toHaveBeenCalledTimes(2);
        });
    });

    describe('error handling', () => {
        it('should handle network timeout', async () => {
            fetch.mockRejectedValueOnce(new Error('AbortError'));

            await expect(apiService.searchCountryByName('pakistan'))
                .rejects.toThrow('Generic error');
        });

        it('should retry on failure', async () => {
            // First two calls fail, third succeeds
            fetch
                .mockRejectedValueOnce(new Error('Network error'))
                .mockRejectedValueOnce(new Error('Network error'))
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => [{ name: { common: 'Pakistan' } }]
                });

            const result = await apiService.searchCountryByName('pakistan');
            
            expect(fetch).toHaveBeenCalledTimes(3);
            expect(result.name.common).toBe('Pakistan');
        });
    });
});
