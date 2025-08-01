/**
 * Test setup file
 */

// Mock global fetch for testing
global.fetch = jest.fn();

// Mock performance API
global.performance = {
    now: jest.fn(() => Date.now())
};

// Mock console methods for cleaner test output
global.console = {
    ...console,
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
};

// Setup DOM environment
document.body.innerHTML = `
    <div class="container">
        <div class="search-section">
            <div class="search-container">
                <input type="text" class="search-input" id="countryInput">
                <button class="search-btn">Search</button>
                <button class="random-btn">Random</button>
            </div>
            <div class="favorites-section">
                <span class="favorites-label">Quick Access:</span>
            </div>
        </div>
        <div class="flag-display" id="flagDisplay"></div>
    </div>
`;

// Reset mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
});
