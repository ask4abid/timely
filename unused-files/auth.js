// Timely Authentication & User Profile Management
// Using IndexedDB for local storage with JSON backup capability

class TimelyAuth {
    constructor() {
        this.dbName = 'TimelyUserDB';
        this.dbVersion = 1;
        this.db = null;
        this.currentUser = null;
        
        // Initialize database
        this.initDatabase();
        
        // Check for existing session
        this.checkSession();
    }

    async initDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ Timely Database initialized');
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Users store
                if (!db.objectStoreNames.contains('users')) {
                    const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
                    userStore.createIndex('email', 'email', { unique: true });
                    userStore.createIndex('username', 'username', { unique: false });
                }
                
                // User preferences store
                if (!db.objectStoreNames.contains('preferences')) {
                    const prefStore = db.createObjectStore('preferences', { keyPath: 'userId' });
                }
                
                // User sessions store
                if (!db.objectStoreNames.contains('sessions')) {
                    const sessionStore = db.createObjectStore('sessions', { keyPath: 'token' });
                }
                
                console.log('🔄 Database schema created/updated');
            };
        });
    }

    // User Registration
    async signUp(userData) {
        try {
            const { name, email, password, confirmPassword } = userData;
            
            // Validation
            if (!name || !email || !password) {
                throw new Error('All fields are required');
            }
            
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }
            
            if (password.length < 8) {
                throw new Error('Password must be at least 8 characters long');
            }
            
            // Check if user already exists
            const existingUser = await this.getUserByEmail(email);
            if (existingUser) {
                throw new Error('User with this email already exists');
            }
            
            // Hash password (simple hash for demo - use bcrypt in production)
            const hashedPassword = await this.hashPassword(password);
            
            // Create user object
            const newUser = {
                username: name,
                email: email.toLowerCase(),
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                isActive: true,
                profile: {
                    name: name,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    theme: 'light',
                    favoriteCity: null,
                    worldClocks: [],
                    preferences: {
                        notifications: true,
                        autoDetectLocation: true,
                        format24h: false
                    }
                }
            };
            
            // Save to database
            const userId = await this.saveUser(newUser);
            newUser.id = userId;
            
            // Create session
            await this.createSession(newUser);
            
            // Export user data for backup
            await this.exportUserData();
            
            console.log('✅ User registered successfully:', newUser.email);
            return { success: true, user: this.sanitizeUser(newUser) };
            
        } catch (error) {
            console.error('❌ Registration failed:', error);
            return { success: false, error: error.message };
        }
    }

    // User Login
    async signIn(credentials) {
        try {
            const { email, password, rememberMe } = credentials;
            
            if (!email || !password) {
                throw new Error('Email and password are required');
            }
            
            // Get user from database
            const user = await this.getUserByEmail(email.toLowerCase());
            if (!user) {
                throw new Error('Invalid email or password');
            }
            
            // Verify password
            const isValidPassword = await this.verifyPassword(password, user.password);
            if (!isValidPassword) {
                throw new Error('Invalid email or password');
            }
            
            if (!user.isActive) {
                throw new Error('Account is deactivated');
            }
            
            // Update last login
            user.lastLogin = new Date().toISOString();
            await this.updateUser(user);
            
            // Create session
            await this.createSession(user, rememberMe);
            
            console.log('✅ User signed in successfully:', user.email);
            return { success: true, user: this.sanitizeUser(user) };
            
        } catch (error) {
            console.error('❌ Sign in failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Session Management
    async createSession(user, rememberMe = false) {
        const token = this.generateToken();
        const expiresAt = rememberMe 
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            : new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        const session = {
            token,
            userId: user.id,
            createdAt: new Date().toISOString(),
            expiresAt: expiresAt.toISOString(),
            userAgent: navigator.userAgent
        };
        
        // Save session to database
        await this.saveSession(session);
        
        // Store in localStorage
        localStorage.setItem('timelyAuthToken', token);
        
        // Set current user
        this.currentUser = this.sanitizeUser(user);
        
        // Update UI
        this.updateAuthUI(true);
        
        return token;
    }

    async checkSession() {
        const token = localStorage.getItem('timelyAuthToken');
        if (!token) return null;
        
        try {
            const session = await this.getSession(token);
            if (!session || new Date(session.expiresAt) < new Date()) {
                await this.signOut();
                return null;
            }
            
            const user = await this.getUserById(session.userId);
            if (!user || !user.isActive) {
                await this.signOut();
                return null;
            }
            
            this.currentUser = this.sanitizeUser(user);
            this.updateAuthUI(true);
            
            console.log('✅ Session restored for:', user.email);
            return this.currentUser;
            
        } catch (error) {
            console.error('❌ Session check failed:', error);
            await this.signOut();
            return null;
        }
    }

    async signOut() {
        const token = localStorage.getItem('timelyAuthToken');
        if (token) {
            await this.deleteSession(token);
            localStorage.removeItem('timelyAuthToken');
        }
        
        this.currentUser = null;
        this.updateAuthUI(false);
        
        console.log('✅ User signed out');
    }

    // Database Operations
    async saveUser(user) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');
            const request = store.add(user);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const index = store.index('email');
            const request = index.get(email);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getUserById(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const request = store.get(id);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async updateUser(user) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');
            const request = store.put(user);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async saveSession(session) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['sessions'], 'readwrite');
            const store = transaction.objectStore('sessions');
            const request = store.put(session);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getSession(token) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['sessions'], 'readonly');
            const store = transaction.objectStore('sessions');
            const request = store.get(token);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteSession(token) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['sessions'], 'readwrite');
            const store = transaction.objectStore('sessions');
            const request = store.delete(token);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // User Preferences
    async updateUserPreferences(preferences) {
        if (!this.currentUser) return;
        
        const user = await this.getUserById(this.currentUser.id);
        user.profile.preferences = { ...user.profile.preferences, ...preferences };
        user.updatedAt = new Date().toISOString();
        
        await this.updateUser(user);
        this.currentUser = this.sanitizeUser(user);
        
        console.log('✅ User preferences updated');
    }

    async addWorldClock(city) {
        if (!this.currentUser) return;
        
        const user = await this.getUserById(this.currentUser.id);
        if (!user.profile.worldClocks.find(c => c.name === city.name)) {
            user.profile.worldClocks.push({
                ...city,
                addedAt: new Date().toISOString()
            });
            user.updatedAt = new Date().toISOString();
            
            await this.updateUser(user);
            this.currentUser = this.sanitizeUser(user);
            
            console.log('✅ World clock added:', city.name);
        }
    }

    async removeWorldClock(cityName) {
        if (!this.currentUser) return;
        
        const user = await this.getUserById(this.currentUser.id);
        user.profile.worldClocks = user.profile.worldClocks.filter(c => c.name !== cityName);
        user.updatedAt = new Date().toISOString();
        
        await this.updateUser(user);
        this.currentUser = this.sanitizeUser(user);
        
        console.log('✅ World clock removed:', cityName);
    }

    // Data Export/Import for easy profile management
    async exportUserData() {
        try {
            const users = await this.getAllUsers();
            const sessions = await this.getAllSessions();
            
            const exportData = {
                version: '1.0',
                exportedAt: new Date().toISOString(),
                users: users.map(this.sanitizeUser),
                sessions: sessions,
                stats: {
                    totalUsers: users.length,
                    activeUsers: users.filter(u => u.isActive).length
                }
            };
            
            // Save to downloadable JSON file
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            console.log('💾 User data exported for backup');
            return { blob, url, data: exportData };
            
        } catch (error) {
            console.error('❌ Export failed:', error);
        }
    }

    async getAllUsers() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllSessions() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['sessions'], 'readonly');
            const store = transaction.objectStore('sessions');
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Utility Functions
    async hashPassword(password) {
        // Simple hash for demo - use bcrypt or similar in production
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'timely_salt_2024');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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

    updateAuthUI(isLoggedIn) {
        // Update hamburger menu
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

    // Public methods for external access
    isLoggedIn() {
        return !!this.currentUser;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    async downloadUserData() {
        const exportResult = await this.exportUserData();
        if (exportResult) {
            const a = document.createElement('a');
            a.href = exportResult.url;
            a.download = `timely-users-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(exportResult.url);
        }
    }
}

// Initialize global auth instance
window.timelyAuth = new TimelyAuth();
