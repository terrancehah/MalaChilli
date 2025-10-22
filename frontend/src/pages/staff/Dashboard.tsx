import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { LogOut, Receipt, Users } from 'lucide-react';

export default function StaffDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todayTransactions: 0,
    todayRegistrations: 0,
    todayCustomersHelped: 0,
  });
  const [loading, setLoading] = useState(true);

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

  const handleCheckout = () => {
    navigate('/staff/checkout');
  };

  const handleViewTransactions = () => {
    navigate('/staff/transactions');
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
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-1">
              Staff Portal
            </h1>
            <p className="text-primary-foreground/80 text-sm">
              {user?.full_name || user?.email}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSignOut}
            className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-6 space-y-6">
        {/* Today's Stats - Staff Focused */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Receipt className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transactions Today</p>
                  <p className="text-2xl font-bold text-foreground">{stats.todayTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">New Registrations Today</p>
                  <p className="text-2xl font-bold text-foreground">{stats.todayRegistrations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Customers Helped</p>
                  <p className="text-2xl font-bold text-foreground">{stats.todayCustomersHelped}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleCheckout}
              className="h-24 text-lg bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Receipt className="h-6 w-6 mr-2" />
              Process Checkout
            </Button>

            <Button
              onClick={handleViewTransactions}
              variant="outline"
              className="h-24 text-lg"
              size="lg"
            >
              <Receipt className="h-6 w-6 mr-2" />
              View Transactions
            </Button>
          </div>
        </div>

        {/* Staff-Focused Coming Soon */}
        <Card className="border-border/50">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground text-sm">
              Coming soon: QR code scanner, customer verification, discount calculator, receipt upload
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
