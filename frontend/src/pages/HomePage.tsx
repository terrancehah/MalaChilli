import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoginModal, RegisterModal } from '../components/auth';
import { Toaster } from 'react-hot-toast';

export default function HomePage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleSwitchToSignUp = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            MakanTak
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Earn rewards by sharing. Save on every meal.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-2xl mx-auto px-4">
            <Link
              to="/demo"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-semibold hover:from-primary-dark hover:to-primary-dark transition shadow-lg text-center touch-manipulation min-h-[44px] flex items-center justify-center"
            >
              🎨 View Demo Dashboard
            </Link>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition text-center touch-manipulation min-h-[44px] flex items-center justify-center"
            >
              Get Started
            </button>
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-gray-800 text-primary dark:text-primary-light border-2 border-primary dark:border-primary-light rounded-lg font-semibold hover:bg-primary/5 dark:hover:bg-gray-700 transition text-center touch-manipulation min-h-[44px] flex items-center justify-center"
            >
              Login
            </button>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">5% Guaranteed Discount</h3>
            <p className="text-gray-600 dark:text-gray-300 text-base">
              Get an instant 5% discount on your first visit at any participating restaurant.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Share & Earn</h3>
            <p className="text-gray-600 dark:text-gray-300 text-base">
              Share your code with friends. Earn virtual currency when they dine.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Redeem Rewards</h3>
            <p className="text-gray-600 dark:text-gray-300 text-base">
              Use your earned virtual currency for discounts on future meals.
            </p>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster position="top-right" toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#111827',
        },
        success: {
          iconTheme: {
            primary: '#0A5F0A',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#DC2626',
            secondary: '#fff',
          },
        },
      }} />

      {/* Auth Modals */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
      <RegisterModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
}
