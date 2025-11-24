import { Pipe, PipeTransform } from '@angular/core';

interface CalendarEvent {
    id: number;
    date: Date;
    title: string;
    description: string;
    categoryId: string;
}

@Pipe({
  name: 'filterByDate',
  standalone: true
})
export class FilterByDatePipe implements PipeTransform {
  transform(events: CalendarEvent[], date: Date): CalendarEvent[] {
    if (!events || !date) {
      return [];
    }
    return events.filter(event => event.date.toDateString() === date.toDateString());
  }
}
