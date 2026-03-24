/**
 * Main Calendar Application - Coordinates all views
 */

import { store } from './state.js';
import utils from './utils.js';
import DayViewRenderer from './views.js';
import MonthViewRenderer from './MonthViewRenderer.js';
import WeekViewRenderer from './WeekViewRenderer.js';

// Make calendarApp available globally before creating instance
window.calendarApp = null;

class CalendarApp {
    constructor(container) {
        this.container = document.getElementById('container') || container;
        this.currentView = 'month';
        this.viewRenderers = {};
        
        this.init();
    }
    
    init() {
        if (!this.container) {
            console.error('Calendar container not found');
            return;
        }
        
        this.renderContainer();
        this.setupEventListeners();
        this.subscribeToStore();
        this.startMonthContextMenu();
        this.renderCurrentView();
    }
    
    renderContainer() {
        this.container.innerHTML = `
            <div class="calendar-app">
                <div class="calendar-main"></div>
                <div id="event-context-menu" class="context-menu" style="display: none;">
                    <div class="context-menu-item" data-action="create-day">All day event</div>
                    <div class="context-menu-item" data-action="create-hour">Event at 9 AM</div>
                    <div class="context-menu-item" data-action="create-noon">Event at noon</div>
                    <div class="context-menu-item" data-action="create-evening">Event at 6 PM</div>
                </div>
            </div>
        `;
        
        const mainContainer = this.container.querySelector('.calendar-main');
        if (mainContainer) {
            this.mainContainer = mainContainer;
        } else {
            this.mainContainer = this.container;
        }
    }
    
    setupEventListeners() {
        this.monthClickHandler = () => this.changeView('month');
        this.weekClickHandler = () => this.changeView('week');
        this.dayClickHandler = () => this.changeView('day');
        
        this.container.addEventListener('click', (e) => this.handleGlobalClick(e));
        this.container.addEventListener('contextmenu', (e) => this.handleContextClick(e));
        this.container.addEventListener('keydown', (e) => this.handleKeydown(e));
    }
    
    subscribeToStore() {
        this.storeUnsubscribe = store.subscribe(() => this.onStoreChange());
        
        store.onViewChanged(() => {
            if (typeof window.calendarApp === "undefined") return;
            window.calendarApp.changeView(store.getState().view);
        });
        
        store.on('currentDateChanged', () => {
            if (typeof window.calendarApp === "undefined") return;
            const state = store.getState();
            if (state && state.currentDate) {
                window.calendarApp.renderCurrentView(state.currentDate);
            }
        });
    }
    
    changeView(viewName) {
        const validViews = ['month', 'week', 'day'];
        if (!validViews.includes(viewName)) {
            return;
        }
        
        const currentDate = store.get('currentDate');
        store.set('view', viewName);
        this.changeActiveView(viewName, currentDate);
    }
    
    changeActiveView(viewName, date) {
        this.mainContainer.innerHTML = '';
        
        switch (viewName) {
            case 'month':
                this.mainContainer.innerHTML = `
                    <div class="calendar-app">
                        <div class="calendar-main"></div>
                        <div id="event-context-menu" class="context-menu" style="display: none;">
                            <div class="context-menu-item" data-action="create-day">All day event</div>
                            <div class="context-menu-item" data-action="create-hour">Event at 9 AM</div>
                            <div class="context-menu-item" data-action="create-noon">Event at noon</div>
                            <div class="context-menu-item" data-action="create-evening">Event at 6 PM</div>
                        </div>
                    </div>
                `;
                const newMain = this.mainContainer.querySelector('.calendar-main');
                const monthRenderer = new MonthViewRenderer(store);
                monthRenderer.render(newMain, date);
                this.currentRenderer = monthRenderer;
                break;
            
            case 'week':
                this.mainContainer.innerHTML = `
                    <div class="calendar-app">
                        <div class="calendar-main"></div>
                    </div>
                `;
                const weekMain = this.mainContainer.querySelector('.calendar-main');
                const weekRenderer = new WeekViewRenderer(store);
                weekRenderer.render(weekMain, date);
                this.currentRenderer = weekRenderer;
                break;
            
            case 'day':
                this.mainContainer.innerHTML = `
                    <div class="calendar-app">
                        <div class="calendar-main"></div>
                    </div>
                `;
                const dayMain = this.mainContainer.querySelector('.calendar-main');
                const dayRenderer = new DayViewRenderer(store);
                dayRenderer.render(dayMain, date);
                this.currentRenderer = dayRenderer;
                break;
        }
    }
    
