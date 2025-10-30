import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Settings, Receipt, QrCode, AlertCircle, CheckCircle, Camera, Edit } from 'lucide-react';
import { 
  SettingsPanel, 
  QRScannerSheet, 
  CustomerVerifiedModal, 
  CheckoutSheet,
  EditCustomerSheet
} from '../../components/staff';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { HeaderSkeleton } from '../../components/ui/skeleton';

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
  
  // UI State
  const [showSettings, setShowSettings] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showVerified, setShowVerified] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showEditCustomer, setShowEditCustomer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
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

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleViewTransactions = () => {
    navigate('/staff/transactions');
  };

  // Handle QR scan success
  const handleScanSuccess = async (code: string) => {
    setError('');
    setLoading(true);

    try {
      // The QR code contains the customer's user ID (UUID)
      const customerId = code.trim();

      // Look up customer by user ID
      const { data: customer, error: customerError } = await supabase
        .from('users')
        .select('id, full_name, email, referral_code, birthday')
        .eq('id', customerId)
        .eq('role', 'customer')
        .single();

      if (customerError || !customer) {
        throw new Error('Customer not found. Please check the QR code and try again.');
      }

      // Check if today is customer's birthday
      const today = new Date();
      const customerBirthday = customer.birthday ? new Date(customer.birthday) : null;
      const isBirthdayToday = customerBirthday && 
        customerBirthday.getMonth() === today.getMonth() && 
        customerBirthday.getDate() === today.getDate();

      // Get customer's wallet balance
      const { data: walletData } = await supabase
        .from('customer_wallet_balance')
        .select('available_balance')
        .eq('user_id', customer.id)
        .eq('restaurant_id', user?.restaurant_id)
        .single();

      // Check if first visit to this restaurant
      const { data: visitHistory } = await supabase
        .from('customer_restaurant_history')
        .select('total_visits')
        .eq('customer_id', customer.id)
        .eq('restaurant_id', user?.restaurant_id)
        .single();

      setCustomerData(customer);
      setCustomerWalletBalance(walletData?.available_balance || 0);
      setIsFirstVisit(!visitHistory || visitHistory.total_visits === 0);
      setIsBirthday(isBirthdayToday || false);
      setShowScanner(false);
      setShowVerified(true);
    } catch (err: any) {
      setError(err.message);
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
      const { data: transactionId, error: transactionError } = await supabase
        .rpc('process_checkout_transaction', {
          p_customer_id: customerData.id,
          p_branch_id: user.branch_id,
          p_staff_id: user.id,
          p_bill_amount: data.billAmount,
          p_virtual_currency_redeemed: data.redeemAmount,
          p_receipt_photo_url: null,
          p_saved_code_id: null
        });

      if (transactionError) throw transactionError;

      setSuccess(`Transaction completed successfully! ID: ${transactionId}`);
      setShowCheckout(false);
      
      // Reset customer data
      setCustomerData(null);
      setCustomerWalletBalance(0);
      setIsFirstVisit(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
      throw err; // Re-throw to let CheckoutSheet handle it
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
    <div className="min-h-screen bg-background pb-6">
      <DashboardHeader
        title={user?.full_name || user?.email || 'Staff'}
        subtitle="Staff Portal"
        actions={
          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-xl bg-white/95 hover:bg-white shadow-lg"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-6 w-6 text-primary" />
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto px-6 mt-6 space-y-6">

        {/* Success/Error Messages */}
        {success && (
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              {success}
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Primary Action - Scan Customer QR for Checkout */}
            <Button
              onClick={() => setShowScanner(true)}
              className="h-32 md:h-36 bg-gradient-to-br from-primary to-primary-light hover:from-primary/90 hover:to-primary-light/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl flex flex-col items-center justify-center gap-4 group"
              size="lg"
            >
              <QrCode className="!h-12 !w-12 md:!h-14 md:!w-14 text-white group-hover:scale-110 transition-transform duration-300" />
              <span className="text-base md:text-lg font-semibold text-white">Scan for Checkout</span>
            </Button>

            {/* Secondary Action - Edit Customer */}
            <Button
              onClick={() => {
                setShowScanner(false);
                // Will implement customer lookup/edit flow
                setError('Please scan customer QR to edit their details');
              }}
              variant="outline"
              className="h-32 md:h-36 border-2 border-border hover:border-primary/50 hover:bg-primary/5 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col items-center justify-center gap-4 group"
              size="lg"
            >
              <Edit className="!h-12 !w-12 md:!h-14 md:!w-14 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
              <span className="text-base md:text-lg font-semibold text-foreground">Edit Customer</span>
            </Button>

            {/* Secondary Action - Scan Receipt */}
            <Button
              onClick={() => setError('Receipt scanning feature coming soon!')}
              variant="outline"
              className="h-32 md:h-36 border-2 border-border hover:border-primary/50 hover:bg-primary/5 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col items-center justify-center gap-4 group"
              size="lg"
            >
              <Camera className="!h-12 !w-12 md:!h-14 md:!w-14 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
              <span className="text-base md:text-lg font-semibold text-foreground">Scan Receipt</span>
            </Button>

            {/* Secondary Action - View Transactions */}
            <Button
              onClick={handleViewTransactions}
              variant="outline"
              className="h-32 md:h-36 border-2 border-border hover:border-primary/50 hover:bg-primary/5 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col items-center justify-center gap-4 group"
              size="lg"
            >
              <Receipt className="!h-12 !w-12 md:!h-14 md:!w-14 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
              <span className="text-base md:text-lg font-semibold text-foreground">View Transactions</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Modals and Sheets */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        onSignOut={handleSignOut}
      />

      <QRScannerSheet
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleScanSuccess}
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
          />

          <CheckoutSheet
            isOpen={showCheckout}
            onClose={() => setShowCheckout(false)}
            customerData={customerData}
            walletBalance={customerWalletBalance}
            isFirstVisit={isFirstVisit}
            onSubmit={handleCheckoutSubmit}
          />
        </>
      )}

      {/* Edit Customer Sheet - Separate from checkout flow */}
      {customerData && (
        <EditCustomerSheet
          isOpen={showEditCustomer}
          onClose={() => setShowEditCustomer(false)}
          customerData={customerData}
          onUpdate={() => {
            // Refresh customer data after update
            handleScanSuccess(customerData.id);
          }}
        />
      )}
    </div>
  );
}
