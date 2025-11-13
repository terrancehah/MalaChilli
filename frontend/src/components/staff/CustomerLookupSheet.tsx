import { useState } from 'react';
import { X, Search, QrCode, User, Mail, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { supabase } from '../../lib/supabase';

interface CustomerLookupSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerFound: (customer: {
    id: string;
    full_name: string;
    email: string;
    referral_code: string;
    birthday?: string;
  }) => void;
  onScanQR: () => void;
}

export function CustomerLookupSheet({ isOpen, onClose, onCustomerFound, onScanQR }: CustomerLookupSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    setError('');
    setIsSearching(true);
    setSearchResults([]);

    try {
      const query = searchQuery.trim().toLowerCase();

      // Search by name, email, or referral code
      const { data, error: searchError } = await supabase
        .from('users')
        .select('id, full_name, email, referral_code, birthday')
        .eq('role', 'customer')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,referral_code.ilike.%${query}%`)
        .limit(10);

      if (searchError) throw searchError;

      if (!data || data.length === 0) {
        setError('No customers found. Try a different search term.');
      } else {
        setSearchResults(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search customers');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCustomer = (customer: any) => {
    onCustomerFound(customer);
    onClose();
    // Reset state
    setSearchQuery('');
    setSearchResults([]);
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
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
      <div className="relative w-full md:max-w-2xl bg-background rounded-t-3xl md:rounded-2xl shadow-xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom md:zoom-in-95 duration-300">
        {/* Handle (mobile) */}
        <div className="md:hidden flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-muted rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Find Customer</h2>
              <p className="text-sm text-muted-foreground">Search or scan QR code</p>
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={() => {
                onClose();
                onScanQR();
              }}
              className="h-16 bg-gradient-to-br from-primary to-primary-light hover:from-primary/90 hover:to-primary-light/90 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl flex items-center justify-center gap-3"
            >
              <QrCode className="!h-6 !w-6 text-white" />
              <span className="text-base font-semibold text-white">Scan Customer QR Code</span>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or search manually</span>
            </div>
          </div>

          {/* Search Input */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, email, or referral code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 text-sm border-2 rounded-xl"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="h-12 px-6 bg-primary hover:bg-primary/90 rounded-xl"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Search'
                )}
              </Button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">
                Found {searchResults.length} customer{searchResults.length !== 1 ? 's' : ''}
              </p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {searchResults.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => handleSelectCustomer(customer)}
                    className="w-full p-4 bg-muted/50 hover:bg-muted border border-border rounded-xl transition-all duration-200 text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {customer.full_name}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono bg-background px-2 py-0.5 rounded border border-border">
                            {customer.referral_code}
                          </span>
                          {customer.birthday && (
                            <span className="text-xs text-muted-foreground">
                              🎂 {new Date(customer.birthday).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
