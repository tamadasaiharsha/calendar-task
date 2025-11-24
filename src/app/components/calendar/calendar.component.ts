import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterByDatePipe } from '../filter-by-date.pipe';

interface EventCategory {
  id: string;
  name: string;
  color: string;
}

interface CalendarEvent {
  id: number;
  date: Date;
  title: string;
  description: string;
  categoryId: string;
  startTime?: string;
  endTime?: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterByDatePipe],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  // Core calendar state
  currentDate: Date = new Date();
  daysInMonth: Date[] = [];
  weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  selectedDate: Date | null = null;
  events: CalendarEvent[] = [];

  // UI flags
  showSidebar = false;
  showEventDialog = false;
  showCategoryDialog = false;

  // Event dialog form data
  editingEvent: CalendarEvent | null = null;
  dialogTitle = '';
  dialogDescription = '';
  dialogCategoryId = 'personal';
  dialogStartTime = '';
  dialogEndTime = '';

  // Category inputs
  newCategoryName = '';
  newCategoryColor = '#000000';

  // Default categories
  categories: EventCategory[] = [
    { id: 'personal', name: 'Personal', color: '#4CAF50' },
    { id: 'work', name: 'Work', color: '#2196F3' },
    { id: 'urgent', name: 'Urgent', color: '#F44336' }
  ];

  // Common UI helpers
  isLoading = false;
  showConfirmDialog = false;
  confirmAction: (() => void) | null = null;
  confirmMessage = '';
  errorMessage: string | null = null;

  eventSearchTerm = '';

  ngOnInit() {
    this.generateCalendar();

    // Sample event for testing
    this.events.push({
      id: 1,
      date: new Date(new Date().setHours(23, 30, 0, 0)),
      title: 'Testing event',
      description: 'This event starts soon.',
      categoryId: 'work',
      startTime: '23:30',
      endTime: '00:30'
    });
  }

  // Builds the 6-week calendar grid
  generateCalendar() {
    this.daysInMonth = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startOffset = firstDay.getDay();

    // Previous month's trailing days
    for (let i = startOffset; i > 0; i--) {
      this.daysInMonth.push(new Date(year, month, 1 - i));
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      this.daysInMonth.push(new Date(year, month, i));
    }

    // Next month's leading days
    const total = this.daysInMonth.length;
    const remaining = 42 - total;

    for (let i = 1; i <= remaining; i++) {
      this.daysInMonth.push(new Date(year, month + 1, i));
    }
  }

  private handleError(message: string) {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = null, 5000);
    this.isLoading = false;
  }

  // Simple month navigation handler
  private updateDate(offset: number) {
    const newDate = new Date(this.currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    this.currentDate = newDate;
    this.generateCalendar();
    this.closeSidebar();
  }

  nextMonth() { this.updateDate(1); }
  prevMonth() { this.updateDate(-1); }

  goToToday() {
    this.currentDate = new Date();
    this.generateCalendar();
    this.closeSidebar();
  }

  isCurrentMonth(date: Date) {
    return (
      date.getMonth() === this.currentDate.getMonth() &&
      date.getFullYear() === this.currentDate.getFullYear()
    );
  }

  isToday(date: Date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  isSelected(date: Date) {
    return this.selectedDate?.toDateString() === date.toDateString();
  }

  getCategoryColor(categoryId: string) {
    return this.categories.find(c => c.id === categoryId)?.color || '#ccc';
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    this.showSidebar = true;
  }

  closeSidebar() {
    this.showSidebar = false;
    this.selectedDate = null;
  }

  get selectedDateEvents() {
    return this.events.filter(e => e.date.toDateString() === this.selectedDate?.toDateString());
  }

  getEventTime(event: CalendarEvent) {
    if (event.startTime && event.endTime) return `${event.startTime} - ${event.endTime}`;
    if (event.startTime) return `Starts at ${event.startTime}`;
    return '';
  }

  // countdown
  getTimeRemaining(event: CalendarEvent) {
    if (!event.startTime) return null;

    const eventTime = new Date(event.date);
    const [h, m] = event.startTime.split(':').map(Number);
    eventTime.setHours(h, m, 0, 0);

    const now = new Date();
    const diff = eventTime.getTime() - now.getTime();

    if (diff < 0) return 'Event in progress or passed';

    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    if (days > 0) return `Starts in ${days}d ${hrs % 24}h`;
    if (hrs > 0) return `Starts in ${hrs}h ${mins % 60}m`;
    if (mins > 0) return `Starts in ${mins}m`;

    return 'Starts soon!';
  }

  openCreateDialog() {
    this.editingEvent = null;
    this.dialogTitle = '';
    this.dialogDescription = '';
    this.dialogCategoryId = 'personal';
    this.dialogStartTime = '09:00';
    this.dialogEndTime = '10:00';
    this.showEventDialog = true;
  }

  openEditDialog(event: CalendarEvent) {
    this.editingEvent = event;
    this.dialogTitle = event.title;
    this.dialogDescription = event.description;
    this.dialogCategoryId = event.categoryId;
    this.dialogStartTime = event.startTime || '';
    this.dialogEndTime = event.endTime || '';
    this.showEventDialog = true;
  }

  closeEventDialog() {
    this.showEventDialog = false;
    this.editingEvent = null;
    this.isLoading = false;
    this.errorMessage = null;
    this.eventSearchTerm = '';
  }

  // Create or update event
  saveEvent() {
    if (!this.dialogTitle.trim() || !this.selectedDate) {
      this.handleError("Title and selected date cannot be empty.");
      return;
    }

    if (this.dialogStartTime && this.dialogEndTime && this.dialogStartTime >= this.dialogEndTime) {
      this.handleError("End time must be after start time.");
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      const data = {
        title: this.dialogTitle.trim(),
        description: this.dialogDescription.trim(),
        categoryId: this.dialogCategoryId,
        ...(this.dialogStartTime && { startTime: this.dialogStartTime }),
        ...(this.dialogEndTime && { endTime: this.dialogEndTime }),
      };

      if (this.editingEvent) {
        const i = this.events.findIndex(e => e.id === this.editingEvent!.id);
        if (i > -1) this.events[i] = { ...this.events[i], ...data };
      } else {
        this.events.push({
          id: Date.now(),
          date: new Date(this.selectedDate!),
          ...data
        });
      }

      this.isLoading = false;
      this.closeEventDialog();
    }, 500);
  }

  confirmDeleteEvent(id: number) {
    this.confirmMessage = 'Are you sure you want to delete this event?';
    this.confirmAction = () => this.deleteEvent(id);
    this.showConfirmDialog = true;
  }

  deleteEvent(id: number) {
    this.events = this.events.filter(e => e.id !== id);
    if (this.editingEvent?.id === id) this.closeEventDialog();
    this.closeConfirmDialog();
  }

  openCategoryManager() {
    this.newCategoryName = '';
    this.newCategoryColor = '#000000';
    this.showCategoryDialog = true;
  }

  closeCategoryDialog() {
    this.showCategoryDialog = false;
    this.errorMessage = null;
    this.eventSearchTerm = '';
  }

  // Simple category add
  addCategory() {
    if (!this.newCategoryName.trim()) {
      this.handleError("Category name cannot be empty.");
      return;
    }

    if (this.categories.some(c => c.name.toLowerCase() === this.newCategoryName.trim().toLowerCase())) {
      this.handleError("Category name already exists.");
      return;
    }

    const id = this.newCategoryName.toLowerCase().replace(/\s/g, '-');

    this.categories.push({
      id,
      name: this.newCategoryName.trim(),
      color: this.newCategoryColor
    });

    this.newCategoryName = '';
    this.newCategoryColor = '#000000';
  }

  confirmDeleteCategory(id: string) {
    if (this.events.some(e => e.categoryId === id)) {
      this.handleError('Cannot delete category: It is being used.');
      return;
    }

    if (this.categories.length <= 1) {
      this.handleError('Cannot delete the last category.');
      return;
    }

    this.confirmMessage = 'Are you sure you want to delete this category?';
    this.confirmAction = () => this.deleteCategoryConfirmed(id);
    this.showConfirmDialog = true;
  }

  deleteCategoryConfirmed(id: string) {
    this.categories = this.categories.filter(c => c.id !== id);
    this.closeConfirmDialog();
  }

  executeConfirmAction() {
    if (this.confirmAction) this.confirmAction();
  }

  closeConfirmDialog() {
    this.showConfirmDialog = false;
    this.confirmAction = null;
    this.confirmMessage = '';
  }

  // Search within selected date's events
  get filteredEvents() {
    if (!this.eventSearchTerm) return this.selectedDateEvents;
    const q = this.eventSearchTerm.toLowerCase();
    return this.selectedDateEvents.filter(
      e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
    );
  }
}
