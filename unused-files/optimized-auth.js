// Optimized Timely Authentication with Google Sign-In
// Performance-optimized with lazy loading and efficient DB operations

class OptimizedTimelyAuth {
    constructor() {
        this.dbName = 'TimelyUserDB';
        this.dbVersion = 1;
        this.db = null;
        this.currentUser = null;
        this.dbInitPromise = null;
        
        // Performance optimization: Lazy initialize
        this.initPromise = this.lazyInit();
        
        // Google Client ID - To enable: Get your actual client ID from Google Cloud Console
        // Visit: https://console.cloud.google.com/apis/credentials
        // Create OAuth 2.0 Client ID for Web application
        // Add your domain to authorized origins
        this.googleClientId = 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com';
        
        // For development, you can use a test client ID
        // Replace with your actual Google OAuth client ID
        
        // Check for existing session immediately
        this.quickSessionCheck();
    }

    async lazyInit() {
        // Only initialize database when needed
        if (!this.dbInitPromise) {
            this.dbInitPromise = this.initDatabase();
        }
        await this.dbInitPromise;
        
        // Initialize Google Sign-In when ready
        if (window.google) {
            this.initGoogleAuth();
        } else {
            // Wait for Google script to load
            window.addEventListener('load', () => {
                if (window.google) {
                    this.initGoogleAuth();
                }
            });
        }
    }

