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

// Sample user data for demo
const demoUser = {
  id: 'demo-123',
  email: 'sarah.chen@example.com',
  full_name: 'Sarah Chen',
  nickname: 'Sarah',
  birthday: '1995-03-15',
  age: 29,
  referral_code: 'SAJI-ABC123',
  role: 'customer' as const,
  is_email_verified: true,
  email_notifications_enabled: true,
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z',
};

// Sample data
const mockData = {
  balance: 45.80,
  totalEarned: 125.50,
  totalRedeemed: 79.70,
  friendsReferred: 12,
  memberSince: 'Jan 2024',
  recentTransactions: [
    {
      id: '1',
      date: 'Today, 12:30 PM',
      restaurant: 'Nasi Lemak Corner',
      amount: 28.50,
      currency_earned: 1.42,
      type: 'earn' as const,
    },
    {
      id: '2',
      date: 'Yesterday, 7:15 PM',
      restaurant: 'Mama\'s Kitchen',
      amount: 42.00,
      currency_redeemed: 10.00,
      type: 'redeem' as const,
    },
    {
      id: '3',
      date: 'Mar 8, 1:20 PM',
      restaurant: 'Satay Station',
      amount: 24.50,
      currency_earned: 0.98,
      type: 'earn' as const,
    },
  ],
};

export default function DemoDashboard() {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(demoUser.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const initials = demoUser.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Demo Banner */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-6 py-3">
        <p className="text-center text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Demo Mode</strong> - This is a preview with sample data. Database not connected.
        </p>
      </div>

      {/* Header with Profile */}
      <div className="bg-gradient-to-br from-primary to-blue-600 px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white/20">
              <AvatarImage src="" alt={demoUser.full_name} />
              <AvatarFallback className="bg-white/10 text-primary-foreground text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground mb-1">
                {demoUser.full_name}
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
                  {demoUser.referral_code}
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

          <div className="space-y-3">
            {mockData.recentTransactions.map((transaction) => (
              <Card key={transaction.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'earn' 
                          ? 'bg-green-500/10' 
                          : 'bg-orange-500/10'
                      }`}>
                        <Receipt className={`h-5 w-5 ${
                          transaction.type === 'earn' 
                            ? 'text-green-600' 
                            : 'text-orange-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {transaction.restaurant}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {formatCurrency(transaction.amount)}
                      </p>
                      <Badge 
                        variant={transaction.type === 'earn' ? 'default' : 'secondary'}
                        className={transaction.type === 'earn' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                        }
                      >
                        {transaction.type === 'earn' ? '+' : '-'}
                        {formatCurrency(
                          transaction.type === 'earn' 
                            ? transaction.currency_earned! 
                            : transaction.currency_redeemed!
                        )}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Back to Home */}
        <div className="pt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.href = '/'}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
