import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoginModal, RegisterModal } from '../components/auth';
import { SEO } from '../components/shared';
import { ArrowRight, Gift, Percent, Share2, LayoutDashboard } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white dark:from-gray-900 dark:to-gray-950 font-sans">
      <SEO title="Home" description="MakanTak - Share the savings, grow the community. The viral restaurant discount platform." />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
            MakanTak
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Earn rewards by sharing. Save on every meal. <br className="hidden sm:block"/>
            The viral restaurant discount platform.
          </p>
          
          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto sm:max-w-none">
            <button
              onClick={() => setShowRegisterModal(true)}
              className="w-full sm:w-auto min-w-[160px] px-8 py-4 bg-primary text-white text-lg font-semibold rounded-full shadow-md hover:shadow-sm active:shadow-none active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full sm:w-auto min-w-[160px] px-8 py-4 bg-white dark:bg-gray-800 text-primary dark:text-primary-light border-2 border-primary dark:border-primary-light text-lg font-semibold rounded-full shadow-md hover:shadow-sm active:shadow-none active:scale-95 hover:bg-primary/5 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center"
            >
              Login
            </button>
          </div>

          {/* Secondary / Demo Action - Repositioned for better UX */}
          <div className="mt-8 sm:mt-10">
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light transition-colors py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>View Demo Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
              <Percent className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">5% Guaranteed Discount</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Get an instant 5% discount on your first visit at any participating restaurant. No strings attached.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
              <Share2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Share & Earn</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Share your unique code with friends. Earn virtual currency every time they dine using your link.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
              <Gift className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Redeem Rewards</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Use your earned virtual currency to pay for your meals. The more you share, the more you eat for free.
            </p>
          </div>
        </div>
      </div>

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
