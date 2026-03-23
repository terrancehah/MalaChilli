import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "../ui/drawer";
import { Plus, Minus, Loader2, CheckCircle } from "lucide-react";
import { CustomerInfoCard } from "./CustomerInfoCard";
import { formatCurrency } from "../../lib/utils";
import { getTranslation, type Language } from "../../translations";

interface CheckoutSheetProps {
  isOpen: boolean;
  onClose: () => void;
  customerData: {
    id: string;
    full_name: string;
    referral_code: string;
  };
  walletBalance: number;
  isFirstVisit: boolean;
  language?: Language;
  onSubmit: (data: { billAmount: number; redeemAmount: number }) => Promise<void>;
}

export function CheckoutSheet({
  isOpen,
  onClose,
  customerData,
  walletBalance,
  isFirstVisit,
  language = "en",
  onSubmit,
}: CheckoutSheetProps) {
  const t = getTranslation(language);
  const [billAmount, setBillAmount] = useState("");
  const [redeemAmount, setRedeemAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Calculations
  const [guaranteedDiscount, setGuaranteedDiscount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [maxRedeemable, setMaxRedeemable] = useState(0);

  // Calculate discounts whenever bill amount or redeem amount changes
  useEffect(() => {
    const bill = parseFloat(billAmount) || 0;

    if (bill > 0) {
      // First visit discount: 5% of bill
      const guaranteed = isFirstVisit ? bill * 0.05 : 0;

      // Max redeemable: 20% of bill or available balance, whichever is lower
      const maxRedeem = Math.min(bill * 0.2, walletBalance);
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
        redeemAmount,
      });

      // Reset form
      setBillAmount("");
      setRedeemAmount(0);

      onClose();
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[85vh]">
        <div className="overflow-y-auto px-6 pb-6">
          {/* Header */}
          <DrawerHeader className="px-0 pt-2">
            <DrawerTitle className="text-xl font-bold text-foreground">{t.staffDashboard.checkout}</DrawerTitle>
            <DrawerDescription>{t.staffDashboard.enterBillAmount}</DrawerDescription>
          </DrawerHeader>

          {/* Customer Info Card */}
          <div className="mb-5">
            <CustomerInfoCard
              customerName={customerData.full_name}
              referralCode={customerData.referral_code}
              walletBalance={walletBalance}
              isFirstVisit={isFirstVisit}
              language={language}
            />
          </div>

          {/* Bill Amount */}
          <div className="mb-5">
            <Label htmlFor="bill-amount" className="text-sm font-semibold mb-2 block">
              {t.staffDashboard.billAmount}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">RM</span>
              <Input
                id="bill-amount"
                type="number"
                inputMode="decimal"
                placeholder={t.staffDashboard.billAmountPlaceholder}
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
                <Label className="text-sm font-semibold">{t.staffDashboard.redeemAmount}</Label>
                <span className="text-xs text-muted-foreground">
                  {t.staffDashboard.maxRedeemable}: {formatCurrency(maxRedeemable)}
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">RM</span>
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
              <h4 className="text-sm font-semibold mb-3">{t.staffDashboard.summary}</h4>
              <div className="space-y-2 text-sm">
                {isFirstVisit && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.staffDashboard.discount}</span>
                    <span className="font-semibold text-green-600">-{formatCurrency(guaranteedDiscount)}</span>
                  </div>
                )}
                {redeemAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.staffDashboard.vcRedeemed}</span>
                    <span className="font-semibold text-primary">-{formatCurrency(redeemAmount)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.staffDashboard.originalAmount}</span>
                  <span className="font-semibold">{formatCurrency(parseFloat(billAmount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.staffDashboard.discount}</span>
                  <span className="font-semibold">-{formatCurrency(totalDiscount)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="font-bold">{t.staffDashboard.finalAmount}</span>
                  <span className="font-bold text-primary text-lg">{formatCurrency(finalAmount)}</span>
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
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t.staffDashboard.processing}
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                {t.staffDashboard.processCheckout}
              </>
            )}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
