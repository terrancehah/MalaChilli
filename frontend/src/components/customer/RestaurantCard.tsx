import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Share2, Wallet } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface Restaurant {
  id: string;
  restaurant_id: string;
  restaurant: {
    name: string;
    slug: string;
  };
  referral_code: string;
  total_visits?: number;
  first_visit_date?: string;
  // Virtual currency fields (restaurant-specific)
  balance?: number;
  earned?: number;
  redeemed?: number;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  getTimeAgo: (date: string) => string;
  onShare: (name: string, slug: string, code: string, balance: number) => void;
}

export function RestaurantCard({ restaurant, getTimeAgo, onShare }: RestaurantCardProps) {
  // Default values for VC fields
  const balance = restaurant.balance ?? 0;

  return (
    <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-primary-light/10 dark:from-primary/10 dark:to-primary-light/5">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">
              {restaurant.restaurant.name}
            </h3>
            {restaurant.total_visits && restaurant.first_visit_date && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {restaurant.total_visits} {restaurant.total_visits === 1 ? 'visit' : 'visits'} • Last: {getTimeAgo(restaurant.first_visit_date)}
              </p>
            )}
          </div>
          <Badge variant="outline" className="bg-green-200 text-green-800 dark:bg-green-800/40 dark:text-green-300 border-0">
            Active
          </Badge>
        </div>

        {/* Restaurant VC Balance - Clean Minimal Design */}
        <div className="bg-primary/5 rounded-lg p-3 mb-4 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Wallet className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">VC Balance</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(balance)}</p>
          </div>
        </div>

        <Button
          onClick={() => onShare(restaurant.restaurant.name, restaurant.restaurant.slug, restaurant.referral_code, balance)}
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Restaurant
        </Button>
      </CardContent>
    </Card>
  );
}
