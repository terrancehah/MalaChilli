import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface DashboardHeaderProps {
  user: {
    full_name?: string | null;
    email?: string | null;
  } | null;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function DashboardHeader({ user, title, subtitle, actions, children }: DashboardHeaderProps) {
  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || '?';

  return (
    <div className="bg-gradient-to-br from-primary to-primary-light px-6 pt-10 pb-6 rounded-b-3xl">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Avatar className="h-14 w-14 border-2 border-white/20 flex-shrink-0">
            <AvatarImage src="" alt={user?.full_name || user?.email || ''} />
            <AvatarFallback className="bg-white/10 text-primary-foreground text-base">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
              {title}
            </h1>
            <p className="text-primary-foreground/80 text-sm">{subtitle}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {actions}
        </div>
      </div>
      {children && (
        <div className="mt-6">
          {children}
        </div>
      )}
    </div>
  );
}
