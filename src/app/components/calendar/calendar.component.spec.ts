import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should generate days for the selected month', () => {
    component.generateCalendar();
    expect(component.daysInMonth.length).toBeGreaterThan(0);
  });

  it('should select a date when clicked', () => {
    const testDate = new Date();
    component.selectDate(testDate);
    expect(component.selectedDate).toEqual(testDate);
    expect(component.showSidebar).toBeTrue();
  });

  it('should open create event dialog', () => {
    component.openCreateDialog();
    expect(component.showEventDialog).toBeTrue();
    expect(component.editingEvent).toBeNull();
    expect(component.dialogTitle).toBe('');
  });

    it('should close the sidebar', () => {
    component.showSidebar = true;
    component.selectedDate = new Date();

    component.closeSidebar();

    expect(component.showSidebar).toBeFalse();
    expect(component.selectedDate).toBeNull();
  });

  it('should open edit dialog and populate event details', () => {
    const event = {
      id: 10,
      date: new Date(),
      title: 'Test Event',
      description: 'Details',
      categoryId: 'work',
      startTime: '09:00',
      endTime: '10:00'
    };

    component.openEditDialog(event);

    expect(component.showEventDialog).toBeTrue();
    expect(component.dialogTitle).toBe('Test Event');
    expect(component.dialogDescription).toBe('Details');
    expect(component.dialogCategoryId).toBe('work');
  });

  it('should add a new category', () => {
    component.newCategoryName = 'Health';
    component.newCategoryColor = '#FF00FF';

    component.addCategory();

    const added = component.categories.find(c => c.name === 'Health');
    expect(added).toBeTruthy();
  });

  it('should filter events based on search term', () => {
    component.selectedDate = new Date();
    
    component.events = [
      { id: 1, date: new Date(), title: 'qwert', description: 'qwert', categoryId: 'personal' },
      { id: 2, date: new Date(), title: 'asdfg', description: 'ascvn', categoryId: 'work' }
    ];

    component.eventSearchTerm = 'asd';

    const results = component.filteredEvents;
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('asdfg');
  });

});
