/**
 * Application Controller - Main App Logic
 * Coordinates between UI, Storage, and Todo modules
 */

const App = {
    todos: [],
    
    /**
     * Initialize application
     */
    init: function() {
        this.bindEvents();
        this.loadTodos();
        this.render();
    },
    
    /**
     * Bind all DOM event listeners
     */
    bindEvents: function() {
        const form = document.getElementById('todo-form');
        const input = document.getElementById('todo-input');
        
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        if (input) {
            // Add button click
            document.getElementById('add-btn')?.addEventListener('click', () => {
                this.addTodo(input.value);
                input.value = '';
                input.focus();
            });
            
            // Enter key in non-submit context
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.addTodo(input.value);
                    input.value = '';
                    input.focus();
                }
            });
        }
    },
    
    /**
     * Handle form submission
     * @param {Event} e 
     */
    handleSubmit: function(e) {
        e.preventDefault();
        const input = document.getElementById('todo-input');
        if (input.value.trim()) {
            this.addTodo(input.value);
            input.value = '';
            input.focus();
        }
    },
    
    /**
     * Add new todo
     * @param {string} text 
     */
    addTodo: function(text) {
        const newTodo = Todo.create(text);
        this.todos.push(newTodo);
        this.saveAndRender();
    },
    
    /**
     * Toggle todo completion status
     * @param {string} id 
     */
    toggleTodo: function(id) {
        this.todos = this.todos.map(todo => {
            if (todo.id === id) {
                return Todo.toggleComplete(todo);
            }
            return todo;
        });
        this.saveAndRender();
    },
    
    /**
     * Delete todo by ID
     * @param {string} id 
     */
    deleteTodo: function(id) {
        this.todos = Todo.delete(this.todos, id);
        this.saveAndRender();
    },
    
    /**
     * Load todos from storage
     */
    loadTodos: function() {
        this.todos = Storage.load();
    },
    
    /**
     * Save todos and re-render
     */
    saveAndRender: function() {
        Storage.save(this.todos);
        this.render();
    },
    
    /**
     * Render the todo list UI
     */
    render: function() {
        this.updateCounter();
        this.renderTodoList();
    },
    
    /**
     * Update task counter display
     */
    updateCounter: function() {
        const totalEl = document.getElementById('total-tasks');
        const completedEl = document.getElementById('completed-tasks');
        
        if (totalEl) {
            totalEl.textContent = Todo.getCount(this.todos);
        }
        
        if (completedEl) {
            completedEl.textContent = Todo.getCompletedCount(this.todos);
        }
    },
    
    /**
     * Render individual todo items
     */
    renderTodoList: function() {
        const listEl = document.getElementById('todo-list');
        const emptyEl = document.getElementById('empty-state');
        
        if (!listEl) return;
        
        // Clear existing tasks (keep empty state)
        const tasks = listEl.querySelectorAll('.todo-item');
        tasks.forEach(task => task.remove());
        
        if (this.todos.length === 0) {
            if (emptyEl) {
                emptyEl.style.display = 'block';
            }
        } else {
            if (emptyEl) {
                emptyEl.style.display = 'none';
            }
            
            // Render each todo
            this.todos.forEach(todo => {
                const itemEl = this.createTodoElement(todo);
                listEl.insertBefore(itemEl, emptyEl);
            });
        }
    },
    
    /**
     * Create todo item DOM element
     * @param {Object} todo 
     * @returns {HTMLElement}
     */
    createTodoElement: function(todo) {
        const item = document.createElement('div');
        item.className = 'todo-item';
        item.setAttribute('data-id', todo.id);
        item.setAttribute('role', 'listitem');
        
        const checkbox = document.createElement('label');
        checkbox.className = `checkbox ${todo.completed ? 'checked' : ''}`;
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = todo.completed;
        input.className = 'todo-checkbox';
        input.setAttribute('aria-label', `Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`);
        
        const text = document.createElement('span');
        text.className = `todo-text ${todo.completed ? 'completed' : ''}`;
        text.textContent = todo.text;
        
        const actions = document.createElement('div');
        actions.className = 'todo-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-icon btn-edit';
        editBtn.innerHTML = '✏️';
        editBtn.title = 'Edit task';
        editBtn.setAttribute('aria-label', 'Edit task');
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-icon btn-delete';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete task';
        deleteBtn.setAttribute('aria-label', 'Delete task');
        
        checkbox.appendChild(input);
        checkbox.appendChild(text);
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        
        item.appendChild(checkbox);
        item.appendChild(actions);
        
        // Event listeners
        checkbox.addEventListener('click', (e) => {
            if (e.target !== input) {
                this.toggleTodo(todo.id);
            }
        });
        
        input.addEventListener('change', () => {
            this.toggleTodo(todo.id);
        });
        
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Delete "${todo.text}"?`)) {
                this.deleteTodo(todo.id);
            }
        });
        
        editBtn.addEventListener('click', () => {
            this.editTodo(todo);
        });
        
        return item;
    },
    
    /**
     * Edit existing todo
     * @param {Object} todo 
     */
    editTodo: function(todo) {
        const newText = prompt('Edit task:', todo.text);
        if (newText && newText.trim()) {
            this.todos = this.todos.map(t => {
                if (t.id === todo.id) {
                    return { ...t, text: newText.trim() };
                }
                return t;
            });
            this.saveAndRender();
        }
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
