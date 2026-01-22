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
│   ├── Header.jsx         # Main navigation bar with Auth logic
│   ├── Footer.jsx         # Reusable footer
│   ├── Layout.jsx         # Main page wrapper
│   └── ProtectedRoute.jsx # Wrapper for route protection (Role-based)
├── contexts/        # Global state contexts
│   └── AuthContext.jsx    # Manages authentication state (user, token)
├── hooks/           # Custom React hooks
│   └── useAuth.jsx        # Hook to consume AuthContext
├── pages/           # Main page views
│   ├── applications/      # Application management pages
│   │   ├── ApplicationsPage.jsx
│   │   ├── CreateApplicationPage.jsx
│   │   ├── ApplicationDetailsPage.jsx
│   │   └── EditApplicationPage.jsx
│   ├── companies/         # Company management pages
│   │   ├── CompaniesPage.jsx
│   │   ├── CompanyDetailsPage.jsx
│   │   └── EditCompanyPage.jsx
│   ├── documents/         # Document management pages
│   │   ├── DocumentsPage.jsx
│   │   ├── DocumentDetailsPage.jsx
│   │   └── EditDocumentPage.jsx
│   ├── users/             # User and Profile pages
│   │   ├── UsersManagementPage.jsx
│   │   ├── EditUserPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── EditProfilePage.jsx
│   ├── HomePage.jsx       # Landing page displaying public job ads
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── DashboardPage.jsx  # User dashboard with stats
└── services/        # External service integration
    └── api.js             # API wrapper methods for Auth, Jobs, Applications, etc.
```

## 4. Key Functionality

### Authentication & Authorization
*   **Mechanism:** JWT-based authentication.
*   **Storage:** Tokens and user info are stored in `sessionStorage` (`edujobapp_token`, `edujobapp_user`).
*   **Roles:**
    *   `USER`: Can manage own applications, companies, documents, and profile.
    *   `ADMIN`: Can manage users (CRUD) in addition to own data.
*   **Protection:** `ProtectedRoute` component guards routes like `/dashboard`, `/applications`, `/users-management`, ensuring access control.

### Application Management
*   **Public View:** The Home page fetches and displays public job advertisements (`/api/public/jobs`).
*   **User Actions:**
    *   **Dashboard:** View statistics, timeline, and urgent alerts.
    *   **Applications:** CRUD operations for Job Applications. Includes document attachment.
    *   **Companies:** Full CRUD for Companies (List, Create, View Details, Edit, Delete).
    *   **Documents:** Upload and manage Resumes/CVs.
    *   **Profile:** View and update personal information (User profile).
    *   **Admin:** Full user management (List, Edit, Delete).

## 5. API Integration
The application communicates with a backend REST API.
*   **Configuration:** Base URL is defined in environment variables (`VITE_API_URL` or proxy).
*   **Service (`src/services/api.js`):**
    *   `jobsAPI`: `getAll`.
    *   `authAPI`: `login`, `register`, `getMe`.
    *   `applicationsAPI`: `getAll`, `create`, `update`, `delete`.
    *   `companiesAPI`: `getAll`, `getById`, `getApplications`, `create`, `update`, `delete`.
    *   `documentsAPI`: `getAll`, `upload`, `download`.
    *   `usersAPI`: `getAll`, `getById`, `updateMe`, `update`, `delete`.
    *   `dashboardAPI`: `getStats`.
*   **Headers:** Automatically attaches `Authorization: Bearer <token>` for authenticated requests.

## 6. Scripts
*   `npm run dev`: Starts the Vite development server.
*   `npm run build`: Builds the application for production.
*   `npm run lint`: Runs ESLint.

## 7. Styles
*   Tailwind CSS 4 is configured and imported in `src/index.css`.
*   Responsive design principles are applied using Tailwind's utility classes.
*   Custom theme colors defined in `src/scheemas.css`.

## 8. Steps of development
*   **Project Initialization**: Set up React with Vite.
*   **Styling**: Configured Tailwind CSS 4.
*   **Structure**: Aligned folder structure with reference architecture.
*   **Assets**: Organized images into `src/assets/backgrounds`.
*   **UI Components**: Implemented Header (w/ Auth logic), Footer, and Layout.
*   **Core Logic**: Restored and implemented `api.js` service, `AuthContext`, and `useAuth` hook.
*   **Public Components**: Implemented Login, Register, Home pages and JobCard component.
*   **Protected Pages**: Implemented Dashboard Page with summary stats and navigation links.
*   **Applications Feature**: Implemented Applications List and Create Page with API integration. Added document attachment via collapsible list.
*   **Companies Feature**: Implemented Companies List, Details View, and Edit page. Fixed creation and update bugs by including `userId`.
*   **Documents Feature**: Implemented Documents List, Upload, and Download (Blob) with API integration.
*   **Routing**: Verified and configured `App.jsx` with Public and Protected routes using `Layout` and `AuthProvider`.
*   **User Management (Admin)**: Implemented Users list, Delete functionality, and Edit User page (`EditUserPage`) with redirect.
*   **Profile Management**: Implemented Profile view (`ProfilePage`) and Edit Profile form (`EditProfilePage`) for logged-in users.
*   **Dashboard Refinement**: Reorganized layout into 2 columns. Added alert-style notifications for submission deadlines and overdue responses. Integrated "View" shortcuts in summary cards.
*   **Directory Restructuring**: Refactored `src/pages` into feature-based subdirectories (`applications`, `companies`, `documents`, `users`) for better scalability.
*   **Auth UX Fixes**: Updated Logout to redirect to the landing page (`/`).

## 9. TODO
*   Add to the list of companies filter by country.
*   Change password for user.

## 10. Dashboard
The dashboard provides a visual overview of the user's activity and highlights urgent tasks. It follows a 2-column layout:

### Left Column (Main Stats)
*   **Layer 1: Timeline:** An Area Chart showing application creation trends over time (Jobs vs Education).
*   **Layer 2: 2x2 Stats Grid:**
    *   **Summary Box:** Totals for Applications, Documents, and Companies with quick "View" navigation buttons.
    *   **Application Types:** Pie chart (Education vs Jobs).
    *   **Success Rate:** Pie chart (Accepted, Rejected, Pending).
    *   **Country Distribution:** Symmetric Bar Chart (Butterfly chart) showing regional activity.

### Right Column (Urgent Alerts)
*   **Alert Cards:** Each urgent application appears as a card styled like an inline alert message.
    *   **Submission Soon:** Red/Error-style alerts for drafts with deadlines within 7 days. Includes an "Apply Now" button redirecting to the edit form.
    *   **Response Overdue:** Yellow/Warning-style alerts for submitted applications where the expected response date has passed.

### API Response Structure:
```json
nDashboardResponse{
     totalApplications    integer($int64)
     totalDocuments    integer($int64)
     totalCompanies    integer($int64)
     applicationsByStatus    { < * >:    integer($int64)}
     applicationsByType    { < * >:    integer($int64)}
     allApplications    [ApplicationResponse{
          id    [...]
          title    [...]
          description    [...]
          applicationType    [...]
          creationDate    [...]
          submitDate    [...]
          submitDeadline    [...]
          responseDeadline    [...]
          appStatus    [...]
          resultNotes    [...]
          userId    [...]
          company    CompanyResponse{
               name    [...]
               country    [...]
          }
     }]
  }
```

# Project Context: EduJobApp - Backend API structure

## API structure of backend service
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