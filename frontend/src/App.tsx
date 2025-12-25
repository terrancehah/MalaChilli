import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ToastProvider } from "./components/ui/toast";

// Auth pages with new Malaysian green food design
import Login from "./pages/customer/Login";
import Register from "./pages/customer/Register";
import JoinPage from "./pages/customer/JoinPage";
import ForgotPassword from "./pages/customer/ForgotPassword";
import ResetPassword from "./pages/customer/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";

// Customer pages
import CustomerDashboard from "./pages/customer/Dashboard";
import DemoDashboard from "./pages/DemoDashboard";

// Staff pages
import StaffDashboard from "./pages/staff/Dashboard";
import StaffTransactions from "./pages/staff/Transactions";
import { MenuManagement } from "./pages/staff/MenuManagement";

// Merchant pages
import MerchantDashboard from "./pages/merchant/Dashboard";
import MerchantCustomers from "./pages/merchant/Customers";
import MerchantTransactions from "./pages/merchant/Transactions";
import MerchantStaff from "./pages/merchant/Staff";
import MerchantBranches from "./pages/merchant/Branches";
import MerchantSettings from "./pages/merchant/Settings";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";

// Other pages
import HomePage from "./pages/HomePage";

// Legal pages
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import FAQ from "./pages/legal/FAQ";
import AboutUs from "./pages/legal/AboutUs";
import Contact from "./pages/legal/Contact";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Centralized toast notifications - Design System State Patterns */}
        <ToastProvider />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/join/:restaurantSlug/:referralCode"
            element={<JoinPage />}
          />
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
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Staff Portal (protected) */}
          <Route
            path="/staff/dashboard"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/transactions"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <StaffTransactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/menu"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <MenuManagement />
              </ProtectedRoute>
            }
          />

          {/* Merchant Portal (protected) */}
          <Route
            path="/merchant/dashboard"
            element={
              <ProtectedRoute allowedRoles={["merchant"]}>
                <MerchantDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/merchant/customers"
            element={
              <ProtectedRoute allowedRoles={["merchant"]}>
                <MerchantCustomers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/merchant/transactions"
            element={
              <ProtectedRoute allowedRoles={["merchant"]}>
                <MerchantTransactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/merchant/staff"
            element={
              <ProtectedRoute allowedRoles={["merchant"]}>
                <MerchantStaff />
              </ProtectedRoute>
            }
          />
          <Route
            path="/merchant/branches"
            element={
              <ProtectedRoute allowedRoles={["merchant"]}>
                <MerchantBranches />
              </ProtectedRoute>
            }
          />
          <Route
            path="/merchant/settings"
            element={
              <ProtectedRoute allowedRoles={["merchant"]}>
                <MerchantSettings />
              </ProtectedRoute>
            }
          />

          {/* Admin Portal (protected) */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          {/* Demo Dashboard (public) */}
          <Route path="/demo" element={<DemoDashboard />} />

          {/* Backward compatibility - redirect old /dashboard to customer dashboard */}
          <Route
            path="/dashboard"
            element={<Navigate to="/customer/dashboard" replace />}
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