    onStoreChange() {
        const state = store.getState();
        if (state.currentDate) {
            this.changeActiveView(state.view, state.currentDate);
        }
    }
    
    renderCurrentView(date) {
        const currentDate = date || store.get('currentDate');
        const view = store.get('view');
        
        if (date) {
            this.changeView(view);
        } else {
            this.changeActiveView(view, currentDate);
        }
    }
    
    handleGlobalClick(e) {
        if (e.target.closest('#event-context-menu')) {
            const action = e.target.dataset.action;
            if (action) {
                this.handleContextMenuAction(action);
                this.hideContextMenu();
            }
        }
    }
    
    handleContextClick(e) {
        if (this.contextMenuActive) {
            e.preventDefault();
            this.hideContextMenu();
            return;
        }
    }
    
    startMonthContextMenu() {
        const clickPromise = new Promise(resolve => {
            const mouseMoveHandler = (pos) => { this.lastMousePos = pos; };
            const upHandler = () => {
                this.lastMouseMovePosition = this.lastMousePos;
                this.addMouseUpListener();
                setTimeout(() => { resolve(this.lastMouseMovePosition); }, 20000);
            };
            this.container.addEventListener('mousemove', mouseMoveHandler);
            document.body.addEventListener('mouseup', upHandler, true);
            this.removeMouseUpListener = () => document.body.removeEventListener('mouseup', upHandler, true);
        });
        
        setTimeout(() => {
            this.container.removeEventListener('mouseleave', this.closeMouseEventHandler);
            this.removeMouseUpListener();
        }, 40000);
    }
    
    closeMouseEventHandler() {
        this.removeMouseUpListener();
    }
    
    addMouseUpListener() {
        document.body.addEventListener('mouseup', this.closeMouseEventHandler, true);
    }
    
    showMonthContextMenu(dateStr, dayNum) {
        this.showContextMenu(dateStr, dayNum);
    }
    
    handleContextMenuAction(action) {
        if (this.lastClickedDate) {
            window.calendarApp.openEventCreate(this.lastClickedDate, null, action);
            this.lastClickedDate = null;
        }
    }
    
    hideContextMenu() {
        this.contextMenuElement.style.display = 'none';
        this.contextMenuActive = false;
        this.lastClickedDate = null;
    }
    
