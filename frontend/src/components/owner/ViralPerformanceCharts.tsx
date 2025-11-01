import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { TrendingUp, Users, Link2 } from 'lucide-react';

interface ViralPerformanceChartsProps {
  savedCodesPipeline?: {
    total_saved_codes: number;
    unused_codes: number;
    converted_codes: number;
    conversion_rate: number;
  };
  networkGrowthData?: Array<{
    date: string;
    total_customers: number;
    active_sharers: number;
  }>;
}

export function ViralPerformanceCharts({ 
  savedCodesPipeline,
  networkGrowthData = []
}: ViralPerformanceChartsProps) {
  
  // Prepare saved codes data for bar chart
  const savedCodesData = savedCodesPipeline ? [
    { name: 'Total Saved', value: savedCodesPipeline.total_saved_codes, fill: 'hsl(var(--chart-1))' },
    { name: 'Awaiting Visit', value: savedCodesPipeline.unused_codes, fill: 'hsl(var(--chart-3))' },
    { name: 'Converted', value: savedCodesPipeline.converted_codes, fill: 'hsl(var(--chart-2))' },
  ] : [];

  const chartConfig = {
    total_customers: {
      label: "Total Customers",
      color: "hsl(var(--chart-1))",
    },
    active_sharers: {
      label: "Active Sharers",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Saved Codes Pipeline Chart */}
      {savedCodesPipeline && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Link2 className="h-4 w-4 sm:h-5 sm:w-5" />
              Saved Codes Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart data={savedCodesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartContainer>
            
            {/* Conversion Rate Badge */}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="font-semibold">{savedCodesPipeline.conversion_rate.toFixed(1)}%</span>
              </div>
              <span className="text-muted-foreground">conversion rate</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Network Growth Trend */}
      {networkGrowthData.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              Network Growth Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <AreaChart data={networkGrowthData}>
                <defs>
                  <linearGradient id="fillCustomers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="fillSharers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="total_customers"
                  stroke="hsl(var(--chart-1))"
                  fill="url(#fillCustomers)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="active_sharers"
                  stroke="hsl(var(--chart-2))"
                  fill="url(#fillSharers)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
