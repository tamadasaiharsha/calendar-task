import { Component } from '@angular/core';
import { CalendarComponent } from './components/calendar/calendar.component';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CalendarComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'calendar-app';
}
