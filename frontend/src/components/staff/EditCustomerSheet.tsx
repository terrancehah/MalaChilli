import { useState, useEffect } from 'react';
import { X, User, Calendar, Cake } from 'lucide-react';
import { Button } from '../ui/button';
import { getTranslation, type Language } from '../../translations';
import { supabase } from '../../lib/supabase';

interface EditCustomerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  customerData: {
    id: string;
    full_name: string;
    email: string;
    birthday?: string;
  };
  onUpdate: () => void;
  language?: Language;
}

export function EditCustomerSheet({ isOpen, onClose, customerData, onUpdate, language = 'en' }: EditCustomerSheetProps) {
  const t = getTranslation(language);
  const [fullName, setFullName] = useState(customerData.full_name || '');
  const [birthday, setBirthday] = useState(customerData.birthday || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Update local state when customerData prop changes
  useEffect(() => {
    setFullName(customerData.full_name || '');
    setBirthday(customerData.birthday || '');
  }, [customerData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          full_name: fullName.trim(),
          birthday: birthday || null,
        })
        .eq('id', customerData.id);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      // Call onUpdate to refresh parent data
      await onUpdate();
      
      // Close the sheet
      onClose();
    } catch (err: any) {
      console.error('Failed to update customer:', err);
      setError(err.message || 'Failed to update customer details. You may not have permission to edit this customer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full md:max-w-lg bg-background rounded-t-3xl md:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom md:zoom-in-95 duration-300">
        {/* Handle (mobile) */}
        <div className="md:hidden flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-muted rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{t.staffDashboard.editCustomer}</h2>
              <p className="text-sm text-muted-foreground">{customerData.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-lg"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              {t.staffDashboard.fullName}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder={t.staffDashboard.fullName}
              required
            />
          </div>

          {/* Birthday */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Cake className="h-4 w-4 text-muted-foreground" />
              {t.staffDashboard.birthday} (Optional)
            </label>
            <div className="relative">
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            <p className="text-xs text-muted-foreground">
              Birthday helps us send special rewards
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-primary hover:bg-primary/90 rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
