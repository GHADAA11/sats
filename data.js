/**
 * data.js
 * Handles data persistence using LocalStorage
 */

const STORAGE_KEYS = {
    USERS: 'sats_users',
    CURRENT_USER: 'sats_current_user',
    ATTENDANCE: 'sats_attendance'
};

const DataManager = {
    getUsers: () => {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    },

    saveUser: (user) => {
        const users = DataManager.getUsers();
        // Check if user already exists
        if (users.find(u => u.email === user.email || u.studentId === user.studentId)) {
            return { success: false, message: 'User already exists with this Email or Student ID.' };
        }
        users.push(user);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        return { success: true };
    },

    loginUser: (email, password) => {
        const users = DataManager.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            // Save to session storage as per requirement "saved temporarily during the session"
            // But we'll use LocalStorage for "current user" to simulate a session for simplicity in this frontend-only app
            // Or better, SessionStorage for the active session.
            sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, message: 'Invalid credentials.' };
    },

    getCurrentUser: () => {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    },

    logout: () => {
        sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    },

    getAttendance: (studentId) => {
        const allAttendance = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) || [];
        return allAttendance.filter(record => record.studentId === studentId);
    },

    saveAttendance: (record) => {
        const allAttendance = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) || [];
        // Check for duplicates if needed (same class same day)
        const exists = allAttendance.find(r =>
            r.studentId === record.studentId &&
            r.classCode === record.classCode &&
            new Date(r.timestamp).toDateString() === new Date().toDateString()
        );

        if (exists) {
            return { success: false, message: 'You have already checked in for this class today.' };
        }

        allAttendance.push(record);
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(allAttendance));
        return { success: true };
    },

    clearAllData: () => {
        localStorage.removeItem(STORAGE_KEYS.USERS);
        localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
        sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        return { success: true, message: 'All data cleared successfully.' };
    },

    deleteAllStudents: () => {
        localStorage.removeItem(STORAGE_KEYS.USERS);
        // Also log out if the current user was a student
        sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        return { success: true, message: 'All students deleted successfully.' };
    }
};
