import QRCode from 'react-qr-code';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

export function QRCodeModal({ isOpen, onClose, userId, userName }: QRCodeModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-2xl max-w-md w-full shadow-2xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="relative mb-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">Your QR Code</h3>
              <p className="text-sm text-muted-foreground">
                Show this to staff when making a transaction
              </p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-0 right-0 h-6 w-6 p-0 hover:bg-muted rounded-md transition-colors flex items-center justify-center"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* QR Code */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-4">
            <QRCode
              value={userId}
              size={220}
              level="H"
            />
          </div>

          {/* User Info */}
          <div className="text-center mb-6">
            <p className="font-semibold text-foreground mb-1">
              {userName}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              ID: {userId.substring(0, 8)}...
            </p>
          </div>

          <Button
            onClick={onClose}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
