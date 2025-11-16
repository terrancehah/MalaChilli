// Enhanced OCR Extraction Utilities
// Extracts structured data from receipt text

import type { OCRLineItem, OCRTotals, OCRDateTime, OCRExtractionResult } from '../types/ocr.types';

/**
 * Extract date and time from receipt text
 */
export function extractDateTime(text: string): OCRDateTime | undefined {
  const lines = text.split('\n');
  
  // Common date patterns
  const datePatterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,  // DD/MM/YYYY or DD-MM-YYYY
    /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,    // YYYY/MM/DD
    /(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{2,4})/i
  ];
  
  // Common time patterns
  const timePatterns = [
    /(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?/i,
    /(\d{1,2})\.(\d{2})(?:\.(\d{2}))?/
  ];
  
  let dateMatch: RegExpMatchArray | null = null;
  let timeMatch: RegExpMatchArray | null = null;
  let rawDateTime = '';
  
  // Search for date and time in text
  for (const line of lines) {
    if (!dateMatch) {
      for (const pattern of datePatterns) {
        const match = line.match(pattern);
        if (match) {
          dateMatch = match;
          rawDateTime += line + ' ';
          break;
        }
      }
    }
    
    if (!timeMatch) {
      for (const pattern of timePatterns) {
        const match = line.match(pattern);
        if (match) {
          timeMatch = match;
          rawDateTime += line;
          break;
        }
      }
    }
    
    if (dateMatch && timeMatch) break;
  }
  
  if (!dateMatch) return undefined;
  
  // Parse date
  let year: number, month: number, day: number;
  
  if (dateMatch[0].match(/^\d{4}/)) {
    // YYYY/MM/DD format
    year = parseInt(dateMatch[1]);
    month = parseInt(dateMatch[2]);
    day = parseInt(dateMatch[3]);
  } else if (dateMatch[2] && dateMatch[2].match(/[a-z]/i)) {
    // DD MMM YYYY format
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    day = parseInt(dateMatch[1]);
    month = monthNames.indexOf(dateMatch[2].toLowerCase().substring(0, 3)) + 1;
    year = parseInt(dateMatch[3]);
  } else {
    // DD/MM/YYYY format (Malaysian standard)
    day = parseInt(dateMatch[1]);
    month = parseInt(dateMatch[2]);
    year = parseInt(dateMatch[3]);
  }
  
  // Handle 2-digit year
  if (year < 100) {
    year += year < 50 ? 2000 : 1900;
  }
  
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
  // Parse time
  let timeStr = '00:00:00';
  if (timeMatch) {
    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const seconds = timeMatch[3] ? parseInt(timeMatch[3]) : 0;
    const meridiem = timeMatch[4]?.toLowerCase();
    
    // Convert to 24-hour format
    if (meridiem === 'pm' && hours < 12) hours += 12;
    if (meridiem === 'am' && hours === 12) hours = 0;
    
    timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  
  return {
    date: dateStr,
    time: timeStr,
    raw: rawDateTime.trim()
  };
}

/**
 * Extract line items from receipt text
 */
export function extractLineItems(text: string): OCRLineItem[] {
  const lines = text.split('\n');
  const items: OCRLineItem[] = [];
  let lineNumber = 1;
  
  // Patterns for line items
  // Format: [quantity] [name] [price]
  // Examples:
  // "2 Chicken Wing 35.80"
  // "1x Beef Chuck 24.90"
  // "Enoki Mushroom x3 9.90"
  // "Adult RM71 80" (space in price due to OCR error)
  const itemPatterns = [
    // Pattern for "Name RM## ##" (OCR space in price)
    /^(.+?)\s+rm\s*(\d+)\s+(\d{2})$/i,
    // Pattern for quantity with 'x': "2x Item Name RM12.34"
    /^(\d+\.?\d*)\s*x\s+(.+?)\s+(?:rm\s*)?(\d+\.?\d{0,2})$/i,
    // Pattern for name with quantity: "Item Name x2 RM12.34"
    /^(.+?)\s+x\s*(\d+\.?\d*)\s+(?:rm\s*)?(\d+\.?\d{0,2})$/i,
    // Pattern for quantity first: "2 Item Name 12.34"
    /^(\d+\.?\d*)\s+(.+?)\s+(?:rm\s*)?(\d+\.?\d{0,2})$/i,
    // Pattern with @ separator: "2 Item @ RM12.34 RM24.68"
    /^(\d+\.?\d*)\s+(.+?)\s+(?:@|at)\s*(?:rm\s*)?(\d+\.?\d{0,2})\s+(?:rm\s*)?(\d+\.?\d{0,2})$/i
  ];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines and common headers/footers
    if (!trimmed || 
        trimmed.length < 3 ||
        /^(total|subtotal|tax|service|payment|cash|change|thank|receipt)/i.test(trimmed)) {
      continue;
    }
    
    // Try each pattern
    for (let i = 0; i < itemPatterns.length; i++) {
      const pattern = itemPatterns[i];
      const match = trimmed.match(pattern);
      if (match) {
        let quantity: number, name: string, price: number;
        
        if (i === 0) {
          // Pattern 0: "Name RM## ##" (OCR space in price)
          name = match[1].trim();
          quantity = 1;
          price = parseFloat(`${match[2]}.${match[3]}`);
        } else if (i === 1 || i === 3 || i === 4) {
          // Patterns with quantity first
          quantity = parseFloat(match[1]);
          name = match[2].trim();
          price = parseFloat(match[match.length - 1]);
        } else {
          // Patterns with name first (i === 2)
          name = match[1].trim();
          quantity = parseFloat(match[2]);
          price = parseFloat(match[3]);
        }
        
        // Validate
        if (quantity > 0 && quantity <= 100 && price > 0 && price < 10000 && name.length > 2) {
          const unitPrice = price / quantity;
          
          items.push({
            name,
            quantity,
            unitPrice: Math.round(unitPrice * 100) / 100,
            total: Math.round(price * 100) / 100,
            lineNumber: lineNumber++
          });
        }
        
        break;
      }
    }
  }
  
  return items;
}

