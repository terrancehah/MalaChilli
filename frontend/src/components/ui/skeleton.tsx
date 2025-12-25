import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

/* Reusable Skeleton Components */

interface CardSkeletonProps {
  lines?: number;
  showAvatar?: boolean;
  showButton?: boolean;
  className?: string;
}

function CardSkeleton({ 
  lines = 3, 
  showAvatar = false, 
  showButton = false,
  className 
}: CardSkeletonProps) {
  return (
    <div className={cn("border border-border/50 rounded-lg p-4 bg-gradient-to-br from-primary/5 to-primary-light/10 dark:from-primary/10 dark:to-primary-light/5", className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          {showAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
          <div className="flex-1">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        {showButton && <Skeleton className="h-9 w-20 rounded-md" />}
      </div>
      
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
      
      {lines > 2 && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <Skeleton className="h-4 w-full" />
        </div>
      )}
    </div>
  )
}

interface StatsCardSkeletonProps {
  statsCount?: number;
  className?: string;
}

function StatsCardSkeleton({ statsCount = 3, className }: StatsCardSkeletonProps) {
  return (
    <div className={cn("border border-border/50 rounded-lg shadow-sm p-5 md:p-6", className)}>
      <div className={`grid grid-cols-${statsCount} gap-2 md:gap-4 text-center`}>
        {Array.from({ length: statsCount }).map((_, index) => (
          <div key={index} className="py-2">
            <Skeleton className="h-12 w-12 md:h-14 md:w-14 rounded-full mx-auto mb-3" />
            <Skeleton className="h-7 w-16 mx-auto mb-1" />
            <Skeleton className="h-3 w-20 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

interface ListSkeletonProps {
  items?: number;
  className?: string;
}

function ListSkeleton({ items = 3, className }: ListSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: items }).map((_, index) => (
        <CardSkeleton key={index} lines={2} showAvatar />
      ))}
    </div>
  )
}

interface HeaderSkeletonProps {
  showButton?: boolean;
  className?: string;
}

function HeaderSkeleton({ showButton = true, className }: HeaderSkeletonProps) {
  return (
    <div className={cn("bg-gradient-to-br from-primary to-primary-light px-6 pt-10 pb-7 rounded-b-3xl", className)}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex-1">
          <Skeleton className="h-7 w-40 mb-2 bg-white/20" />
          <Skeleton className="h-4 w-32 bg-white/20" />
        </div>
        {showButton && <Skeleton className="h-12 w-12 rounded-xl bg-white/20" />}
      </div>
    </div>
  )
}

/* Additional Skeleton Components - Design System State Patterns */

interface ImageSkeletonProps {
  className?: string;
  aspectRatio?: "square" | "video" | "wide";
}

/**
 * ImageSkeleton - Placeholder for image content
 * Supports different aspect ratios for various image contexts
 */
function ImageSkeleton({ className, aspectRatio = "video" }: ImageSkeletonProps) {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
  };

  return (
    <Skeleton 
      className={cn(
        "w-full rounded-lg", 
        aspectClasses[aspectRatio],
        className
      )} 
    />
  );
}

interface TextBlockSkeletonProps {
  lines?: number;
  className?: string;
}

/**
 * TextBlockSkeleton - Multi-line paragraph placeholder
 * Last line is shorter to simulate natural text ending
 */
function TextBlockSkeleton({ lines = 3, className }: TextBlockSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            "h-4 rounded-md",
            // Last line is shorter to look more natural
            i === lines - 1 ? "w-4/5" : "w-full"
          )} 
        />
      ))}
    </div>
  );
}

interface GridSkeletonProps {
  columns?: 2 | 3 | 4;
  items?: number;
  showImage?: boolean;
  className?: string;
}

/**
 * GridSkeleton - Grid of card skeletons for menu items, products, etc.
 * Configurable columns and item count
 */
function GridSkeleton({ 
  columns = 2, 
  items = 4, 
  showImage = true,
  className 
}: GridSkeletonProps) {
  const gridClasses = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridClasses[columns], className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div 
          key={i} 
          className="border border-border/50 rounded-xl p-4 bg-gradient-to-br from-primary/5 to-primary-light/10 dark:from-primary/10 dark:to-primary-light/5"
        >
          {showImage && <Skeleton className="h-24 w-full rounded-lg mb-3" />}
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

/**
 * TableSkeleton - Row-based table placeholder
 * Useful for order lists, transaction tables, etc.
 */
function TableSkeleton({ rows = 5, columns = 4, className }: TableSkeletonProps) {
  return (
    <div className={cn("divide-y divide-border", className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4 py-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              className={cn(
                "h-4 rounded-md",
                // Vary widths for visual interest
                colIndex === 0 ? "w-24" : 
                colIndex === columns - 1 ? "w-16 ml-auto" : 
                "w-20"
              )} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface MenuItemCardSkeletonProps {
  className?: string;
}

/**
 * MenuItemCardSkeleton - Specific skeleton for menu item cards
 * Matches the layout: image, title, description, price
 */
function MenuItemCardSkeleton({ className }: MenuItemCardSkeletonProps) {
  return (
    <div 
      className={cn(
        "border border-border/50 rounded-xl p-4 bg-gradient-to-br from-primary/5 to-primary-light/10 dark:from-primary/10 dark:to-primary-light/5",
        className
      )}
    >
      {/* Image skeleton */}
      <Skeleton className="h-32 w-full rounded-lg mb-3" />
      
      {/* Title skeleton */}
      <Skeleton className="h-5 w-3/4 mb-2" />
      
      {/* Description skeleton (2 lines) */}
      <div className="space-y-2 mb-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      {/* Price skeleton */}
      <Skeleton className="h-5 w-16" />
    </div>
  );
}

interface OrderItemSkeletonProps {
  className?: string;
}

/**
 * OrderItemSkeleton - Skeleton for order/transaction list items
 * Shows avatar, content lines, and action area
 */
function OrderItemSkeleton({ className }: OrderItemSkeletonProps) {
  return (
    <div className={cn("flex items-center gap-4 p-4", className)}>
      {/* Avatar/icon skeleton */}
      <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
      
      {/* Content skeleton */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      
      {/* Action skeleton */}
      <Skeleton className="h-8 w-20 rounded-md" />
    </div>
  );
}

interface OrderListSkeletonProps {
  items?: number;
  className?: string;
}

/**
 * OrderListSkeleton - List of order item skeletons
 */
function OrderListSkeleton({ items = 3, className }: OrderListSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <OrderItemSkeleton key={i} />
      ))}
    </div>
  );
}

export { 
  Skeleton, 
  CardSkeleton, 
  StatsCardSkeleton, 
  ListSkeleton, 
  HeaderSkeleton,
  // New skeleton components from Design System State Patterns
  ImageSkeleton,
  TextBlockSkeleton,
  GridSkeleton,
  TableSkeleton,
  MenuItemCardSkeleton,
  OrderItemSkeleton,
  OrderListSkeleton,
}
