import { Button } from '../ui/button';
import { CheckCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getTranslation, type Language } from '../../translations';

interface TransactionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
  customerName: string;
  billAmount: number;
  discountApplied: number;
  vcRedeemed: number;
  birthdayBonus?: number;
  language?: Language;
}

export function TransactionSuccessModal({
  isOpen,
  onClose,
  transactionId,
  customerName,
  billAmount,
  discountApplied,
  vcRedeemed,
  birthdayBonus = 0,
  language = 'en'
}: TransactionSuccessModalProps) {
  const t = getTranslation(language);
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

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-foreground mb-2">
          {t.staffDashboard.transactionSuccess}!
        </h2>

        {/* Transaction ID */}
        <p className="text-center text-sm text-muted-foreground mb-6">
          {t.staffDashboard.transactionId}: <span className="font-mono font-semibold">{transactionId}</span>
        </p>

        {/* Transaction Details */}
        <div className="space-y-3 mb-6 p-4 bg-muted/50 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t.staffDashboard.customer}</span>
            <span className="text-sm font-semibold text-foreground">{customerName}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t.staffDashboard.billAmount}</span>
            <span className="text-sm font-semibold text-foreground">RM {billAmount.toFixed(2)}</span>
          </div>

          {discountApplied > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t.staffDashboard.discount}</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                -RM {discountApplied.toFixed(2)}
              </span>
            </div>
          )}

          {vcRedeemed > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t.staffDashboard.vcRedeemed}</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                -RM {vcRedeemed.toFixed(2)}
              </span>
            </div>
          )}

          {birthdayBonus > 0 && (
            <div className="flex justify-between items-center bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 -mx-4 px-4 py-2 rounded-lg">
              <span className="text-sm font-semibold text-pink-700 dark:text-pink-300 flex items-center gap-1">
                🎂 {t.staffDashboard.birthdayBonus}
              </span>
              <span className="text-sm font-bold text-pink-700 dark:text-pink-300">
                +RM {birthdayBonus.toFixed(2)}
              </span>
            </div>
          )}

          <div className="pt-3 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-foreground">{t.staffDashboard.finalAmount}</span>
              <span className="text-lg font-bold text-primary">
                RM {(billAmount - discountApplied - vcRedeemed).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={onClose}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl"
        >
          {t.staffDashboard.done}
        </Button>
      </div>
    </div>
  );
}
