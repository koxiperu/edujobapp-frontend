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
import EditUserPage from './pages/EditUserPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import CompanyDetailsPage from './pages/CompanyDetailsPage';
import EditCompanyPage from './pages/EditCompanyPage';

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
            <Route path="/companies/:id" element={<CompanyDetailsPage />} />
            <Route path="/companies/:id/edit" element={<EditCompanyPage />} />

            {/* Documents */}
            <Route path="/documents" element={<DocumentsPage />} />
            
            {/* Profile */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/users-management" element={<UsersManagementPage />} />
            <Route path="/users-management/edit/:id" element={<EditUserPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<div className="text-center py-20">404 - Page Not Found</div>} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
