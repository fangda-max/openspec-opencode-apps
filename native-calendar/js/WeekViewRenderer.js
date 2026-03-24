/**
 * Calendar Rendering - Week View
 */

import utils from './utils.js';

class WeekViewRenderer {
    constructor(store) {
        this.store = store;
        this.container = null;
    }

    render(container, date) {
        const currentDate = date || this.store.get('currentDate');
        this.container = container;
        
        const weekStart = utils.getStartOfWeek(currentDate);
        const weekEnd = utils.getEndOfWeek(currentDate);
        
        container.innerHTML = `
            <div class="calendar-header">
                <button class="nav-prev btn-secondary" title="Previous week">◀</button>
                <button class="today-button btn-secondary">Today</button>
                <button class="nav-next btn-secondary" title="Next week">▶</button>
                <div class="date-display">${utils.formatDisplayDate(weekStart)} - ${utils.formatDisplayDate(weekEnd)}</div>
                <div class="view-switcher">
                    <button class="view-button" data-view="month">Month</button>
                    <button class="view-button active" data-view="week">Week</button>
                    <button class="view-button" data-view="day">Day</button>
                </div>
                <button class="add-event-btn">+ Add Event</button>
            </div>
            <div class="week-view-container week-time-grid">
                <div class="week-side-bar"></div>
                <div class="week-days">
                    ${this.renderWeekDays(weekStart)}
                </div>
                <div class="week-cols"></div>
            </div>
        `;
        
        const sideBar = container.querySelector('.week-side-bar');
        const weekCols = container.querySelector('.week-cols');
        
        if (sideBar) this.renderTimeLabels(sideBar);
        if (weekCols) this.renderWeekColumns(weekCols, weekStart);
        
        this.attachListeners();
    }

    renderWeekDays(weekStart) {
        let html = '';
        for (let i = 0; i < 7; i++) {
            const currentDay = utils.addDays(weekStart, i);
            const isToday = utils.isSameDate(currentDay, utils.getToday());
            const dayName = currentDay.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNumber = currentDay.getDate();
            
            html += `<div class="week-day-column ${isToday ? 'today-highlight' : ''}" 
                        data-date="${utils.formatDate(currentDay)}">
                <span class="day-name">${dayName}</span>
                <span class="day-number">${dayNumber}</span>
            </div>`;
        }
        return html;
    }

    renderTimeLabels(container) {
        let html = '<div class="time-slots">';
        for (let hour = 0; hour < 24; hour++) {
            html += `<div class="time-slot" style="height:50px;">
                ${hour === 0 ? '' : `<div class="time-label">${this.formatHourDisplay(hour)}</div>`}
            </div>`;
        }
        html += '</div>';
        container.innerHTML = html;
    }

    renderWeekColumns(container, weekStart) {
        const events = this.store.get('events') || [];
        let html = '';
        
        for (let i = 0; i < 7; i++) {
            const currentDay = utils.addDays(weekStart, i);
            const dateStr = utils.formatDate(currentDay);
            
            html += `<div class="week-col day-col" data-date="${dateStr}">`;
            
            for (let hour = 0; hour < 24; hour++) {
                const dayEvents = events.filter(e => {
                    if (!e.start) return false;
                    const eventDate = new Date(e.start);
                    if (!utils.isSameDate(eventDate, currentDay)) return false;
                    const eventHour = eventDate.getHours();
                    return eventHour === hour;
                });
                
                if (dayEvents.length > 0) {
                    const event = dayEvents[0];
                    const topPos = (hour >= 12 ? hour + 24 : hour) * 25;
                    const height = event.durationMinutes || 60;
                    
                    html += `<div class="event-block" 
                                  style="top: ${topPos}px; height: ${height}px;"
                                  data-event-id="${event.id || ''}"
                                  title="${event.title}">
                        <strong>${this.escapeHtml(event.title)}</strong>
                        <br/>${this.formatTime(new Date(event.start))}
                    </div>`;
                } else {
                    html += `<div class="time-slot clickable-slot" data-hour="${hour}" data-date="${dateStr}"></div>`;
                }
            }
            
            html += '</div>';
        }
        
        container.innerHTML = html;
        this.attachColumnClickHandlers();
        
        const today = utils.getToday();
        container.querySelectorAll('.day-col').forEach(col => {
            if (utils.isSameDate(utils.parseDate(col.dataset.date), today)) {
                col.classList.add('today-highlight');
            }
        });
        
        container.querySelectorAll('[data-date]').forEach(col => {
            const colDate = utils.parseDate(col.dataset.date);
            if (utils.isSameDate(colDate, today)) {
                col.classList.add('today-highlight');
            }
        });

        setTimeout(() => this.addCurrentTimeIndicator(container, weekStart), 100);
    }

    addCurrentTimeIndicator(container, weekStart) {
        const now = new Date();
        const timeSlots = container.querySelectorAll(':scope > .week-cols > .day-col .clickable-slot[data-hour]');
        
        if (timeSlots.length > 0 && utils.isSameDate(now, weekStart)) {
            const hour = now.getHours();
            const minuteOffset = now.getMinutes() / 60;
            const topPosition = (hour + minuteOffset) * 50;
            
            timeSlots.forEach(slot => {
                const slotDate = utils.parseDate(slot.dataset.date);
                if (utils.isSameDate(slotDate, now)) {
                    const line = document.createElement("div");
                    line.className = "current-time-line";
                    line.style.top = topPosition + 'px';
                    line.style.width = '100%';
                    line.style.position = 'absolute';
                    line.style.left = '0';
                    line.setAttribute("aria-label", "Current time");
                    slot.appendChild(line);
                }
            });
        }
    }

    formatHourDisplay(hour) {
        const ampm = hour >= 12 ? "PM" : "AM";
        const h = hour % 12 || 12;
        return `${h}${ampm}`;
    }

    formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text.toString() || "";
        return div.innerHTML;
    }

    attachColumnClickHandlers() {
        const slots = this.container.querySelectorAll('.clickable-slot');
        slots.forEach(slot => {
            slot.addEventListener('click', () => {
                const dateStr = slot.dataset.date;
                const hour = parseInt(slot.dataset.hour);
                if (typeof window.calendarApp !== "undefined") {
                    window.calendarApp.openEventCreate(dateStr, hour);
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

export default WeekViewRenderer;
