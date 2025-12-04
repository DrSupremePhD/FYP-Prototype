// ===================================
// PRIVAGENE - AUTHENTICATION
// Mock authentication system
// ===================================

// BACKEND_INTEGRATION: Replace all authentication logic with JWT tokens or session-based auth from your backend

const Auth = {
    // Get current logged-in user
    getCurrentUser() {
        // BACKEND_INTEGRATION: Replace with API call: GET /api/auth/me (using session cookie or JWT)
        const userJson = sessionStorage.getItem('privagene_current_user');
        return userJson ? JSON.parse(userJson) : null;
    },

    // Set current user in session
    setCurrentUser(user) {
        // BACKEND_INTEGRATION: This will be handled by server-side session or JWT token
        sessionStorage.setItem('privagene_current_user', JSON.stringify(user));
    },

    // Clear current user
    clearCurrentUser() {
        // BACKEND_INTEGRATION: Replace with API call: POST /api/auth/logout
        sessionStorage.removeItem('privagene_current_user');
    },

    // Check if user is authenticated
    isAuthenticated() {
        return this.getCurrentUser() !== null;
    },

    // Check if user has a specific role
    hasRole(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    },

    // Login function
    async login(email, password) {
        try {
            // Try backend API first
            const response = await fetch('http://localhost:3001/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const data = await response.json();
            const user = data.user;

            // Clear gene upload
            localStorage.removeItem('mappedGeneSymbols');
            localStorage.removeItem('geneUploads');
            localStorage.removeItem('psiResult');

            // Store user in session
            this.setCurrentUser(user);
            return user;

        } catch (error) {
            // Fallback to localStorage if backend is unavailable
            console.warn('Backend unavailable, using localStorage:', error.message);

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const user = Storage.getUser(email);

                    if (!user) {
                        reject({ message: 'User not found' });
                        return;
                    }

                    if (user.status === 'suspended') {
                        reject({ message: 'Account suspended. Please contact support.' });
                        return;
                    }

                    if (user.status === 'pending_approval') {
                        reject({ message: 'Account pending approval. Please wait for system admin to approve your registration.' });
                        return;
                    }

                    if (user.password !== password) {
                        reject({ message: 'Invalid password' });
                        return;
                    }

                    const { password: _, ...userWithoutPassword } = user;
                    this.setCurrentUser(userWithoutPassword);
                    resolve(userWithoutPassword);
                }, 800);
            });
        }
    },

    // Register function
    async register(userData, autoLogin = true) {
        try {
            // Try backend API first
            const response = await fetch('http://localhost:3001/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || error.error || 'Registration failed');
            }

            const data = await response.json();
            const user = data.user;

            // Auto-login for non-admin roles
            if (autoLogin && userData.role !== 'system_admin' && user.status === 'active') {
                this.setCurrentUser(user);
            }

            return user;

        } catch (error) {
            // Fallback to localStorage if backend is unavailable
            console.warn('Backend unavailable, using localStorage:', error.message);

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const existingUser = Storage.getUser(userData.email);
                    if (existingUser) {
                        reject({ message: 'User already exists with this email' });
                        return;
                    }

                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(userData.email)) {
                        reject({ message: 'Invalid email format' });
                        return;
                    }

                    if (userData.password.length < 8) {
                        reject({ message: 'Password must be at least 8 characters long' });
                        return;
                    }

                    const newUser = Storage.addUser(userData);
                    const { password: _, ...userWithoutPassword } = newUser;

                    if (autoLogin && userData.role !== 'system_admin') {
                        this.setCurrentUser(userWithoutPassword);
                    }

                    resolve(userWithoutPassword);
                }, 800);
            });
        }
    },

    // Logout function
    logout() {
        // Clear gene data when logging out
        localStorage.removeItem('mappedGeneSymbols');
        localStorage.removeItem('geneUploads');
        localStorage.removeItem('psiResult');
        
        // BACKEND_INTEGRATION: Replace with API call: POST /api/auth/logout
        this.clearCurrentUser();
        // Use navigation helper to resolve path robustly
        const prefix = (window.Navigation && typeof Navigation.getPathToPages === 'function') ? Navigation.getPathToPages() : './';
        window.location.href = prefix + 'index.html';
    },

    // Request password reset
    async requestPasswordReset(email) {
        // BACKEND_INTEGRATION: Replace with API call: POST /api/auth/password-reset-request
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = Storage.getUser(email);
                if (!user) {
                    reject({ message: 'User not found' });
                    return;
                }

                // In production, this would send an email with a reset token
                console.log('Password reset email sent to:', email);
                resolve({ message: 'Password reset email sent' });
            }, 800);
        });
    },

    // Reset password
    async resetPassword(token, newPassword) {
        // BACKEND_INTEGRATION: Replace with API call: POST /api/auth/password-reset
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // In production, validate the token and update password in database
                if (newPassword.length < 8) {
                    reject({ message: 'Password must be at least 8 characters long' });
                    return;
                }

                console.log('Password reset successful');
                resolve({ message: 'Password updated successfully' });
            }, 800);
        });
    },

    // Update password for logged-in user
    async updatePassword(currentPassword, newPassword) {
        // BACKEND_INTEGRATION: Replace with API call: PUT /api/auth/password
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = this.getCurrentUser();
                if (!user) {
                    reject({ message: 'Not authenticated' });
                    return;
                }

                const fullUser = Storage.getUserById(user.id);

                // WARNING: Password comparison should happen on server
                if (fullUser.password !== currentPassword) {
                    reject({ message: 'Current password is incorrect' });
                    return;
                }

                if (newPassword.length < 8) {
                    reject({ message: 'New password must be at least 8 characters long' });
                    return;
                }

                // Update password
                Storage.updateUser(user.id, { password: newPassword });

                resolve({ message: 'Password updated successfully' });
            }, 800);
        });
    },

    // Update user profile
    async updateProfile(updates) {
        // BACKEND_INTEGRATION: Replace with API call: PUT /api/users/profile
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = this.getCurrentUser();
                if (!user) {
                    reject({ message: 'Not authenticated' });
                    return;
                }

                // Don't allow updating certain fields
                const { id, email, password, role, ...allowedUpdates } = updates;

                const updatedUser = Storage.updateUser(user.id, allowedUpdates);

                // Update session
                const { password: _, ...userWithoutPassword } = updatedUser;
                this.setCurrentUser(userWithoutPassword);

                resolve(userWithoutPassword);
            }, 800);
        });
    },

    // Delete user account
    async deleteAccount(password) {
        // BACKEND_INTEGRATION: Replace with API call: DELETE /api/users/account
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = this.getCurrentUser();
                if (!user) {
                    reject({ message: 'Not authenticated' });
                    return;
                }

                const fullUser = Storage.getUserById(user.id);

                // WARNING: Password comparison should happen on server
                if (fullUser.password !== password) {
                    reject({ message: 'Password is incorrect' });
                    return;
                }

                // Delete user
                Storage.deleteUser(user.id);
                this.clearCurrentUser();

                resolve({ message: 'Account deleted successfully' });
            }, 800);
        });
    },

    // Redirect to appropriate dashboard based on user role
    redirectToDashboard(user) {
        // Determine current location and build appropriate path
        const currentPath = window.location.pathname;
        let basePath = '';

        // If we're in pages directory (login.html, index.html, etc)
        if (currentPath.includes('/pages/') && !currentPath.includes('/pages/patient/') &&
            !currentPath.includes('/pages/hospital/') && !currentPath.includes('/pages/admin/') &&
            !currentPath.includes('/pages/system-admin/') && !currentPath.includes('/pages/researcher/')) {
            basePath = '';
        } else {
            // We're somewhere else, use relative path back to pages
            basePath = '../';
        }

        const dashboardPaths = {
            patient: basePath + 'patient/dashboard.html',
            hospital: basePath + 'hospital/dashboard.html',
            admin: basePath + 'admin/dashboard.html',
            system_admin: basePath + 'system-admin/dashboard.html',
            researcher: basePath + 'researcher/dashboard.html'
        };

        const dashboardPath = dashboardPaths[user.role];
        if (dashboardPath) {
            window.location.href = dashboardPath;
        } else {
            console.error('Unknown user role:', user.role);
        }
    },

    // Require authentication for a page
    requireAuth() {
        if (!this.isAuthenticated()) {
            // Navigate to login from any subdirectory
            const currentPath = window.location.pathname;
            const depth = (currentPath.match(/\//g) || []).length - 2;
            const prefix = '../'.repeat(Math.max(0, depth));
            window.location.href = prefix + 'login.html';
            return false;
        }
        return true;
    },

    // Require specific role for a page
    requireRole(role) {
        if (!this.requireAuth()) {
            return false;
        }

        if (!this.hasRole(role)) {
            // Redirect to their own dashboard
            this.redirectToDashboard(this.getCurrentUser());
            return false;
        }

        return true;
    }
};

// Export for use in other scripts
window.Auth = Auth;
