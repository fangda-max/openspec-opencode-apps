/**
 * Todo Module - Core Todo Item Management
 */

const Todo = {
    /**
     * Create a new todo object
     * @param {string} text - Todo description
     * @returns {Object} New todo object
     */
    create: function(text) {
        return {
            id: this.generateId(),
            text: text.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };
    },
    
    /**
     * Generate unique ID using timestamp + random
     * @returns {string} Unique identifier
     */
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    /**
     * Toggle completion status
     * @param {Object} todo - Todo object
     * @returns {Object} Updated todo
     */
    toggleComplete: function(todo) {
        return {
            ...todo,
            completed: !todo.completed
        };
    },
    
    /**
     * Delete todo by ID
     * @param {Array} todos - Array of todos
     * @param {string} id - Todo ID to delete
     * @returns {Array} Filtered array
     */
    delete: function(todos, id) {
        return todos.filter(todo => todo.id !== id);
    },
    
    /**
     * Get all todos
     * @param {Array} todos 
     * @returns {number} Total count
     */
    getCount: function(todos) {
        return todos.length;
    },
    
    /**
     * Get completed todos count
     * @param {Array} todos 
     * @returns {number} Completed count
     */
    getCompletedCount: function(todos) {
        return todos.filter(todo => todo.completed).length;
    },
    
    /**
     * Get incomplete todos count
     * @param {Array} todos 
     * @returns {number} Pending count
     */
    getPendingCount: function(todos) {
        return todos.filter(todo => !todo.completed).length;
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Todo;
}
