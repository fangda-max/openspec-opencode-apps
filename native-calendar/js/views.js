/**
 * Calendar Rendering - Day View
 */

import utils from './utils.js';

class DayViewRenderer {
    constructor(store) {
        this.store = store;
    }

    render(container, date) {
        const currentDate = date || this.store.get('currentDate');
        
        container.innerHTML = `
            <div class="calendar-header">
                <button class="nav-prev btn-secondary" title="Previous day">◀</button>
                <button class="today-button btn-secondary">Today</button>
                <button class="nav-next btn-secondary" title="Next day">▶</button>
                <div class="date-display">${currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
                <div class="view-switcher">
                    <button class="view-button" data-view="month">Month</button>
                    <button class="view-button" data-view="week">Week</button>
                    <button class="view-button active" data-view="day">Day</button>
                </div>
                <button class="add-event-btn">+ Add Event</button>
            </div>
            <div class="day-view-container week-time-grid">
                <div class="week-side-bar"></div>
                <div class="week-col day-col" data-date="${utils.formatDate(currentDate)}"></div>
            </div>
        `;
        
        const sideBar = container.querySelector('.week-side-bar');
        const dayCol = container.querySelector('.week-col.day-col');
        
        this.container = container;
        
        if (sideBar) this.renderTimeLabels(sideBar);
        if (dayCol) this.renderDaySlots(dayCol, currentDate);
        
        this.attachListeners();
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

    renderDaySlots(container, date) {
        const isToday = utils.isSameDate(date, utils.getToday());
        if (isToday) container.classList.add('today-highlight');
        
        const allEvents = this.store.get('events').filter(e => e.start && utils.isSameDate(new Date(e.start), date));

        container.querySelectorAll(".time-slot[data-hour]").forEach(slot => {
            const hour = parseInt(slot.dataset.hour);
            const slotStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 0);
            
            const eventsForSlot = allEvents.filter(e => {
                const start = new Date(e.start);
                return !e.end && 
                       utils.isSameDate(start, date) && 
                       start.getHours() === hour &&
                       (start.getMinutes() === 0 || start.getMinutes() === 30);
            });
            
            if (eventsForSlot.length > 0) {
                const event = eventsForSlot[0];
                
                const block = document.createElement("div");
                block.className = "event-block";
                const topPos = (hour % 12 >= 12 ? hour - 12 + 72 : hour + 24) * 25;
                const height = event.durationMinutes || 60;
                block.style.top = topPos + 'px';
                block.style.height = height + 'px';
                block.title = event.title;
                
                block.innerHTML = `<strong>${this.escapeHtml(event.title)}</strong><br/>${this.formatTime(slotStart)}<br/>${event.description ? event.description.substring(0, 50) : ""}`;
                
                block.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (typeof window.calendarApp !== "undefined") {
                        window.calendarApp.openEditModal(event);
                    }
                });
                
                container.appendChild(block);
            }
        });

    // Add current time indicator
    this.addCurrentTimeIndicator(container, date);

    // Attach click handler to slots for creating events
    container.querySelectorAll(".time-slot[data-hour]").forEach(slot => {
        slot.addEventListener("click", () => {
            const hour = parseInt(slot.dataset.hour);
            if (typeof window.calendarApp !== "undefined") {
                window.calendarApp.openEventCreate(container.dataset.date, hour);
            }
        });
    });
}

    formatHourDisplay(hour) {
        const ampm = hour >= 12 ? "PM" : "AM";
        const h = hour % 12 || 12;
        return `${h}${ampm}`;
    }

    addCurrentTimeIndicator(container, todayDate) {
        const now = new Date();
        if (utils.isSameDate(now, todayDate)) {
            const hour = now.getHours();
            const minuteOffset = now.getMinutes() / 60;
            const topPosition = (hour + minuteOffset) * 50;
            
            const line = document.createElement("div");
            line.className = "current-time-line";
            line.style.top = topPosition + 'px';
            line.setAttribute("aria-label", "Current time");
            
            container.appendChild(line);
        }
    }

    formatTime(date) {
        return `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
    }

    escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text.toString() || "";
        return div.innerHTML;
    }

    attachListeners() {
        if (!this.container) return;
        
        const navButtons = this.container.querySelectorAll('.nav-prev');
        navButtons.forEach(btn => {
            btn.addEventListener("click", () => this.store.navigatePrev());
        });
        
        const nextButtons = this.container.querySelectorAll(".nav-next");
        nextButtons.forEach(btn => {
            btn.addEventListener("click", () => this.store.navigateNext());
        });
        
        const todayButtons = this.container.querySelectorAll(".today-button");
        todayButtons.forEach(btn => {
            btn.addEventListener("click", () => this.store.goToToday());
        });
        
        this.container.querySelectorAll(".view-button").forEach(btn => {
            btn.addEventListener("click", (e) => {
                this.store.setView(e.target.dataset.view);
                this.container.querySelectorAll(".view-button").forEach(b => b.classList.remove("active"));
                e.target.classList.add("active");
            });
        });
        
        const addBtn = this.container.querySelector(".add-event-btn");
        if (addBtn) {
            addBtn.addEventListener("click", () => this.openEventModal(null));
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

export default DayViewRenderer;
