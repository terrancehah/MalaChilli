import { useState } from 'react';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface MerchantEnquiryFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MerchantEnquiryForm({ isOpen, onClose }: MerchantEnquiryFormProps) {
  const [formData, setFormData] = useState({
    restaurantName: '',
    contactName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(`Partnership Enquiry - ${formData.restaurantName}`);
      const body = encodeURIComponent(
        `Restaurant Name: ${formData.restaurantName}\n` +
        `Contact Name: ${formData.contactName}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n\n` +
        `Message:\n${formData.message}`
      );
      
      // Open mailto link
      window.location.href = `mailto:support@makantak.com?subject=${subject}&body=${body}`;
      
      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setFormData({
          restaurantName: '',
          contactName: '',
          email: '',
          phone: '',
          message: '',
        });
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Partner With MakanTak
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Restaurant Name */}
            <div>
              <label htmlFor="restaurantName" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Restaurant Name *
              </label>
              <input
                type="text"
                id="restaurantName"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="Your Restaurant Name"
              />
            </div>

            {/* Contact Name */}
            <div>
              <label htmlFor="contactName" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Contact Name *
              </label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="Your Full Name"
              />
            </div>

            {/* Email and Phone Grid */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="+60 12-345 6789"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                placeholder="Tell us about your restaurant and what you'd like to know..."
              />
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                  Thank you! Your enquiry has been sent successfully.
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                  Something went wrong. Please try again or email us directly at support@makantak.com
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? 'Sending...' : 'Send Enquiry'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
