/**
 * Calendar Rendering - Month View
 */

import utils from './utils.js';

class MonthViewRenderer {
    constructor(store) {
        this.store = store;
        this.container = null;
    }

    render(container, date) {
        const currentDate = date || this.store.get('currentDate');
        this.container = container;
        
        container.innerHTML = `
            <div class="calendar-header">
                <button class="nav-prev btn-secondary" title="Previous month">&lt;</button>
                <button class="today-button btn-secondary">Today</button>
                <button class="nav-next btn-secondary" title="Next month">&gt;</button>
                <div class="date-display">${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                <div class="view-switcher">
                    <button class="view-button active" data-view="month">Month</button>
                    <button class="view-button" data-view="week">Week</button>
                    <button class="view-button" data-view="day">Day</button>
                </div>
                <button class="add-event-btn">+ Add Event</button>
            </div>
            <div class="month-view-container">
                <div class="weekday-headers">
                    <div class="weekday">Sun</div>
                    <div class="weekday">Mon</div>
                    <div class="weekday">Tue</div>
                    <div class="weekday">Wed</div>
                    <div class="weekday">Thu</div>
                    <div class="weekday">Fri</div>
                    <div class="weekday">Sat</div>
                </div>
                <div class="month-grid"></div>
            </div>
        `;
        
        const gridContainer = container.querySelector('.month-grid');
        this.renderMonthGrid(gridContainer, currentDate);
        this.attachListeners();
    }

    renderMonthGrid(container, currentDate) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDayOfMonth = firstDay.getDay();
        const daysInMonth = lastDay.getDate();
        
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        const today = utils.getToday();
        
        let html = '<div class="month-days">';
        
        for (let i = 0; i < startDayOfMonth; i++) {
            const prevDay = daysInPrevMonth - startDayOfMonth + 1 + i;
            html += `<div class="day-cell other-month">
                <span class="day-number">${prevDay}</span>
            </div>`;
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDateCell = new Date(year, month, day);
            const isToday = utils.isSameDate(currentDateCell, today);
            const eventsForDay = this.getEventsForDate(currentDateCell);
            
            html += `<div class="day-cell ${isToday ? 'today-highlight' : ''}" 
                        data-date="${utils.formatDate(currentDateCell)}" 
                        data-day="${day}">
                <span class="day-number">${day}${isToday ? '<i class="icon-today"></i>' : ''}</span>
                <div class="event-indicators">`;
            
            for (let j = 0; j < Math.min(eventsForDay.length, 3); j++) {
                html += `<span class="event-dot" style="background-color: ${eventsForDay[j].color || '#4a90d9'}"></span>`;
            }
            
            if (eventsForDay.length > 3) {
                html += `<span class="more-events">+${eventsForDay.length - 3}</span>`;
            }
            
            html += `</div></div>`;
        }
        
        const remainingCells = 7 - ((startDayOfMonth + daysInMonth) % 7);
        if (remainingCells < 7) {
            for (let i = 1; i <= remainingCells; i++) {
                html += `<div class="day-cell other-month">
                    <span class="day-number">${i}</span>
                </div>`;
            }
        }
        
        html += '</div>';
        container.innerHTML = html;
        this.attachDayClickHandlers();
    }

    getEventsForDate(date) {
        const allEvents = this.store.get('events') || [];
        return allEvents.filter(e => {
            if (!e.start) return false;
            const eventDate = new Date(e.start);
            return utils.isSameDate(eventDate, date);
        }).sort((a, b) => {
            const aTime = new Date(a.start).getTime();
            const bTime = new Date(b.start).getTime();
            return aTime - bTime;
        });
    }

    attachDayClickHandlers() {
        const dayCells = this.container.querySelectorAll('.day-cell:not(.other-month)');
        dayCells.forEach(cell => {
            cell.addEventListener('click', () => {
                const dateStr = cell.dataset.date;
                if (typeof window.calendarApp !== "undefined") {
                    window.calendarApp.openEventCreate(dateStr);
                }
            });
            
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const dateStr = cell.dataset.date;
                const dayNum = parseInt(cell.dataset.day);
                if (typeof window.calendarApp !== "undefined") {
                    window.calendarApp.showMonthContextMenu(dateStr, dayNum);
                }
            });
        });
    }

    attachListeners() {
        if (!this.container) return;
        
        this.container.querySelectorAll('.nav-prev').forEach(btn => {
            btn.addEventListener("click", () => this.store.navigatePrev());
        });
        
        this.container.querySelectorAll('.nav-next').forEach(btn => {
            btn.addEventListener("click", () => this.store.navigateNext());
        });
        
        this.container.querySelectorAll('.today-button').forEach(btn => {
            btn.addEventListener("click", () => this.store.goToToday());
        });
        
        this.container.querySelectorAll('.view-button').forEach(btn => {
            btn.addEventListener("click", (e) => {
                this.store.setView(e.target.dataset.view);
                this.container.querySelectorAll('.view-button').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
        
        const addBtn = this.container.querySelector('.add-event-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openEventModal(null));
        }
    }
    
    openEventModal(eventOrNull, dateStr, hour) {
        if (typeof window.calendarApp !== "undefined") {
            window.calendarApp.openEventModal(eventOrNull, dateStr, hour);
        }
    }

    destroy() {
        this.container = null;
    }
}

export default MonthViewRenderer;
