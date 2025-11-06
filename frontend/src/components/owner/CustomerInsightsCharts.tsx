import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { Bar, BarChart, Pie, PieChart, Cell, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Award, Target, PieChart as PieChartIcon } from 'lucide-react';

interface CustomerInsightsChartsProps {
  segmentationBySpend?: {
    vip: number;
    high: number;
    medium: number;
    low: number;
  };
  segmentationByActivity?: {
    super_active: number;
    active: number;
    moderate: number;
    one_time: number;
  };
  acquisitionData?: {
    referral: number;
    walk_in: number;
  };
}

export function CustomerInsightsCharts({ 
  segmentationBySpend,
  segmentationByActivity,
  acquisitionData
}: CustomerInsightsChartsProps) {
  
  const chartConfig = {
    customers: {
      label: "Customers",
      color: "hsl(var(--chart-1))",
    },
  };

  // Prepare spend segmentation data
  const spendData = segmentationBySpend ? [
    { name: 'VIP (>RM500)', value: segmentationBySpend.vip, fill: '#EAB308' },
    { name: 'High (RM200-500)', value: segmentationBySpend.high, fill: '#3B82F6' },
    { name: 'Medium (RM100-200)', value: segmentationBySpend.medium, fill: '#10B981' },
    { name: 'Low (<RM100)', value: segmentationBySpend.low, fill: '#6B7280' },
  ] : [];

  // Prepare activity segmentation data
  const activityData = segmentationByActivity ? [
    { name: 'Super Active', value: segmentationByActivity.super_active, fill: 'hsl(var(--chart-1))' },
    { name: 'Active', value: segmentationByActivity.active, fill: 'hsl(var(--chart-2))' },
    { name: 'Moderate', value: segmentationByActivity.moderate, fill: 'hsl(var(--chart-3))' },
    { name: 'One-time', value: segmentationByActivity.one_time, fill: 'hsl(var(--chart-4))' },
  ] : [];

  // Prepare acquisition data for pie chart
  const acquisitionChartData = acquisitionData ? [
    { name: 'Referrals', value: acquisitionData.referral, fill: 'hsl(var(--chart-2))' },
    { name: 'Walk-ins', value: acquisitionData.walk_in, fill: 'hsl(var(--chart-4))' },
  ] : [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Segmentation by Spend */}
      {segmentationBySpend && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Award className="h-4 w-4 sm:h-5 sm:w-5" />
              Customer Segmentation by Spend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={spendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  angle={-15}
                  textAnchor="end"
                  height={70}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {spendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Segmentation by Activity */}
        {segmentationByActivity && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                By Activity Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={70}
                      dataKey="value"
                    >
                      {activityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              {/* Legend */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                {activityData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: entry.fill }} />
                    <span className="text-muted-foreground truncate">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Acquisition Sources */}
        {acquisitionData && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                Acquisition Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={acquisitionChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={70}
                      dataKey="value"
                    >
                      {acquisitionChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              {/* Legend with counts */}
              <div className="mt-3 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-2))]" />
                  <span className="text-muted-foreground">Referrals:</span>
                  <span className="font-semibold">{acquisitionData.referral}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-4))]" />
                  <span className="text-muted-foreground">Walk-ins:</span>
                  <span className="font-semibold">{acquisitionData.walk_in}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
