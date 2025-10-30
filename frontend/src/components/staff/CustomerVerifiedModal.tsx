import { Button } from '../ui/button';
import { X, CheckCircle, Edit, Cake } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CustomerVerifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onEdit: () => void;
  customerName: string;
  referralCode: string;
  isBirthday?: boolean;
  isFirstVisit?: boolean;
}

/**
 * Quick confirmation modal after successful QR scan
 * Shows customer info and allows proceeding to checkout
 */
export function CustomerVerifiedModal({ 
  isOpen, 
  onClose, 
  onContinue,
  onEdit,
  customerName,
  referralCode,
  isBirthday = false,
  isFirstVisit = false
}: CustomerVerifiedModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Delay animation to ensure element is mounted
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-background rounded-2xl max-w-sm w-full shadow-2xl border border-border transition-all duration-200 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="relative mb-6">
            <button
              onClick={onClose}
              className="absolute top-0 right-0 h-6 w-6 p-0 hover:bg-muted rounded-md transition-colors flex items-center justify-center"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-foreground mb-3">
              Customer Verified
            </h3>
            
            {/* Badges */}
            <div className="flex gap-2 justify-center mb-3">
              {isBirthday && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-xs font-semibold shadow-lg">
                  <Cake className="h-3.5 w-3.5" />
                  Birthday Today! 🎉
                </div>
              )}
              {isFirstVisit && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-semibold shadow-lg">
                  ✨ First Visit
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 mb-1">
              <p className="text-lg font-semibold text-foreground">
                {customerName}
              </p>
              <button
                onClick={onEdit}
                className="h-7 w-7 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                title="Edit customer details"
              >
                <Edit className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground font-mono">
              {referralCode}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={onContinue}
              className="w-full bg-primary hover:bg-primary/90 h-11"
              size="lg"
            >
              Continue to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
