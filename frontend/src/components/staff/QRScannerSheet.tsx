import { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { X, Keyboard } from 'lucide-react';

interface QRScannerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (code: string) => void;
}

export function QRScannerSheet({ isOpen, onClose, onScanSuccess }: QRScannerSheetProps) {
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchCurrent, setTouchCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleTouchEnd = () => {
    setIsDragging(false);
    const dragDistance = touchCurrent - touchStart;
    if (dragDistance > 100) {
      onClose();
    } else {
      setTouchCurrent(touchStart);
    }
  };

  const handleScan = (detectedCodes: any[]) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const code = detectedCodes[0].rawValue;
      onScanSuccess(code);
      onClose();
    }
  };

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onScanSuccess(manualCode.trim());
      setManualCode('');
      onClose();
    }
  };

  const toggleInputMode = () => {
    setShowManualInput(!showManualInput);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 animate-in fade-in overflow-hidden"
        onClick={onClose}
        style={{ touchAction: 'none' }}
      />
      
      {/* Bottom Sheet (Mobile) / Split View (iPad Landscape) */}
      <div 
        className="fixed inset-x-0 bottom-0 md:landscape:inset-y-0 md:landscape:left-0 md:landscape:right-auto md:landscape:w-[60%] z-50 animate-in slide-in-from-bottom md:landscape:slide-in-from-left duration-300"
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
        onTouchEnd={handleTouchEnd}
      >
        <div className="bg-background rounded-t-3xl md:landscape:rounded-none md:landscape:rounded-r-3xl shadow-2xl border-t md:landscape:border-t-0 md:landscape:border-r border-border max-h-[85vh] md:landscape:max-h-full md:landscape:h-full overflow-y-auto">
          <div className="p-6 md:landscape:h-full md:landscape:flex md:landscape:flex-col">
            {/* Handle Bar (Mobile Only) */}
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-5 md:landscape:hidden"></div>
            
            {/* Header */}
            <div className="mb-5 relative">
              <button
                onClick={onClose}
                className="absolute -top-2 right-0 p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
              <h3 className="text-xl font-bold text-foreground mb-1 pr-10">
                Scan Customer QR
              </h3>
              <p className="text-sm text-muted-foreground">
                {showManualInput ? 'Enter customer code manually' : 'Point camera at customer\'s QR code'}
              </p>
            </div>

            {/* Scanner or Manual Input */}
            {!showManualInput ? (
              <div className="mb-5 md:landscape:flex-1 md:landscape:flex md:landscape:flex-col md:landscape:justify-center">
                {/* Camera Scanner Container */}
                <div className="relative bg-black rounded-2xl overflow-hidden h-[400px] md:landscape:h-[500px]">
                  <Scanner
                    onScan={handleScan}
                    onError={(error) => console.error('Scanner error:', error)}
                    constraints={{
                      facingMode: 'environment',
                    }}
                    styles={{
                      container: {
                        width: '100%',
                        height: '100%',
                      },
                      video: {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      },
                    }}
                    components={{
                      finder: false,
                    }}
                  />
                  
                  {/* Custom Corner Brackets Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="relative w-64 h-64">
                      {/* Top Left Corner */}
                      <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
                      {/* Top Right Corner */}
                      <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
                      {/* Bottom Left Corner */}
                      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
                      {/* Bottom Right Corner */}
                      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-xl"></div>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Align the QR code within the frame
                  </p>
                </div>
              </div>
            ) : (
              <div className="mb-5 md:landscape:flex-1 md:landscape:flex md:landscape:flex-col md:landscape:justify-center">
                <div>
                  <Label htmlFor="manual-code" className="text-sm font-semibold">
                    Customer Code
                  </Label>
                  <Input
                    id="manual-code"
                    type="text"
                    placeholder="CHILLI-ABC123"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                    className="mt-2 text-base md:landscape:text-lg md:landscape:h-14"
                    autoFocus
                  />
                  <Button
                    onClick={handleManualSubmit}
                    className="w-full mt-3 bg-primary hover:bg-primary/90"
                    size="lg"
                    disabled={!manualCode.trim()}
                  >
                    Verify Customer
                  </Button>
                </div>
              </div>
            )}

            {/* Toggle Input Mode */}
            <Button
              onClick={toggleInputMode}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Keyboard className="h-5 w-5 mr-2" />
              {showManualInput ? 'Switch to Camera' : 'Enter Code Manually'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
