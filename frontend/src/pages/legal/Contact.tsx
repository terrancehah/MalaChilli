import { Link } from 'react-router-dom';
import { Mail, MessageSquare, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { getTranslation, type Language } from '../../translations';
import { LanguageSelector } from '../../components/shared';

export default function Contact() {
  const [language, setLanguage] = useState<Language>('en');
  const t = getTranslation(language);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error(t.contact.fillAllFields);
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement actual email sending via Supabase Edge Function
      // For now, just show success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(t.contact.messageSent);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error(t.contact.messageFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="text-primary hover:underline text-sm">
              ← {t.contact.backToHome}
            </Link>
            <LanguageSelector language={language} onLanguageChange={setLanguage} />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.contact.title}</h1>
          <p className="text-muted-foreground">{t.contact.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t.contact.emailSupportTitle}</h3>
              <p className="text-foreground/70 text-sm mb-3">
                {t.contact.emailSupportDesc}
              </p>
              <a
                href="mailto:support@malachilli.com"
                className="text-primary hover:underline font-medium"
              >
                {t.contact.emailSupportAddress}
              </a>
            </div>

            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t.contact.businessInquiriesTitle}</h3>
              <p className="text-foreground/70 text-sm mb-3">
                {t.contact.businessInquiriesDesc}
              </p>
              <a
                href="mailto:business@malachilli.com"
                className="text-primary hover:underline font-medium"
              >
                {t.contact.businessInquiriesAddress}
              </a>
            </div>

            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t.contact.phoneSupportTitle}</h3>
              <p className="text-foreground/70 text-sm mb-3">
                {t.contact.phoneSupportDesc}
              </p>
              <a
                href="tel:+60123456789"
                className="text-primary hover:underline font-medium"
              >
                {t.contact.phoneSupportNumber}
              </a>
            </div>

            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t.contact.officeLocationTitle}</h3>
              <p className="text-foreground/70 text-sm">
                {t.contact.officeLocationAddress}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="p-8 bg-card border border-border rounded-lg">
              <h2 className="text-2xl font-bold text-foreground mb-6">{t.contact.sendMessageTitle}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    {t.contact.nameLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder={t.contact.namePlaceholder}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    {t.contact.emailLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder={t.contact.emailPlaceholder}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    {t.contact.subjectLabel} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                  >
                    <option value="">{t.contact.subjectPlaceholder}</option>
                    <option value="general">{t.contact.subjectGeneral}</option>
                    <option value="support">{t.contact.subjectSupport}</option>
                    <option value="account">{t.contact.subjectAccount}</option>
                    <option value="partnership">{t.contact.subjectPartnership}</option>
                    <option value="feedback">{t.contact.subjectFeedback}</option>
                    <option value="other">{t.contact.subjectOther}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    {t.contact.messageLabel} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground resize-none"
                    placeholder={t.contact.messagePlaceholder}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t.contact.sending : t.contact.sendButton}
                </button>
              </form>

              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-foreground/80">
                  <strong>{t.contact.noteTitle}</strong> {t.contact.noteText}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4">{t.contact.quickLinksTitle}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/faq"
              className="p-4 bg-card border border-border rounded-lg hover:border-primary transition-colors text-center"
            >
              <h4 className="font-semibold text-foreground mb-1">{t.contact.faqTitle}</h4>
              <p className="text-sm text-muted-foreground">{t.contact.faqDesc}</p>
            </Link>
            <Link
              to="/about"
              className="p-4 bg-card border border-border rounded-lg hover:border-primary transition-colors text-center"
            >
              <h4 className="font-semibold text-foreground mb-1">{t.contact.aboutTitle}</h4>
              <p className="text-sm text-muted-foreground">{t.contact.aboutDesc}</p>
            </Link>
            <Link
              to="/privacy"
              className="p-4 bg-card border border-border rounded-lg hover:border-primary transition-colors text-center"
            >
              <h4 className="font-semibold text-foreground mb-1">{t.contact.privacyTitle}</h4>
              <p className="text-sm text-muted-foreground">{t.contact.privacyDesc}</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
