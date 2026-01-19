import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ApplicationsPage from './pages/ApplicationsPage';
import CreateApplicationPage from './pages/CreateApplicationPage';
import CompaniesPage from './pages/CompaniesPage';
import DocumentsPage from './pages/DocumentsPage';
import UsersManagementPage from './pages/UsersManagementPage';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Applications */}
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/applications/new" element={<CreateApplicationPage />} />

            {/* Companies */}
            <Route path="/companies" element={<CompaniesPage />} />

            {/* Documents */}
            <Route path="/documents" element={<DocumentsPage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/users-management" element={<UsersManagementPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<div className="text-center py-20">404 - Page Not Found</div>} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
