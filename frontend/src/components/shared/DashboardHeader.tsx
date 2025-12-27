interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function DashboardHeader({
  title,
  subtitle,
  actions,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-primary to-primary-light px-6 pt-8 pb-8 sm:pt-10 sm:pb-12 rounded-b-3xl relative transition-all duration-300 ease-in-out">
      {/* Background decoration - Contained to avoid clipping dropdowns */}
      <div className="absolute inset-0 overflow-hidden rounded-b-3xl pointer-events-none">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/5 rounded-full blur-2xl" />
      </div>

      <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-foreground tracking-tight leading-tight break-words">
            {title}
          </h1>
          <p className="text-primary-foreground/90 text-base sm:text-lg mt-2 font-medium break-words">
            {subtitle}
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0 self-start sm:self-center">
          {actions}
        </div>
      </div>
      {children && <div className="mt-6 sm:mt-8">{children}</div>}
    </div>
  );
}
