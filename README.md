# Al-Ghazali Educational Platform

A comprehensive educational platform frontend built with React, Vite, and Tailwind CSS, designed to replicate the experience of professional e-learning systems.

## Features

### Student Portal
- **Authentication**: Register/Login with grade selection.
- **Dashboard**: Overview of progress, exams, and watch time.
- **Course Content**: Structured hierarchy (Grade -> Month -> Week -> Lesson).
- **Lesson Player**: Video playback, exam interface, and solution videos.
- **Exams**: Interactive MCQ exams with immediate scoring.

### Admin Portal
- **Dashboard**: Stats and charts for platform overview.
- **Course Management**: Add, edit, and delete courses.
- **Content Management**: Manage months, weeks, and lessons hierarchy.
- **User Management**: Manage students and subscription status.
- **Subscription System**: Generate and manage activation codes.

## Tech Stack
- **Framework**: React + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router DOM
- **State Management**: React Context + LocalStorage

## Setup & Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Default Credentials

### Admin Account
- **Phone**: `01000000000`
- **Password**: `admin`

### Student Account (Demo)
- **Phone**: `01234567890`
- **Password**: `123456`

## Project Structure
- `src/components`: Reusable UI and layout components.
- `src/pages`: Page components (Public, Student, Admin).
- `src/context`: Global state (Auth, Data).
- `src/data`: Dummy JSON data.
- `src/lib`: Utilities.
