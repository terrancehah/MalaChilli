import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { Line, LineChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { TrendingUp, DollarSign, Percent } from 'lucide-react';

interface BusinessMetricsChartsProps {
  revenueData?: Array<{
    date: string;
    gross_revenue: number;
    net_revenue: number;
    discount_amount: number;
  }>;
  discountBreakdown?: {
    guaranteed_discount_total: number;
    vc_redemption_total: number;
    guaranteed_percentage: number;
    vc_percentage: number;
  };
}

export function BusinessMetricsCharts({ 
  revenueData = [],
  discountBreakdown
}: BusinessMetricsChartsProps) {
  
  const chartConfig = {
    gross_revenue: {
      label: "Gross Revenue",
      color: "hsl(var(--chart-1))",
    },
    net_revenue: {
      label: "Net Revenue",
      color: "hsl(var(--chart-2))",
    },
    discount_amount: {
      label: "Discounts",
      color: "hsl(var(--chart-3))",
    },
  };

  // Prepare discount breakdown data
  const discountData = discountBreakdown ? [
    { 
      name: 'Guaranteed (5%)', 
      amount: discountBreakdown.guaranteed_discount_total,
      percentage: discountBreakdown.guaranteed_percentage,
      fill: 'hsl(var(--chart-4))'
    },
    { 
      name: 'VC Redemption', 
      amount: discountBreakdown.vc_redemption_total,
      percentage: discountBreakdown.vc_percentage,
      fill: 'hsl(var(--chart-5))'
    },
  ] : [];

  // Get last 14 days for better visualization
  const recentRevenue = revenueData.slice(0, 14).reverse();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Revenue Trend Line Chart */}
      {recentRevenue.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              Revenue Trend (Last 14 Days)
            </CardTitle>
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

      {/* Discount Breakdown Bar Chart */}
      {discountBreakdown && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Percent className="h-4 w-4 sm:h-5 sm:w-5" />
              Discount Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart data={discountData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  type="number"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `RM${value}`}
                />
                <YAxis 
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={120}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value, name, props) => [
                      `RM ${Number(value).toLocaleString('en-MY', { minimumFractionDigits: 2 })} (${props.payload.percentage.toFixed(1)}%)`,
                      name
                    ]}
                  />} 
                />
                <Bar dataKey="amount" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ChartContainer>
            
            {/* Total Discounts Summary */}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-orange-600" />
              <span className="text-muted-foreground">Total Discounts:</span>
              <span className="font-semibold text-foreground">
                RM {(discountBreakdown.guaranteed_discount_total + discountBreakdown.vc_redemption_total).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
