import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Share2, Wallet } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { getTranslation } from '../../translations';
import type { Language } from '../../translations';

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
  last_visit_date?: string;
  total_spent?: number;
  // Virtual currency fields (restaurant-specific)
  balance?: number;
  earned?: number;
  redeemed?: number;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  getTimeAgo: (date: string) => string;
  onShare: (name: string, slug: string, code: string, balance: number, totalSpent: number) => void;
  language?: Language;
}

export function RestaurantCard({ restaurant, getTimeAgo, onShare, language = 'en' }: RestaurantCardProps) {
  const t = getTranslation(language);
  // Default values for VC fields
  const balance = restaurant.balance ?? 0;
  const totalSpent = restaurant.total_spent ?? 0;

  return (
    <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-primary-light/10 dark:from-primary/10 dark:to-primary-light/5">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">
              {restaurant.restaurant.name}
            </h3>
            {restaurant.total_visits && restaurant.last_visit_date && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {restaurant.total_visits} {restaurant.total_visits === 1 ? t.restaurantCard.visit : t.restaurantCard.visits} • Last: {getTimeAgo(restaurant.last_visit_date)}
              </p>
            )}
          </div>
          <Badge variant="outline" className="bg-green-200 text-green-800 dark:bg-green-800/40 dark:text-green-300 border-0">
            {t.restaurantCard.active}
          </Badge>
        </div>

        {/* Restaurant VC Balance - Compact Design */}
        <div className="bg-primary/5 rounded-lg p-2.5 mb-3 flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Wallet className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground leading-tight">{t.restaurantCard.vcBalance}</p>
            <p className="text-base font-bold text-foreground leading-tight">{formatCurrency(balance)}</p>
          </div>
        </div>

        <Button
          onClick={() => onShare(restaurant.restaurant.name, restaurant.restaurant.slug, restaurant.referral_code, balance, totalSpent)}
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          <Share2 className="h-4 w-4 mr-2" />
          {t.restaurantCard.share}
        </Button>
      </CardContent>
    </Card>
  );
}
