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
  Receipt,
  Sparkles,
  Share2,
  Copy,
  Check,
  LogOut,
  QrCode as QrCodeIcon,
  Info,
  X,
} from 'lucide-react';

// Social Media Icons as SVG components
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="!h-5 !w-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="!h-5 !w-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// TypeScript interface for restaurant code
interface RestaurantCode {
  id: string;
  restaurant_id: string;
  referral_code: string;
  restaurant: {
    name: string;
    slug: string;
  };
  total_visits?: number;
  first_visit_date?: string;
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

// Helper function to calculate time ago
const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'today';
  if (diffInDays === 1) return 'yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }
  const months = Math.floor(diffInDays / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
};

export default function CustomerDashboard() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showCurrencyInfoModal, setShowCurrencyInfoModal] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<{
    name: string;
    slug: string;
    code: string;
  } | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchCurrent, setTouchCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [restaurantCodes, setRestaurantCodes] = useState<RestaurantCode[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(true);
  const [visitedRestaurants, setVisitedRestaurants] = useState<VisitedRestaurant[]>([]);
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  // Prevent body scroll when bottom sheet is open
  useEffect(() => {
    if (showShareSheet) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showShareSheet]);

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
        // Fetch visited restaurants first (from customer_restaurant_history)
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
        
        // Transform visited data into a map for easy lookup
        const visitHistoryMap = new Map();
        (visitedData || []).forEach((item: any) => {
          visitHistoryMap.set(item.restaurant_id, {
            first_visit_date: item.first_visit_date,
            total_visits: item.total_visits,
            total_spent: item.total_spent,
          });
        });
        
        // Fetch existing referral codes
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
        
        // Transform codes data and merge with visit history
        const transformedCodes: RestaurantCode[] = (codesData || []).map((item: any) => {
          const visitInfo = visitHistoryMap.get(item.restaurant_id);
          return {
            id: item.id,
            restaurant_id: item.restaurant_id,
            referral_code: item.referral_code,
            restaurant: item.restaurants[0] || { name: 'Unknown', slug: 'unknown' },
            total_visits: visitInfo?.total_visits,
            first_visit_date: visitInfo?.first_visit_date,
          };
        });
        
        setRestaurantCodes(transformedCodes);
        
        // Transform visited data for eligible restaurants
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

  const handleCopyLink = (slug: string, code: string) => {
    const link = `${window.location.origin}/join/${slug}/${code}`;
    navigator.clipboard.writeText(link);
    setCopied(`link-${code}`);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(`code-${code}`);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleShareWhatsApp = (name: string, slug: string, code: string) => {
    const link = `${window.location.origin}/join/${slug}/${code}`;
    const message = `Hey! I love ${name}. Join me there and get a discount: ${link}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleShareFacebook = (slug: string, code: string) => {
    const link = `${window.location.origin}/join/${slug}/${code}`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async (name: string, slug: string, code: string) => {
    const link = `${window.location.origin}/join/${slug}/${code}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join me at ${name}`,
          text: `Check out ${name}!`,
          url: link
        });
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else {
      handleCopyLink(slug, code);
    }
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
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm text-muted-foreground">Virtual Currency</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCurrencyInfoModal(true)}
                    className="h-5 w-5 p-0"
                    title="How virtual currency works"
                  >
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                <p className="text-4xl font-bold text-foreground">
                  {formatCurrency(0)}
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
                  {formatCurrency(0)}
                </p>
              </div>
              <div className="text-center flex-1 bg-primary/10 rounded-lg py-3">
                <p className="text-xs text-muted-foreground mb-0.5">Referred</p>
                <p className="text-sm font-semibold text-blue-600">
                  0
                </p>
              </div>
              <div className="text-center flex-1 bg-primary/10 rounded-lg py-3">
                <p className="text-xs text-muted-foreground mb-0.5">Redeemed</p>
                <p className="text-sm font-semibold text-primary">
                  {formatCurrency(0)}
                </p>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground text-center mt-2">
              Member since {memberSince}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {/* Restaurant-Specific Referral Codes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Promote Restaurants</h2>
              <p className="text-sm text-muted-foreground">Share codes for restaurants you've visited</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInfoModal(true)}
              className="h-8 w-8 p-0"
              title="How it works"
            >
              <Info className="h-5 w-5 text-muted-foreground" />
            </Button>
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
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {code.restaurant.name}
                        </h3>
                        {code.total_visits && code.first_visit_date && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {code.total_visits} {code.total_visits === 1 ? 'visit' : 'visits'} • Last: {getTimeAgo(code.first_visit_date)}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="bg-green-200 text-green-800 dark:bg-green-800/40 dark:text-green-300 border-0">
                        Active
                      </Badge>
                    </div>

                    {/* Single Share Button */}
                    <Button
                      onClick={() => {
                        setSelectedRestaurant({
                          name: code.restaurant.name,
                          slug: code.restaurant.slug,
                          code: code.referral_code
                        });
                        setShowShareSheet(true);
                      }}
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Restaurant
                    </Button>
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

      {/* Bottom Sheet for Sharing Options */}
      {showShareSheet && selectedRestaurant && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 animate-in fade-in overflow-hidden"
            onClick={() => setShowShareSheet(false)}
            style={{ touchAction: 'none' }}
          />
          
          {/* Bottom Sheet */}
          <div 
            className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300"
            style={{
              transform: isDragging && touchCurrent > touchStart 
                ? `translateY(${touchCurrent - touchStart}px)` 
                : 'translateY(0)',
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
            onTouchStart={(e) => {
              setTouchStart(e.targetTouches[0].clientY);
              setTouchCurrent(e.targetTouches[0].clientY);
              setIsDragging(true);
            }}
            onTouchMove={(e) => {
              if (isDragging) {
                const current = e.targetTouches[0].clientY;
                if (current > touchStart) {
                  setTouchCurrent(current);
                }
              }
            }}
            onTouchEnd={() => {
              setIsDragging(false);
              const dragDistance = touchCurrent - touchStart;
              if (dragDistance > 100) {
                setShowShareSheet(false);
              } else {
                setTouchCurrent(touchStart);
              }
            }}
          >
            <div className="bg-background rounded-t-3xl shadow-2xl border-t border-border max-h-[85vh] overflow-y-auto">
              <div className="p-6">
                {/* Handle Bar */}
                <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6"></div>
                
                {/* Header */}
                <div className="mb-6 relative">
                  <button
                    onClick={() => setShowShareSheet(false)}
                    className="absolute -top-2 right-0 p-2 hover:bg-muted rounded-full transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                  <h3 className="text-xl font-bold text-foreground mb-1 pr-10">
                    Share {selectedRestaurant.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose how you'd like to share this restaurant
                  </p>
                </div>

                {/* Referral Link Section */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Referral Link
                  </label>
                  <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                    <p className="text-xs font-mono text-muted-foreground break-all leading-relaxed mb-3">
                      {window.location.origin}/join/{selectedRestaurant.slug}/{selectedRestaurant.code}
                    </p>
                    <Button
                      onClick={() => handleCopyLink(selectedRestaurant.slug, selectedRestaurant.code)}
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      {copied === `link-${selectedRestaurant.code}` ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Link Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Social Share Options */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Share via Social Media
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleShareWhatsApp(selectedRestaurant.name, selectedRestaurant.slug, selectedRestaurant.code);
                        setShowShareSheet(false);
                      }}
                      className="bg-[#25D366] hover:bg-[#20BA5A] text-white border-0 flex flex-col items-center justify-center h-20 gap-2"
                    >
                      <WhatsAppIcon />
                      <span className="text-xs">WhatsApp</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleShareFacebook(selectedRestaurant.slug, selectedRestaurant.code);
                        setShowShareSheet(false);
                      }}
                      className="bg-[#1877F2] hover:bg-[#0C63D4] text-white border-0 flex flex-col items-center justify-center h-20 gap-2"
                    >
                      <FacebookIcon />
                      <span className="text-xs">Facebook</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleNativeShare(selectedRestaurant.name, selectedRestaurant.slug, selectedRestaurant.code);
                        setShowShareSheet(false);
                      }}
                      className="bg-muted hover:bg-muted/80 text-foreground border border-border flex flex-col items-center justify-center h-20 gap-2"
                    >
                      <Share2 className="h-5 w-5" />
                      <span className="text-xs">More</span>
                    </Button>
                  </div>
                </div>

                {/* Promotion Code Section */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Promotion Code
                  </label>
                  <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                    <div className="flex items-center justify-between gap-3">
                      <code className="text-base font-mono text-foreground flex-1">
                        {selectedRestaurant.code}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyCode(selectedRestaurant.code)}
                        className="shrink-0"
                      >
                        {copied === `code-${selectedRestaurant.code}` ? (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </>
      )}

      {/* Restaurant Promotion Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowInfoModal(false)}
        >
          <div
            className="bg-background rounded-2xl max-w-lg w-full shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="relative mb-6">
                <h3 className="text-xl font-bold text-foreground leading-none pt-2">How It Works</h3>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="absolute top-0 right-0 h-6 w-6 p-0 hover:bg-muted rounded-md transition-colors flex items-center justify-center"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="text-sm">
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Visit a restaurant and make a transaction to unlock promotion for that restaurant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Generate your unique referral code for each restaurant you've visited</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Share your referral link with friends via WhatsApp, Facebook, or copy the link</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>When someone uses your link and makes their first transaction at that restaurant, you both earn virtual currency</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => setShowInfoModal(false)}
                className="w-full mt-6"
              >
                Got it!
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Virtual Currency Info Modal */}
      {showCurrencyInfoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowCurrencyInfoModal(false)}
        >
          <div
            className="bg-background rounded-2xl max-w-lg w-full shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="relative mb-6">
                <h3 className="text-xl font-bold text-foreground leading-none pt-2">Virtual Currency</h3>
                <button
                  onClick={() => setShowCurrencyInfoModal(false)}
                  className="absolute top-0 right-0 h-6 w-6 p-0 hover:bg-muted rounded-md transition-colors flex items-center justify-center"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="text-sm">
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Redeem your virtual currency for discounts at participating restaurants</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Check your balance and transaction history in the dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>The more friends you refer, the more you earn!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span><strong>Earned:</strong> Total virtual currency you've earned from referrals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span><strong>Referred:</strong> Number of friends you've successfully referred</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span><strong>Redeemed:</strong> Total amount you've used for discounts</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => setShowCurrencyInfoModal(false)}
                className="w-full mt-6"
              >
                Got it!
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowQR(false)}
        >
          <div
            className="bg-background rounded-2xl max-w-md w-full shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Your QR Code</h3>
                <p className="text-sm text-muted-foreground">
                  Show this to staff when making a transaction
                </p>
              </div>

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
