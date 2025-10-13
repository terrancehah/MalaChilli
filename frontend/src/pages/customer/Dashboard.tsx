import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

export default function CustomerDashboard() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCopyReferralCode = () => {
    if (user?.referral_code) {
      navigator.clipboard.writeText(user.referral_code);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    }
  };

  const shareUrl = user?.referral_code
    ? `${window.location.origin}/join/malchilli/${user.referral_code}`
    : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              MalaChilli
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Welcome, {user.full_name}!
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <p className="text-base text-gray-900 dark:text-white mt-1">
                  {user.full_name || 'Not set'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <p className="text-base text-gray-900 dark:text-white mt-1">
                  {user.email}
                </p>
                {!user.email_verified && (
                  <Badge variant="outline" className="mt-1">
                    Not Verified
                  </Badge>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Birthday
                </label>
                <p className="text-base text-gray-900 dark:text-white mt-1">
                  {user.birthday
                    ? new Date(user.birthday).toLocaleDateString()
                    : 'Not set'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Referral Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Code</CardTitle>
              <CardDescription>Share with friends to earn rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* QR Code */}
              <div className="flex justify-center p-4 bg-white dark:bg-gray-900 rounded-lg">
                {user.referral_code && (
                  <QRCode
                    value={shareUrl}
                    size={180}
                    level="H"
                    className="w-full h-auto max-w-[180px]"
                  />
                )}
              </div>

              {/* Referral Code */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Code
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded font-mono text-lg">
                    {user.referral_code}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyReferralCode}
                  >
                    {copying ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              {/* Share Link */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Share Link
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 break-all">
                  {shareUrl}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Virtual Currency Wallet</CardTitle>
              <CardDescription>
                Earn rewards when your referrals make purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  RM 0.00
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Available Balance
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                  Start referring friends to earn rewards!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
