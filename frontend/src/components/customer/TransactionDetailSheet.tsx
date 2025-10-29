import { useState, useEffect } from 'react';
import { X, MapPin, Clock, Receipt, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { getTranslation } from '../../translations';
import type { Language } from '../../translations';

interface TransactionDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any | null;
  language?: Language;
}

export function TransactionDetailSheet({ isOpen, onClose, transaction, language = 'en' }: TransactionDetailSheetProps) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchCurrent, setTouchCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [showReferralInfo, setShowReferralInfo] = useState(false);
  
  const t = getTranslation(language);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const current = e.touches[0].clientY;
    setTouchCurrent(current);
  };

  const handleTouchEnd = () => {
    if (touchCurrent - touchStart > 100) {
      onClose();
    }
    setTouchCurrent(0);
    setTouchStart(0);
    setIsDragging(false);
  };

  if (!shouldRender || !transaction) return null;

  const translateY = isDragging && touchCurrent > touchStart ? touchCurrent - touchStart : 0;
  const potentialEarning = transaction.bill_amount * 0.01;
  const hasEarnings = transaction.vc_earned > 0;

  // Calculate potential earnings for multiple referrals (up to 3 levels)
  const potentialReferrals = [
    { level: 1, amount: potentialEarning },
    { level: 2, amount: potentialEarning },
    { level: 3, amount: potentialEarning },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-2xl z-50 transition-transform duration-300 ease-out ${
          isAnimating ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          transform: `translateY(${isAnimating ? translateY : '100%'}px)`,
          maxHeight: '85vh',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="overflow-y-auto max-h-[85vh] pb-safe">
          <div className="p-6">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors z-10"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
            
            {/* Handle Bar */}
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4"></div>
            
            {/* Header */}
            <div className="mb-5">
              <h3 className="text-xl font-bold text-foreground mb-1">
                {t.transactionDetail.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {transaction.branches.restaurants.name}
              </p>
            </div>

            {/* Transaction Info */}
            <div className="space-y-4 mb-5">
              {/* Time */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t.transactionDetail.transactionTime}</p>
                  <p className="text-sm font-semibold text-foreground">
                    {new Date(transaction.created_at).toLocaleString('en-MY', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t.transactionDetail.branch}</p>
                  <p className="text-sm font-semibold text-foreground">
                    {transaction.branches.name}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t.transactionDetail.billAmount}</p>
                  <p className="text-sm font-semibold text-foreground">
                    RM {transaction.bill_amount}
                  </p>
                </div>
              </div>
            </div>

            {/* Realized VC Earnings */}
            {hasEarnings && (
              <div className="mb-5 bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground mb-1">
                      {t.transactionDetail.vcEarnedTitle}
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                      +RM {transaction.vc_earned.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.transactionDetail.vcEarnedDesc}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Unrealized Potential Earnings */}
            {!hasEarnings && (
              <div className="mb-5 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-sm font-semibold text-foreground">
                        {t.transactionDetail.unrealizedTitle}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowReferralInfo(true)}
                        className="h-5 w-5 p-0"
                        title="How referral levels work"
                      >
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      {t.transactionDetail.unrealizedDesc}
                    </p>
                    
                    <div className="space-y-2">
                      {potentialReferrals.map((ref) => (
                        <div key={ref.level} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-md p-2 border border-amber-200 dark:border-amber-700">
                          <span className="text-xs text-muted-foreground">
                            {ref.level === 1 ? t.transactionDetail.level1Referral : ref.level === 2 ? t.transactionDetail.level2Referral : t.transactionDetail.level3Referral}
                          </span>
                          <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                            +RM {ref.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                      
                      <div className="flex items-center justify-between bg-amber-100 dark:bg-amber-900/40 rounded-md p-2 border border-amber-300 dark:border-amber-600 mt-2">
                        <span className="text-xs font-semibold text-foreground">
                          {t.transactionDetail.totalReferrals}
                        </span>
                        <span className="text-base font-bold text-amber-600 dark:text-amber-400">
                          +RM {(potentialEarning * 3).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Discounts Applied */}
            {(transaction.guaranteed_discount_amount > 0 || transaction.virtual_currency_redeemed > 0) && (
              <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                <p className="text-xs font-semibold text-foreground mb-2">{t.transactionDetail.discountsTitle}</p>
                <div className="space-y-1">
                  {transaction.guaranteed_discount_amount > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{t.transactionDetail.guaranteedDiscount}</span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        -RM {transaction.guaranteed_discount_amount}
                      </span>
                    </div>
                  )}
                  {transaction.virtual_currency_redeemed > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{t.transactionDetail.vcRedeemed}</span>
                      <span className="text-primary font-semibold">
                        -RM {transaction.virtual_currency_redeemed}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Referral Info Modal */}
      {showReferralInfo && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setShowReferralInfo(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-background rounded-2xl shadow-2xl z-[60] p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">
                {t.referralInfo.title}
              </h3>
              <button
                onClick={() => setShowReferralInfo(false)}
                className="h-8 w-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800 mb-4">
                <p className="text-xs font-semibold text-foreground mb-1">
                  📊 {t.referralInfo.howItWorks}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.referralInfo.howItWorksDesc}
                </p>
              </div>

              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                <p className="text-sm font-semibold text-foreground mb-2">
                  🎯 {t.referralInfo.level1Title}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  {t.referralInfo.level1Desc}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  {t.referralInfo.upperLimit}
                </p>
              </div>

              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                <p className="text-sm font-semibold text-foreground mb-2">
                  🎯 {t.referralInfo.level2Title}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  {t.referralInfo.level2Desc}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  {t.referralInfo.upperLimit}
                </p>
              </div>

              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                <p className="text-sm font-semibold text-foreground mb-2">
                  🎯 {t.referralInfo.level3Title}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  {t.referralInfo.level3Desc}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  {t.referralInfo.upperLimit}
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <p className="text-xs font-semibold text-foreground mb-2">
                  💰 {t.referralInfo.exampleTitle}
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold">{t.referralInfo.maxPotential}</span>
                  <br />• {t.referralInfo.level1Max}
                  <br />• {t.referralInfo.level2Max}
                  <br />• {t.referralInfo.level3Max}
                  <br /><span className="font-semibold text-green-600 dark:text-green-400">{t.referralInfo.totalPotential}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-green-200 dark:border-green-700">
                  <span className="font-semibold">{t.referralInfo.note}</span> {t.referralInfo.noteDesc}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
