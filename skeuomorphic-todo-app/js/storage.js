/**
 * Storage Module - LocalStorage Abstraction
 * Provides reliable data persistence with fallback handling
 */

const Storage = {
    KEY: 'skeuomorphic-todo-v1',
    
    /**
     * Save todos to localStorage
     * @param {Array} todos - Array of todo objects
     * @returns {boolean} Success status
     */
    save: function(todos) {
        try {
            const serialized = JSON.stringify(todos);
            localStorage.setItem(this.KEY, serialized);
            return true;
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
            return false;
        }
    },
    
    /**
     * Load todos from localStorage
     * @returns {Array} Array of todo objects or empty array
     */
    load: function() {
        try {
            const data = localStorage.getItem(this.KEY);
            if (!data) return [];
            
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
            return [];
        }
    },
    
    /**
     * Clear all stored data
     * @returns {boolean} Success status
     */
    clear: function() {
        try {
            localStorage.removeItem(this.KEY);
            return true;
        } catch (e) {
            console.error('Failed to clear localStorage:', e);
            return false;
        }
    },
    
    /**
     * Check if storage is available
     * @returns {boolean}
     */
    available: function() {
        try {
            localStorage.setItem('__test__', '__test__');
            localStorage.removeItem('__test__');
            return true;
        } catch (e) {
            return false;
        }
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