    // Quick session check using localStorage only (performance optimization)
    quickSessionCheck() {
        const token = localStorage.getItem('timelyAuthToken');
        const userData = localStorage.getItem('timelyUserData');
        
        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                this.currentUser = user;
                this.updateAuthUI(true);
                
                // Verify session in background
                this.verifySessionInBackground(token);
            } catch (error) {
                console.warn('Invalid stored user data');
                localStorage.removeItem('timelyUserData');
            }
        }
    }

    async verifySessionInBackground(token) {
        try {
            await this.initPromise; // Ensure DB is ready
            const session = await this.getSession(token);
            
            if (!session || new Date(session.expiresAt) < new Date()) {
                await this.signOut();
                return;
            }
            
            // Session is valid, user remains logged in
            console.log('✅ Session verified');
        } catch (error) {
            console.warn('Session verification failed:', error);
            await this.signOut();
        }
    }

    async initDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ Database ready');
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Optimized schema with better indexing
                if (!db.objectStoreNames.contains('users')) {
                    const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
                    userStore.createIndex('email', 'email', { unique: true });
                    userStore.createIndex('googleId', 'googleId', { unique: false });
                    userStore.createIndex('createdAt', 'createdAt', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('sessions')) {
                    const sessionStore = db.createObjectStore('sessions', { keyPath: 'token' });
                    sessionStore.createIndex('userId', 'userId', { unique: false });
                    sessionStore.createIndex('expiresAt', 'expiresAt', { unique: false });
                }
            };
        });
    }

    // Google Authentication Setup
    initGoogleAuth() {
        try {
            google.accounts.id.initialize({
                client_id: this.googleClientId,
                callback: this.handleGoogleCallback.bind(this),
                auto_select: false,
                cancel_on_tap_outside: true
            });
            
            console.log('✅ Google Auth initialized');
        } catch (error) {
            console.warn('Google Auth initialization failed:', error);
        }
    }

    async handleGoogleCallback(response) {
        try {
            // Decode JWT token
            const userInfo = this.parseJWT(response.credential);
            
            // Check if user exists
            let user = await this.getUserByEmail(userInfo.email);
            
            if (!user) {
                // Create new user from Google account
                const newUser = {
                    username: userInfo.name,
                    email: userInfo.email.toLowerCase(),
                    googleId: userInfo.sub,
                    avatar: userInfo.picture,
                    emailVerified: userInfo.email_verified,
                    createdAt: new Date().toISOString(),
                    isActive: true,
                    authProvider: 'google',
                    profile: {
                        name: userInfo.name,
                        picture: userInfo.picture,
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        theme: 'light',
                        worldClocks: [],
                        preferences: {
                            notifications: true,
                            autoDetectLocation: true,
                            format24h: false
                        }
                    }
                };
                
                const userId = await this.saveUser(newUser);
                newUser.id = userId;
                user = newUser;
                
                showAuthMessage(`🎉 Welcome to Timely, ${user.profile.name}!`, 'success');
            } else {
                // Update existing user's Google info
                user.lastLogin = new Date().toISOString();
                if (!user.googleId) {
                    user.googleId = userInfo.sub;
                    user.profile.picture = userInfo.picture;
                }
                await this.updateUser(user);
                
                showAuthMessage(`👋 Welcome back, ${user.profile.name}!`, 'success');
            }
            
            // Create session
            await this.createSession(user, true); // Remember Google users
            
            // Close any open modals
            window.timelyApp?.hideAllModals();
            
            return { success: true, user: this.sanitizeUser(user) };
            
        } catch (error) {
            console.error('Google authentication failed:', error);
            showAuthMessage('❌ Google sign-in failed. Please try again.', 'error');
            return { success: false, error: error.message };
        }
    }

    parseJWT(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    // Enhanced sign up with validation
    async signUp(userData) {
        try {
            await this.initPromise; // Ensure DB is ready
            
            const { name, email, password, confirmPassword } = userData;
            
            // Client-side validation
            const validation = this.validateSignUpData(userData);
            if (!validation.valid) {
                throw new Error(validation.error);
            }
            
            // Check if user exists
            const existingUser = await this.getUserByEmail(email);
            if (existingUser) {
                throw new Error('An account with this email already exists');
            }
            
            // Create user with performance optimization
            const hashedPassword = await this.hashPassword(password);
            const newUser = {
                username: name,
                email: email.toLowerCase(),
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                isActive: true,
                authProvider: 'email',
                profile: {
                    name: name,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    theme: 'light',
                    worldClocks: [],
                    preferences: {
                        notifications: true,
                        autoDetectLocation: true,
                        format24h: false
                    }
                }
            };
            
            const userId = await this.saveUser(newUser);
            newUser.id = userId;
            
            // Create session with performance optimization
            await this.createSession(newUser);
            
            return { success: true, user: this.sanitizeUser(newUser) };
            
        } catch (error) {
            console.error('Sign up failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Enhanced sign in with performance optimization
    async signIn(credentials) {
        try {
            await this.initPromise;
            
            const { email, password, rememberMe } = credentials;
            
            if (!email || !password) {
                throw new Error('Email and password are required');
            }
            
            const user = await this.getUserByEmail(email.toLowerCase());
            if (!user) {
                throw new Error('Invalid email or password');
            }
            
            if (user.authProvider === 'google') {
                throw new Error('This account uses Google Sign-In. Please use the Google button.');
            }
            
            const isValid = await this.verifyPassword(password, user.password);
            if (!isValid) {
                throw new Error('Invalid email or password');
            }
            
            if (!user.isActive) {
                throw new Error('This account has been deactivated');
            }
            
            // Update last login
            user.lastLogin = new Date().toISOString();
            await this.updateUser(user);
            
            // Create session
            await this.createSession(user, rememberMe);
            
            return { success: true, user: this.sanitizeUser(user) };
            
        } catch (error) {
            console.error('Sign in failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Optimized session creation
    async createSession(user, rememberMe = false) {
        const token = this.generateToken();
        const expiresAt = rememberMe 
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
            : new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        const session = {
            token,
            userId: user.id,
            createdAt: new Date().toISOString(),
            expiresAt: expiresAt.toISOString(),
            userAgent: navigator.userAgent.substring(0, 255) // Limit size
        };
        
        // Performance optimization: Store in both DB and localStorage
        await this.saveSession(session);
        localStorage.setItem('timelyAuthToken', token);
        
        // Cache user data for quick access
        const sanitizedUser = this.sanitizeUser(user);
        localStorage.setItem('timelyUserData', JSON.stringify(sanitizedUser));
        
        this.currentUser = sanitizedUser;
        this.updateAuthUI(true);
        
        return token;
    }

    async signOut() {
        const token = localStorage.getItem('timelyAuthToken');
        if (token) {
            try {
                await this.deleteSession(token);
            } catch (error) {
                console.warn('Error deleting session:', error);
            }
        }
        
        // Clear all stored data
        localStorage.removeItem('timelyAuthToken');
        localStorage.removeItem('timelyUserData');
        
        this.currentUser = null;
        this.updateAuthUI(false);
        
        console.log('✅ Signed out successfully');
    }

    // Validation helpers
    validateSignUpData(data) {
        const { name, email, password, confirmPassword } = data;
        
        if (!name?.trim()) {
            return { valid: false, error: 'Full name is required' };
        }
        
        if (!this.isValidEmail(email)) {
            return { valid: false, error: 'Please enter a valid email address' };
        }
        
        if (!password || password.length < 8) {
            return { valid: false, error: 'Password must be at least 8 characters long' };
        }
        
        if (password !== confirmPassword) {
            return { valid: false, error: 'Passwords do not match' };
        }
        
        return { valid: true };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Performance optimized database operations
    async saveUser(user) {
        return this.performDBOperation('users', 'readwrite', store => store.add(user));
    }

    async getUserByEmail(email) {
        return this.performDBOperation('users', 'readonly', store => {
            const index = store.index('email');
            return index.get(email);
        });
    }

    async updateUser(user) {
        return this.performDBOperation('users', 'readwrite', store => store.put(user));
    }

    async saveSession(session) {
        return this.performDBOperation('sessions', 'readwrite', store => store.put(session));
    }

    async getSession(token) {
        return this.performDBOperation('sessions', 'readonly', store => store.get(token));
    }

    async deleteSession(token) {
        return this.performDBOperation('sessions', 'readwrite', store => store.delete(token));
    }

    // Generic DB operation helper
    async performDBOperation(storeName, mode, operation) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], mode);
            const store = transaction.objectStore(storeName);
            const request = operation(store);
            
            if (request.onsuccess !== undefined) {
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            } else {
                // For operations that return a promise
                transaction.oncomplete = () => resolve(request);
                transaction.onerror = () => reject(transaction.error);
            }
        });
    }

    // Optimized password operations
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'timely_salt_' + new Date().getFullYear());
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    async verifyPassword(password, hash) {
        const newHash = await this.hashPassword(password);
        return newHash === hash;
    }

    generateToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    sanitizeUser(user) {
        const { password, ...sanitized } = user;
        return sanitized;
    }

    // UI Updates
    updateAuthUI(isLoggedIn) {
        const authSection = document.querySelector('.auth-section');
        if (!authSection) return;
        
        if (isLoggedIn && this.currentUser) {
            authSection.innerHTML = `
                <div class="user-profile">
                    <div class="user-info">
                        <span class="user-name">${this.currentUser.profile.name}</span>
                        <span class="user-email">${this.currentUser.email}</span>
                    </div>
                    <button class="auth-btn signout-btn" onclick="window.timelyAuth.signOut()">
                        <span class="auth-icon">🚪</span>
                        Sign Out
                    </button>
                    <a href="profile.html" class="auth-btn" style="text-decoration: none; text-align: center; margin-top: 8px; background-color: #6c757d; color: white;">
                        <span class="auth-icon">👤</span>
                        View Profile
                    </a>
                </div>
            `;
        } else {
            authSection.innerHTML = `
                <button class="auth-btn signin-btn" onclick="window.timelyApp.showSignIn()">
                    <span class="auth-icon">🔐</span>
                    Sign In
                </button>
                <button class="auth-btn signup-btn" onclick="window.timelyApp.showSignUp()">
                    <span class="auth-icon">📝</span>
                    Sign Up
                </button>
            `;
        }
    }

    // Public API
    isLoggedIn() {
        return !!this.currentUser;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    async addWorldClock(city) {
        if (!this.currentUser) return;
        
        try {
            await this.initPromise;
            const user = await this.getUserById(this.currentUser.id);
            
            if (!user.profile.worldClocks.find(c => c.name === city.name)) {
                user.profile.worldClocks.push({
                    ...city,
                    addedAt: new Date().toISOString()
                });
                
                await this.updateUser(user);
                
                // Update cached user data
                this.currentUser = this.sanitizeUser(user);
                localStorage.setItem('timelyUserData', JSON.stringify(this.currentUser));
            }
        } catch (error) {
            console.error('Error adding world clock:', error);
        }
    }

    async removeWorldClock(cityName) {
        if (!this.currentUser) return;
        
        try {
            await this.initPromise;
            const user = await this.getUserById(this.currentUser.id);
            
            user.profile.worldClocks = user.profile.worldClocks.filter(c => c.name !== cityName);
            await this.updateUser(user);
            
            // Update cached user data
            this.currentUser = this.sanitizeUser(user);
            localStorage.setItem('timelyUserData', JSON.stringify(this.currentUser));
        } catch (error) {
            console.error('Error removing world clock:', error);
        }
    }

    async getUserById(id) {
        return this.performDBOperation('users', 'readonly', store => store.get(id));
    }
}

// Google Sign-In functions
function signInWithGoogle() {
    if (window.google) {
        google.accounts.id.prompt();
    } else {
        showAuthMessage('❌ Google Sign-In is not available. Please try again later.', 'error');
    }
}

function signUpWithGoogle() {
    // Same as sign in - Google handles both cases
    signInWithGoogle();
}

function showForgotPassword() {
    showAuthMessage('🔄 Password reset functionality coming soon! Please contact support for assistance.', 'info');
}

// Initialize optimized auth system
window.timelyAuth = new OptimizedTimelyAuth();
