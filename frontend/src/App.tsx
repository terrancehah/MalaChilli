import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Auth pages with new Malaysian green food design
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';

// Dashboard pages
import CustomerDashboard from './pages/customer/Dashboard';
import DemoDashboard from './pages/DemoDashboard';

// Other pages
import HomePage from './pages/HomePage';

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
          
          {/* Customer Dashboard (protected) */}
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          
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
