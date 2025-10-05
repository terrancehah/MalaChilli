import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../lib/utils';

export default function CustomerDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ShareSaji</h1>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.full_name || user.nickname || 'there'}! 👋
          </h2>
          <p className="mt-2 text-gray-600">Here's your dashboard overview</p>
        </div>

        {/* Virtual Currency Balance Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-white mb-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium">Your Balance</p>
              <p className="text-4xl font-bold mt-2">{formatCurrency(0)}</p>
              <p className="text-blue-100 text-sm mt-1">Virtual Currency</p>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-xs font-medium">Your Code</p>
              <p className="text-xl font-bold">{user.referral_code}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Earned</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(0)}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Redeemed</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(0)}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Friends Referred</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
          </div>
        </div>

        {/* Share Your Code Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Share Your Referral Code</h3>
          <p className="text-gray-600 mb-4">
            Share your code with friends and earn rewards when they dine!
          </p>
          
          <div className="flex gap-4">
            <input
              type="text"
              readOnly
              value={user.referral_code}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
            <button
              onClick={() => navigator.clipboard.writeText(user.referral_code)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Copy Code
            </button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Coming Soon:</strong> Share your referral link and QR code on social media!
            </p>
          </div>
        </div>

        {/* Recent Orders Placeholder */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No orders yet</p>
            <p className="text-sm mt-2">Visit a participating restaurant to get started!</p>
          </div>
        </div>
      </main>
    </div>
  );
}
