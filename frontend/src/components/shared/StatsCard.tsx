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
        <div className={`grid grid-cols-${stats.length} gap-6 md:gap-8 text-center`}>
          {stats.map((stat, index) => (
            <div key={index} className="py-2">
              <div className="flex items-center justify-center h-12 w-12 md:h-14 md:w-14 rounded-full bg-muted dark:bg-muted/50 mx-auto mb-3">
                {stat.icon}
              </div>
              <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-xs md:text-sm text-muted-foreground leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
