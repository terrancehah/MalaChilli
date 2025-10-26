import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { X, QrCode, Keyboard } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (code: string) => void;
}

export function QRScannerSheet({ isOpen, onClose, onScanSuccess }: QRScannerSheetProps) {
  const qrScannerRef = useRef<HTMLDivElement>(null);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchCurrent, setTouchCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize QR scanner when sheet opens
  useEffect(() => {
    if (isOpen && qrScannerRef.current && !showManualInput) {
      const qrScanner = new Html5QrcodeScanner(
        'qr-scanner-region',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );

      qrScanner.render(
        (decodedText) => {
          onScanSuccess(decodedText);
          qrScanner.clear();
          onClose();
        },
        (errorMessage) => {
          // Suppress error logging for continuous scanning
          console.debug('QR scan error:', errorMessage);
        }
      );

      setScanner(qrScanner);

      return () => {
        qrScanner.clear().catch(() => {
          // Ignore cleanup errors
        });
      };
    }
  }, [isOpen, showManualInput, onScanSuccess, onClose]);

  // Cleanup scanner on unmount or close
  useEffect(() => {
    if (!isOpen && scanner) {
      scanner.clear().catch(() => {
        // Ignore cleanup errors
      });
      setScanner(null);
    }
  }, [isOpen, scanner]);

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

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onScanSuccess(manualCode.trim());
      setManualCode('');
      onClose();
    }
  };

  const toggleInputMode = () => {
    setShowManualInput(!showManualInput);
    if (scanner) {
      scanner.clear().catch(() => {
        // Ignore cleanup errors
      });
      setScanner(null);
    }
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
        onTouchEnd={handleTouchEnd}
      >
        <div className="bg-background rounded-t-3xl shadow-2xl border-t border-border max-h-[85vh] overflow-y-auto">
          <div className="p-6">
            {/* Handle Bar */}
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-5"></div>
            
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
              <div className="mb-5">
                {/* Camera Scanner Container */}
                <div className="relative bg-black rounded-2xl overflow-hidden">
                  <div id="qr-scanner-region" ref={qrScannerRef} className="w-full"></div>
                  
                  {/* Overlay Frame */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 border-2 border-primary/30 rounded-2xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-primary rounded-2xl shadow-lg"></div>
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
              <div className="mb-5">
                <Label htmlFor="manual-code" className="text-sm font-semibold">
                  Customer Code
                </Label>
                <Input
                  id="manual-code"
                  type="text"
                  placeholder="CHILLI-ABC123"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  className="mt-2 text-base"
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
            )}

            {/* Toggle Input Mode */}
            <Button
              onClick={toggleInputMode}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {showManualInput ? (
                <>
                  <QrCode className="h-5 w-5 mr-2" />
                  Switch to Camera
                </>
              ) : (
                <>
                  <Keyboard className="h-5 w-5 mr-2" />
                  Enter Code Manually
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
