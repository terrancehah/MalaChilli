import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

/**
 * Base modal component for authentication forms
 * Provides backdrop, close button, animations, and body scroll lock
 */
export function AuthModal({ isOpen, onClose, children, title }: AuthModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle animation and body scroll
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      document.body.style.overflow = 'unset';
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200); // Match transition duration
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-md bg-white dark:bg-gray-800 rounded-card shadow-2xl transition-all duration-200 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Body */}
        <div className="p-8 sm:p-12">
          {title && (
            <div className="text-center mb-8">
              <h1 className="font-display text-4xl sm:text-5xl mb-2">
                <span className="text-gray-900 dark:text-white">Mala</span>
                <span className="text-primary">Chilli</span>
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
