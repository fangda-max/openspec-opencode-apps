/**
 * Main Entry Point
 * Initializes the application and handles any module imports
 */

// This file is intentionally minimal - it's the entry point for ES6 modules
// In a real project with bundler, this would handle dynamic imports

console.log('🌱 Skeuomorphic Todo List loaded successfully');
console.log('✨ Built with Spec-Kit workflow');

// Global error handler for better debugging
window.addEventListener('error', (e) => {
    console.error('Application Error:', e.message);
    console.error('File:', e.filename, 'Line:', e.lineno, 'Column:', e.colno);
});

// Make App globally accessible for debugging
window.app = App;
