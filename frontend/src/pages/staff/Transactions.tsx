import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { ArrowLeft, Receipt } from 'lucide-react';

interface Transaction {
  id: string;
  created_at: string;
  bill_amount: string;
  guaranteed_discount_amount: string;
  virtual_currency_redeemed: string;
  customer: {
    full_name: string;
    email: string;
  } | null;
}

export default function StaffTransactions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.branch_id) return;

      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
          .from('transactions')
          .select(`
            id,
            created_at,
            bill_amount,
            guaranteed_discount_amount,
            virtual_currency_redeemed,
            customer:users!transactions_customer_id_fkey (
              full_name,
              email
            )
          `)
          .eq('branch_id', user.branch_id)
          .gte('created_at', today.toISOString())
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Transform data: Supabase returns customer as array, extract first element
        const transformedData = (data || []).map((transaction: any) => ({
          ...transaction,
          customer: Array.isArray(transaction.customer) 
            ? transaction.customer[0] || null 
            : transaction.customer
        }));
        
        setTransactions(transformedData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-MY', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

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
              Today's Transactions
            </h1>
            <p className="text-primary-foreground/80 text-sm">
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </p>
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
                No transactions today
              </p>
            </CardContent>
          </Card>
        ) : (
          transactions.map((transaction) => (
            <Card key={transaction.id} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground mb-1">
                      {transaction.customer?.full_name || transaction.customer?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(transaction.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground text-lg">
                      RM {parseFloat(transaction.bill_amount).toFixed(2)}
                    </p>
                    {parseFloat(transaction.guaranteed_discount_amount) > 0 && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        -RM {parseFloat(transaction.guaranteed_discount_amount).toFixed(2)} discount
                      </p>
                    )}
                    {parseFloat(transaction.virtual_currency_redeemed) > 0 && (
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        -RM {parseFloat(transaction.virtual_currency_redeemed).toFixed(2)} VC
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
