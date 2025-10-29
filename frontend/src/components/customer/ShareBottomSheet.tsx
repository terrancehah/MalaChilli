import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Share2, Copy, Check, X } from 'lucide-react';

// Social Media Icons
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

interface ShareBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: {
    name: string;
    slug: string;
    code: string;
    balance: number;
    totalSpent?: number;
  } | null;
}

export function ShareBottomSheet({ isOpen, onClose, restaurant }: ShareBottomSheetProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchCurrent, setTouchCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender || !restaurant) return null;

  const handleCopyLink = () => {
    const link = `${window.location.origin}/join/${restaurant.slug}/${restaurant.code}`;
    navigator.clipboard.writeText(link);
    setCopied('link');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(restaurant.code);
    setCopied('code');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleShareWhatsApp = () => {
    const link = `${window.location.origin}/join/${restaurant.slug}/${restaurant.code}`;
    const message = `Hey! I love ${restaurant.name}. Join me there and get a discount: ${link}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onClose();
  };

  const handleShareFacebook = () => {
    const link = `${window.location.origin}/join/${restaurant.slug}/${restaurant.code}`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
    window.open(url, '_blank');
    onClose();
  };

  const handleNativeShare = async () => {
    const link = `${window.location.origin}/join/${restaurant.slug}/${restaurant.code}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join me at ${restaurant.name}`,
          text: `Check out ${restaurant.name}!`,
          url: link
        });
        onClose();
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const dragDistance = touchCurrent - touchStart;
    if (dragDistance > 100) {
      onClose();
    } else {
      setTouchCurrent(touchStart);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 overflow-hidden ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        style={{ touchAction: 'none' }}
      />
      
      {/* Bottom Sheet */}
      <div 
        className="fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-out"
        style={{
          transform: isDragging && touchCurrent > touchStart 
            ? `translateY(${touchCurrent - touchStart}px)` 
            : isAnimating ? 'translateY(0)' : 'translateY(100%)',
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
        onTouchEnd={handleTouchEnd}
      >
        <div className="bg-background rounded-t-3xl shadow-2xl border-t border-border max-h-[85vh] overflow-y-auto">
          <div className="p-6 pt-4">
            {/* Close Button - Top Right */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors z-10"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
            
            {/* Handle Bar */}
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4"></div>
            
            {/* Header */}
            <div className="mb-5">
              <h3 className="text-xl font-bold text-foreground mb-1">
                Share {restaurant.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Choose how you'd like to share this restaurant
              </p>
            </div>

            {/* Referral Link Section */}
            <div className="mb-5">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Referral Link
              </label>
              <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                <p className="text-xs font-mono text-muted-foreground break-all leading-relaxed mb-3">
                  {window.location.origin}/join/{restaurant.slug}/{restaurant.code}
                </p>
                <Button
                  onClick={handleCopyLink}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  {copied === 'link' ? (
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
            <div className="mb-5">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Share via Social Media
              </label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={handleShareWhatsApp}
                  className="bg-[#25D366] hover:bg-[#20BA5A] text-white border-0 flex flex-col items-center justify-center h-20 gap-2"
                >
                  <WhatsAppIcon />
                  <span className="text-xs">WhatsApp</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShareFacebook}
                  className="bg-[#1877F2] hover:bg-[#0C63D4] text-white border-0 flex flex-col items-center justify-center h-20 gap-2"
                >
                  <FacebookIcon />
                  <span className="text-xs">Facebook</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNativeShare}
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
              <div className="bg-muted/50 rounded-lg p-2.5 border border-border/50">
                <div className="flex items-center justify-between gap-3">
                  <code className="text-base font-mono text-foreground flex-1">
                    {restaurant.code}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyCode}
                    className="shrink-0"
                  >
                    {copied === 'code' ? (
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
  );
}
