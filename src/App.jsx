import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

// Application Pages
import ApplicationsPage from './pages/applications/ApplicationsPage';
import CreateApplicationPage from './pages/applications/CreateApplicationPage';
import ApplicationDetailsPage from './pages/applications/ApplicationDetailsPage';
import EditApplicationPage from './pages/applications/EditApplicationPage';

// Company Pages
import CompaniesPage from './pages/companies/CompaniesPage';
import CompanyDetailsPage from './pages/companies/CompanyDetailsPage';
import EditCompanyPage from './pages/companies/EditCompanyPage';

// Document Pages
import DocumentsPage from './pages/documents/DocumentsPage';
import DocumentDetailsPage from './pages/documents/DocumentDetailsPage';
import EditDocumentPage from './pages/documents/EditDocumentPage';

// User Pages
import UsersManagementPage from './pages/users/UsersManagementPage';
import EditUserPage from './pages/users/EditUserPage';
import ProfilePage from './pages/users/ProfilePage';
import EditProfilePage from './pages/users/EditProfilePage';

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
            <Route path="/applications/:id" element={<ApplicationDetailsPage />} />
            <Route path="/applications/:id/edit" element={<EditApplicationPage />} />

            {/* Companies */}
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/companies/:id" element={<CompanyDetailsPage />} />
            <Route path="/companies/:id/edit" element={<EditCompanyPage />} />

            {/* Documents */}
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/documents/:id" element={<DocumentDetailsPage />} />
            <Route path="/documents/:id/edit" element={<EditDocumentPage />} />
            
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
