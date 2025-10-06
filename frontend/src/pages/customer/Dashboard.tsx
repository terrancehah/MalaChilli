import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  TrendingUp,
  Receipt,
  ChevronRight,
  Sparkles,
  QrCode,
  Users,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { useState } from 'react';

// Mock data - will be replaced with real API calls
const mockData = {
  balance: 0,
  totalEarned: 0,
  totalRedeemed: 0,
  friendsReferred: 0,
  memberSince: 'Jan 2024',
  recentTransactions: [
    // Will be populated from database
  ],
};

export default function CustomerDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleCopyCode = () => {
    if (user?.referral_code) {
      navigator.clipboard.writeText(user.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const initials = user.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || user.nickname?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header with Profile */}
      <div className="bg-gradient-to-br from-primary to-blue-600 px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white/20">
              <AvatarImage src="" alt={user.full_name || user.nickname || ''} />
              <AvatarFallback className="bg-white/10 text-primary-foreground text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground mb-1">
                {user.full_name || user.nickname || 'Welcome'}
              </h1>
              <Badge variant="secondary" className="bg-white/20 text-primary-foreground border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                Member
              </Badge>
            </div>
          </div>
          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-xl bg-white/95 hover:bg-white shadow-lg"
            onClick={() => {}}
          >
            <QrCode className="h-6 w-6 text-primary" />
          </Button>
        </div>

        {/* Virtual Currency Balance Card */}
        <Card className="bg-white/95 backdrop-blur border-0 shadow-lg">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Virtual Currency</p>
                <p className="text-4xl font-bold text-foreground mb-1">
                  {formatCurrency(mockData.balance)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Member since {mockData.memberSince}
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
                  {formatCurrency(mockData.totalEarned)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center mx-auto mb-2">
                  <Receipt className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">Redeemed</p>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(mockData.totalRedeemed)}
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
                <p className="text-lg font-bold text-foreground">
                  {mockData.friendsReferred}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Share Your Referral Code */}
        <Card className="border-border/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Share2 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Share & Earn</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Share your code with friends. Earn 1% when they dine!
            </p>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-border/50">
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
                <p className="text-xl sm:text-2xl font-bold text-primary dark:text-blue-400 font-mono flex-1 break-all">
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

            <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
              <p className="text-xs text-blue-800 dark:text-blue-300">
                💡 <strong>Tip:</strong> Share your link on social media to maximize your earnings!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Recent Transactions</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {mockData.recentTransactions.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="p-12">
                <div className="text-center text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium mb-1">No transactions yet</p>
                  <p className="text-sm">
                    Visit a participating restaurant to start earning!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {/* Transactions will be mapped here */}
            </div>
          )}
        </div>

        {/* Sign Out Button */}
        <div className="pt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
