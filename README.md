# EduJobApp - Frontend

This is the frontend repository for **EduJobApp**, a comprehensive job application tracking system designed to help users manage their job search, applications, and professional documents. It is built as a Single Page Application (SPA) using React.

## Important: Backend Requirement

This frontend application requires a running instance of the **EduJobApp Backend** (Java Spring Boot) to function correctly. The frontend communicates with the backend via a REST API.

Please refer to the `README.md` in the backend project repository for instructions on how to install, configure, and run the server. Ensure the backend is running (typically on `http://localhost:8080`) before starting the frontend.

## Getting Started

Follow these instructions to set up and run the frontend project on your local machine.

### Prerequisites

*   **Node.js**: Version 18.0.0 or higher.
*   **npm**: Included with Node.js (or `yarn`/`pnpm`).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd edujobapp-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Configuration

The application uses environment variables for configuration.

1.  Create a `.env` file in the root directory (or rename `.env.example` if available).
2.  Define the API base URL:
    ```env
    VITE_API_URL=http://localhost:8080/api
    ```
    *Note: Adjust the URL if your local backend is running on a different port.*

### Running the Application

To start the development server with hot-reloading:

```bash
npm run dev
```

The application will typically be available at `http://localhost:5173` (check the console output for the exact URL).

### Building for Production

To build the application for production deployment:

```bash
npm run build
```

The build artifacts will be generated in the `dist/` directory. You can preview the production build locally using:

```bash
npm run preview
```

## Tech Stack

*   **Framework:** React 19
*   **Build Tool:** Vite 7
*   **Language:** JavaScript (ES Modules)
*   **Styling:** Tailwind CSS 4
*   **Routing:** React Router DOM 7
*   **Icons:** React Icons
*   **HTTP Client:** Native Fetch API

## Project Structure

```
src/
├── assets/          # Static images and icons
├── components/      # Reusable UI components (Header, Footer, Layout, etc.)
├── contexts/        # React Contexts (AuthContext)
├── hooks/           # Custom Hooks (useAuth)
├── pages/           # Application Pages
│   ├── applications/# Application management
│   ├── companies/   # Company management
│   ├── documents/   # Document management
│   ├── users/       # User profiles & Admin management
│   └── ...          # General pages (Home, Login, Dashboard)
└── services/        # API integration services
```

## Contributing

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

[License Name] - see the LICENSE file for details.