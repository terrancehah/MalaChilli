import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Wallet, Info } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface VirtualCurrencyCardProps {
  balance: number;
  earned: number;
  referred: number;
  redeemed: number;
  memberSince: string;
  onInfoClick: () => void;
}

export function VirtualCurrencyCard({
  balance,
  earned,
  referred,
  redeemed,
  memberSince,
  onInfoClick
}: VirtualCurrencyCardProps) {
  return (
    <Card className="bg-white/95 backdrop-blur border-0 shadow-lg">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm text-muted-foreground">Virtual Currency</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={onInfoClick}
                className="h-5 w-5 p-0"
                title="How virtual currency works"
              >
                <Info className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <p className="text-4xl font-bold text-foreground">
              {formatCurrency(balance)}
            </p>
          </div>
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="flex items-center gap-2 pt-4 mt-2 border-t border-border/20 -mx-5 px-5 pb-4">
          <div className="text-center flex-1 bg-primary/10 rounded-lg py-3">
            <p className="text-xs text-muted-foreground mb-0.5">Earned</p>
            <p className="text-sm font-semibold text-green-600">
              {formatCurrency(earned)}
            </p>
          </div>
          <div className="text-center flex-1 bg-primary/10 rounded-lg py-3">
            <p className="text-xs text-muted-foreground mb-0.5">Referred</p>
            <p className="text-sm font-semibold text-blue-600">
              {referred}
            </p>
          </div>
          <div className="text-center flex-1 bg-primary/10 rounded-lg py-3">
            <p className="text-xs text-muted-foreground mb-0.5">Redeemed</p>
            <p className="text-sm font-semibold text-primary">
              {formatCurrency(redeemed)}
            </p>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-2">
          Member since {memberSince}
        </p>
      </CardContent>
    </Card>
  );
}
