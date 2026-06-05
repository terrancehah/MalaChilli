// Receipt OCR via Supabase Edge Function
// The Gemini API key is stored server-side — never exposed to the client.
// This module sends the receipt image to the `receipt-ocr` edge function
// which handles authentication, authorization, and the Gemini Vision call.

import { supabase } from "./supabase";
import type { OCRExtractionResult } from "../types/ocr.types";

/**
 * Extract receipt data by calling the server-side receipt-ocr edge function.
 * The edge function verifies the caller is staff before proxying to Gemini.
 */
export async function extractReceiptWithGemini(
  imageFile: File,
  onProgress?: (progress: number) => void
): Promise<OCRExtractionResult> {
  try {
    onProgress?.(10);

    // Convert image to base64 (strip the data URL prefix for the server)
    const imageBase64 = await fileToBase64(imageFile);
    const base64Data = imageBase64.split(",")[1]; // Remove "data:image/jpeg;base64," prefix
    onProgress?.(30);

    // Get current session for authorization header
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Not authenticated. Please log in again.");
    }

    onProgress?.(50);

    // Call the receipt-ocr edge function
    const { data, error } = await supabase.functions.invoke("receipt-ocr", {
      body: {
        imageBase64: base64Data,
        mimeType: imageFile.type,
      },
    });

    if (error) {
      throw new Error(error.message || "Failed to process receipt");
    }

    if (!data?.success) {
      throw new Error(data?.error || "OCR processing failed");
    }

    onProgress?.(80);

    // Convert server response to our OCRExtractionResult format
    const ocrData = data.data;

    const extractionResult: OCRExtractionResult = {
      rawText: JSON.stringify(ocrData, null, 2), // Store structured data as "raw text"
      items: ocrData.items.map((item: any, index: number) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        total: item.total,
        lineNumber: index + 1,
      })),
      totals: {
        subtotal: ocrData.subtotal || 0,
        tax: ocrData.tax,
        serviceCharge: ocrData.service_charge,
        total: ocrData.total,
      },
      dateTime:
        ocrData.date && ocrData.time
          ? {
              date: ocrData.date,
              time: ocrData.time,
              raw: `${ocrData.date} ${ocrData.time}`,
            }
          : undefined,
      confidence: ocrData.confidence || 0,
    };

    onProgress?.(100);

    return extractionResult;
  } catch (error) {
    console.error("Receipt OCR error:", error);
    throw new Error(`Failed to process receipt: ${error instanceof Error ? error.message : "Unknown error"}`);
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
