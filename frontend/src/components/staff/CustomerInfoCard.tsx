import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { User, Wallet, Gift } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface CustomerInfoCardProps {
  customerName: string;
  referralCode: string;
  walletBalance: number;
  isFirstVisit: boolean;
}

/**
 * Customer information card for staff checkout
 * Styled similar to VirtualCurrencyCard for consistency
 */
export function CustomerInfoCard({ 
  customerName, 
  referralCode, 
  walletBalance, 
  isFirstVisit 
}: CustomerInfoCardProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary-light/10 dark:from-primary/10 dark:to-primary-light/5 border-primary/20 shadow-sm">
      <CardContent className="p-5">
        {/* Customer Name & Code */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Customer</p>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1">
              {customerName}
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              {referralCode}
            </p>
          </div>
          {isFirstVisit && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-800/40 dark:text-green-300 border-0">
              <Gift className="h-3 w-3 mr-1" />
              First Visit
            </Badge>
          )}
        </div>

        {/* Wallet Balance */}
        <div className="bg-primary/10 rounded-lg p-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-0.5">VC Balance</p>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(walletBalance)}
            </p>
          </div>
        </div>

        {/* First Visit Bonus Info */}
        {isFirstVisit && (
          <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-xs text-green-800 dark:text-green-200 text-center">
              🎉 Eligible for 5% first visit discount
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
