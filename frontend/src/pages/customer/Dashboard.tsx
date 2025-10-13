import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Wallet,
  TrendingUp,
  Receipt,
  Sparkles,
  Users,
  Share2,
  Copy,
  Check,
  LogOut,
} from 'lucide-react';

export default function CustomerDashboard() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

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

  const handleCopyCode = () => {
    if (user?.referral_code) {
      navigator.clipboard.writeText(user.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || '?';

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : 'Recently';

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
    <div className="min-h-screen bg-background pb-6">
      {/* Header with Profile */}
      <div className="bg-gradient-to-br from-primary to-primary-light px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white/20">
              <AvatarImage src="" alt={user.full_name || user.email} />
              <AvatarFallback className="bg-white/10 text-primary-foreground text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground mb-1">
                {user.full_name || user.email}
              </h1>
              <Badge variant="secondary" className="bg-white/20 text-primary-foreground border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                {user.email_verified ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
          </div>
          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-xl bg-white/95 hover:bg-white shadow-lg"
            onClick={handleSignOut}
          >
            <LogOut className="h-6 w-6 text-primary" />
          </Button>
        </div>

        {/* Virtual Currency Balance Card */}
        <Card className="bg-white/95 backdrop-blur border-0 shadow-lg">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Virtual Currency</p>
                <p className="text-4xl font-bold text-foreground mb-1">
                  {formatCurrency(0)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Member since {memberSince}
                </p>
              </div>
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">Earned</p>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(0)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="h-10 w-10 rounded-lg bg-primary-light/20 flex items-center justify-center mx-auto mb-2">
                  <Receipt className="h-5 w-5 text-primary-light" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">Redeemed</p>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(0)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">Referred</p>
                <p className="text-lg font-bold text-foreground">0</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Share Your Referral Code */}
        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-primary-light/10 dark:from-primary/10 dark:to-primary-light/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Share2 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Share & Earn</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Share your code with friends. Earn rewards when they dine!
            </p>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-border/50 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Your Code
                </span>
                {copied && (
                  <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Copied!
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <p className="text-xl sm:text-2xl font-bold text-primary dark:text-primary-light font-mono flex-1 break-all">
                  {user.referral_code}
                </p>
                <Button
                  size="sm"
                  onClick={handleCopyCode}
                  className="bg-primary hover:bg-primary/90 whitespace-nowrap"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>

            <div className="mt-4 p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
              <p className="text-xs text-primary-dark dark:text-primary-light">
                💡 <strong>Tip:</strong> Share your code on social media to maximize your earnings!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions - Coming Soon */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Recent Transactions</h2>
          </div>

          <Card className="border-border/50">
            <CardContent className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Receipt className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">
                No transactions yet. Start dining at our partner restaurants to earn rewards!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
