# Project Context: EduJobApp - Frontend

This document describes the structure, technology stack, and functionality of the "EduJobApp" React application. It serves as context for further development or integration tasks.

## 1. Project Overview
**Name:** EduJobApp
**Purpose:** A job application tracking system connecting applicants with job opportunities and allowing them to manage their applications, documents, and companies.
**Type:** Single Page Application (SPA)

## 2. Tech Stack
*   **Framework:** React 19
*   **Build Tool:** Vite 7
*   **Language:** JavaScript (ES Modules)
*   **Styling:** Tailwind CSS 4
*   **Routing:** React Router DOM 7
*   **Icons:** React Icons (`react-icons`)
*   **HTTP Client:** Native `fetch` API (wrapped in a custom service)
*   **State Management:** React Context API (specifically for Authentication)

## 3. Folder Structure
The project follows a standard feature-based React architecture:

```
src/
├── assets/          # Static assets (images like logos)
├── components/      # Reusable UI components
│   ├── JobCard.jsx        # Displays individual job advertisement details
│   ├── NavBar.jsx         # Main navigation bar
│   └── ProtectedRoute.jsx # Wrapper for route protection (Role-based)
├── contexts/        # Global state contexts
│   └── AuthContext.jsx    # Manages authentication state (user, token)
├── hooks/           # Custom React hooks
│   └── useAuth.jsx        # Hook to consume AuthContext
├── pages/           # Main page views
│   ├── HomePage.jsx          # Landing page displaying public job ads
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx     # User dashboard with stats
│   ├── ApplicationsPage.jsx  # List and manage applications
│   ├── CompaniesPage.jsx     # Manage companies
│   └── DocumentsPage.jsx     # Manage documents
└── services/        # External service integration
    └── api.js             # API wrapper methods for Auth, Jobs, Applications, etc.
```

## 4. Key Functionality

### Authentication & Authorization
*   **Mechanism:** JWT-based authentication.
*   **Storage:** Tokens and user info are stored in `sessionStorage` (`edujobapp_token`, `edujobapp_user`).
*   **Roles:**
    *   `USER`: Can manage own applications, companies, documents.
    *   `ADMIN`: Can manage users.
*   **Protection:** `ProtectedRoute` component guards routes like `/dashboard`, `/applications`, ensuring only authenticated users can access them.

### Application Management
*   **Public View:** The Home page fetches and displays public job advertisements (`/api/public/jobs`).
*   **User Actions:**
    *   **Dashboard:** View statistics (Total Applications, etc.).
    *   **Applications:** CRUD operations for Job Applications.
    *   **Companies:** Manage list of Companies.
    *   **Documents:** Upload and manage Resumes/CVs.

## 5. API Integration
The application communicates with a backend REST API.
*   **Configuration:** Base URL is defined in environment variables (`VITE_API_URL` or proxy).
*   **Service (`src/services/api.js`):**
    *   `jobsAPI`: `getPublicJobs`.
    *   `authAPI`: `login`, `register`, `getMe`.
    *   `applicationsAPI`: `getAll`, `create`, `update`, `delete`.
    *   `companiesAPI`: `getAll`, `create`, `update`, `delete`.
    *   `documentsAPI`: `getAll`, `upload`, `download`.
*   **Headers:** Automatically attaches `Authorization: Bearer <token>` for authenticated requests.

## 6. Scripts
*   `npm run dev`: Starts the Vite development server.
*   `npm run build`: Builds the application for production.
*   `npm run lint`: Runs ESLint.

## 7. Styles
*   Tailwind CSS is configured and imported in `src/index.css`.
*   Responsive design principles are applied using Tailwind's utility classes.

## 8. Steps of development
*   **Project Initialization**: Set up React with Vite.
*   **Styling**: Configured Tailwind CSS 4.
*   **Structure**: Aligned folder structure with reference architecture.
*   **Assets**: Organized images into `src/assets/backgrounds`.
*   **UI Components**: Implemented Header (w/ Auth logic), Footer, and Layout.
*   **Core Logic**: Restored and implemented `api.js` service, `AuthContext`, and `useAuth` hook.
*   **Public Components**: Implemented Login, Register, Home pages and JobCard component.
*   **Protected Pages**: Implemented Dashboard Page with summary stats and navigation links.
*   **Applications Feature**: Implemented Applications List and Create Page with API integration.
*   **Companies Feature**: Implemented Companies List and Create form with API integration.
*   **Documents Feature**: Implemented Documents List, Upload, and Download (Blob) with API integration.