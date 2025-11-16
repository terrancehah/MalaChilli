import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Plus, Search, Edit2, Trash2, Package, Loader2, Grid3x3, List, Download, MoreVertical, AlertTriangle, CheckCircle2, Eye, EyeOff, Copy, ArrowUpDown, ArrowLeft, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { MenuItemForm } from './MenuItemForm';
import { MenuItemImport } from './MenuItemImport';
import { LanguageSelector } from '../shared';
import { getTranslation, type Language } from '../../translations';
import toast from 'react-hot-toast';
import type { MenuItem } from '../../types/ocr.types';

interface MenuItemManagementProps {
  restaurantId: string;
  onBack: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export function MenuItemManagement({ restaurantId, onBack, language, onLanguageChange }: MenuItemManagementProps) {
  const t = getTranslation(language);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'category'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const categories = [
    { value: 'all', label: t.staffDashboard.allItems },
    { value: 'meat', label: t.staffDashboard.meatPoultry },
    { value: 'seafood', label: t.staffDashboard.seafood },
    { value: 'vegetables', label: t.staffDashboard.vegetables },
    { value: 'processed', label: t.staffDashboard.processed },
    { value: 'noodles_rice', label: t.staffDashboard.noodlesRice },
    { value: 'herbs', label: t.staffDashboard.herbsSpices },
    { value: 'others', label: t.staffDashboard.others }
  ];

  useEffect(() => {
    loadMenuItems();
  }, [restaurantId]);

  useEffect(() => {
    filterItems();
  }, [menuItems, searchQuery, selectedCategory]);

  const loadMenuItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_active', true)
        .order('item_number', { ascending: true });

      if (error) throw error;
      setMenuItems(data || []);
    } catch (err) {
      console.error('Failed to load menu items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = menuItems;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
      );
    }

