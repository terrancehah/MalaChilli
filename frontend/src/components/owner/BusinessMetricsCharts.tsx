import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { getTranslation, type Language } from '../../translations';
import { InfoButton } from '../common';

interface BusinessMetricsChartsProps {
  revenueData?: Array<{
    date: string;
    gross_revenue: number;
    net_revenue: number;
    discount_amount: number;
  }>;
  language: Language;
}

export function BusinessMetricsCharts({ 
  revenueData = [],
  language
}: BusinessMetricsChartsProps) {
  const t = getTranslation(language);
  const [revenuePeriod, setRevenuePeriod] = useState<7 | 14 | 30>(14);
  
  const chartConfig = {
    gross_revenue: {
      label: t.ownerDashboard.businessMetrics.totalRevenue,
      color: "hsl(var(--chart-1))",
    },
    net_revenue: {
      label: t.ownerDashboard.businessMetrics.netRevenue,
      color: "hsl(var(--chart-2))",
    },
    discount_amount: {
      label: t.ownerDashboard.businessMetrics.totalDiscounts,
      color: "hsl(var(--chart-3))",
    },
  };

  // Get revenue data based on selected period
  const recentRevenue = revenueData.slice(0, revenuePeriod).reverse();
  
  // Calculate total revenue for each period
  const revenue7d = revenueData.slice(0, 7).reduce((sum, d) => sum + d.gross_revenue, 0);
  const revenue14d = revenueData.slice(0, 14).reduce((sum, d) => sum + d.gross_revenue, 0);
  const revenue30d = revenueData.reduce((sum, d) => sum + d.gross_revenue, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Revenue Trend Line Chart with Period Filter */}
      {recentRevenue.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                {t.ownerDashboard.businessMetrics.revenueOverTime}
                <InfoButton 
                  title={t.ownerDashboard.businessMetrics.revenueOverTime}
                  description={t.ownerDashboard.businessMetrics.revenueOverTimeInfo}
                />
              </CardTitle>
              
              {/* Period Filter Buttons */}
              <div className="flex gap-1">
                <Button
                  variant={revenuePeriod === 7 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRevenuePeriod(7)}
                  className="h-8 px-3 text-xs"
                >
                  {t.ownerDashboard.businessMetrics.days7}
                </Button>
                <Button
                  variant={revenuePeriod === 14 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRevenuePeriod(14)}
                  className="h-8 px-3 text-xs"
                >
                  {t.ownerDashboard.businessMetrics.days14}
                </Button>
                <Button
                  variant={revenuePeriod === 30 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRevenuePeriod(30)}
                  className="h-8 px-3 text-xs"
                >
                  {t.ownerDashboard.businessMetrics.days30}
                </Button>
              </div>
            </div>
            
            {/* Revenue Summary */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
              <div className={`p-2 rounded-lg transition-colors ${revenuePeriod === 7 ? 'bg-primary/10' : 'bg-muted/30'}`}>
                <p className="text-xs text-muted-foreground">{t.ownerDashboard.businessMetrics.last7Days}</p>
                <p className="text-sm sm:text-lg font-bold text-foreground">
                  RM {revenue7d.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className={`p-2 rounded-lg transition-colors ${revenuePeriod === 14 ? 'bg-primary/10' : 'bg-muted/30'}`}>
                <p className="text-xs text-muted-foreground">{t.ownerDashboard.businessMetrics.last14Days}</p>
                <p className="text-sm sm:text-lg font-bold text-foreground">
                  RM {revenue14d.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className={`p-2 rounded-lg transition-colors ${revenuePeriod === 30 ? 'bg-primary/10' : 'bg-muted/30'}`}>
                <p className="text-xs text-muted-foreground">{t.ownerDashboard.businessMetrics.last30Days}</p>
                <p className="text-sm sm:text-lg font-bold text-foreground">
                  RM {revenue30d.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart data={recentRevenue}>
                <defs>
                  <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `RM${value}`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value) => `RM ${Number(value).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`}
                  />} 
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey="gross_revenue"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--chart-1))', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="net_revenue"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: 'hsl(var(--chart-2))', r: 3 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
