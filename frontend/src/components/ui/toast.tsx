import { Toaster as HotToaster, toast as hotToast } from 'react-hot-toast';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

/**
 * Toast Provider Component
 * Centralized toast configuration following Design System State Patterns (Section 13.4)
 * Place this once in App.tsx to enable toasts throughout the application
 */
export function ToastProvider() {
  return (
    <HotToaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          padding: '16px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 500,
          maxWidth: '400px',
        },
        // Default success styling
        success: {
          style: {
            background: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
          },
          iconTheme: {
            primary: 'hsl(var(--primary-foreground))',
            secondary: 'hsl(var(--primary))',
          },
        },
        // Default error styling
        error: {
          style: {
            background: 'hsl(var(--destructive))',
            color: 'hsl(var(--destructive-foreground))',
          },
          iconTheme: {
            primary: 'hsl(var(--destructive-foreground))',
            secondary: 'hsl(var(--destructive))',
          },
        },
      }}
    />
  );
}

/* Toast Wrapper Helpers - Clean API for showing toasts */

interface ToastOptions {
  description?: string;
  duration?: number;
}

/**
 * Show a success toast notification
 * Uses primary color with CheckCircle icon
 */
export function showSuccessToast(message: string, options?: ToastOptions) {
  return hotToast.custom(
    (t) => (
      <div
        className={`flex items-center gap-3 p-4 bg-primary text-primary-foreground rounded-xl shadow-lg max-w-sm ${
          t.visible ? 'animate-in fade-in slide-in-from-top-2 duration-300' : 'animate-out fade-out slide-out-to-top-2 duration-300'
        }`}
      >
        <CheckCircle className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{message}</p>
          {options?.description && (
            <p className="text-xs opacity-90 mt-0.5">{options.description}</p>
          )}
        </div>
        <button
          onClick={() => hotToast.dismiss(t.id)}
          className="p-1 hover:bg-white/10 rounded-md transition-colors flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ),
    { duration: options?.duration ?? 4000 }
  );
}

/**
 * Show an error toast notification
 * Uses destructive color with AlertCircle icon
 */
export function showErrorToast(message: string, options?: ToastOptions) {
  return hotToast.custom(
    (t) => (
      <div
        className={`flex items-center gap-3 p-4 bg-destructive text-destructive-foreground rounded-xl shadow-lg max-w-sm ${
          t.visible ? 'animate-in fade-in slide-in-from-top-2 duration-300' : 'animate-out fade-out slide-out-to-top-2 duration-300'
        }`}
      >
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{message}</p>
          {options?.description && (
            <p className="text-xs opacity-90 mt-0.5">{options.description}</p>
          )}
        </div>
        <button
          onClick={() => hotToast.dismiss(t.id)}
          className="p-1 hover:bg-white/10 rounded-md transition-colors flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ),
    { duration: options?.duration ?? 5000 }
  );
}

/**
 * Show a warning toast notification
 * Uses amber color with AlertTriangle icon
 */
export function showWarningToast(message: string, options?: ToastOptions) {
  return hotToast.custom(
    (t) => (
      <div
        className={`flex items-center gap-3 p-4 bg-amber-500 text-white rounded-xl shadow-lg max-w-sm ${
          t.visible ? 'animate-in fade-in slide-in-from-top-2 duration-300' : 'animate-out fade-out slide-out-to-top-2 duration-300'
        }`}
      >
        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{message}</p>
          {options?.description && (
            <p className="text-xs opacity-90 mt-0.5">{options.description}</p>
          )}
        </div>
        <button
          onClick={() => hotToast.dismiss(t.id)}
          className="p-1 hover:bg-white/10 rounded-md transition-colors flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ),
    { duration: options?.duration ?? 4000 }
  );
}

/**
 * Show an info toast notification
 * Uses blue color with Info icon
 */
export function showInfoToast(message: string, options?: ToastOptions) {
  return hotToast.custom(
    (t) => (
      <div
        className={`flex items-center gap-3 p-4 bg-blue-600 text-white rounded-xl shadow-lg max-w-sm ${
          t.visible ? 'animate-in fade-in slide-in-from-top-2 duration-300' : 'animate-out fade-out slide-out-to-top-2 duration-300'
        }`}
      >
        <Info className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{message}</p>
          {options?.description && (
            <p className="text-xs opacity-90 mt-0.5">{options.description}</p>
          )}
        </div>
        <button
          onClick={() => hotToast.dismiss(t.id)}
          className="p-1 hover:bg-white/10 rounded-md transition-colors flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ),
    { duration: options?.duration ?? 4000 }
  );
}

/**
 * Dismiss a specific toast or all toasts
 */
export function dismissToast(toastId?: string) {
  if (toastId) {
    hotToast.dismiss(toastId);
  } else {
    hotToast.dismiss();
  }
}

/**
 * Show a loading toast that can be updated later
 * Returns the toast ID for updating/dismissing
 */
export function showLoadingToast(message: string) {
  return hotToast.loading(message, {
    style: {
      padding: '16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 500,
      background: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
      border: '1px solid hsl(var(--border))',
    },
  });
}

/**
 * Update an existing toast (useful for loading → success/error transitions)
 */
export function updateToast(
  toastId: string, 
  type: 'success' | 'error', 
  message: string,
  options?: ToastOptions
) {
  hotToast.dismiss(toastId);
  if (type === 'success') {
    return showSuccessToast(message, options);
  } else {
    return showErrorToast(message, options);
  }
}
