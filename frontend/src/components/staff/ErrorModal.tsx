import { Button } from '../ui/button';
import { AlertCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

export function ErrorModal({
  isOpen,
  onClose,
  title = 'Error',
  message
}: ErrorModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isAnimating ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-background rounded-2xl shadow-2xl max-w-md w-full p-6 transition-all duration-300 ${
          isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Error Icon */}
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-foreground mb-2">
          {title}
        </h2>

        {/* Message */}
        <p className="text-center text-sm text-muted-foreground mb-6 whitespace-pre-line">
          {message}
        </p>

        {/* Action Button */}
        <Button
          onClick={onClose}
          variant="outline"
          className="w-full h-12 border-2 font-semibold rounded-xl"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
