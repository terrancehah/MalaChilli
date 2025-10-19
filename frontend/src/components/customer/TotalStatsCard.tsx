import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Info } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface TotalStatsCardProps {
  totalEarned: number;
  totalReferred: number;
  totalRedeemed: number;
  onInfoClick: () => void;
}

/**
 * Displays total VC stats across all restaurants with 3-stat layout
 * Matches the original VirtualCurrencyCard design
 */
export function TotalStatsCard({ totalEarned, totalReferred, totalRedeemed, onInfoClick }: TotalStatsCardProps) {
  return (
    <Card className="bg-white/95 backdrop-blur border-0 shadow-lg">
      <CardContent className="p-5">
        {/* Header with Info Button */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Lifetime Stats</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={onInfoClick}
            className="h-6 w-6 p-0"
            title="How virtual currency works"
          >
            <Info className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
        
        {/* Stats Row */}
        <div className="flex items-center gap-2">
          <div className="text-center flex-1 bg-primary/10 rounded-lg py-3">
            <p className="text-xs text-muted-foreground mb-0.5">Earned</p>
            <p className="text-sm font-semibold text-green-600">
              {formatCurrency(totalEarned)}
            </p>
          </div>
          <div className="text-center flex-1 bg-primary/10 rounded-lg py-3">
            <p className="text-xs text-muted-foreground mb-0.5">Referred</p>
            <p className="text-sm font-semibold text-blue-600">
              {totalReferred}
            </p>
          </div>
          <div className="text-center flex-1 bg-primary/10 rounded-lg py-3">
            <p className="text-xs text-muted-foreground mb-0.5">Redeemed</p>
            <p className="text-sm font-semibold text-primary">
              {formatCurrency(totalRedeemed)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
