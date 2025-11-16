import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Skeleton, CardSkeleton } from '../../components/ui/skeleton';
import { ArrowLeft, Receipt, ArrowDown, ArrowUp, Calendar } from 'lucide-react';
import { getTranslation, type Language } from '../../translations';
import { LanguageSelector } from '../../components/shared';
import { TransactionDetailSheet } from '../../components/staff';

interface Transaction {
  id: string;
  created_at: string;
  transaction_date: string;
  bill_amount: string;
  final_amount: string;
  guaranteed_discount_amount: string;
  virtual_currency_redeemed: string;
  is_first_transaction: boolean;
  ocr_processed: boolean;
  ocr_data: any;
  customer: {
    full_name: string;
    email: string;
  } | null;
}

export default function StaffTransactions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>('en');
  const t = getTranslation(language);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'1' | '7' | '30' | 'all'>('7');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailSheet, setShowDetailSheet] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.branch_id) return;

      try {
        let startDate: Date | undefined;
        
        if (dateRange !== 'all') {
          startDate = new Date();
          const days = parseInt(dateRange);
          startDate.setDate(startDate.getDate() - days);
          startDate.setHours(0, 0, 0, 0);
        }

        let query = supabase
          .from('transactions')
          .select(`
            id,
            created_at,
            transaction_date,
            bill_amount,
            final_amount,
            guaranteed_discount_amount,
            virtual_currency_redeemed,
            is_first_transaction,
            ocr_processed,
            ocr_data,
            customer:users!transactions_customer_id_fkey (
              full_name,
              email
            )
          `)
          .eq('branch_id', user.branch_id);

        if (startDate) {
          query = query.gte('created_at', startDate.toISOString());
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        
        // Transform data: Supabase returns customer as array, extract first element
        let transformedData = (data || []).map((transaction: any) => ({
          ...transaction,
          customer: Array.isArray(transaction.customer) 
            ? transaction.customer[0] || null 
            : transaction.customer
        }));
        
        // Apply sorting
        transformedData.sort((a, b) => {
          let comparison = 0;
          
          switch (sortBy) {
            case 'date':
              comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
              break;
            case 'amount':
              comparison = parseFloat(b.bill_amount) - parseFloat(a.bill_amount);
              break;
          }
          
          return sortOrder === 'desc' ? comparison : -comparison;
        });
        
        setTransactions(transformedData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user, dateRange, sortBy, sortOrder]);

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    // Convert to Malaysia timezone (UTC+8)
    const malaysiaTime = new Date(date.getTime() + (8 * 60 * 60 * 1000));
    
    return {
      date: malaysiaTime.toLocaleDateString('en-MY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      time: malaysiaTime.toLocaleTimeString('en-MY', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-6">
        <div className="bg-gradient-to-br from-primary to-primary-light px-6 pt-10 pb-7 rounded-b-3xl">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-md bg-white/20" />
            <div>
              <Skeleton className="h-7 w-40 mb-2 bg-white/20" />
              <Skeleton className="h-4 w-32 bg-white/20" />
            </div>
          </div>
        </div>

        <div className="px-6 mt-6 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <CardSkeleton key={index} lines={2} showAvatar />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-light px-6 pt-10 pb-7 rounded-b-3xl">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/staff/dashboard')}
            className="text-primary-foreground hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-1">
              {t.staffDashboard.transactions}
            </h1>
            <p className="text-primary-foreground/80 text-sm">
              {transactions.length} {t.staffDashboard.transaction}{transactions.length !== 1 ? 's' : ''}
            </p>
          </div>
          <LanguageSelector language={language} onLanguageChange={setLanguage} />
        </div>
      </div>

      {/* Date Range and Sorting Controls */}
      <div className="px-6 mt-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Date Range */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <span className="text-sm font-medium hidden sm:block">{t.staffDashboard.period}:</span>
              <div className="flex gap-1 flex-wrap">
                {[
                  { value: '1', label: '1D', labelFull: t.staffDashboard.oneDay },
                  { value: '7', label: '7D', labelFull: t.staffDashboard.sevenDays },
                  { value: '30', label: '30D', labelFull: t.staffDashboard.thirtyDays },
                  { value: 'all', label: t.staffDashboard.all, labelFull: t.staffDashboard.all }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDateRange(option.value as any)}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${
                      dateRange === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                    title={option.labelFull}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium hidden sm:block">{t.staffDashboard.sortBy}:</span>
              <div className="flex gap-1">
                {[
                  { value: 'date', label: t.staffDashboard.date },
                  { value: 'amount', label: t.staffDashboard.amount }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (sortBy === option.value) {
                        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                      } else {
                        setSortBy(option.value as any);
                        setSortOrder('desc');
                      }
                    }}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition-colors flex items-center gap-1 ${
                      sortBy === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <span>{option.label}</span>
                    {sortBy === option.value && (
                      sortOrder === 'desc' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-6 space-y-4">
        {transactions.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Receipt className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">
                {t.staffDashboard.noTransactions}
              </p>
            </CardContent>
          </Card>
        ) : (
          transactions.map((transaction) => (
            <Card 
              key={transaction.id} 
              className="border-border/50 cursor-pointer hover:border-primary/50 transition-colors active:scale-[0.98]"
              onClick={() => {
                setSelectedTransaction(transaction);
                setShowDetailSheet(true);
              }}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground mb-1">
                      {transaction.customer?.full_name || transaction.customer?.email}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDateTime(transaction.created_at).date}</span>
                      <span>•</span>
                      <span>{formatDateTime(transaction.created_at).time}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      {parseFloat(transaction.guaranteed_discount_amount) > 0 && (
                        <span className="text-green-600 dark:text-green-400">
                          {t.staffDashboard.discount}: RM {parseFloat(transaction.guaranteed_discount_amount).toFixed(2)}
                        </span>
                      )}
                      {parseFloat(transaction.virtual_currency_redeemed) > 0 && (
                        <span className="text-blue-600 dark:text-blue-400">
                          {t.staffDashboard.vcRedeemed}: RM {parseFloat(transaction.virtual_currency_redeemed).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground text-lg">
                      RM {parseFloat(transaction.bill_amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.staffDashboard.totalAmount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Transaction Detail Sheet */}
      <TransactionDetailSheet
        isOpen={showDetailSheet}
        onClose={() => {
          setShowDetailSheet(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
        language={language}
      />
    </div>
  );
}
