import { Link } from 'react-router-dom';
import { Target, Users, TrendingUp, Heart } from 'lucide-react';
import { useState } from 'react';
import { getTranslation, type Language } from '../../translations';
import { LanguageSelector, SEO } from '../../components/shared';

export default function AboutUs() {
  const [language, setLanguage] = useState<Language>('en');
  const t = getTranslation(language);

  return (
    <div className="min-h-screen bg-background">
      <SEO title={t.about.title} description="Learn about MakanTak's mission to help local restaurants grow through community-driven viral marketing." />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="text-primary hover:underline text-sm">
              ← {t.about.backToHome}
            </Link>
            <LanguageSelector language={language} onLanguageChange={setLanguage} />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.about.title}</h1>
          <p className="text-lg text-muted-foreground">{t.about.subtitle}</p>
        </div>

        {/* Hero Section */}
        <div className="mb-12 p-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
          <h2 className="text-2xl font-bold text-foreground mb-4">{t.about.missionTitle}</h2>
          <p className="text-lg text-foreground/90 leading-relaxed">
            {t.about.missionText}
          </p>
        </div>

        {/* What We Do */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">{t.about.whatWeDoTitle}</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            {t.about.whatWeDoPara1}
          </p>
          <p className="text-foreground/80 leading-relaxed">
            {t.about.whatWeDoPara2}
          </p>
        </section>

        {/* Core Values */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">{t.about.coreValuesTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t.about.transparencyTitle}</h3>
              <p className="text-foreground/70">
                {t.about.transparencyDesc}
              </p>
            </div>

            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t.about.communityTitle}</h3>
              <p className="text-foreground/70">
                {t.about.communityDesc}
              </p>
            </div>

            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t.about.growthTitle}</h3>
              <p className="text-foreground/70">
                {t.about.growthDesc}
              </p>
            </div>

            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t.about.simplicityTitle}</h3>
              <p className="text-foreground/70">
                {t.about.simplicityDesc}
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">{t.about.howItWorksTitle}</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{t.about.step1Title}</h3>
                <p className="text-foreground/70">
                  {t.about.step1Desc}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{t.about.step2Title}</h3>
                <p className="text-foreground/70">
                  {t.about.step2Desc}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{t.about.step3Title}</h3>
                <p className="text-foreground/70">
                  {t.about.step3Desc}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{t.about.step4Title}</h3>
                <p className="text-foreground/70">
                  {t.about.step4Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* For Restaurants */}
        <section className="mb-12 p-8 bg-primary/5 border border-primary/20 rounded-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">{t.about.forRestaurantsTitle}</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            {t.about.forRestaurantsPara}
          </p>
          <ul className="space-y-2 text-foreground/80">
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>{t.about.forRestaurantsPoint1}</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>{t.about.forRestaurantsPoint2}</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>{t.about.forRestaurantsPoint3}</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span>{t.about.forRestaurantsPoint4}</span>
            </li>
          </ul>
          <div className="mt-6">
            <Link
              to="/contact"
              className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {t.about.partnerWithUs}
            </Link>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">{t.about.questionsTitle}</h2>
          <p className="text-foreground/80 mb-6">
            {t.about.questionsDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/faq"
              className="inline-block bg-card hover:bg-muted border border-border text-foreground font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {t.about.viewFAQ}
            </Link>
            <Link
              to="/contact"
              className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {t.about.contactUs}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
