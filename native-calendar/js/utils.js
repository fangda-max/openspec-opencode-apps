/**
 * Utility functions for date manipulation and formatting
 */

const utils = {
    /**
     * Get current date at midnight
     */
    getToday() {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    },

    /**
     * Check if two dates are on the same day
     */
    isSameDate(date1, date2) {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    },

    /**
     * Add days to a date
     */
    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },

    /**
     * Subtract days from a date
     */
    subDays(date, days) {
        return this.addDays(date, -days);
    },

    /**
     * Get first day of month
     */
    getFirstDayOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    },

    /**
     * Get last day of month
     */
    getLastDayOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    },

    /**
     * Get number of days in month
     */
    getDaysInMonth(date) {
        return this.getLastDayOfMonth(date).getDate();
    },

    /**
     * Get day of week (0-6, 0=Sunday)
     */
    getDayOfWeek(date) {
        return date.getDay();
    },

    /**
     * Get week number of year
     */
    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    },

    /**
     * Format date as YYYY-MM-DD
     */
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    /**
     * Parse string date to Date object
     */
    parseDate(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    },

    /**
     * Format date for display (e.g., "January 15, 2024")
     */
    formatDisplayDate(date) {
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    },

    /**
     * Format short date for display (e.g., "Jan 15")
     */
    formatShortDate(date) {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    },

    /**
     * Format time as HH:MM
     */
    formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    },

    /**
     * Calculate start of week (Sunday)
     */
    getStartOfWeek(date) {
        const day = date.getDay();
        return this.subDays(date, day);
    },

    /**
     * Calculate end of week (Saturday)
     */
    getEndOfWeek(date) {
        return this.addDays(this.getStartOfWeek(date), 6);
    },

    /**
     * Generate array of dates for a range
     */
    dateRange(start, end) {
        const dates = [];
        let current = start;
        while (current <= end) {
            dates.push(new Date(current));
            current = this.addDays(current, 1);
        }
        return dates;
    },

    /**
     * Navigate to previous period
     */
    prevPeriod(date, view) {
        switch (view) {
            case 'day':
                return this.subDays(date, 1);
            case 'week':
                return this.subDays(date, 7);
            case 'month':
            default:
                return new Date(date.getFullYear(), date.getMonth() - 1, 1);
        }
    },

    /**
     * Navigate to next period
     */
    nextPeriod(date, view) {
        switch (view) {
            case 'day':
                return this.addDays(date, 1);
            case 'week':
                return this.addDays(date, 7);
            case 'month':
            default:
                return new Date(date.getFullYear(), date.getMonth() + 1, 1);
        }
    }
};

export default utils;
