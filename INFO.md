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
    *   `jobsAPI`: `getAll`.
    *   `authAPI`: `login`, `register`, `getMe`.
    *   `applicationsAPI`: `getAll`, `create`, `update`, `delete`.
    *   `companiesAPI`: `getAll`, `create`, `update`, `delete`.
    *   `documentsAPI`: `getAll`, `upload`, `download`.
    *   `usersAPI`: `getAll`, `update`, `delete`.
    *   `dashboardAPI`: `getStats`.
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
*   **Routing**: Verified and configured `App.jsx` with Public and Protected routes using `Layout` and `AuthProvider`.
*   **Verification & Bug Fixes**:
    *   **Fixed Missing Endpoint**: Added `api.jobs.getAll` to `src/services/api.js`.
    *   **Fixed JobCard**: Hardened `JobCard.jsx` to gracefully handle missing `date_posted`/`description` and added `remote`/`job_types` badges.
    *   **Header Refactor**: Implemented responsive Sidebar menu with Admin/User views.
    *   **Final Verification**: Confirmed effective end-to-end data fetching with backend.

## 9. TODO
*   Implement manage companies.
*   Change password for user.
* Color in red deadlines and notification on dashboard.

## 10. API to fix
The following endpoints are defined in the backend API but are currently unused/unimplemented in the frontend service (`src/services/api.js`):

*   **Users**
    *   `PUT /api/users/me` (Update current user profile)
    *   `GET /api/users/{id}` (Get specific user - Admin)
    *   `PUT /api/users/{id}` (Update specific user - Admin)

*   **Applications**
    *   `GET /api/applications/{id}` (Get single application details)
    *   `PUT /api/applications/{id}` (Update application)
    *   `DELETE /api/applications/{id}` (Delete application)

*   **Companies**
    *   `GET /api/companies/{id}` (Get single company details)
    *   `PUT /api/companies/{id}` (Update company)
    *   `DELETE /api/companies/{id}` (Delete company)
    *   `GET /api/companies/{id}/applications` (Get applications for a company)

*   **Documents**
    *   `GET /api/documents/{id}` (Get document metadata)
    *   `PUT /api/documents/{id}` (Update document metadata)
    *   `DELETE /api/documents/{id}` (Delete document)
    *   `GET /api/documents/{id}/applications` (Get applications linked to a document)


# API structure of backend service
**/api/auth** 
   * /register: POST - Register a new user. 
   * /login: POST - Authenticate and receive a token (JWT).

**/api/public - for unauthenticated users**
   * /jobs
        GET - Get job advertisements from an external third-party API.

**/api/users**
   * /me
        GET - Get the current user's profile.
        PUT -  Update the current user's profile.
   * /
        GET - (ADMIN) Get a list of all users.
   * /{id}
        GET - (ADMIN) Get a specific user by ID.
        PUT - (ADMIN) Update a user's information.
        DELETE - (ADMIN) Delete a user.

**/api/applications - for the logged-in user**
   * /
        GET - Get all applications .
        POST - Create a new application.
   * /{id}
        GET - Get a single application by ID.
        PUT - Update an application.
        DELETE - Delete an application.

**/api/companies - for the logged-in user**
   * /
        GET - Get all companies for the logged-in user.
        POST - Create a new company.
   * /{id}
        GET - Get a single company by ID.
        PUT - Update a company.
        DELETE - Delete a company.
   * /{id}/applications
        GET - Get all applications for a specific company.

**/api/documents - for the logged-in user**
   * /
        GET - Get all documents for the logged-in user.
   * /upload
        POST - Upload a new document.
   * /{id}
        GET - Get metadata for a single document.
        PUT - Update a document's metadata.
        DELETE - Delete a document.
   * /{id}/download
        GET -  Download a document.
   * /{id}/applications
        GET - Get all applications using a specific document.

**/api/dashboard - of logged-in user**
   GET - Get dashboard statistics and data for the logged-in user.
   Response includes:
   1.  Total count of documents and list of document file names.
   2.  Total count of companies and list of company names.
   3.  Total count of applications and list of all applications (full details) for frontend filtering.
   4.  Applications breakdown by status and type.
   Frontend will use this data to display critical applications (deadline < 1 week).