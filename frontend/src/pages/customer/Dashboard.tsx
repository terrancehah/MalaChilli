import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import QRCode from 'react-qr-code';
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
  QrCode as QrCodeIcon,
} from 'lucide-react';

// TypeScript interface for restaurant code
interface RestaurantCode {
  id: string;
  restaurant_id: string;
  referral_code: string;
  restaurant: {
    name: string;
    slug: string;
  };
}

// Interface for visited restaurant (eligible for code generation)
interface VisitedRestaurant {
  restaurant_id: string;
  first_visit_date: string;
  total_visits: number;
  total_spent: string;
  restaurant: {
    name: string;
    slug: string;
  };
}

export default function CustomerDashboard() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [restaurantCodes, setRestaurantCodes] = useState<RestaurantCode[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(true);
  const [visitedRestaurants, setVisitedRestaurants] = useState<VisitedRestaurant[]>([]);
  const [generating, setGenerating] = useState<string | null>(null);

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

  // Fetch user's restaurant-specific codes AND visited restaurants
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoadingCodes(true);
      try {
        // Fetch existing codes
        const { data: codesData, error: codesError } = await supabase
          .from('user_restaurant_referral_codes')
          .select(`
            id,
            restaurant_id,
            referral_code,
            restaurants (
              name,
              slug
            )
          `)
          .eq('user_id', user.id)
          .eq('is_active', true);
        
        if (codesError) throw codesError;
        
        // Transform codes data
        const transformedCodes: RestaurantCode[] = (codesData || []).map((item: any) => ({
          id: item.id,
          restaurant_id: item.restaurant_id,
          referral_code: item.referral_code,
          restaurant: item.restaurants[0] || { name: 'Unknown', slug: 'unknown' }
        }));
        
        setRestaurantCodes(transformedCodes);
        
        // Fetch visited restaurants (from customer_restaurant_history)
        const { data: visitedData, error: visitedError } = await supabase
          .from('customer_restaurant_history')
          .select(`
            restaurant_id,
            first_visit_date,
            total_visits,
            total_spent,
            restaurants (
              name,
              slug
            )
          `)
          .eq('customer_id', user.id);
        
        if (visitedError) throw visitedError;
        
        // Transform visited data
        const transformedVisited: VisitedRestaurant[] = (visitedData || []).map((item: any) => ({
          restaurant_id: item.restaurant_id,
          first_visit_date: item.first_visit_date,
          total_visits: item.total_visits,
          total_spent: item.total_spent,
          restaurant: item.restaurants[0] || { name: 'Unknown', slug: 'unknown' }
        }));
        
        setVisitedRestaurants(transformedVisited);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingCodes(false);
      }
    };
    
    fetchData();
  }, [user]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleGenerateCode = async (restaurantId: string) => {
    if (!user) return;
    
    setGenerating(restaurantId);
    try {
      const { error } = await supabase.rpc('generate_restaurant_referral_code', {
        p_user_id: user.id,
        p_restaurant_id: restaurantId
      });
      
      if (error) throw error;
      
      // Refresh codes list
      const { data: updatedCodes, error: fetchError } = await supabase
        .from('user_restaurant_referral_codes')
        .select(`
          id,
          restaurant_id,
          referral_code,
          restaurants (
            name,
            slug
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      if (fetchError) throw fetchError;
      
      const transformedData: RestaurantCode[] = (updatedCodes || []).map((item: any) => ({
        id: item.id,
        restaurant_id: item.restaurant_id,
        referral_code: item.referral_code,
        restaurant: item.restaurants[0] || { name: 'Unknown', slug: 'unknown' }
      }));
      
      setRestaurantCodes(transformedData);
    } catch (error: any) {
      console.error('Error generating code:', error);
      alert(error.message || 'Failed to generate code');
    } finally {
      setGenerating(null);
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
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-xl bg-white/95 hover:bg-white shadow-lg"
              onClick={() => setShowQR(!showQR)}
            >
              <QrCodeIcon className="h-6 w-6 text-primary" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-xl bg-white/95 hover:bg-white shadow-lg"
              onClick={handleSignOut}
            >
              <LogOut className="h-6 w-6 text-primary" />
            </Button>
          </div>
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

        {/* Restaurant-Specific Referral Codes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Promote Restaurants</h2>
              <p className="text-sm text-muted-foreground">Share codes for restaurants you've visited</p>
            </div>
          </div>

          {loadingCodes ? (
            <Card className="border-border/50">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground text-sm">Loading restaurants...</p>
              </CardContent>
            </Card>
          ) : visitedRestaurants.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="p-12 text-center">
                <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Share2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm mb-2">
                  No visited restaurants yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Visit a restaurant and make your first transaction to start promoting!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {/* Show existing codes */}
              {restaurantCodes.map((code) => (
                <Card key={code.id} className="border-border/50 bg-gradient-to-br from-primary/5 to-primary-light/10 dark:from-primary/10 dark:to-primary-light/5">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {code.restaurant.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Share this code to promote {code.restaurant.name}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-0">
                        Active
                      </Badge>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-border/50 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">
                          Your Code
                        </span>
                        {copied === code.referral_code && (
                          <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            Copied!
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <p className="text-lg sm:text-xl font-bold text-primary dark:text-primary-light font-mono flex-1 break-all">
                          {code.referral_code}
                        </p>
                        <Button
                          size="sm"
                          onClick={() => handleCopyCode(code.referral_code)}
                          className="bg-primary hover:bg-primary/90 whitespace-nowrap"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
                      <p className="text-xs text-primary-dark dark:text-primary-light break-all">
                        🔗 Share link: <strong>{window.location.origin}/join/{code.restaurant.slug}/{code.referral_code}</strong>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Show visited restaurants WITHOUT codes yet */}
              {visitedRestaurants
                .filter(visited => !restaurantCodes.some(code => code.restaurant_id === visited.restaurant_id))
                .map((visited) => (
                  <Card key={visited.restaurant_id} className="border-border/50">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {visited.restaurant.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Visited {visited.total_visits} time{visited.total_visits > 1 ? 's' : ''} • Spent RM{visited.total_spent}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-0">
                          Eligible
                        </Badge>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                        <p className="text-sm text-muted-foreground mb-3 text-center">
                          Generate your unique referral code to start promoting this restaurant
                        </p>
                        <Button
                          onClick={() => handleGenerateCode(visited.restaurant_id)}
                          disabled={generating === visited.restaurant_id}
                          className="w-full bg-primary hover:bg-primary/90"
                        >
                          {generating === visited.restaurant_id ? (
                            <>Generating...</>
                          ) : (
                            <>
                              <Share2 className="h-4 w-4 mr-2" />
                              Generate Referral Code
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>

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

      {/* QR Code Modal - For Staff to Scan at Counter */}
      {showQR && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowQR(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Your Customer ID
              </h2>
              <p className="text-sm text-muted-foreground mb-6 text-center">
                Show this QR code to staff at the counter for transactions
              </p>
              
              {/* QR Code */}
              <div className="bg-white p-6 rounded-xl shadow-lg mb-4">
                <QRCode
                  value={user.id}
                  size={220}
                  level="H"
                />
              </div>

              {/* User Info */}
              <div className="text-center mb-6">
                <p className="font-semibold text-foreground mb-1">
                  {user.full_name || user.email}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  ID: {user.id.substring(0, 8)}...
                </p>
              </div>

              <Button
                onClick={() => setShowQR(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
