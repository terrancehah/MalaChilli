import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoginModal, RegisterModal } from '../components/auth';
import { MerchantEnquiryForm } from '../components/merchant';
import { SEO } from '../components/shared';
import { ArrowRight, Gift, Percent, Share2, LayoutDashboard, Users, TrendingUp, Shield } from 'lucide-react';

export default function HomePage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showMerchantEnquiry, setShowMerchantEnquiry] = useState(false);

  const handleSwitchToSignUp = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-background dark:from-gray-900 dark:to-gray-950 font-sans">
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
            <div className="relative w-full sm:w-auto">
              <div className="absolute -inset-2 bg-primary rounded-full opacity-20" style={{animation: "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite"}}></div>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="relative w-full sm:w-auto min-w-[160px] px-8 py-4 bg-primary text-white text-lg font-semibold rounded-full shadow-md hover:shadow-sm active:shadow-none active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
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
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
              <Percent className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">5% Guaranteed Discount</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Get an instant 5% discount on your first visit at any participating restaurant. No strings attached.
            </p>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
              <span>First visit bonus</span>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
              <Share2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Share & Earn</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Share your unique code with friends. Earn 1% of their bill as virtual currency every time they dine.
            </p>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
              <span>3-level rewards system</span>
            </div>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
              <Gift className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Redeem Rewards</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Use your earned virtual currency to pay for your meals. Redeem up to 20% of your bill.
            </p>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
              <span>Max 20% redemption</span>
            </div>
          </div>
        </div>

        {/* Merchant CTA Section */}
        <div className="mt-24 sm:mt-32 max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-orange-600 rounded-3xl overflow-hidden shadow-xl">
            <div className="grid md:grid-cols-2 gap-0 items-center">
              <div className="p-8 sm:p-12 text-white">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Own a Restaurant?
                </h2>
                <p className="text-lg sm:text-xl mb-6 opacity-95">
                  Join MakanTak and turn your customers into brand ambassadors. Pay only for results with our viral referral system.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm">✓</span>
                    </div>
                    <span className="text-base">Max 8% marketing cost - only pay when customers dine</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm">✓</span>
                    </div>
                    <span className="text-base">Build your own customer referral network</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm">✓</span>
                    </div>
                    <span className="text-base">Track ROI with real-time analytics dashboard</span>
                  </li>
                </ul>
                <button
                  onClick={() => setShowMerchantEnquiry(true)}
                  className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-lg"
                >
                  Get Started
                </button>
              </div>
              <div className="hidden md:block h-full min-h-[400px] bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80')"}}>
                <div className="w-full h-full bg-gradient-to-l from-transparent to-primary/20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* About Us Section */}
        <div className="mt-24 sm:mt-32 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why MakanTak?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We're revolutionizing how Malaysian restaurants grow their business through viral word-of-mouth marketing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* About Card 1 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Community-Driven</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Built for Malaysian local restaurants and their loyal customers. We believe in growing together through authentic referrals.
              </p>
            </div>

            {/* About Card 2 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Performance-Based</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                No upfront costs. Restaurants only pay when customers actually dine. Transparent, measurable, and fair for everyone.
              </p>
            </div>

            {/* About Card 3 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Secure & Compliant</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                PDPA-compliant with robust security measures. Your data is protected, and your privacy is our priority.
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Questions? Reach us at{' '}
              <a href="mailto:support@makantak.com" className="text-primary hover:underline font-semibold">
                support@makantak.com
              </a>
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
      <MerchantEnquiryForm
        isOpen={showMerchantEnquiry}
        onClose={() => setShowMerchantEnquiry(false)}
      />
    </div>
  );
}
