import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { MenuItem } from '../../types/ocr.types';

interface MenuItemFormProps {
  restaurantId: string;
  item: MenuItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function MenuItemForm({ restaurantId, item, onClose, onSuccess }: MenuItemFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'others',
    price: '',
    unit: '',
    calories_per_100g: '',
    protein_per_100g: '',
    fat_per_100g: '',
    stock_quantity: '',
    low_stock_threshold: '',
    is_available: true,
    notes: ''
  });

  const categories = [
    { value: 'meat', label: 'Meat & Poultry' },
    { value: 'seafood', label: 'Seafood' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'processed', label: 'Processed' },
    { value: 'noodles_rice', label: 'Noodles & Rice' },
    { value: 'herbs', label: 'Herbs & Spices' },
    { value: 'others', label: 'Others' }
  ];

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || 'others',
        price: item.price?.toString() || '',
        unit: item.unit || '',
        calories_per_100g: item.calories_per_100g?.toString() || '',
        protein_per_100g: item.protein_per_100g?.toString() || '',
        fat_per_100g: item.fat_per_100g?.toString() || '',
        stock_quantity: item.stock_quantity?.toString() || '',
        low_stock_threshold: item.low_stock_threshold?.toString() || '',
        is_available: item.is_available ?? true,
        notes: item.notes || ''
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        restaurant_id: restaurantId,
        name: formData.name.trim(),
        category: formData.category,
        price: formData.price ? parseFloat(formData.price) : null,
        unit: formData.unit.trim() || null,
        calories_per_100g: formData.calories_per_100g ? parseInt(formData.calories_per_100g) : null,
        protein_per_100g: formData.protein_per_100g ? parseFloat(formData.protein_per_100g) : null,
        fat_per_100g: formData.fat_per_100g ? parseFloat(formData.fat_per_100g) : null,
        stock_quantity: formData.stock_quantity ? parseFloat(formData.stock_quantity) : 0,
        low_stock_threshold: formData.low_stock_threshold ? parseFloat(formData.low_stock_threshold) : null,
        is_available: formData.is_available,
        notes: formData.notes.trim() || null
      };

      if (item) {
        // Update existing item
        const { error } = await supabase
          .from('menu_items')
          .update(payload)
          .eq('id', item.id);

        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from('menu_items')
          .insert(payload);

        if (error) throw error;
      }

      onSuccess();
    } catch (err: any) {
      console.error('Failed to save menu item:', err);
      alert(`Failed to save item: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Form */}
      <div className="relative bg-background w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            {item ? 'Edit Menu Item' : 'Add Menu Item'}
          </h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Chicken Breast, Tiger Prawns"
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use the exact name as it appears on receipts for better OCR matching
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price and Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Price (RM)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Unit
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                placeholder="Kg, Pack, Box"
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Nutritional Info */}
          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Nutritional Info (per 100g) - Optional
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Calories
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.calories_per_100g}
                  onChange={(e) => handleChange('calories_per_100g', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Protein (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.protein_per_100g}
                  onChange={(e) => handleChange('protein_per_100g', e.target.value)}
                  placeholder="0.0"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Fat (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.fat_per_100g}
                  onChange={(e) => handleChange('fat_per_100g', e.target.value)}
                  placeholder="0.0"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Inventory - Optional
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={(e) => handleChange('stock_quantity', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Low Stock Alert
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.low_stock_threshold}
                  onChange={(e) => handleChange('low_stock_threshold', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm font-semibold text-foreground">Available for Sale</p>
              <p className="text-xs text-muted-foreground">
                Toggle to mark item as unavailable
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleChange('is_available', !formData.is_available)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.is_available ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.is_available ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional notes or descriptions..."
              rows={3}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{item ? 'Update Item' : 'Add Item'}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
