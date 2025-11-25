import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { HeaderSkeleton } from "../../components/ui/skeleton";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { getTranslation } from "../../translations";
import { LanguageSelector } from "../../components/shared";
import { useLanguagePreference } from "../../hooks/useLanguagePreference";
import {
  SettingsPanel,
  QRScannerSheet,
  CustomerVerifiedModal,
  CheckoutSheet,
  TransactionSuccessModal,
  CustomerLookupSheet,
  EditCustomerSheet,
  ReceiptOCRSheet,
} from "../../components/staff";
import {
  Settings,
  QrCode,
  Receipt,
  CheckCircle,
  AlertCircle,
  Package,
  Edit,
  Camera,
} from "lucide-react";
import { DashboardHeader } from "../../components/shared/DashboardHeader";

interface CustomerInfo {
  id: string;
  full_name: string;
  email: string;
  referral_code: string;
  birthday?: string;
}

export default function StaffDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Language preference with database persistence
  const { language, setLanguage } = useLanguagePreference(user?.id);
  const t = getTranslation(language);

  // UI State
  const [showSettings, setShowSettings] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showCustomerLookup, setShowCustomerLookup] = useState(false);
  const [showVerified, setShowVerified] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showEditCustomer, setShowEditCustomer] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showReceiptOCR, setShowReceiptOCR] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Transaction data for success modal
  const [lastTransaction, setLastTransaction] = useState<{
    id: string;
    billAmount: number;
    discountApplied: number;
    vcRedeemed: number;
    birthdayBonus?: number;
  } | null>(null);

  // Customer Data
  const [customerData, setCustomerData] = useState<CustomerInfo | null>(null);
  const [customerWalletBalance, setCustomerWalletBalance] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    // Set loading to false once user is loaded
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const handleViewTransactions = () => {
    navigate("/staff/transactions");
  };

  const handleMenuManagement = () => {
    navigate("/staff/menu");
  };

  // Handle QR scan success
  const handleScanSuccess = async (code: string) => {
    setError("");
    setLoading(true);

    try {
      // The QR code contains the customer's user ID (UUID)
      const customerId = code.trim();

      // Look up customer by user ID
      const { data: customer, error: customerError } = await supabase
        .from("users")
        .select("id, full_name, email, referral_code, birthday")
        .eq("id", customerId)
        .eq("role", "customer")
        .single();

      if (customerError || !customer) {
        throw new Error(t.staffDashboard.customerNotFound);
      }

      // Check if today is customer's birthday
      const today = new Date();
      const customerBirthday = customer.birthday
        ? new Date(customer.birthday)
        : null;
      const isBirthdayToday =
        customerBirthday &&
        customerBirthday.getMonth() === today.getMonth() &&
        customerBirthday.getDate() === today.getDate();

      // Get customer's wallet balance
      const { data: walletData } = await supabase
        .from("customer_wallet_balance")
        .select("available_balance")
        .eq("user_id", customer.id)
        .eq("restaurant_id", user?.restaurant_id)
        .single();

      // Check if first visit to this restaurant
      const { data: visitHistory } = await supabase
        .from("customer_restaurant_history")
        .select("total_visits")
        .eq("customer_id", customer.id)
        .eq("restaurant_id", user?.restaurant_id)
        .single();

      setCustomerData(customer);
      setCustomerWalletBalance(walletData?.available_balance || 0);
      setIsFirstVisit(!visitHistory || visitHistory.total_visits === 0);
      setIsBirthday(isBirthdayToday || false);
      setShowScanner(false);
      setShowVerified(true);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(""), 5000);
      setShowScanner(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle continuing to checkout after verification
  const handleContinueToCheckout = () => {
    setShowVerified(false);
    setShowCheckout(true);
  };

  // Handle checkout submission
  const handleCheckoutSubmit = async (data: {
    billAmount: number;
    redeemAmount: number;
  }) => {
    if (!customerData || !user?.id) return;

    try {
      // Call the process_checkout_transaction function
      const { data: transactionResult, error: transactionError } =
        await supabase.rpc("process_checkout_transaction", {
          p_customer_id: customerData.id,
          p_branch_id: user.branch_id,
          p_staff_id: user.id,
          p_bill_amount: data.billAmount,
          p_virtual_currency_redeemed: data.redeemAmount,
          p_receipt_photo_url: null,
          p_saved_code_id: null,
        });

      if (transactionError) throw transactionError;

      // Calculate discount applied (5% guaranteed discount always applied)
      const discountApplied = data.billAmount * 0.05;

      // Store transaction data and show success modal
      setLastTransaction({
        id: transactionResult.transaction_id,
        billAmount: data.billAmount,
        discountApplied: discountApplied,
        vcRedeemed: data.redeemAmount,
        birthdayBonus: transactionResult.birthday_bonus || 0,
      });

      setShowCheckout(false);
      setShowSuccessModal(true);

      // Reset customer data
      setCustomerData(null);
      setCustomerWalletBalance(0);
      setIsFirstVisit(false);
      setIsBirthday(false);
    } catch (err: any) {
      setError(err.message || t.staffDashboard.transactionFailed);
      setTimeout(() => setError(""), 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-6">
        <HeaderSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-6">
      <DashboardHeader
        title={user?.full_name || user?.email || t.staffDashboard.title}
        subtitle={t.staffDashboard.subtitle}
        actions={
          <>
            <LanguageSelector
              language={language}
              onLanguageChange={setLanguage}
            />
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-xl bg-white/95 hover:bg-white shadow-lg"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="h-6 w-6 text-primary" />
            </Button>
          </>
        }
      />

      {/* Toast Notifications - Fixed Position */}
      {success && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 shadow-lg min-w-[320px]">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200 font-medium">
              {success}
            </AlertDescription>
          </Alert>
        </div>
      )}
      {error && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 shadow-lg min-w-[320px]">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-200 font-medium">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 mt-6 space-y-6">
        {/* Quick Actions */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
            {t.staffDashboard.quickActions}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Primary Action - Scan Customer QR for Checkout */}
            <Button
              onClick={() => setShowScanner(true)}
              className="h-32 md:h-36 glass-card bg-gradient-to-br from-primary to-primary-light hover:from-primary/90 hover:to-primary-light/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl flex flex-col items-center justify-center gap-4 group border-0"
              size="lg"
            >
              <QrCode className="!h-12 !w-12 md:!h-14 md:!w-14 text-white group-hover:scale-110 transition-transform duration-300" />
              <span className="text-base md:text-lg font-semibold text-white">
                {t.staffDashboard.scanForCheckout}
              </span>
            </Button>

            {/* Secondary Action - Menu Management */}
            <Button
              onClick={handleMenuManagement}
              variant="outline"
              className="h-32 md:h-36 glass-card bg-white/50 dark:bg-gray-900/50 hover:bg-white/80 dark:hover:bg-gray-900/80 border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col items-center justify-center gap-4 group"
              size="lg"
            >
              <Package className="!h-12 !w-12 md:!h-14 md:!w-14 text-primary/80 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
              <span className="text-base md:text-lg font-semibold text-primary-dark">
                {t.staffDashboard.menuItems}
              </span>
            </Button>

            {/* Secondary Action - Edit Customer */}
            <Button
              onClick={() => setShowCustomerLookup(true)}
              variant="outline"
              className="h-32 md:h-36 glass-card bg-white/50 dark:bg-gray-900/50 hover:bg-white/80 dark:hover:bg-gray-900/80 border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col items-center justify-center gap-4 group"
              size="lg"
            >
              <Edit className="!h-12 !w-12 md:!h-14 md:!w-14 text-primary/80 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
              <span className="text-base md:text-lg font-semibold text-primary-dark">
                {t.staffDashboard.editCustomer}
              </span>
            </Button>

            {/* Secondary Action - Scan Receipt */}
            <Button
              onClick={() => setShowReceiptOCR(true)}
              variant="outline"
              className="h-32 md:h-36 glass-card bg-white/50 dark:bg-gray-900/50 hover:bg-white/80 dark:hover:bg-gray-900/80 border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col items-center justify-center gap-4 group"
              size="lg"
            >
              <Camera className="!h-12 !w-12 md:!h-14 md:!w-14 text-primary/80 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
              <span className="text-base md:text-lg font-semibold text-primary-dark">
                {t.staffDashboard.scanReceipt}
              </span>
            </Button>

            {/* Secondary Action - View Transactions */}
            <Button
              onClick={handleViewTransactions}
              variant="outline"
              className="h-32 md:h-36 glass-card bg-white/50 dark:bg-gray-900/50 hover:bg-white/80 dark:hover:bg-gray-900/80 border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col items-center justify-center gap-4 group"
              size="lg"
            >
              <Receipt className="!h-12 !w-12 md:!h-14 md:!w-14 text-primary/80 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
              <span className="text-base md:text-lg font-semibold text-primary-dark">
                {t.staffDashboard.viewTransactions}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Modals and Sheets */}
      {user && (
        <SettingsPanel
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          user={user}
          onSignOut={signOut}
          language={language}
          onLanguageChange={setLanguage}
        />
      )}

      <QRScannerSheet
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleScanSuccess}
        language={language}
      />

      {customerData && (
        <>
          <CustomerVerifiedModal
            isOpen={showVerified}
            onClose={() => setShowVerified(false)}
            onContinue={handleContinueToCheckout}
            customerName={customerData.full_name}
            referralCode={customerData.referral_code}
            isBirthday={isBirthday}
            isFirstVisit={isFirstVisit}
            language={language}
          />

          <CheckoutSheet
            isOpen={showCheckout}
            onClose={() => setShowCheckout(false)}
            customerData={customerData}
            walletBalance={customerWalletBalance}
            isFirstVisit={isFirstVisit}
            language={language}
            onSubmit={handleCheckoutSubmit}
          />
        </>
      )}

      {/* Customer Lookup Sheet - For editing customer details */}
      <CustomerLookupSheet
        isOpen={showCustomerLookup}
        onClose={() => setShowCustomerLookup(false)}
        onCustomerFound={(customer) => {
          setCustomerData(customer);
          setShowEditCustomer(true);
        }}
        onScanQR={() => {
          setShowCustomerLookup(false);
          setShowScanner(true);
        }}
        language={language}
      />

      {/* Edit Customer Sheet - Separate from checkout flow */}
      {customerData && (
        <EditCustomerSheet
          isOpen={showEditCustomer}
          onClose={() => setShowEditCustomer(false)}
          customerData={customerData}
          language={language}
          onUpdate={async () => {
            // Refresh customer data from database
            try {
              const { data: updatedCustomer, error: fetchError } =
                await supabase
                  .from("users")
                  .select("id, full_name, email, referral_code, birthday")
                  .eq("id", customerData.id)
                  .single();

              if (fetchError) {
                console.error("Failed to fetch updated customer:", fetchError);
                setError(t.staffDashboard.ocr.refreshError);
                setTimeout(() => setError(""), 3000);
                return;
              }

              if (updatedCustomer) {
                setCustomerData(updatedCustomer);
                setSuccess(t.staffDashboard.customerUpdated);
                setTimeout(() => setSuccess(""), 3000);
              }
            } catch (err) {
              console.error("Failed to refresh customer data:", err);
              setError(t.staffDashboard.ocr.refreshError);
              setTimeout(() => setError(""), 3000);
            }
          }}
        />
      )}

      {/* Transaction Success Modal */}
      {lastTransaction && customerData && (
        <TransactionSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            setLastTransaction(null);
          }}
          transactionId={lastTransaction.id}
          customerName={customerData.full_name}
          billAmount={lastTransaction.billAmount}
          discountApplied={lastTransaction.discountApplied}
          vcRedeemed={lastTransaction.vcRedeemed}
          birthdayBonus={lastTransaction.birthdayBonus}
          language={language}
        />
      )}

      {/* Receipt OCR Sheet */}
      <ReceiptOCRSheet
        isOpen={showReceiptOCR}
        onClose={() => setShowReceiptOCR(false)}
        restaurantId={user?.restaurant_id || null}
        language={language}
        onExtracted={async (data) => {
          setShowReceiptOCR(false);

          // If matched transaction found, update it with OCR data
          if (data.matchedTransaction) {
            try {
              const { error: updateError } = await supabase.rpc(
                "update_transaction_with_receipt",
                {
                  p_transaction_id: data.matchedTransaction.id,
                  p_receipt_photo_url: null, // TODO: Upload photo to storage first
                  p_ocr_data: {
                    extraction: data.extraction,
                    matched_items: data.matchedItems,
                    extraction_timestamp: new Date().toISOString(),
                    ocr_version: "gemini-2.5-flash",
                  },
                }
              );

              if (updateError) throw updateError;

              const timeDiff = Math.abs(
                data.matchedTransaction.time_diff_minutes
              );
              const timeDiffText =
                timeDiff < 1 ? "<1 min" : `${Math.round(timeDiff)} mins`;

              setSuccess(
                t.staffDashboard.ocr.linkSuccess
                  .replace("{customer}", data.matchedTransaction.customer_name)
                  .replace("{timeDiff}", timeDiffText)
                  .replace("{items}", data.extraction.items.length.toString())
                  .replace(
                    "{confidence}",
                    data.extraction.confidence.toString()
                  )
              );
            } catch (err: any) {
              setError(
                t.staffDashboard.ocr.linkError.replace("{error}", err.message)
              );
              setTimeout(() => setError(""), 5000);
            }
          } else {
            // No matching transaction found
            const itemsText =
              data.extraction.items.length > 0
                ? ` | ${data.extraction.items.length} ${t.staffDashboard.items} (${data.matchedItems.length} ${t.staffDashboard.itemsMatched})`
                : "";

            setSuccess(
              t.staffDashboard.ocr.scanSuccess
                .replace("{amount}", data.amount.toFixed(2))
                .replace("{itemsText}", itemsText)
                .replace("{confidence}", data.extraction.confidence.toString())
            );
          }

          setTimeout(() => setSuccess(""), 8000);
        }}
      />
    </div>
  );
}
