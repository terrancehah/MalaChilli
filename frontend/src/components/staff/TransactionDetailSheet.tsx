import { useState, useEffect } from 'react';
import { X, Clock, Receipt, DollarSign, User, Package, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { getTranslation, type Language } from '../../translations';

interface TransactionDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onVoidSuccess?: () => void;
  transaction: any | null;
  language?: Language;
}

export function TransactionDetailSheet({ 
  isOpen, 
  onClose, 
  onVoidSuccess,
  transaction,
  language = 'en'
}: TransactionDetailSheetProps) {
  const t = getTranslation(language);
  const [touchStart, setTouchStart] = useState(0);
  const [touchCurrent, setTouchCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  // Void State
  const [showVoidConfirm, setShowVoidConfirm] = useState(false);
  const [voidReason, setVoidReason] = useState('');
  const [isVoiding, setIsVoiding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setShowVoidConfirm(false);
      setVoidReason('');
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      document.body.style.overflow = 'unset';
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleVoidTransaction = async () => {
    if (!voidReason.trim()) {
      toast.error(t.staffDashboard.voidReasonPlaceholder);
      return;
    }

    try {
      setIsVoiding(true);
      const { error } = await supabase.rpc('void_transaction', {
        p_transaction_id: transaction.id,
        p_reason: voidReason
      });

      if (error) throw error;

      toast.success(t.staffDashboard.voidSuccess);
      if (onVoidSuccess) onVoidSuccess();
      else onClose();
    } catch (error) {
      console.error('Error voiding transaction:', error);
      toast.error(t.common.error);
    } finally {
      setIsVoiding(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (showVoidConfirm) return; // Disable drag when showing confirmation
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
  
  // Parse OCR data if available
  const ocrData = transaction.ocr_data;
  const hasOCR = transaction.ocr_processed && ocrData;
  const ocrItems = hasOCR ? ocrData.extraction?.items || [] : [];
  const ocrConfidence = hasOCR ? ocrData.extraction?.confidence || 0 : 0;
  const isVoided = transaction.status === 'voided';

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
          maxHeight: '90vh',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="overflow-y-auto max-h-[90vh] pb-safe">
          <div className="p-6">
            {/* Drag Handle */}
            {!showVoidConfirm && (
              <div className="flex justify-center mb-4">
                <div className="w-12 h-1.5 bg-muted rounded-full" />
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors z-10"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Receipt className="h-4 w-4" />
                <span className="text-sm font-medium">{t.staffDashboard.detailSheetTitle}</span>
                {isVoided && (
                  <span className="bg-destructive/10 text-destructive text-xs font-bold px-2 py-0.5 rounded uppercase">
                    {t.staffDashboard.detailVoided}
                  </span>
                )}
              </div>
              <h2 className={`text-2xl font-bold text-foreground ${isVoided ? 'line-through text-muted-foreground' : ''}`}>
                RM {parseFloat(transaction.final_amount || transaction.bill_amount).toFixed(2)}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{new Date(transaction.transaction_date || transaction.created_at).toLocaleString()}</span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-muted/50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{t.staffDashboard.detailCustomer}</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {transaction.customer?.full_name || 'Unknown Customer'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction.customer?.email || 'No email'}
                </p>
              </div>
            </div>

            {/* Transaction Breakdown */}
            <div className="bg-muted/50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{t.staffDashboard.detailBreakdown}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.staffDashboard.billAmount}</span>
                  <span className={`font-medium text-foreground ${isVoided ? 'line-through' : ''}`}>
                    RM {parseFloat(transaction.bill_amount).toFixed(2)}
                  </span>
                </div>
                {parseFloat(transaction.guaranteed_discount_amount || 0) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.transactionDetail?.guaranteedDiscount || 'Discount'}</span>
                    <span className={`font-medium text-green-600 ${isVoided ? 'line-through text-green-600/50' : ''}`}>
                      -RM {parseFloat(transaction.guaranteed_discount_amount).toFixed(2)}
                    </span>
                  </div>
                )}
                {parseFloat(transaction.virtual_currency_redeemed || 0) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.transactionDetail?.vcRedeemed || 'VC Redeemed'}</span>
                    <span className={`font-medium text-green-600 ${isVoided ? 'line-through text-green-600/50' : ''}`}>
                      -RM {parseFloat(transaction.virtual_currency_redeemed).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-border flex justify-between">
                  <span className="text-sm font-semibold text-foreground">{t.staffDashboard.finalAmount}</span>
                  <span className={`text-sm font-bold text-foreground ${isVoided ? 'line-through text-muted-foreground' : ''}`}>
                    RM {parseFloat(transaction.final_amount || transaction.bill_amount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* OCR Data (if available) */}
            {hasOCR && (
              <div className="bg-muted/50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">{t.staffDashboard.detailReceiptItems}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {ocrConfidence >= 80 ? (
                      <>
                        <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                        <span className="text-green-600 font-medium">{ocrConfidence}%</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3.5 w-3.5 text-yellow-600" />
                        <span className="text-yellow-600 font-medium">{ocrConfidence}%</span>
                      </>
                    )}
                  </div>
                </div>
                {ocrItems.length > 0 ? (
                  <div className="space-y-2">
                    {ocrItems.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <span className="text-foreground">{item.name}</span>
                          <span className="text-muted-foreground ml-2">×{item.quantity}</span>
                        </div>
                        <span className="font-medium text-foreground">
                          RM {item.total.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">{t.staffDashboard.detailNoItems}</p>
                )}
              </div>
            )}

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {transaction.is_first_transaction && (
                <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                  {t.staffDashboard.detailFirstVisit}
                </div>
              )}
              {hasOCR && (
                <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                  {t.staffDashboard.detailReceiptScanned}
                </div>
              )}
            </div>

            {/* Void Confirmation UI */}
            {showVoidConfirm ? (
              <div className="bg-destructive/5 rounded-xl p-4 mb-4 border border-destructive/20 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-destructive/10 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-destructive">{t.staffDashboard.voidConfirmTitle}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t.staffDashboard.voidConfirmDesc}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">
                      {t.staffDashboard.voidReason}
                    </label>
                    <input
                      type="text"
                      value={voidReason}
                      onChange={(e) => setVoidReason(e.target.value)}
                      placeholder={t.staffDashboard.voidReasonPlaceholder}
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-destructive/20"
                      autoFocus
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowVoidConfirm(false)}
                      disabled={isVoiding}
                    >
                      {t.staffDashboard.cancelVoid}
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={handleVoidTransaction}
                      disabled={isVoiding || !voidReason.trim()}
                    >
                      {isVoiding ? t.common.loading : t.staffDashboard.confirmVoid}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* Actions */
              <div className="space-y-3">
                {!isVoided && (
                  <Button
                    variant="destructive"
                    className="w-full bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 shadow-none"
                    onClick={() => setShowVoidConfirm(true)}
                  >
                    {t.staffDashboard.voidTransaction}
                  </Button>
                )}
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full"
                >
                  {t.common.close}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
