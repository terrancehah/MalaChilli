// Fuzzy Matching Utilities for OCR Item Matching
// Uses Levenshtein distance algorithm

import type { MenuItem, FuzzyMatchResult } from '../types/ocr.types';

/**
 * Calculate Levenshtein distance between two strings
 * Returns the minimum number of single-character edits needed
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[len1][len2];
}

/**
 * Normalize string for matching
 * - Convert to lowercase
 * - Remove extra spaces
 * - Remove common OCR artifacts
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')           // Multiple spaces to single
    .replace(/[^\w\s]/g, '')        // Remove punctuation
    .replace(/\bl\b/g, '1')         // Common OCR: l -> 1
    .replace(/\bo\b/g, '0')         // Common OCR: o -> 0
    .replace(/\s+/g, '');           // Remove all spaces for comparison
}

/**
 * Calculate similarity percentage between two strings
 * Returns 0-100 where 100 is exact match
 */
function calculateSimilarity(str1: string, str2: string): number {
  const norm1 = normalizeString(str1);
  const norm2 = normalizeString(str2);
  
  // Exact match after normalization
  if (norm1 === norm2) return 100;
  
  const distance = levenshteinDistance(norm1, norm2);
  const maxLength = Math.max(norm1.length, norm2.length);
  
  if (maxLength === 0) return 0;
  
  const similarity = ((maxLength - distance) / maxLength) * 100;
  return Math.round(similarity);
}

/**
 * Check if string contains another string (fuzzy)
 */
function fuzzyContains(haystack: string, needle: string): boolean {
  const normHaystack = normalizeString(haystack);
  const normNeedle = normalizeString(needle);
  return normHaystack.includes(normNeedle) || normNeedle.includes(normHaystack);
}

/**
 * Find best matching menu item for OCR text
 * Returns null if no good match found (confidence < threshold)
 */
export function findBestMatch(
  ocrText: string,
  menuItems: MenuItem[],
  minConfidence: number = 60
): FuzzyMatchResult | null {
  let bestMatch: FuzzyMatchResult | null = null;
  let highestConfidence = 0;

  for (const menuItem of menuItems) {
    // Skip unavailable items
    if (!menuItem.is_available) continue;

    // Calculate similarity
    const confidence = calculateSimilarity(ocrText, menuItem.name);
    const distance = levenshteinDistance(
      normalizeString(ocrText),
      normalizeString(menuItem.name)
    );

    // Bonus points for partial matches
    let adjustedConfidence = confidence;
    if (fuzzyContains(ocrText, menuItem.name)) {
      adjustedConfidence += 10;
    }

    // Cap at 100
    adjustedConfidence = Math.min(adjustedConfidence, 100);

    if (adjustedConfidence > highestConfidence && adjustedConfidence >= minConfidence) {
      highestConfidence = adjustedConfidence;
      bestMatch = {
        menuItem,
        confidence: adjustedConfidence,
        distance
      };
    }
  }

  return bestMatch;
}

/**
 * Find top N matching menu items
 */
export function findTopMatches(
  ocrText: string,
  menuItems: MenuItem[],
  topN: number = 3,
  minConfidence: number = 50
): FuzzyMatchResult[] {
  const matches: FuzzyMatchResult[] = [];

  for (const menuItem of menuItems) {
    if (!menuItem.is_available) continue;

    const confidence = calculateSimilarity(ocrText, menuItem.name);
    const distance = levenshteinDistance(
      normalizeString(ocrText),
      normalizeString(menuItem.name)
    );

    let adjustedConfidence = confidence;
    if (fuzzyContains(ocrText, menuItem.name)) {
      adjustedConfidence += 10;
    }
    adjustedConfidence = Math.min(adjustedConfidence, 100);

    if (adjustedConfidence >= minConfidence) {
      matches.push({
        menuItem,
        confidence: adjustedConfidence,
        distance
      });
    }
  }

  // Sort by confidence descending, then by distance ascending
  matches.sort((a, b) => {
    if (b.confidence !== a.confidence) {
      return b.confidence - a.confidence;
    }
    return a.distance - b.distance;
  });

  return matches.slice(0, topN);
}

/**
 * Batch match multiple OCR items to menu items
 */
export function batchMatchItems(
  ocrItems: Array<{ name: string; quantity: number; unitPrice: number; total: number; lineNumber: number }>,
  menuItems: MenuItem[],
  minConfidence: number = 60
): Array<{
  ocrItem: typeof ocrItems[0];
  match: FuzzyMatchResult | null;
}> {
  return ocrItems.map(ocrItem => ({
    ocrItem,
    match: findBestMatch(ocrItem.name, menuItems, minConfidence)
  }));
}
