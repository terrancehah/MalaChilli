import { useState } from "react";
import { Link } from "react-router-dom";
import { LoginModal, RegisterModal } from "../components/auth";
import { MerchantEnquiryForm } from "../components/merchant";
import { SEO, LanguageSelector } from "../components/shared";
import { ArrowRight, Gift, Percent, Share2, LayoutDashboard, Users, TrendingUp, Shield, Check } from "lucide-react";
import { getTranslation } from "../translations";
import { useLanguagePreference } from "../hooks/useLanguagePreference";

export default function HomePage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showMerchantEnquiry, setShowMerchantEnquiry] = useState(false);

  // Language preference (no user ID for public page, uses localStorage only)
  const { language, setLanguage } = useLanguagePreference(undefined);
  const t = getTranslation(language);

  const handleSwitchToSignUp = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-background dark:from-gray-900 dark:to-gray-950 font-montserrat overflow-x-hidden">
      <SEO
        title="Home"
        description="MakanTak - Share the savings, grow the community. The viral restaurant discount platform."
      />

      {/* Header */}
      <header className="w-full px-8 sm:px-10 lg:px-12 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-1 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary dark:text-primary-light"
        >
          <img src="/logo.png" alt="MakanTak logo" className="h-12 w-12" />
          <span className="mt-2">{t.home.title}</span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSelector language={language} onLanguageChange={setLanguage} />
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-2 py-2.5 w-min break-keep text-base font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
          >
            {t.home.login}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="w-full px-8 sm:px-10 lg:px-12 pt-8 pb-8 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-primary dark:text-primary-light mb-3">
            {t.home.title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-2 max-w-3xl mx-auto leading-snug">
            {t.home.tagline}
          </p>
          <p className="text-base sm:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">{t.home.subtitle}</p>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-2xl mx-auto">
            {/* Primary CTA - Get Started with ping animation */}
            <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-[280px]">
              <div className="absolute -inset-2 bg-primary rounded-full opacity-20 motion-safe:animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="relative w-full px-10 py-5 bg-primary text-white text-base sm:text-lg font-semibold rounded-full shadow-md hover:shadow-lg active:opacity-90 transition-all duration-200 flex items-center justify-center gap-3 group cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary outline-none"
              >
                <span className="pl-3">{t.home.getStarted}</span>
                <ArrowRight className="w-6 h-6 lg:w-7 lg:h-7 motion-safe:group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Secondary CTA - Demo */}
            <Link
              to="/demo"
              className="w-full sm:w-auto sm:flex-1 sm:max-w-[280px] px-10 py-5 bg-muted text-foreground text-base sm:text-lg font-semibold rounded-full hover:bg-muted/80 active:opacity-90 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
            >
              <LayoutDashboard className="w-6 h-6 lg:w-7 lg:h-7" />
              <span>{t.home.demo}</span>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 sm:mt-24 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <article className="bg-card p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-border group">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary motion-safe:group-hover:scale-110 transition-transform duration-300">
              <Percent className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-foreground">{t.home.feature1Title}</h3>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4">{t.home.feature1Desc}</p>
            <p className="text-sm sm:text-base font-semibold text-primary">{t.home.feature1Badge}</p>
          </article>

          {/* Feature 2 */}
          <article className="bg-card p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-border group">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary motion-safe:group-hover:scale-110 transition-transform duration-300">
              <Share2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-foreground">{t.home.feature2Title}</h3>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4">{t.home.feature2Desc}</p>
            <p className="text-sm sm:text-base font-semibold text-primary">{t.home.feature2Badge}</p>
          </article>

          {/* Feature 3 */}
          <article className="bg-card p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-border group">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary motion-safe:group-hover:scale-110 transition-transform duration-300">
              <Gift className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-foreground">{t.home.feature3Title}</h3>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4">{t.home.feature3Desc}</p>
            <p className="text-sm sm:text-base font-semibold text-primary">{t.home.feature3Badge}</p>
          </article>
        </div>

        {/* Merchant CTA Section */}
        <div className="mt-24 sm:mt-32 max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-orange-600 rounded-3xl overflow-hidden shadow-xl">
            <div className="grid md:grid-cols-2 gap-0 items-center">
              <div className="p-8 sm:p-12 text-white">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{t.home.merchantTitle}</h2>
                <p className="text-lg sm:text-xl mb-6 opacity-95">{t.home.merchantSubtitle}</p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    </div>
                    <span className="text-base sm:text-lg">{t.home.merchantPoint1}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    </div>
                    <span className="text-base sm:text-lg">{t.home.merchantPoint2}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    </div>
                    <span className="text-base sm:text-lg">{t.home.merchantPoint3}</span>
                  </li>
                </ul>
                <button
                  onClick={() => setShowMerchantEnquiry(true)}
                  className="bg-white text-primary px-8 py-4 rounded-full font-bold text-base sm:text-lg hover:bg-white/90 active:opacity-90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shadow-xl focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary outline-none"
                >
                  {t.home.merchantCTA}
                </button>
              </div>
              <div
                className="hidden md:block h-full min-h-[400px] bg-cover bg-center"
                style={{ backgroundImage: "url('/restaurant.jpeg')" }}
                aria-hidden="true"
              >
                <div className="w-full h-full bg-gradient-to-l from-transparent to-primary/20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* About Us Section */}
        <div className="mt-24 sm:mt-32 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">{t.home.aboutTitle}</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">{t.home.aboutSubtitle}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* About Card 1 */}
            <div className="bg-card p-8 rounded-2xl border border-border text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-foreground">{t.home.aboutCard1Title}</h3>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{t.home.aboutCard1Desc}</p>
            </div>

            {/* About Card 2 */}
            <div className="bg-card p-8 rounded-2xl border border-border text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-foreground">{t.home.aboutCard2Title}</h3>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{t.home.aboutCard2Desc}</p>
            </div>

            {/* About Card 3 */}
            <div className="bg-card p-8 rounded-2xl border border-border text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-foreground">{t.home.aboutCard3Title}</h3>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{t.home.aboutCard3Desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-24">
        <div className="max-w-6xl mx-auto px-8 sm:px-10 lg:px-12 py-12">
          {/* Footer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-7 mb-8 justify-around w-fit">
            {/* Brand Column */}
            <div className="md:col-span-1">
              {/* Brand Name and Logo */}
              <div className="flex items-center gap-2 mb-3">
                <img src="/logo.png" alt="MakanTak logo" className="h-12 w-12" />
                <h3 className="text-3xl sm:text-2xl font-display font-bold">
                  <span className="flex mt-2 text-primary dark:text-primary-light">{t.home.title}</span>
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{t.home.footerTagline}</p>
              <p className="text-sm text-muted-foreground">{t.home.footerDesc}</p>
            </div>

            {/* For Customers Column */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">{t.home.forCustomers}</h4>
              <ul className="space-y-3">
                <li className="flex flex-col gap-2 text-sm sm:text-base">
                  <Link
                    to="/demo"
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    {t.home.demoLink}
                  </Link>

                  <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    {t.home.faqLink}
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Restaurants Column */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">{t.home.forRestaurants}</h4>
              <ul className="space-y-3">
                <li className="flex flex-col gap-2 text-sm sm:text-base">
                  <button
                    onClick={() => setShowMerchantEnquiry(true)}
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer text-left"
                  >
                    {t.home.merchantEnquiry}
                  </button>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">{t.home.company}</h4>
              <ul className="space-y-3">
                <li className="flex flex-col gap-2 text-sm sm:text-base">
                  <Link
                    to="/about"
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    {t.home.aboutUs}
                  </Link>
                  <Link
                    to="/contact"
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    {t.home.contact}
                  </Link>
                  <a
                    href="mailto:support@makantak.com"
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    support@makantak.com
                  </a>
                  <Link
                    to="/privacy"
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    {t.home.privacy}
                  </Link>
                  <Link
                    to="/terms"
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    {t.home.terms}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm lg:text-base text-muted-foreground">{t.home.copyright}</p>

            {/* Social Media */}
            <div className="flex items-center gap-4">
              <a
                href="https://x.com/MakanTakMY"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors duration-200 cursor-pointer"
                aria-label={t.home.followUs}
              >
                <svg className="w-5 h-5 text-foreground" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

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
      <MerchantEnquiryForm isOpen={showMerchantEnquiry} onClose={() => setShowMerchantEnquiry(false)} />
    </div>
  );
}
