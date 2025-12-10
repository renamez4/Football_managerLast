// Authentication utilities
const AUTH_KEY = 'sport_manager_user';
const USERS_DB_KEY = 'sport_manager_users_db';

// Save user to database
function saveUserToDatabase(user) {
    try {
        const usersDB = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
        // Update or create user entry
        // We preserve existing data (like password) if we are just updating profile info
        const existingUser = usersDB[user.username] || {};

        usersDB[user.username] = {
            ...existingUser,
            username: user.username,
            email: user.email,
            phone: user.phone || '',
            profileImage: user.profileImage || '',
            // Only update password if it's provided in the user object
            password: user.password || existingUser.password || ''
        };
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDB));
    } catch (e) {
        console.error('Error saving user to database:', e);
    }
}

// Get current user
function getCurrentUser() {
    try {
        const stored = localStorage.getItem(AUTH_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        console.error('Error getting current user:', e);
        return null;
    }
}

// Login user
function login(identifier, password) {
    try {
        const usersDB = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
        let foundUser = null;

        // Find user by username or email
        for (const username in usersDB) {
            const user = usersDB[username];
            if (user.username === identifier || user.email === identifier) {
                foundUser = user;
                break;
            }
        }

        if (!foundUser) {
            throw new Error('ไม่พบชื่อผู้ใช้หรืออีเมลนี้');
        }

        // Check password only if user has one (for legacy support)
        if (foundUser.password && foundUser.password !== password) {
            throw new Error('รหัสผ่านไม่ถูกต้อง');
        }

        // If user has no password (legacy), allow login but maybe prompt to set one later?
        // For now, just allow login.

        // Login successful
        // Don't store password in the active session for security (basic)
        const sessionUser = { ...foundUser };
        delete sessionUser.password;

        localStorage.setItem(AUTH_KEY, JSON.stringify(sessionUser));
        return sessionUser;
    } catch (e) {
        console.error('Error logging in:', e);
        throw e; // Re-throw to handle in UI
    }
}

// Register user
function register(userData) {
    try {
        const usersDB = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');

        // Check if username already exists
        if (usersDB[userData.username]) {
            throw new Error('ชื่อผู้ใช้นี้ถูกใช้งานแล้ว');
        }

        // Check if email already exists
        for (const username in usersDB) {
            if (usersDB[username].email === userData.email) {
                throw new Error('อีเมลนี้ถูกใช้งานแล้ว');
            }
        }

        const user = {
            username: userData.username,
            email: userData.email,
            phone: userData.phone || '',
            profileImage: '',
            password: userData.password
        };

        saveUserToDatabase(user);

        // Auto login after register
        const sessionUser = { ...user };
        delete sessionUser.password;
        localStorage.setItem(AUTH_KEY, JSON.stringify(sessionUser));

        return sessionUser;
    } catch (e) {
        console.error('Error registering:', e);
        throw e;
    }
}

// Logout user
function logout() {
    try {
        localStorage.removeItem(AUTH_KEY);
        // Redirect to index or login page is handled by the caller or nav
    } catch (e) {
        console.error('Error logging out:', e);
    }
}

// Update user profile
function updateProfile(updates) {
    const user = getCurrentUser();
    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    try {
        localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
        saveUserToDatabase(updatedUser);
    } catch (e) {
        console.error('Error updating profile:', e);
    }
    return updatedUser;
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Redirect if not logged in
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}
