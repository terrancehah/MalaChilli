import { Card, CardContent } from '../ui/card';

interface Stat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

interface StatsCardProps {
  stats: Stat[];
}

export function StatsCard({ stats }: StatsCardProps) {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="p-5 md:p-6">
        <div className={`grid grid-cols-${stats.length} gap-2 md:gap-4 text-center`}>
          {stats.map((stat, index) => (
            <div key={index} className="py-2">
              <div className="flex items-center justify-center h-12 w-12 md:h-14 md:w-14 rounded-full bg-muted dark:bg-muted/50 mx-auto mb-3">
                {stat.icon}
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
