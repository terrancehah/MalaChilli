import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface InfoItem {
  text: string;
  color?: "primary" | "green" | "blue";
}

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: readonly InfoItem[];
}

export function InfoModal({ isOpen, onClose, title, items }: InfoModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Delay animation to ensure element is mounted
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const getColorClass = (color?: string) => {
    switch (color) {
      case "green":
        return "text-green-600";
      case "blue":
        return "text-blue-600";
      case "primary":
      default:
        return "text-primary";
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`glass max-w-lg w-full transition-all duration-200 ${
          isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="relative mb-6">
            <h3 className="text-xl font-bold text-foreground leading-none pt-2">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="absolute top-0 right-0 h-6 w-6 p-0 hover:bg-muted rounded-md transition-colors flex items-center justify-center"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="text-sm">
            <ul className="space-y-2 text-foreground">
              {items.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className={`mt-0.5 ${getColorClass(item.color)}`}>
                    •
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: item.text }} />
                </li>
              ))}
            </ul>
          </div>

          <Button onClick={onClose} className="w-full mt-6">
            Got it!
          </Button>
        </div>
      </div>
    </div>
  );
}
