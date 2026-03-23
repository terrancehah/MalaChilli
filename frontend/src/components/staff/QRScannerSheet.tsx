import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "../ui/drawer";
import { Keyboard } from "lucide-react";
import { getTranslation, type Language } from "../../translations";

interface QRScannerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (code: string) => void;
  language?: Language;
}

export function QRScannerSheet({ isOpen, onClose, onScanSuccess, language = "en" }: QRScannerSheetProps) {
  const t = getTranslation(language);
  const [manualCode, setManualCode] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);

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
      setManualCode("");
      onClose();
    }
  };

  const toggleInputMode = () => {
    setShowManualInput(!showManualInput);
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <div className="overflow-y-auto px-6 pb-6">
          {/* Header */}
          <DrawerHeader className="px-0 pt-2">
            <DrawerTitle className="text-xl font-bold text-foreground">{t.staffDashboard.scanQR}</DrawerTitle>
            <DrawerDescription>
              {showManualInput ? "Enter customer code manually" : "Point your camera at the customer's QR code"}
            </DrawerDescription>
          </DrawerHeader>

          {/* Scanner or Manual Input */}
          {!showManualInput ? (
            <div className="mb-5">
              {/* Camera Scanner Container */}
              <div className="relative bg-black rounded-2xl overflow-hidden h-[400px]">
                <Scanner
                  onScan={handleScan}
                  onError={(error) => console.error("Scanner error:", error)}
                  constraints={{
                    facingMode: "environment",
                  }}
                  styles={{
                    container: {
                      width: "100%",
                      height: "100%",
                    },
                    video: {
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
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
                <p className="text-sm text-muted-foreground">Align the QR code within the frame</p>
              </div>
            </div>
          ) : (
            <div className="mb-5">
              <div>
                <Label htmlFor="manual-code" className="text-sm font-semibold">
                  Customer Code
                </Label>
                <Input
                  id="manual-code"
                  type="text"
                  placeholder="MAKAN-ABC123"
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
            </div>
          )}

          {/* Toggle Input Mode */}
          <Button onClick={toggleInputMode} variant="outline" className="w-full" size="lg">
            <Keyboard className="h-5 w-5 mr-2" />
            {showManualInput ? "Switch to Camera" : "Enter Code Manually"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