    // Sort items
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = (a.price || 0) - (b.price || 0);
          break;
        case 'stock':
          comparison = (a.stock_quantity || 0) - (b.stock_quantity || 0);
          break;
        case 'category':
          comparison = (a.category || '').localeCompare(b.category || '');
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredItems(filtered);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_active: false })
        .eq('id', itemId);

      if (error) throw error;
      
      // Reload items
      await loadMenuItems();
    } catch (err) {
      console.error('Failed to delete item:', err);
      alert('Failed to delete item. Please try again.');
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleFormSuccess = () => {
    loadMenuItems();
    handleFormClose();
  };

  const toggleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`Delete ${selectedItems.size} selected items? This cannot be undone.`)) return;

    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_active: false })
        .in('id', Array.from(selectedItems));

      if (error) throw error;
      setSelectedItems(new Set());
      await loadMenuItems();
    } catch (err) {
      console.error('Failed to delete items:', err);
      alert('Failed to delete items. Please try again.');
    }
  };

  const handleBulkToggleAvailability = async (available: boolean) => {
    if (selectedItems.size === 0) return;

    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: available })
        .in('id', Array.from(selectedItems));

      if (error) throw error;
      setSelectedItems(new Set());
      await loadMenuItems();
    } catch (err) {
      console.error('Failed to update items:', err);
      alert('Failed to update items. Please try again.');
    }
  };

  const handleDuplicate = async (item: MenuItem) => {
    try {
      const { id, created_at, updated_at, item_number, ...itemData } = item;
      const { error } = await supabase
        .from('menu_items')
        .insert({ ...itemData, name: `${item.name} (Copy)` });

      if (error) throw error;
      await loadMenuItems();
    } catch (err) {
      console.error('Failed to duplicate item:', err);
      alert('Failed to duplicate item. Please try again.');
    }
  };

  const handleExport = () => {
    if (menuItems.length === 0) {
      toast.error('No items to export');
      return;
    }

    try {
      // Export in the same format as import template for easy re-import
      const csv = [
        // Header row matching import format
        ['name', 'category', 'price', 'unit', 'calories_per_100g', 'protein_per_100g', 'fat_per_100g', 'stock_quantity', 'low_stock_threshold', 'is_available', 'notes'].join(','),
        
        // Instruction row for reference
        ['# REQUIRED: Item name', '# REQUIRED: meat/seafood/vegetables/processed/noodles_rice/herbs/others', '# Optional: Price in RM', '# Optional: e.g., Kg, Pack, Box', '# Optional: Calories per 100g', '# Optional: Protein per 100g', '# Optional: Fat per 100g', '# Optional: Current stock', '# Optional: Alert threshold', '# Optional: true/false', '# Optional: Additional notes'].join(','),
        
        // Data rows
        ...menuItems.map(item => [
          item.name,
          item.category || '',
          item.price || '',
          item.unit || '',
          item.calories_per_100g || '',
          item.protein_per_100g || '',
          item.fat_per_100g || '',
          item.stock_quantity || '',
          item.low_stock_threshold || '',
          item.is_available ? 'true' : 'false',
          item.notes || ''
        ].join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filename = `menu-items-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      // Success notification
      toast.success(`Exported ${menuItems.length} items to ${filename}`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export items. Please try again.');
    }
  };

  const getStockStatus = (item: MenuItem) => {
    if (!item.stock_quantity) return null;
    if (item.low_stock_threshold && item.stock_quantity <= item.low_stock_threshold) {
      return 'low';
    }
    return 'ok';
  };

  const stats = {
    total: menuItems.length,
    available: menuItems.filter(i => i.is_available).length,
    lowStock: menuItems.filter(i => getStockStatus(i) === 'low').length,
    categories: new Set(menuItems.map(i => i.category)).size
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-br from-primary to-primary-light px-4 sm:px-6 pt-10 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-primary-foreground hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-1">
              {t.staffDashboard.menuManagement}
            </h1>
            <p className="text-primary-foreground/80 text-sm">
              {stats.total} {t.staffDashboard.items} • {stats.available} {t.staffDashboard.available}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
            <Button
              onClick={() => setIsImportOpen(true)}
              variant="ghost"
              size="sm"
              className="hidden md:flex text-primary-foreground hover:bg-white/20"
              title="Bulk import menu items from CSV file"
            >
              <Upload className="h-4 w-4 mr-2" />
              {t.staffDashboard.import}
            </Button>
            <Button
              onClick={handleExport}
              variant="ghost"
              size="sm"
              className="hidden md:flex text-primary-foreground hover:bg-white/20"
              title="Export all menu items to CSV (can be re-imported)"
            >
              <Download className="h-4 w-4 mr-2" />
              {t.staffDashboard.export}
            </Button>
            <Button
              onClick={handleAdd}
              className="bg-white text-primary hover:bg-white/90 shadow-md"
              size="sm"
              title="Add a single menu item"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t.staffDashboard.add}
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">{t.staffDashboard.totalItems}</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500 opacity-50" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-3 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">{t.staffDashboard.availableItems}</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.available}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500 opacity-50" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-3 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">{t.staffDashboard.lowStock}</p>
                  <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{stats.lowStock}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-amber-500 opacity-50" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-3 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">{t.staffDashboard.categories}</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.categories}</p>
                </div>
                <Grid3x3 className="h-8 w-8 text-purple-500 opacity-50" />
              </div>
            </div>
          </div>
      </div>

      {/* Controls Section */}
      <div className="sticky top-0 z-10 bg-background border-b border-border shadow-sm">
        <div className="px-4 py-4">
          {/* Search and Controls */}
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t.staffDashboard.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
                className="h-10 px-3 rounded-xl border border-border bg-background hover:bg-muted transition-colors flex items-center gap-2"
                title="Toggle sort order"
              >
                <ArrowUpDown className="h-4 w-4" />
                <span className="text-xs font-medium hidden md:inline">{sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-10 px-3 rounded-xl border border-border bg-background hover:bg-muted transition-colors text-sm font-medium"
              >
                <option value="name">{t.staffDashboard.name}</option>
                <option value="category">{t.staffDashboard.category}</option>
                <option value="price">{t.staffDashboard.price}</option>
                <option value="stock">{t.staffDashboard.stock}</option>
              </select>
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                className="h-10 w-10 rounded-xl border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center"
                title={`Switch to ${viewMode === 'list' ? 'grid' : 'list'} view`}
              >
                {viewMode === 'list' ? <Grid3x3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setSelectedItems(new Set());
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-primary text-primary-foreground shadow-md scale-105'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedItems.size > 0 && (
        <div className="sticky top-[280px] z-10 mx-4 mt-4 bg-primary/10 border-2 border-primary rounded-xl p-3 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedItems.size === filteredItems.length}
                onChange={toggleSelectAll}
                className="h-5 w-5 rounded border-2 border-primary"
              />
              <span className="text-sm font-semibold text-foreground">
                {selectedItems.size} {t.staffDashboard.selected}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleBulkToggleAvailability(true)}
                variant="outline"
                size="sm"
                className="bg-background"
              >
                <Eye className="h-4 w-4 mr-2" />
                {t.staffDashboard.toggleAvailability}
              </Button>
              <Button
                onClick={() => handleBulkToggleAvailability(false)}
                variant="outline"
                size="sm"
                className="bg-background"
              >
                <EyeOff className="h-4 w-4 mr-2" />
                {t.staffDashboard.toggleAvailability}
              </Button>
              <Button
                onClick={handleBulkDelete}
                variant="outline"
                size="sm"
                className="bg-background text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t.staffDashboard.delete}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-sm text-muted-foreground">Loading menu items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-muted mb-4">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery || selectedCategory !== 'all' ? 'No items found' : 'No menu items yet'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search criteria or filters to find what you\'re looking for'
                : 'Get started by adding your first menu item. You can add details like price, stock, and nutritional information.'}
            </p>
            {!searchQuery && selectedCategory === 'all' && (
              <Button onClick={handleAdd} size="lg" className="shadow-md">
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Item
              </Button>
            )}
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const stockStatus = getStockStatus(item);
              return (
                <div
                  key={item.id}
                  className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md active:shadow-none transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="mt-1 h-5 w-5 rounded border-2 border-border"
                      onClick={(e) => e.stopPropagation()}
                    />

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-foreground text-base">
                              {item.name}
                            </h3>
                            {!item.is_available && (
                              <span className="px-2.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold rounded-full">
                                Hidden
                              </span>
                            )}
                            {stockStatus === 'low' && (
                              <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded-full flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Low Stock
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                            {item.category && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded-md text-xs font-medium capitalize">
                                {item.category.replace('_', ' ')}
                              </span>
                            )}
                            {item.price && (
                              <span className="font-bold text-foreground text-base">
                                RM {item.price.toFixed(2)}
                              </span>
                            )}
                            {item.unit && (
                              <span className="text-xs">per {item.unit}</span>
                            )}
                            {item.stock_quantity !== undefined && item.stock_quantity !== null && (
                              <span className="text-xs">
                                Stock: <span className="font-semibold">{item.stock_quantity}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(item);
                        }}
                        className="h-9 w-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(item);
                        }}
                        className="h-9 w-9 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="h-9 w-9 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const stockStatus = getStockStatus(item);
              return (
                <div
                  key={item.id}
                  className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md active:shadow-none transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="h-5 w-5 rounded border-2 border-border"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(item);
                        }}
                        className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                      >
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h3 className="font-bold text-foreground text-base mb-2 line-clamp-2">
                      {item.name}
                    </h3>
                    {item.category && (
                      <span className="inline-block px-2 py-1 bg-muted rounded-md text-xs font-medium capitalize mb-2">
                        {item.category.replace('_', ' ')}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {item.price && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Price</span>
                        <span className="font-bold text-foreground">RM {item.price.toFixed(2)}</span>
                      </div>
                    )}
                    {item.stock_quantity !== undefined && item.stock_quantity !== null && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Stock</span>
                        <span className={`font-semibold ${stockStatus === 'low' ? 'text-amber-600' : 'text-foreground'}`}>
                          {item.stock_quantity} {item.unit || ''}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Status</span>
                      <span className={`text-xs font-semibold ${item.is_available ? 'text-green-600' : 'text-red-600'}`}>
                        {item.is_available ? 'Available' : 'Hidden'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate(item);
                      }}
                      className="flex-1 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center gap-1 transition-colors text-xs font-medium"
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item);
                      }}
                      className="flex-1 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center gap-1 transition-colors text-xs font-medium"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <MenuItemForm
          restaurantId={restaurantId}
          item={editingItem}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          language={language}
        />
      )}

      {/* Import Modal */}
      <MenuItemImport
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        restaurantId={restaurantId}
        language={language}
        onSuccess={() => {
          setIsImportOpen(false);
          loadMenuItems();
          toast.success('Menu items imported successfully');
        }}
      />
    </div>
  );
}
