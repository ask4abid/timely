/**
 * Test Configuration for Jest
 */

module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    moduleFileExtensions: ['js', 'json'],
    testMatch: [
        '<rootDir>/tests/**/*.test.js'
    ],
    collectCoverageFrom: [
        'src/js/**/*.js',
        '!src/js/**/*.test.js'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    transform: {
        '^.+\\.js$': 'babel-jest'
    }
};
