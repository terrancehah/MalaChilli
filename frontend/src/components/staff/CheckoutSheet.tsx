import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { X, Plus, Minus, Loader2, CheckCircle } from 'lucide-react';
import { CustomerInfoCard } from './CustomerInfoCard';
import { formatCurrency } from '../../lib/utils';

interface CheckoutSheetProps {
  isOpen: boolean;
  onClose: () => void;
  customerData: {
    id: number;
    full_name: string;
    referral_code: string;
  };
  walletBalance: number;
  isFirstVisit: boolean;
  onSubmit: (data: {
    billAmount: number;
    redeemAmount: number;
  }) => Promise<void>;
}

export function CheckoutSheet({ 
  isOpen, 
  onClose, 
  customerData, 
  walletBalance, 
  isFirstVisit,
  onSubmit 
}: CheckoutSheetProps) {
  const [billAmount, setBillAmount] = useState('');
  const [redeemAmount, setRedeemAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Calculations
  const [guaranteedDiscount, setGuaranteedDiscount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [maxRedeemable, setMaxRedeemable] = useState(0);

  // Touch gestures for swipe to dismiss
  const [touchStart, setTouchStart] = useState(0);
  const [touchCurrent, setTouchCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Calculate discounts whenever bill amount or redeem amount changes
  useEffect(() => {
    const bill = parseFloat(billAmount) || 0;
    
    if (bill > 0) {
      // First visit discount: 5% of bill
      const guaranteed = isFirstVisit ? bill * 0.05 : 0;
      
      // Max redeemable: 20% of bill or available balance, whichever is lower
      const maxRedeem = Math.min(bill * 0.20, walletBalance);
      const redeem = Math.min(maxRedeem, redeemAmount);
      
      const total = guaranteed + redeem;
      const final = Math.max(0, bill - total);
      
      setGuaranteedDiscount(guaranteed);
      setMaxRedeemable(maxRedeem);
      setTotalDiscount(total);
      setFinalAmount(final);
      
      // Adjust redeem amount if it exceeds max
      if (redeemAmount > maxRedeem) {
        setRedeemAmount(maxRedeem);
      }
    } else {
      setGuaranteedDiscount(0);
      setMaxRedeemable(0);
      setTotalDiscount(0);
      setFinalAmount(0);
    }
  }, [billAmount, redeemAmount, isFirstVisit, walletBalance]);

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
      }, 300); // Match transition duration
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleTouchEnd = () => {
    setIsDragging(false);
    const dragDistance = touchCurrent - touchStart;
    if (dragDistance > 100) {
      onClose();
    } else {
      setTouchCurrent(touchStart);
    }
  };


  const handleIncreaseRedeem = () => {
    const step = 1; // RM 1 increment
    const newAmount = Math.min(redeemAmount + step, maxRedeemable);
    setRedeemAmount(parseFloat(newAmount.toFixed(2)));
  };

  const handleDecreaseRedeem = () => {
    const step = 1; // RM 1 decrement
    const newAmount = Math.max(0, redeemAmount - step);
    setRedeemAmount(parseFloat(newAmount.toFixed(2)));
  };

  const handleRedeemInputChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    const capped = Math.min(Math.max(0, numValue), maxRedeemable);
    setRedeemAmount(parseFloat(capped.toFixed(2)));
  };

  const handleSubmit = async () => {
    if (!billAmount || parseFloat(billAmount) <= 0) return;
    
    setLoading(true);
    try {
      await onSubmit({
        billAmount: parseFloat(billAmount),
        redeemAmount
      });
      
      // Reset form
      setBillAmount('');
      setRedeemAmount(0);
      
      onClose();
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 overflow-hidden ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        style={{ touchAction: 'none' }}
      />
      
      {/* Bottom Sheet */}
      <div 
        className="fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-out"
        style={{
          transform: isDragging && touchCurrent > touchStart 
            ? `translateY(${touchCurrent - touchStart}px)` 
            : isAnimating ? 'translateY(0)' : 'translateY(100%)',
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
        onTouchStart={(e) => {
          setTouchStart(e.targetTouches[0].clientY);
          setTouchCurrent(e.targetTouches[0].clientY);
          setIsDragging(true);
        }}
        onTouchMove={(e) => {
          if (isDragging) {
            const current = e.targetTouches[0].clientY;
            if (current > touchStart) {
              setTouchCurrent(current);
            }
          }
        }}
        onTouchEnd={handleTouchEnd}
      >
        <div className="bg-background rounded-t-3xl shadow-2xl border-t border-border max-h-[85vh] overflow-y-auto">
          <div className="p-6 pt-4">
            {/* Close Button - Top Right */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors z-10"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
            
            {/* Handle Bar */}
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4"></div>
            
            {/* Header */}
            <div className="mb-5">
              <h3 className="text-xl font-bold text-foreground mb-1">
                Process Transaction
              </h3>
              <p className="text-sm text-muted-foreground">
                Enter bill details and complete checkout
              </p>
            </div>

            {/* Customer Info Card */}
            <div className="mb-5">
              <CustomerInfoCard
                customerName={customerData.full_name}
                referralCode={customerData.referral_code}
                walletBalance={walletBalance}
                isFirstVisit={isFirstVisit}
              />
            </div>

            {/* Bill Amount */}
            <div className="mb-5">
              <Label htmlFor="bill-amount" className="text-sm font-semibold mb-2 block">
                Bill Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  RM
                </span>
                <Input
                  id="bill-amount"
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="pl-12 text-lg h-12"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {/* VC Redemption */}
            {parseFloat(billAmount) > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-semibold">
                    Redeem Virtual Currency
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Max: {formatCurrency(maxRedeemable)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 flex-shrink-0"
                    onClick={handleDecreaseRedeem}
                    disabled={redeemAmount <= 0}
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      RM
                    </span>
                    <Input
                      type="number"
                      inputMode="decimal"
                      value={redeemAmount}
                      onChange={(e) => handleRedeemInputChange(e.target.value)}
                      className="pl-12 text-lg h-12 text-center"
                      step="0.01"
                      min="0"
                      max={maxRedeemable}
                    />
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 flex-shrink-0"
                    onClick={handleIncreaseRedeem}
                    disabled={redeemAmount >= maxRedeemable}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Discount Summary */}
            {parseFloat(billAmount) > 0 && (
              <div className="mb-5 p-4 bg-muted/50 rounded-lg">
                <h4 className="text-sm font-semibold mb-3">Discount Summary</h4>
                <div className="space-y-2 text-sm">
                  {isFirstVisit && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">First Visit Bonus (5%)</span>
                      <span className="font-semibold text-green-600">
                        -{formatCurrency(guaranteedDiscount)}
                      </span>
                    </div>
                  )}
                  {redeemAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VC Redeemed</span>
                      <span className="font-semibold text-primary">
                        -{formatCurrency(redeemAmount)}
                      </span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Discount</span>
                    <span className="font-semibold">
                      -{formatCurrency(totalDiscount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="font-bold">Final Amount</span>
                    <span className="font-bold text-primary text-lg">
                      {formatCurrency(finalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}


            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
              disabled={!billAmount || parseFloat(billAmount) <= 0 || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Complete Transaction
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
