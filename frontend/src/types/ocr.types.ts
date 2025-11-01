// OCR Types for Receipt Processing
// Date: 2025-11-01

/**
 * Individual line item extracted from receipt
 */
export interface OCRLineItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  lineNumber: number;
}

/**
 * Matched menu item with confidence score
 */
export interface MatchedMenuItem {
  menuItemId: string;
  menuItemName: string;
  matchedName: string;  // Original OCR name
  confidence: number;  // 0-100
  quantity: number;
  unitPrice: number;
  total: number;
  lineNumber: number;
}

/**
 * Receipt totals section
 */
export interface OCRTotals {
  subtotal: number;
  tax?: number;
  serviceCharge?: number;
  total: number;
}

/**
 * Date and time from receipt
 */
export interface OCRDateTime {
  date: string;  // YYYY-MM-DD format
  time: string;  // HH:MM:SS format
  raw: string;   // Original text
}

/**
 * Complete OCR extraction result
 */
export interface OCRExtractionResult {
  items: OCRLineItem[];
  totals: OCRTotals;
  dateTime?: OCRDateTime;
  confidence: number;  // Overall confidence 0-100
  rawText: string;     // Full OCR text for debugging
}

/**
 * OCR data structure stored in transactions.ocr_data JSONB field
 */
export interface TransactionOCRData {
  extraction: OCRExtractionResult;
  matched_items: MatchedMenuItem[];
  extraction_timestamp: string;  // ISO timestamp
  ocr_version: string;  // e.g., "tesseract-5.1.1"
}

/**
 * Transaction item for database insertion
 */
export interface TransactionItemInsert {
  transaction_id: string;
  menu_item_id: string | null;
  item_name: string;
  matched_name: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  line_number: number;
  is_matched: boolean;
  match_confidence: number | null;
  source: 'ocr' | 'manual' | 'corrected';
}

/**
 * Menu item from database
 */
export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number | null;
  unit: string | null;
  is_available: boolean;
}

/**
 * Fuzzy match result
 */
export interface FuzzyMatchResult {
  menuItem: MenuItem;
  confidence: number;  // 0-100
  distance: number;    // Levenshtein distance
}
