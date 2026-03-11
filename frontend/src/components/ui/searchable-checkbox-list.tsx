import { useState, useMemo } from "react";
import { Search, Check } from "lucide-react";
import { cn } from "../../lib/utils";

// Represents a selectable option in the list
interface Option {
  id: string;
  label: string;
}

interface SearchableCheckboxListProps {
  /** Available options to display */
  options: Option[];
  /** Currently selected option IDs */
  selectedIds: string[];
  /** Callback when selection changes */
  onChange: (selectedIds: string[]) => void;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  /** Message shown when no options match the search */
  emptyMessage?: string;
  /** Maximum height of the scrollable list area */
  maxHeight?: string;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * A searchable list of checkboxes for multi-selection.
 * Designed for scenarios where the list of options may grow large
 * (e.g., selecting multiple restaurants for a merchant).
 */
export function SearchableCheckboxList({
  options,
  selectedIds,
  onChange,
  searchPlaceholder = "Search...",
  emptyMessage = "No results found",
  maxHeight = "200px",
  className,
}: SearchableCheckboxListProps) {
  // Local search query state
  const [searchQuery, setSearchQuery] = useState("");

  // Filter options based on search query (case-insensitive)
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [options, searchQuery]);

  // Toggle an option's selection state
  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className={cn("border border-gray-300 rounded-lg overflow-hidden", className)}>
      {/* Search input area */}
      <div className="relative border-b border-gray-200">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
        />
      </div>

      {/* Scrollable checkbox list */}
      <div className="overflow-y-auto" style={{ maxHeight }}>
        {filteredOptions.length === 0 ? (
          <p className="px-3 py-4 text-sm text-gray-400 text-center">{emptyMessage}</p>
        ) : (
          filteredOptions.map((option) => {
            const isSelected = selectedIds.includes(option.id);
            return (
              <label
                key={option.id}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors",
                  isSelected && "bg-purple-50"
                )}
              >
                {/* Custom styled checkbox */}
                <div
                  className={cn(
                    "flex items-center justify-center h-4 w-4 rounded border shrink-0 transition-colors",
                    isSelected
                      ? "bg-purple-600 border-purple-600 text-white"
                      : "border-gray-300 bg-white"
                  )}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                </div>
                {/* Hidden native checkbox for accessibility */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggle(option.id)}
                  className="sr-only"
                />
                <span className="text-sm text-gray-700 truncate">{option.label}</span>
              </label>
            );
          })
        )}
      </div>

      {/* Selection count footer */}
      {selectedIds.length > 0 && (
        <div className="px-3 py-1.5 border-t border-gray-200 bg-gray-50">
          <span className="text-xs text-gray-500">
            {selectedIds.length} selected
          </span>
        </div>
      )}
    </div>
  );
}
