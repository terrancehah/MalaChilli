import { useState } from 'react';
import { Button } from '../ui/button';
import { X, Upload, Download, AlertCircle, CheckCircle2, Loader2, FileText } from 'lucide-react';
import Papa from 'papaparse';
import { supabase } from '../../lib/supabase';
import type { MenuItem } from '../../types/ocr.types';

interface MenuItemImportProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  onSuccess: () => void;
  language?: string; // Accept but don't use for now
}

interface ImportRow {
  name: string;
  category: string;
  price?: string;
  unit?: string;
  calories_per_100g?: string;
  protein_per_100g?: string;
  fat_per_100g?: string;
  stock_quantity?: string;
  low_stock_threshold?: string;
  is_available?: string;
  notes?: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export function MenuItemImport({ isOpen, onClose, restaurantId, onSuccess }: MenuItemImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    total: number;
  } | null>(null);

  const validCategories = ['meat', 'seafood', 'vegetables', 'processed', 'noodles_rice', 'herbs', 'others'];

  // Validate a single row
  const validateRow = (row: ImportRow, rowIndex: number): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Required fields
    if (!row.name || row.name.trim() === '') {
      errors.push({ row: rowIndex, field: 'name', message: 'Name is required' });
    }

    if (!row.category || row.category.trim() === '') {
      errors.push({ row: rowIndex, field: 'category', message: 'Category is required' });
    } else if (!validCategories.includes(row.category.toLowerCase())) {
      errors.push({
        row: rowIndex,
        field: 'category',
        message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
    }

    // Validate numeric fields if provided
    if (row.price && isNaN(parseFloat(row.price))) {
      errors.push({ row: rowIndex, field: 'price', message: 'Price must be a number' });
    }

    if (row.calories_per_100g && isNaN(parseInt(row.calories_per_100g))) {
      errors.push({ row: rowIndex, field: 'calories_per_100g', message: 'Calories must be a number' });
    }

    if (row.protein_per_100g && isNaN(parseFloat(row.protein_per_100g))) {
      errors.push({ row: rowIndex, field: 'protein_per_100g', message: 'Protein must be a number' });
    }

    if (row.fat_per_100g && isNaN(parseFloat(row.fat_per_100g))) {
      errors.push({ row: rowIndex, field: 'fat_per_100g', message: 'Fat must be a number' });
    }

    if (row.stock_quantity && isNaN(parseFloat(row.stock_quantity))) {
      errors.push({ row: rowIndex, field: 'stock_quantity', message: 'Stock quantity must be a number' });
    }

    if (row.low_stock_threshold && isNaN(parseFloat(row.low_stock_threshold))) {
      errors.push({ row: rowIndex, field: 'low_stock_threshold', message: 'Low stock threshold must be a number' });
    }

    // Validate boolean field
    if (row.is_available && !['true', 'false', '1', '0', 'yes', 'no'].includes(row.is_available.toLowerCase())) {
      errors.push({ row: rowIndex, field: 'is_available', message: 'Must be true/false' });
    }

    return errors;
  };

  // Convert row to MenuItem payload
  const rowToMenuItem = (row: ImportRow): Omit<MenuItem, 'id' | 'created_at' | 'updated_at'> => {
    const parseBoolean = (value?: string): boolean => {
      if (!value) return true;
      const lower = value.toLowerCase();
      return lower === 'true' || lower === '1' || lower === 'yes';
    };

    return {
      restaurant_id: restaurantId,
      name: row.name.trim(),
      category: row.category.toLowerCase(),
      price: row.price ? parseFloat(row.price) : null,
      unit: row.unit?.trim() || null,
      calories_per_100g: row.calories_per_100g ? parseInt(row.calories_per_100g) : null,
      protein_per_100g: row.protein_per_100g ? parseFloat(row.protein_per_100g) : null,
      fat_per_100g: row.fat_per_100g ? parseFloat(row.fat_per_100g) : null,
      stock_quantity: row.stock_quantity ? parseFloat(row.stock_quantity) : 0,
      low_stock_threshold: row.low_stock_threshold ? parseFloat(row.low_stock_threshold) : null,
      is_available: parseBoolean(row.is_available),
      is_active: true,
      notes: row.notes?.trim() || null
    };
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setValidationErrors([]);
      setImportResults(null);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  // Process and import CSV
  const handleImport = async () => {
    if (!file) return;

    setIsProcessing(true);
    setValidationErrors([]);
    setImportResults(null);

    Papa.parse<ImportRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_'),
      complete: async (results) => {
        const errors: ValidationError[] = [];
        const validRows: ImportRow[] = [];

        // Filter out instruction rows (rows starting with #) and validate
        const dataRows = results.data.filter(row => !row.name?.startsWith('#'));

        dataRows.forEach((row, index) => {
          const rowErrors = validateRow(row, index + 3); // +3 for header, instruction row, and 1-based indexing
          if (rowErrors.length > 0) {
            errors.push(...rowErrors);
          } else {
            validRows.push(row);
          }
        });

        if (errors.length > 0) {
          setValidationErrors(errors);
          setIsProcessing(false);
          return;
        }

        // Import valid rows
        let successCount = 0;
        let failedCount = 0;

        for (const row of validRows) {
          try {
            const menuItem = rowToMenuItem(row);
            const { error } = await supabase
              .from('menu_items')
              .insert(menuItem);

            if (error) throw error;
            successCount++;
          } catch (err) {
            console.error('Failed to import row:', row, err);
            failedCount++;
          }
        }

        setImportResults({
          success: successCount,
          failed: failedCount,
          total: validRows.length
        });

        setIsProcessing(false);

        if (successCount > 0) {
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        alert('Failed to parse CSV file');
        setIsProcessing(false);
      }
    });
  };

  // Download CSV template with comprehensive examples and instructions
  const downloadTemplate = () => {
    const template = [
      // Header row
      ['name', 'category', 'price', 'unit', 'calories_per_100g', 'protein_per_100g', 'fat_per_100g', 'stock_quantity', 'low_stock_threshold', 'is_available', 'notes'],
      
      // Instruction row (will be commented)
      ['# REQUIRED: Item name', '# REQUIRED: meat/seafood/vegetables/processed/noodles_rice/herbs/others', '# Optional: Price in RM', '# Optional: e.g., Kg, Pack, Box', '# Optional: Calories per 100g', '# Optional: Protein per 100g', '# Optional: Fat per 100g', '# Optional: Current stock', '# Optional: Alert threshold', '# Optional: true/false', '# Optional: Additional notes'],
      
      // Example rows with different categories
      ['Beef Chuck Tender', 'meat', '24.90', 'Kg', '180', '20', '11', '50', '10', 'true', 'Premium quality'],
      ['Tiger Prawns', 'seafood', '36.99', 'Kg', '105', '20', '2', '30', '5', 'true', 'Fresh frozen'],
      ['Enoki Mushroom', 'vegetables', '33.00', 'Box/50pcs', '37', '2', '0', '100', '20', 'true', ''],
      ['Cheese Tofu', 'processed', '10.80', '500g/pack', '170', '8', '10', '75', '15', 'true', ''],
      ['Wei Yi Noodles', 'noodles_rice', '40.00', 'Pack', '180', '5', '1', '200', '30', 'true', ''],
      ['Green Onion', 'herbs', '12.00', 'Kg', '32', '1', '0', '25', '5', 'true', 'Organic'],
      ['Bell Roll', 'others', '130.00', 'Box', '150', '10', '8', '40', '10', 'false', 'Currently unavailable'],
      
      // Empty row for staff to fill
      ['', '', '', '', '', '', '', '', '', '', '']
    ];

    const csv = template.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `menu-items-template-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background w-full sm:max-w-2xl sm:rounded-2xl rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Import Menu Items</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              How to Import
            </h3>
            <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 ml-7 list-decimal">
              <li>Download the CSV template below</li>
              <li>Fill in your menu items</li>
              <li>Keep the instruction row (starts with #)</li>
              <li>Upload the completed CSV file</li>
              <li>Review any validation errors</li>
              <li>Click Import to add items</li>
            </ol>
          </div>

          {/* Format Preview */}
          <div className="bg-muted rounded-xl p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">CSV Format Preview:</h4>
            <div className="bg-background rounded-lg p-3 font-mono text-xs overflow-x-auto">
              <div className="text-green-600 dark:text-green-400">name,category,price,unit,stock_quantity,is_available</div>
              <div className="text-muted-foreground"># REQUIRED,# REQUIRED: meat/seafood/...,# Optional,# Optional,# Optional,# Optional</div>
              <div className="text-foreground">Beef Chuck,meat,24.90,Kg,50,true</div>
              <div className="text-foreground">Tiger Prawns,seafood,36.99,Kg,30,true</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              ✓ First row: Column headers<br/>
              ✓ Second row: Instructions (starts with #)<br/>
              ✓ Following rows: Your menu items
            </p>
          </div>

          {/* Template Download */}
          <div>
            <Button
              onClick={downloadTemplate}
              variant="outline"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download CSV Template
            </Button>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Upload CSV File
            </label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">
                  {file ? file.name : 'Click to upload CSV file'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 5MB
                </p>
              </label>
            </div>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Validation Errors ({validationErrors.length})
              </h3>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {validationErrors.map((error, index) => (
                  <div key={index} className="text-sm text-red-800 dark:text-red-200 bg-red-100 dark:bg-red-900/30 rounded-lg p-2">
                    <span className="font-semibold">Row {error.row}:</span> {error.field} - {error.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Import Results */}
          {importResults && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Import Complete
              </h3>
              <div className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <p>✓ Successfully imported: <span className="font-bold">{importResults.success}</span> items</p>
                {importResults.failed > 0 && (
                  <p>✗ Failed: <span className="font-bold">{importResults.failed}</span> items</p>
                )}
                <p>Total processed: <span className="font-bold">{importResults.total}</span> items</p>
              </div>
            </div>
          )}

          {/* Valid Categories Reference */}
          <div className="bg-muted rounded-xl p-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">Valid Categories:</h4>
            <div className="flex flex-wrap gap-2">
              {validCategories.map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-1 bg-background border border-border rounded-lg text-xs font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              className="flex-1"
              disabled={!file || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Items
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
