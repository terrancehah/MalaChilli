import { Info, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface InfoButtonProps {
  title: string;
  description: string;
}

/**
 * InfoButton component displays an info icon that opens a modal with detailed information
 * Used throughout the merchant dashboard to explain metrics and statistics
 */
export function InfoButton({ title, description }: InfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 p-0 hover:bg-transparent"
        onClick={() => setIsOpen(true)}
      >
        <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <Card
            className="w-full max-w-2xl p-6 relative max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 h-6 w-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
            
            <h3 className="text-lg font-semibold mb-4 pr-8">{title}</h3>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {description}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