    showContextMenu(dateStr, dayNum) {
        this.contextMenuElement = document.getElementById('event-context-menu');
        const rect = this.contentRect();
        this.contextualDate = dateStr;
        const dayElement = this.getDayElement(dayNum);
        const menuWidth = 145;
        const menuHeight = 115;
        let left = rect.left + dayElement.offsetWidth - menuWidth;
        let top = rect.top + dayElement.offsetTop + dayElement.offsetHeight;
        
        if (this.shouldFlipHorizontal(rect, left, menuWidth)) {
            left = rect.left + dayElement.offsetLeft;
        }
        if (this.shouldFlipVertical(rect, top, menuHeight)) {
            top = rect.top + dayElement.offsetTop;
        }
        
        this.contextMenuElement.style.cssText = ``;
        this.contextMenuElement.style.display = 'block';
        this.contextMenuElement.style.zIndex = '10000';
        this.contextMenuElement.style.position = 'absolute';
        this.contextMenuElement.style.top = top + 'px';
        this.contextMenuElement.style.left = left + 'px';
        this.contextMenuElement.style.width = `${menuWidth}px`;
        this.contextMenuElement.style.height = `${menuHeight}px`;
        
        this.contextMenuActive = true;
        this.lastClickedDate = dateStr;
        document.addEventListener('click', () => this.hideContextMenu());
        
        this.menuClickHandlers = [{selector: 'create-day', handler: () => this.openEventCreate(dateStr)}, 
                                   {selector: 'create-hour', handler: () => this.openEventCreate(dateStr, 9)}, 
                                   {selector: 'create-noon', handler: () => this.openEventCreate(dateStr, 12)},  
                                   {selector: 'create-evening', handler: () => this.openEventCreate(dateStr, 18)}];
        this.contextMenuElement.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const handler = this.menuClickHandlers.find(h => h.selector === e.target.dataset.action);
                if (handler) { handler.handler(); }
            });
        });
    }
    
    contentRect() {
        return this.container.getBoundingClientRect();
    }
    
    getDayElement(dayNum) {
        return this.container.querySelector(`.day-number:contains('${dayNum}')`) || 
               Array.from(this.container.querySelectorAll('.day-number')).find(el => el.textContent.trim() === String(dayNum));
    }
    
    shouldFlipHorizontal(rect, left, width) {
        return rect.right - left <= width;
    }
    
    shouldFlipVertical(rect, top, height) {
        return rect.bottom - top <= height;
    }
    
    handleKeydown(e) {
        if (e.key === 'Escape' && this.contextMenuActive) {
            this.hideContextMenu();
        }
    }
    
    openEventModal(eventOrNull, dateStr, hour) {
        const modalTitle = eventOrNull ? 'Edit Event' : '+ Add New Event';
        this.currentEventData = eventOrNull;
        
        const [year, month, day] = dateStr.split('-').map(Number);
        const eventDate = new Date(year, month - 1, day);
        
        const existingEvent = eventOrNull;
        
        const html = `
            <div class="modal-backdrop" id="event-modal-backdrop">
                <div class="modal-window" id="event-modal">
                    <h4>${modalTitle}</h4>
                    <label>Title: <input type="text" id="modal-title" value="${existingEvent ? this.escapeHtml(existingEvent.title) : ''}" /></label><br/>
                    <label>Description: <textarea rows="3" id="modal-description">${existingEvent && existingEvent.description ? this.escapeHtml(existingEvent.description) : ''}</textarea></label><br/>
                    <label>Date: <input type="date" id="modal-date" value="${dateStr}" min="${this.formatDateForInput(utils.subDays(eventDate, 1000))}" max="${this.formatDateForInput(utils.addDays(eventDate, 1000))}" /></label><br/>
                    ${hour !== null ? `<label>Hour: <select id="modal-hour"><option value="0">Midnight</option>` + 
                        Array.from({length: 24}, (_, i) => `<option value="${i}" ${i === hour ? 'selected' : ''}>${this.formatHourDisplay(i)}</option>`).join('') + 
                        '</select></label>' : ''}
                    <button id="save-event-btn">Save</button>
                    ${!existingEvent ? `<button id="cancel-event-btn">Cancel</button>` : ''}
                    ${existingEvent ? `<button id="delete-event-btn" style="background-color: #fa5252; color: white;">Delete</button>` : ''}
                </div>
            </div>
        `;
        
        this.container.insertAdjacentHTML('beforeend', html);
        
        this.attachModalListeners(dateStr, eventDate, hour, existingEvent);
        this.showBackdrop();
    }
    
    escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text.toString() || "";
        return div.innerHTML;
    }
    
    formatHourDisplay(hour) {
        const ampm = hour >= 12 ? "PM" : "AM";
        const h = hour % 12 || 12;
        return `${h}${ampm}`;
    }
    
    attachModalListeners(dateStr, eventDate, hour, existingEvent) {
        const saveBtn = document.getElementById('save-event-btn');
        const cancelBtn = document.getElementById('cancel-event-btn');
        const deleteBtn = document.getElementById('delete-event-btn');
        const titleInput = document.getElementById('modal-title');
        const descriptionInput = document.getElementById('modal-description');
        const dateInput = document.getElementById('modal-date');
        const hourSelect = document.getElementById('modal-hour');
        
        function generateId() {
            return Math.random().toString(36).substr(2, 9);
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const titleValue = titleInput.value.trim();
                if (!titleValue) {
                    alert('Event must have a title!');
                    return;
                }
                
                const year = parseInt(dateInput.value.split('-')[0]);
                const month = parseInt(dateInput.value.split('-')[1]) - 1;
                const day = parseInt(dateInput.value.split('-')[2]);
                const newDateStr = dateInput.value;
                
                const selectedHour = hourSelect ? hourSelect.value : 0;
                let newDate = new Date(year, month, day);
                
                if (hour !== null) {
                    newDate.setHours(parseInt(selectedHour), 0, 0);
                }
                
                const eventData = {
                    id: existingEvent ? existingEvent.id : generateId(),
                    title: titleValue,
                    description: descriptionInput.value.trim(),
                    start: newDate.toISOString(),
                    durationMinutes: hour !== null ? 60 : undefined
                };
                
                if (existingEvent) {
                    store.updateEvent(eventData);
                    this.closeModal();
                    alert('Event updated successfully!');
                } else {
                    store.addEvent(eventData);
                    this.closeModal();
                    alert('Event created successfully!');
                }
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (existingEvent) {
                    if (confirm(`Are you sure you want to delete "${existingEvent.title}"?`)) {
                        store.deleteEvent(existingEvent.id);
                        this.closeModal();
                        alert('Event deleted successfully!');
                    }
                }
            });
        }
        
        if (descriptionInput) {
            descriptionInput.addEventListener('input', (e) => {
                const maxLength = 50;
                const inputVal = e.target.value;
                if (inputVal.length > maxLength) {
                    descriptionInput.value = inputVal.slice(0, maxLength);
                    e.stopPropagation();
                }
            });
        }
    }
    
    formatDateForInput(dateObj) {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    closeModal() {
        const backdrop = document.getElementById('event-modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    }
    
    showBackdrop() {
        const backdrop = document.getElementById('event-modal-backdrop');
        if (backdrop) {
            backdrop.click = () => this.closeModal();
        }
    }
    
    openEventCreate(dateStr, hour) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const eventDate = new Date(year, month - 1, day);
        this.openEventModal(null, dateStr, hour, eventDate);
    }
    
    showWeekNavButtons(currentDate) {
        const navContainer = document.querySelector('.week-navigation');
        if (navContainer) {
            const weekStart = utils.getStartOfWeek(currentDate);
            const nextWeek = utils.addDays(weekStart, 7);
            navContainer.style.display = 'flex';
            navContainer.innerHTML = `
                <span style="margin-right: auto;"><a href="#" onclick="window.calendarApp.preWeek(${new Date(nextWeek).getTime()});return false;">« Previous Week</a></span>
                <span><strong>${weekStart.toLocaleDateString()} - ${nextWeek.toLocaleDateString()}</strong></span>
                <span style="margin-left: auto;"><a href="#" onclick="window.calendarApp.nextWeek(${new Date(nextWeek).getTime()});return false;">Next Week »</a></span>
            `;
        } else {
            document.getElementById('app').insertAdjacentHTML('afterbegin', '<div class="week-navigation" style="display:flex;padding:10px;background:#f5f7fa;margin-bottom:10px;border-radius:8px;"></div>');
        }
    }
    
    nextWeek(nextTime) {
        store.setCurrentDate(new Date(nextTime + 7 * 24 * 60 * 60 * 1000));
    }
    
    preWeek(prevTime) {
        store.setCurrentDate(new Date(prevTime - 7 * 24 * 60 * 60 * 1000));
    }
}

window.CalendarApp = CalendarApp;

export default CalendarApp;
