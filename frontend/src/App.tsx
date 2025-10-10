import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Auth pages with new Malaysian green food design
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';

// Other pages
import HomePage from './pages/HomePage';
import DemoDashboard from './pages/DemoDashboard';

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
          
          {/* Dashboard - no authentication needed (demo mode) */}
          <Route path="/dashboard" element={<DemoDashboard />} />
          <Route path="/demo" element={<DemoDashboard />} />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
