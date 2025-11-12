import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Plus, Search, Edit2, Trash2, Package, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { MenuItemForm } from './MenuItemForm';
import type { MenuItem } from '../../types/ocr.types';

interface MenuItemManagementProps {
  restaurantId: string;
}

export function MenuItemManagement({ restaurantId }: MenuItemManagementProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const categories = [
    { value: 'all', label: 'All Items' },
    { value: 'meat', label: 'Meat & Poultry' },
    { value: 'seafood', label: 'Seafood' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'processed', label: 'Processed' },
    { value: 'noodles_rice', label: 'Noodles & Rice' },
    { value: 'herbs', label: 'Herbs & Spices' },
    { value: 'others', label: 'Others' }
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

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Menu Items</h1>
                <p className="text-sm text-muted-foreground">
                  {menuItems.length} items
                </p>
              </div>
            </div>
            <Button
              onClick={handleAdd}
              className="bg-primary hover:bg-primary/90"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto mt-3 pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground mb-1">
              {searchQuery || selectedCategory !== 'all' ? 'No items found' : 'No menu items yet'}
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Add your first menu item to get started'}
            </p>
            {!searchQuery && selectedCategory === 'all' && (
              <Button onClick={handleAdd} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add First Item
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {item.name}
                      </h3>
                      {!item.is_available && (
                        <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-full">
                          Unavailable
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {item.category && (
                        <span className="capitalize">{item.category.replace('_', ' ')}</span>
                      )}
                      {item.price && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-foreground">
                            RM {item.price.toFixed(2)}
                          </span>
                        </>
                      )}
                      {item.unit && (
                        <>
                          <span>•</span>
                          <span>{item.unit}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                    >
                      <Edit2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="h-8 w-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
        />
      )}
    </div>
  );
}
