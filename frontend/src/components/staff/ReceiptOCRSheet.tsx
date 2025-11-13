import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { X, Upload, Camera, Loader2, CheckCircle, AlertCircle, Package } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { supabase } from '../../lib/supabase';
import { extractReceiptData } from '../../lib/ocrExtraction';
import { batchMatchItems } from '../../lib/fuzzyMatch';
import type { OCRExtractionResult, MenuItem, MatchedMenuItem } from '../../types/ocr.types';

interface ReceiptOCRSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onExtracted: (data: {
    amount: number;
    extraction: OCRExtractionResult;
    matchedItems: MatchedMenuItem[];
  }) => void;
}

export function ReceiptOCRSheet({
  isOpen,
  onClose,
  onExtracted
}: ReceiptOCRSheetProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [extraction, setExtraction] = useState<OCRExtractionResult | null>(null);
  const [matchedItems, setMatchedItems] = useState<MatchedMenuItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Load menu items on mount
  useEffect(() => {
    if (isOpen) {
      loadMenuItems();
    }
  }, [isOpen]);

  // Load available menu items from database
  const loadMenuItems = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('menu_items')
        .select('id, name, category, price, unit, is_available')
        .eq('is_available', true)
        .eq('is_active', true);

      if (fetchError) throw fetchError;
      setMenuItems(data || []);
    } catch (err) {
      console.error('Failed to load menu items:', err);
    }
  };

  // Process image with Tesseract OCR
  const processImage = async (file: File) => {
    setIsProcessing(true);
    setError('');
    setExtractedText('');
    setExtraction(null);
    setMatchedItems([]);
    setProgress(0);

    try {
      // Create Tesseract worker
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      // Recognize text from image
      const { data: { text } } = await worker.recognize(file);
      
      setExtractedText(text);

      // Extract structured data from text
      const extractionResult = extractReceiptData(text);
      setExtraction(extractionResult);
      
      // Match items with menu database
      if (extractionResult.items.length > 0 && menuItems.length > 0) {
        const matches = batchMatchItems(extractionResult.items, menuItems, 60);
        
        const matchedItemsList: MatchedMenuItem[] = matches
          .filter(m => m.match !== null)
          .map((m) => ({
            menuItemId: m.match!.menuItem.id,
            menuItemName: m.match!.menuItem.name,
            matchedName: m.ocrItem.name,
            confidence: m.match!.confidence,
            quantity: m.ocrItem.quantity,
            unitPrice: m.ocrItem.unitPrice,
            total: m.ocrItem.total,
            lineNumber: m.ocrItem.lineNumber
          }));
        
        setMatchedItems(matchedItemsList);
      }
      
      if (extractionResult.totals.total === 0 && extractionResult.items.length === 0) {
        setError('Could not extract receipt data. Please try again with a clearer image.');
      }

      await worker.terminate();
    } catch (err: any) {
      console.error('OCR Error:', err);
      setError('Failed to process receipt. Please try again or enter amount manually.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processImage(file);
    }
  };

  // Handle confirm
  const handleConfirm = () => {
    if (extraction && extraction.totals.total > 0) {
      onExtracted({
        amount: extraction.totals.total,
        extraction,
        matchedItems
      });
      handleClose();
    }
  };

  // Handle close
  const handleClose = () => {
    setExtractedText('');
    setExtraction(null);
    setMatchedItems([]);
    setError('');
    setProgress(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Sheet */}
      <div className="relative bg-background w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Scan Receipt</h2>
          <button
            onClick={handleClose}
            className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="text-center text-sm text-muted-foreground">
            Upload or take a photo of the receipt to automatically extract the total amount
          </div>

          {/* Upload Buttons */}
          {!isProcessing && !extraction && (
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="h-32 flex-col gap-3 border-2 hover:border-primary/50 hover:bg-primary/5"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-semibold">Upload Photo</span>
              </Button>

              <Button
                onClick={() => cameraInputRef.current?.click()}
                variant="outline"
                className="h-32 flex-col gap-3 border-2 hover:border-primary/50 hover:bg-primary/5"
              >
                <Camera className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-semibold">Take Photo</span>
              </Button>
            </div>
          )}

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Processing State */}
          {isProcessing && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground mb-2">
                  Processing receipt...
                </p>
                <p className="text-xs text-muted-foreground">
                  {progress}% complete
                </p>
              </div>
              <div className="w-full max-w-xs bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success State */}
          {extraction && extraction.totals.total > 0 && !isProcessing && (
            <div className="space-y-4">
              {/* Total Amount */}
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                    Receipt processed! (Confidence: {extraction.confidence}%)
                  </p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                    RM {extraction.totals.total.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Extracted Items */}
              {extraction.items.length > 0 && (
                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Package className="h-4 w-4" />
                    <span>{extraction.items.length} items detected</span>
                    {matchedItems.length > 0 && (
                      <span className="text-xs text-muted-foreground ml-auto">
                        {matchedItems.length} matched
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {extraction.items.map((item, idx) => {
                      const matched = matchedItems.find(m => m.lineNumber === item.lineNumber);
                      return (
                        <div key={idx} className="flex justify-between items-start text-xs bg-background rounded-lg p-2">
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item.name}</p>
                            {matched && (
                              <p className="text-[10px] text-green-600 dark:text-green-400">
                                ✓ Matched: {matched.menuItemName} ({matched.confidence}%)
                              </p>
                            )}
                          </div>
                          <div className="text-right ml-2">
                            <p className="font-semibold text-foreground">RM {item.total.toFixed(2)}</p>
                            <p className="text-[10px] text-muted-foreground">{item.quantity}x @ RM{item.unitPrice.toFixed(2)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Date/Time if extracted */}
              {extraction.dateTime && (
                <div className="text-xs text-muted-foreground text-center">
                  Receipt Date: {extraction.dateTime.date} {extraction.dateTime.time}
                </div>
              )}

              {/* Extracted Text Preview */}
              {extractedText && (
                <details className="group">
                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                    View raw OCR text
                  </summary>
                  <div className="mt-2 p-3 bg-muted rounded-lg text-xs font-mono text-muted-foreground max-h-32 overflow-y-auto">
                    {extractedText}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Confirm & Use Data
                </Button>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isProcessing && (
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                  Detection Failed
                </p>
                <p className="text-xs text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-muted/50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-foreground">Tips for better results:</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Ensure good lighting</li>
              <li>Keep receipt flat and in focus</li>
              <li>Capture the entire receipt</li>
              <li>Avoid shadows and glare</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
