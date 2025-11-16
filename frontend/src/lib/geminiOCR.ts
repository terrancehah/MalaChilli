// Gemini Vision API for Receipt OCR
// Replaces Tesseract.js with AI-powered contextual understanding

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { OCRExtractionResult } from '../types/ocr.types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('VITE_GEMINI_API_KEY not found in environment variables');
}

/**
 * Extract receipt data using Gemini Vision API
 */
export async function extractReceiptWithGemini(
  imageFile: File,
  onProgress?: (progress: number) => void
): Promise<OCRExtractionResult> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file');
  }

  try {
    onProgress?.(10);
    
    // Convert image to base64
    const imageBase64 = await fileToBase64(imageFile);
    onProgress?.(30);

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",  // Stable model with generous free tier
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    onProgress?.(50);

    const prompt = `You are an expert at reading restaurant receipts and invoices.

Analyze this receipt image carefully and extract ALL the information.

IMPORTANT INSTRUCTIONS:
1. For items, extract the EXACT item names as shown on the receipt
2. If quantity is not explicitly shown, assume quantity = 1
3. Calculate unit_price = total / quantity for each item
4. For "Adult" or "Child" buffet items, these are per-person prices
5. Soup bases or add-ons may be free (RM0.00) or have a charge
6. Double-check that all numbers add up correctly
7. If you see "RM## ##" (space instead of decimal), interpret it as "RM##.##"
8. Provide a confidence score (0-100) based on image quality and clarity

Return ONLY a JSON object with this exact structure (no markdown, no code blocks):
{
  "restaurant_name": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM:SS",
  "receipt_number": "string",
  "items": [
    {
      "name": "string",
      "quantity": number,
      "unit_price": number,
      "total": number
    }
  ],
  "subtotal": number,
  "service_charge": number,
  "service_charge_percent": number,
  "tax": number,
  "tax_percent": number,
  "total": number,
  "confidence": number
}`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: imageFile.type,
          data: imageBase64.split(',')[1] // Remove data:image/jpeg;base64, prefix
        }
      }
    ]);

    onProgress?.(80);

    const response = result.response;
    const text = response.text();
    
    // Parse the JSON response
    const data = JSON.parse(text);
    
    onProgress?.(90);

    // Convert to our OCRExtractionResult format
    const extractionResult: OCRExtractionResult = {
      rawText: JSON.stringify(data, null, 2), // Store structured data as "raw text"
      items: data.items.map((item: any, index: number) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        total: item.total,
        lineNumber: index + 1
      })),
      totals: {
        subtotal: data.subtotal || 0,
        tax: data.tax,
        serviceCharge: data.service_charge,
        total: data.total
      },
      dateTime: data.date && data.time ? {
        date: data.date,
        time: data.time,
        raw: `${data.date} ${data.time}`
      } : undefined,
      confidence: data.confidence || 0
    };

    onProgress?.(100);
    
    return extractionResult;

  } catch (error) {
    console.error('Gemini OCR error:', error);
    throw new Error(`Failed to process receipt with Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Convert File to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
