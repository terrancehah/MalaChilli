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

export { 
  Skeleton, 
  CardSkeleton, 
  StatsCardSkeleton, 
  ListSkeleton, 
  HeaderSkeleton 
}