/**
 * Extract totals from receipt text
 */
export function extractTotals(text: string): OCRTotals {
  const lines = text.split('\n');
  
  let subtotal: number | undefined;
  let tax: number | undefined;
  let serviceCharge: number | undefined;
  let total: number | undefined;
  
  // Patterns for totals
  const subtotalPattern = /(?:sub\s*total|subtotal)[:\s]*(?:rm\s*)?(\d+\.?\d{0,2})/i;
  const taxPattern = /(?:tax|gst|sst)[:\s]*(?:rm\s*)?(\d+\.?\d{0,2})/i;
  const servicePattern = /(?:service|svc)[:\s]*(?:rm\s*)?(\d+\.?\d{0,2})/i;
  const totalPattern = /(?:^|\s)(?:total|grand\s*total)[:\s]*(?:rm\s*)?(\d+\.?\d{0,2})/i;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (!total) {
      const match = trimmed.match(totalPattern);
      if (match) {
        total = parseFloat(match[1]);
      }
    }
    
    if (!subtotal) {
      const match = trimmed.match(subtotalPattern);
      if (match) {
        subtotal = parseFloat(match[1]);
      }
    }
    
    if (!tax) {
      const match = trimmed.match(taxPattern);
      if (match) {
        tax = parseFloat(match[1]);
      }
    }
    
    if (!serviceCharge) {
      const match = trimmed.match(servicePattern);
      if (match) {
        serviceCharge = parseFloat(match[1]);
      }
    }
  }
  
  // If no total found, try to find any amount at the end
  if (!total) {
    const lastLines = lines.slice(-5).reverse();
    for (const line of lastLines) {
      const match = line.match(/(?:rm\s*)?(\d+\.?\d{2})/i);
      if (match) {
        const amount = parseFloat(match[1]);
        if (amount > 0 && amount < 10000) {
          total = amount;
          break;
        }
      }
    }
  }
  
  return {
    subtotal: subtotal || total || 0,
    tax,
    serviceCharge,
    total: total || 0
  };
}

/**
 * Calculate overall confidence score
 */
function calculateConfidence(items: OCRLineItem[], totals: OCRTotals, dateTime?: OCRDateTime): number {
  let confidence = 0;
  
  // Items found: +40 points
  if (items.length > 0) {
    confidence += 40;
    // More items = higher confidence (up to +10)
    confidence += Math.min(items.length * 2, 10);
  }
  
  // Total found: +30 points
  if (totals.total > 0) {
    confidence += 30;
  }
  
  // Items total matches receipt total: +15 points
  if (items.length > 0 && totals.total > 0) {
    const itemsTotal = items.reduce((sum, item) => sum + item.total, 0);
    const difference = Math.abs(itemsTotal - totals.total);
    if (difference < 0.10) {
      confidence += 15;
    } else if (difference < 1.00) {
      confidence += 10;
    } else if (difference < 5.00) {
      confidence += 5;
    }
  }
  
  // Date/time found: +5 points
  if (dateTime) {
    confidence += 5;
  }
  
  return Math.min(confidence, 100);
}

/**
 * Main extraction function
 */
export function extractReceiptData(text: string): OCRExtractionResult {
  const items = extractLineItems(text);
  const totals = extractTotals(text);
  const dateTime = extractDateTime(text);
  const confidence = calculateConfidence(items, totals, dateTime);
  
  return {
    items,
    totals,
    dateTime,
    confidence,
    rawText: text
  };
}
