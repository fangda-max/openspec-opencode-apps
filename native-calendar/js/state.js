/**
 * State Store with Event Emitter Pattern
 */

class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }

    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    }
}

// Default state structure
const defaultState = {
    currentDate: utils.getToday(),
    view: 'month',
    events: [],
    preferences: {
        theme: 'light',
        firstDayOfWeek: 0 // Sunday
    }
};

// Merge with persisted defaults
let persistedDefaults = {};
try {
    const stored = localStorage.getItem('calendar_defaults');
    if (stored) {
        persistedDefaults = JSON.parse(stored);
    }
} catch (e) {
    console.warn('Could not load persisted defaults:', e);
}

// Create state store
class StateStore {
    constructor() {
        this.emitter = new EventEmitter();
        this.listeners = new Map();
        this.currentState = null;
        
        this.initialize();
    }
    
    onViewChanged(callback) {
        this.emitter.on('viewChanged', callback);
    }

    initialize() {
        this.loadFromStorage();
        this.currentState = { ...defaultState };
        
        // Load any existing events
        try {
            const storedEvents = localStorage.getItem('calendar_events');
            if (storedEvents) {
                const parsed = JSON.parse(storedEvents);
                if (Array.isArray(parsed)) {
                    this.currentState.events = parsed;
                }
            }
        } catch (e) {
            console.warn('Could not load events from storage:', e);
        }
        
        // Load preferences
        try {
            const storedPrefs = localStorage.getItem('calendar_preferences');
            if (storedPrefs) {
                const prefs = JSON.parse(storedPrefs);
                this.currentState.preferences = { ...defaultState.preferences, ...prefs };
            }
        } catch (e) {
            console.warn('Could not load preferences from storage:', e);
        }
    }

    subscribe(listener) {
        const id = Symbol();
        this.listeners.set(id, listener);
        return () => this.listeners.delete(id);
    }

    getState() {
        return { ...this.currentState };
    }

    get(key) {
        return this.currentState[key];
    }

    set(key, value) {
        this.currentState[key] = value;
        this.persistAsync();
        this.notifyListeners();
    }

    merge(key, updates) {
        this.currentState[key] = { ...this.currentState[key], ...updates };
        this.persistAsync();
        this.notifyListeners();
    }

    update(fn) {
        fn(this.currentState);
        this.persistAsync();
        this.notifyListeners();
    }

    persistAsync() {
        // Debounce persistance slightly
        clearTimeout(this.persistTimeout);
        this.persistTimeout = setTimeout(() => {
            this.persist();
        }, 100);
    }

    persist() {
        try {
            // Save events
            if (Array.isArray(this.currentState.events)) {
                localStorage.setItem('calendar_events', JSON.stringify(this.currentState.events));
            }
            
            // Save preferences
            if (this.currentState.preferences) {
                localStorage.setItem('calendar_preferences', JSON.stringify(this.currentState.preferences));
            }
            
            // Save defaults (currentDate, view)
            const defaults = {
                currentDate: this.currentState.currentDate.toISOString(),
                view: this.currentState.view
            };
            localStorage.setItem('calendar_defaults', JSON.stringify(defaults));
            
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error('LocalStorage quota exceeded! Consider archiving old events.');
            } else {
                console.error('Failed to persist state:', error);
            }
        }
    }

    loadFromStorage() {
        try {
            const storedDefaults = localStorage.getItem('calendar_defaults');
            if (storedDefaults) {
                const parsed = JSON.parse(storedDefaults);
                if (parsed.currentDate) {
                    persistedDefaults.currentDate = new Date(parsed.currentDate);
                }
                if (parsed.view) {
                    persistedDefaults.view = parsed.view;
                }
            }
        } catch (e) {
            console.warn('Could not load defaults:', e);
        }
    }

    notifyListeners() {
        this.listeners.forEach(listener => {
            listener({ ...this.currentState });
        });
    }

    // Action methods
    setCurrentDate(date) {
        this.set('currentDate', date instanceof Date ? date : new Date(date));
    }

    setView(view) {
        const validViews = ['month', 'week', 'day'];
        if (validViews.includes(view)) {
            this.set('view', view);
            this.emitter.emit('viewChanged', view);
        }
    }

    addEvent(event) {
        this.update(state => {
            state.events.push(event);
        });
    }

    updateEvent(updatedEvent) {
        this.update(state => {
            const index = state.events.findIndex(e => e.id === updatedEvent.id);
            if (index !== -1) {
                state.events[index] = updatedEvent;
            }
        });
    }

    deleteEvent(id) {
        this.update(state => {
            state.events = state.events.filter(e => e.id !== id);
        });
    }

    navigatePrev() {
        this.update(state => {
            state.currentDate = utils.prevPeriod(state.currentDate, state.view);
        });
    }

    navigateNext() {
        this.update(state => {
            state.currentDate = utils.nextPeriod(state.currentDate, state.view);
        });
    }

    goToToday() {
        this.setCurrentDate(utils.getToday());
    }
}

// Export singleton instance
export const store = new StateStore();

export default store;
