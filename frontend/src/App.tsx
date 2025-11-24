import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Auth pages with new Malaysian green food design
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import ForgotPassword from './pages/customer/ForgotPassword';
import ResetPassword from './pages/customer/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

// Customer pages
import CustomerDashboard from './pages/customer/Dashboard';
import DemoDashboard from './pages/DemoDashboard';

// Staff pages
import StaffDashboard from './pages/staff/Dashboard';
import StaffTransactions from './pages/staff/Transactions';
import { MenuManagement } from './pages/staff/MenuManagement';

// Owner pages
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerCustomers from './pages/owner/Customers';
import OwnerTransactions from './pages/owner/Transactions';
import OwnerStaff from './pages/owner/Staff';
import OwnerBranches from './pages/owner/Branches';
import OwnerSettings from './pages/owner/Settings';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';

// Other pages
import HomePage from './pages/HomePage';

// Legal pages
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import FAQ from './pages/legal/FAQ';
import AboutUs from './pages/legal/AboutUs';
import Contact from './pages/legal/Contact';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/join/:restaurantSlug/:referralCode" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
          
          {/* Legal pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Customer Dashboard (protected) */}
          <Route 
            path="/customer/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Staff Portal (protected) */}
          <Route 
            path="/staff/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StaffDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff/transactions" 
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StaffTransactions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff/menu" 
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <MenuManagement />
              </ProtectedRoute>
            } 
          />
          
          {/* Owner Portal (protected) */}
          <Route 
            path="/owner/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/owner/customers" 
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerCustomers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/owner/transactions" 
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerTransactions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/owner/staff" 
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerStaff />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/owner/branches" 
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerBranches />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/owner/settings" 
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerSettings />
              </ProtectedRoute>
            } 
          />

          {/* Admin Portal (protected) */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } 
          />
          
          {/* Demo Dashboard (public) */}
          <Route path="/demo" element={<DemoDashboard />} />
          
          {/* Backward compatibility - redirect old /dashboard to customer dashboard */}
          <Route path="/dashboard" element={<Navigate to="/customer/dashboard" replace />} />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
