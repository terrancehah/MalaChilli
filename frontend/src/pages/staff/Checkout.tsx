import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { ArrowLeft, QrCode, User, Receipt, Camera, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import type { User as UserType } from '../../types/database.types';

interface CustomerInfo {
  id: number;
  full_name: string;
  referral_code: string;
}

export default function StaffCheckout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const qrScannerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State management
  const [currentStep, setCurrentStep] = useState<'scan' | 'details' | 'discount' | 'confirm'>('scan');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Customer data
  const [customerCode, setCustomerCode] = useState('');
  const [customerData, setCustomerData] = useState<CustomerInfo | null>(null);
  const [customerWalletBalance, setCustomerWalletBalance] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  // Transaction data
  const [billAmount, setBillAmount] = useState('');
  const [redeemAmount, setRedeemAmount] = useState(0);
  const [receiptPhoto, setReceiptPhoto] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string>('');
  const [transactionNotes, setTransactionNotes] = useState('');

  // Calculations
  const [guaranteedDiscount, setGuaranteedDiscount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  // QR Scanner
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);

  // Initialize QR scanner
  useEffect(() => {
    if (currentStep === 'scan' && qrScannerRef.current) {
      const qrScanner = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );

      qrScanner.render(
        (decodedText) => {
          setCustomerCode(decodedText);
          handleVerifyCustomer(decodedText);
          qrScanner.clear();
        },
        (errorMessage) => {
          console.log('QR scan error:', errorMessage);
        }
      );

      setScanner(qrScanner);

      return () => {
        qrScanner.clear();
      };
    }
  }, [currentStep]);

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [scanner]);

  // Update calculations when bill amount changes
  useEffect(() => {
    if (billAmount && customerData) {
      calculateDiscounts(parseFloat(billAmount));
    }
  }, [billAmount, customerData, redeemAmount]);

  // Verify customer code
  const handleVerifyCustomer = async (code: string) => {
    if (!code.trim()) return;

    setLoading(true);
    setError('');

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
      setCurrentStep('details');
      setSuccess('Customer verified successfully!');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate discounts
  const calculateDiscounts = (amount: number) => {
    const bill = Math.max(0, amount);
    const guaranteed = isFirstVisit ? bill * 0.05 : 0; // 5% for first visit
    const maxRedeemable = bill * 0.20; // Max 20% of bill
    const availableBalance = customerWalletBalance;
    const redeem = Math.min(maxRedeemable, availableBalance, redeemAmount);

    const total = guaranteed + redeem;
    const final = bill - total;

    setGuaranteedDiscount(guaranteed);
    setTotalDiscount(total);
    setFinalAmount(final);
  };

  // Handle bill amount change
  const handleBillAmountChange = (amount: string) => {
    setBillAmount(amount);
    const billValue = parseFloat(amount) || 0;
    if (customerData && billValue > 0) {
      calculateDiscounts(billValue);
    } else {
      setGuaranteedDiscount(0);
      setTotalDiscount(0);
      setFinalAmount(0);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReceiptPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => setReceiptPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Submit transaction
  const handleSubmitTransaction = async () => {
    if (!customerData || !billAmount || !user?.id) return;

    setLoading(true);
    setError('');

    try {
      let receiptUrl = '';

      // Upload receipt photo if provided
      if (receiptPhoto) {
        const fileName = `receipt_${Date.now()}_${customerData.id}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, receiptPhoto);

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
          p_bill_amount: parseFloat(billAmount),
          p_virtual_currency_redeemed: redeemAmount,
          p_receipt_photo_url: receiptUrl || null,
          p_transaction_notes: transactionNotes || null
        });

      if (transactionError) throw transactionError;

      setSuccess(`Transaction completed successfully! ID: ${transactionId}`);

      // Reset form after 2 seconds
      setTimeout(() => {
        resetForm();
        navigate('/staff/dashboard');
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setCurrentStep('scan');
    setCustomerCode('');
    setCustomerData(null);
    setCustomerWalletBalance(0);
    setBillAmount('');
    setRedeemAmount(0);
    setReceiptPhoto(null);
    setReceiptPreview('');
    setTransactionNotes('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-light px-6 pt-10 pb-7 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/staff/dashboard')}
            className="text-primary-foreground hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-1">
              Process Checkout
            </h1>
            <p className="text-primary-foreground/80 text-sm">
              {currentStep === 'scan' && 'Scan customer QR or enter details'}
              {currentStep === 'details' && 'Verify customer details'}
              {currentStep === 'discount' && 'Calculate discounts'}
              {currentStep === 'confirm' && 'Confirm transaction'}
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mt-4">
          {['scan', 'details', 'discount', 'confirm'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${currentStep === step ? 'bg-white text-primary' : 'bg-white/20 text-white/60'}`}>
                {index + 1}
              </div>
              {index < 3 && <div className={`w-8 h-0.5 ${currentStep !== 'scan' && index < ['scan', 'details', 'discount', 'confirm'].indexOf(currentStep) ? 'bg-white' : 'bg-white/20'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 mt-6 space-y-6">
        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: QR Scan & Manual Entry */}
        {currentStep === 'scan' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Customer Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Scanner */}
              <div>
                <Label className="text-sm font-medium">Scan QR Code</Label>
                <div
                  id="qr-reader"
                  ref={qrScannerRef}
                  className="mt-2 border rounded-lg overflow-hidden"
                ></div>
              </div>

              <Separator />

              {/* Manual Entry */}
              <div>
                <Label htmlFor="customerCode" className="text-sm font-medium">Or Enter Customer Code</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="customerCode"
                    placeholder="e.g., CHILLI-ABC123"
                    value={customerCode}
                    onChange={(e) => setCustomerCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && handleVerifyCustomer(customerCode)}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleVerifyCustomer(customerCode)}
                    disabled={loading || !customerCode.trim()}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the customer's referral code (with or without CHILLI- prefix)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Customer Details */}
        {currentStep === 'details' && customerData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{customerData.full_name}</p>
                  <p className="text-sm text-muted-foreground">Code: {customerData.referral_code}</p>
                </div>
                {isFirstVisit && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    First Visit!
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span className="text-sm font-medium">Virtual Currency Balance</span>
                <span className="font-bold text-primary">RM {customerWalletBalance.toFixed(2)}</span>
              </div>

              <Button
                onClick={() => setCurrentStep('discount')}
                className="w-full"
              >
                Proceed to Discount Calculation
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Discount Calculation */}
        {currentStep === 'discount' && customerData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Calculate Discount
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bill Amount */}
              <div>
                <Label htmlFor="billAmount">Bill Amount (RM)</Label>
                <Input
                  id="billAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={billAmount}
                  onChange={(e) => handleBillAmountChange(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Discount Breakdown */}
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Bill Amount:</span>
                  <span>RM {parseFloat(billAmount || '0').toFixed(2)}</span>
                </div>
                {isFirstVisit && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Guaranteed Discount (5%):</span>
                    <span>-RM {guaranteedDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-blue-600">
                  <span>Virtual Currency Redemption:</span>
                  <span>-RM {redeemAmount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Final Amount:</span>
                  <span className="text-primary">RM {finalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* VC Redemption Slider */}
              <div>
                <Label>Virtual Currency to Redeem</Label>
                <div className="mt-2 space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={Math.min(customerWalletBalance, parseFloat(billAmount || '0') * 0.20)}
                    step="0.01"
                    value={redeemAmount}
                    onChange={(e) => {
                      setRedeemAmount(parseFloat(e.target.value));
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>RM 0.00</span>
                    <span>Max: RM {Math.min(customerWalletBalance, parseFloat(billAmount || '0') * 0.20).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Receipt Upload */}
              <div>
                <Label>Receipt Photo</Label>
                <div className="mt-2 space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  {receiptPreview && (
                    <div className="relative">
                      <img
                        src={receiptPreview}
                        alt="Receipt"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setReceiptPhoto(null);
                          setReceiptPreview('');
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction Notes */}
              <div>
                <Label htmlFor="notes">Transaction Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special notes about this transaction..."
                  value={transactionNotes}
                  onChange={(e) => setTransactionNotes(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button
                onClick={() => setCurrentStep('confirm')}
                disabled={!billAmount || parseFloat(billAmount) <= 0}
                className="w-full"
              >
                Review Transaction
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Confirm Transaction */}
        {currentStep === 'confirm' && customerData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Confirm Transaction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Transaction Summary */}
              <div className="space-y-3 p-4 border rounded-lg">
                <h4 className="font-medium">Transaction Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span>{customerData.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bill Amount:</span>
                    <span>RM {parseFloat(billAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Total Discount:</span>
                    <span>-RM {totalDiscount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Final Amount:</span>
                    <span className="text-primary">RM {finalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('discount')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmitTransaction}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Transaction
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
