# 📅 Angular Standalone Calendar Application

A fully functional **calendar scheduling application** built using
**Angular 17 standalone components**.\
This project demonstrates event management, category-based filtering,
clean UI structure, and modern Angular architecture without NgModules.

## ✨ Overview

This application allows users to:

-   Create, edit, and delete calendar events\
-   Categorize events using color-coded categories\
-   Filter events by category or date\
-   View events on a monthly calendar interface

It is designed as part of an Angular hands-on assignment, following best
practices for scalable architecture and maintainable code.

## 🚀 Features

### 🗓 Calendar & Event Management

-   Monthly calendar grid\
-   Add events with title, date, category, and description\
-   Edit or remove existing events\
-   View events for any selected day

### 🎨 Category System

-   Predefined event categories (e.g., Work, Personal, Meeting)\
-   Each category includes a custom color\
-   Category-based visual cues throughout the UI

### 🔍 Filters & Search

-   Search events by title\
-   Filter events by category\
-   Custom date filtering using a standalone pipe

### 🧱 Modern Angular Architecture

-   100% **standalone components**\
-   Strong TypeScript interfaces for Event & Category\
-   Modular, reusable components\
-   SCSS for styling\
-   Lightweight, clean code structure

### 🧪 Unit Testing

Includes basic unit tests for: - Component creation\
- Event addition\
- Category filtering\
- Function invocation tests

## 🛠️ Technologies Used

  Technology            Purpose
  --------------------- ------------------------------------------
  **Angular 17**        Core framework (Standalone Architecture)
  **TypeScript**        Type safety and interfaces
  **SCSS**              Component-level styling
  **UUID**              Unique event IDs
  **Jasmine + Karma**   Unit testing

## 📂 Project Structure

    src/
     ├── app/
     │    ├── calendar/
     │    │      ├── calendar.component.ts
     │    │      ├── calendar.component.html
     │    │      ├── calendar.component.scss
     │    │      ├── filter-by-date.pipe.ts
     │    │      ├── category.model.ts
     │    │      └── event.model.ts
     │    ├── app.component.ts
     │    └── main.ts
     └── assets/

## ▶️ Getting Started

### **1. Install Dependencies**

``` bash
npm install
```

### **2. Start the Development Server**

``` bash
ng serve
```

### **3. Open in Browser**

    http://localhost:4200/

## 📌 Purpose of This Project

This project was built as part of a practical assignment to demonstrate:

-   Ability to build Angular applications using standalone components\
-   Clean UI/UX with reusable components\
-   Working knowledge of pipes, filtering, event-state management\
-   Writing basic unit tests in Angular\
-   Understanding of calendar logic and date handling

## 🤝 Contributing

Contributions are welcome.\
If you'd like to improve UI, logic, or add features, feel free to fork
the repo and create a pull request.

## 📄 License

This project is provided for educational and demonstration purposes.
