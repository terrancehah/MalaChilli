import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Users, TrendingUp, Store, ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMerchants: 0,
    totalStaff: 0,
    totalTransactions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch user counts by role
        const { data: users, error: userError } = await supabase
          .from('users')
          .select('role');
          
        if (userError) throw userError;

        const { count: transactionCount, error: txError } = await supabase
          .from('transactions')
          .select('*', { count: 'exact', head: true });

        if (txError) throw txError;

        const totalUsers = users?.length || 0;
        const totalMerchants = users?.filter(u => u.role === 'owner').length || 0;
        const totalStaff = users?.filter(u => u.role === 'staff').length || 0;

        setStats({
          totalUsers,
          totalMerchants,
          totalStaff,
          totalTransactions: transactionCount || 0
        });

      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <ShieldAlert className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Super Admin</h1>
              <p className="text-xs text-gray-500">System Control Center</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {loading ? '...' : stats.totalUsers}
                </h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Merchants</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {loading ? '...' : stats.totalMerchants}
                </h3>
              </div>
              <div className="bg-purple-50 p-3 rounded-full">
                <Store className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Staff Members</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {loading ? '...' : stats.totalStaff}
                </h3>
              </div>
              <div className="bg-orange-50 p-3 rounded-full">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Transactions</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {loading ? '...' : stats.totalTransactions}
                </h3>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Management</h2>
            <div className="flex gap-4">
                <Button onClick={() => navigate('/admin/users')} className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
