interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function DashboardHeader({ title, subtitle, actions, children }: DashboardHeaderProps) {

  return (
    <div className="bg-gradient-to-br from-primary to-primary-light px-6 pt-10 pb-6 rounded-b-3xl">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-primary-foreground/80 text-sm mb-1">{subtitle}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground">
            {title}
          </h1>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {actions}
        </div>
      </div>
      {children && (
        <div className="mt-5">
          {children}
        </div>
      )}
    </div>
  );
}
