import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Skeleton, HeaderSkeleton } from '../../components/ui/skeleton';
import { LogOut, Receipt, Users, DollarSign, TrendingUp } from 'lucide-react';

export default function OwnerDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    todayRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.restaurant_id) return;

      try {
        // Fetch all transactions for this restaurant
        const { data: allTransactions } = await supabase
          .from('transactions')
          .select('bill_amount, created_at, customer_id')
          .eq('staff_id', user.id) // This should actually join through branches table
          .order('created_at', { ascending: false });

        // Fetch today's transactions
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { data: todayTransactions } = await supabase
          .from('transactions')
          .select('bill_amount')
          .eq('staff_id', user.id)
          .gte('created_at', today.toISOString());

        // Fetch unique customers (referral chains for this restaurant)
        const { data: customers } = await supabase
          .from('referrals')
          .select('downline_id', { count: 'exact', head: true })
          .eq('restaurant_id', user.restaurant_id);

        const totalRevenue = allTransactions?.reduce((sum, t) => sum + parseFloat(t.bill_amount || '0'), 0) || 0;
        const todayRev = todayTransactions?.reduce((sum, t) => sum + parseFloat(t.bill_amount || '0'), 0) || 0;

        setStats({
          totalCustomers: customers?.length || 0,
          totalTransactions: allTransactions?.length || 0,
          totalRevenue: totalRevenue,
          todayRevenue: todayRev,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-6">
        <HeaderSkeleton />
        <div className="px-6 mt-6 space-y-6">
          {/* Owner stats skeleton - 2x2 grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-6 w-20 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
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
              Owner Dashboard
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                  <Receipt className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">RM {stats.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Revenue</p>
                  <p className="text-2xl font-bold text-foreground">RM {stats.todayRevenue.toFixed(2)}</p>
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
              onClick={() => navigate('/owner/customers')}
              variant="outline"
              className="h-20 text-lg"
              size="lg"
            >
              <Users className="h-6 w-6 mr-2" />
              View Customers
            </Button>

            <Button
              onClick={() => navigate('/owner/transactions')}
              variant="outline"
              className="h-20 text-lg"
              size="lg"
            >
              <Receipt className="h-6 w-6 mr-2" />
              View Transactions
            </Button>
          </div>
        </div>

        {/* Coming Soon */}
        <Card className="border-border/50">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground text-sm">
              More analytics coming soon: Revenue charts, customer acquisition trends, referral network visualization
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
