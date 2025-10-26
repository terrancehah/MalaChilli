import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Settings, Receipt, Users, QrCode, AlertCircle, CheckCircle } from 'lucide-react';
import { 
  SettingsPanel, 
  QRScannerSheet, 
  CustomerVerifiedModal, 
  CheckoutSheet 
} from '../../components/staff';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { StatsCard } from '../../components/shared/StatsCard';

interface CustomerInfo {
  id: number;
  full_name: string;
  referral_code: string;
}

export default function StaffDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // UI State
  const [showSettings, setShowSettings] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showVerified, setShowVerified] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  // Stats
  const [stats, setStats] = useState({
    todayTransactions: 0,
    todayRegistrations: 0,
    todayCustomersHelped: 0,
  });
  
  // Customer Data
  const [customerData, setCustomerData] = useState<CustomerInfo | null>(null);
  const [customerWalletBalance, setCustomerWalletBalance] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Fetch today's stats
    const fetchStats = async () => {
      if (!user?.id) return;

      try {
        // Fetch all transactions for this restaurant
        const { data: allTransactions } = await supabase
          .from('transactions')
          .select('customer_id')
          .eq('staff_id', user.id)
          .order('created_at', { ascending: false });

        // Fetch today's transactions
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { data: todayTransactions } = await supabase
          .from('transactions')
          .select('customer_id')
          .eq('staff_id', user.id)
          .gte('created_at', today.toISOString());

        // Fetch customers registered through this staff's transactions
        const customerIds = [...new Set(allTransactions?.map(t => t.customer_id) || [])];
        const todayCustomerIds = [...new Set(todayTransactions?.map(t => t.customer_id) || [])];

        setStats({
          todayTransactions: todayTransactions?.length || 0,
          todayRegistrations: todayCustomerIds.length,
          todayCustomersHelped: customerIds.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
      // Format code (remove prefix if present)
      const formattedCode = code.replace(/^CHILLI-/, '').toUpperCase();

      // Look up customer by referral code
      const { data: customer, error: customerError } = await supabase
        .from('users')
        .select('id, full_name, referral_code')
        .eq('referral_code', `CHILLI-${formattedCode}`)
        .single();

      if (customerError || !customer) {
        throw new Error('Customer not found. Please check the code and try again.');
      }

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
    receiptPhoto: File | null;
    notes: string;
  }) => {
    if (!customerData || !user?.id) return;

    try {
      let receiptUrl = '';

      // Upload receipt photo if provided
      if (data.receiptPhoto) {
        const fileName = `receipt_${Date.now()}_${customerData.id}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, data.receiptPhoto);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('receipts')
          .getPublicUrl(fileName);

        receiptUrl = publicUrl;
      }

      // Call the process_checkout_transaction function
      const { data: transactionId, error: transactionError } = await supabase
        .rpc('process_checkout_transaction', {
          p_customer_id: customerData.id,
          p_branch_id: user.branch_id,
          p_staff_id: user.id,
          p_bill_amount: data.billAmount,
          p_virtual_currency_redeemed: data.redeemAmount,
          p_receipt_photo_url: receiptUrl || null,
          p_transaction_notes: data.notes || null
        });

      if (transactionError) throw transactionError;

      setSuccess(`Transaction completed successfully! ID: ${transactionId}`);
      setShowCheckout(false);
      
      // Reset customer data
      setCustomerData(null);
      setCustomerWalletBalance(0);
      setIsFirstVisit(false);

      // Refresh stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: todayTransactions } = await supabase
        .from('transactions')
        .select('customer_id')
        .eq('staff_id', user.id)
        .gte('created_at', today.toISOString());

      setStats(prev => ({
        ...prev,
        todayTransactions: todayTransactions?.length || 0,
      }));

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
      throw err; // Re-throw to let CheckoutSheet handle it
    }
  };

  const staffStats = [
    {
      label: 'Transactions',
      value: stats.todayTransactions,
      icon: <Receipt className="h-6 w-6 md:h-7 md:w-7 text-blue-600 dark:text-blue-400" />,
    },
    {
      label: 'New Sign-ups',
      value: stats.todayRegistrations,
      icon: <Users className="h-6 w-6 md:h-7 md:w-7 text-green-600 dark:text-green-400" />,
    },
    {
      label: 'Customers Helped',
      value: stats.todayCustomersHelped,
      icon: <Users className="h-6 w-6 md:h-7 md:w-7 text-purple-600 dark:text-purple-400" />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      <DashboardHeader
        user={user}
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

      <div className="max-w-7xl mx-auto px-6 -mt-20 md:-mt-24 space-y-6">
        <StatsCard stats={staffStats} />

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Button
              onClick={() => setShowScanner(true)}
              className="h-20 md:h-24 text-base md:text-lg bg-primary hover:bg-primary/90 font-semibold"
              size="lg"
            >
              <QrCode className="!h-12 !w-12 md:!h-14 md:!w-14 mr-3" />
              Scan Customer QR
            </Button>

            <Button
              onClick={handleViewTransactions}
              variant="outline"
              className="h-20 md:h-24 text-base md:text-lg font-semibold"
              size="lg"
            >
              <Receipt className="!h-12 !w-12 md:!h-14 md:!w-14 mr-3" />
              View Transactions
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
    </div>
  );
}
