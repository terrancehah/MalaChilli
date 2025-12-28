import { Card, CardContent } from "../ui/card";

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
    <Card variant="default" className="bg-white dark:bg-gray-900">
      <CardContent className="p-4 md:p-6">
        <div
          className={`grid grid-cols-${stats.length} gap-2 md:gap-4 text-center`}
        >
          {stats.map((stat, index) => (
            <div key={index} className="py-2">
              <div className="flex items-center justify-center h-12 w-12 md:h-14 md:w-14 rounded-full bg-primary/10 mx-auto mb-3 text-primary">
                {stat.icon}
              </div>
              <p className="text-lg sm:text-2xl md:text-3xl font-bold text-primary-dark mb-1 whitespace-nowrap truncate px-1">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-normal">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
