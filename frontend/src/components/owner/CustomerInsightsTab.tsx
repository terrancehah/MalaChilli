import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { supabase } from '../../lib/supabase';
import type { DashboardSummary, CustomerSegmentation, CustomerAcquisitionSource } from '../../types/analytics.types';
import { Users, UserPlus, TrendingUp, AlertTriangle, Award, Target, PieChart } from 'lucide-react';
import { CustomerInsightsCharts } from './CustomerInsightsCharts';

interface CustomerInsightsTabProps {
  restaurantId: string;
  summary: DashboardSummary | null;
}

export function CustomerInsightsTab({ restaurantId, summary }: CustomerInsightsTabProps) {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<CustomerSegmentation[]>([]);
  const [acquisitionData, setAcquisitionData] = useState<CustomerAcquisitionSource[]>([]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);

        // Fetch customer segmentation data
        const { data: customerData } = await supabase
          .from('customer_segmentation')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('total_spent', { ascending: false });

        if (customerData) {
          setCustomers(customerData);
        }

        // Fetch acquisition source data
        const { data: acquisitionData } = await supabase
          .from('customer_acquisition_source')
          .select('*')
          .eq('restaurant_id', restaurantId);

        if (acquisitionData) {
          setAcquisitionData(acquisitionData);
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const customerInsights = summary?.customer_insights;
  const totalCustomers = customerInsights?.total_customers || 0;
  const activeCustomers = customerInsights?.active_customers || 0;
  const atRiskCustomers = customerInsights?.at_risk_customers || 0;
  const avgLifetimeValue = customerInsights?.avg_lifetime_value || 0;

  // Calculate segmentation stats
  const vipCustomers = customers.filter(c => c.spend_segment === 'vip').length;
  const highSpenders = customers.filter(c => c.spend_segment === 'high').length;
  const mediumSpenders = customers.filter(c => c.spend_segment === 'medium').length;
  const lowSpenders = customers.filter(c => c.spend_segment === 'low').length;

  // Calculate activity stats
  const superActive = customers.filter(c => c.activity_segment === 'super_active').length;
  const activeSegment = customers.filter(c => c.activity_segment === 'active').length;
  const moderate = customers.filter(c => c.activity_segment === 'moderate').length;
  const oneTime = customers.filter(c => c.activity_segment === 'one_time').length;

  // Calculate acquisition stats
  const referralAcquired = acquisitionData.filter(a => a.acquisition_source === 'referral').length;
  const walkInAcquired = acquisitionData.filter(a => a.acquisition_source === 'walk_in').length;
  const referralPercentage = acquisitionData.length > 0 
    ? ((referralAcquired / acquisitionData.length) * 100).toFixed(1) 
    : '0';

  // Top customers by spend
  const topCustomers = customers.slice(0, 10);

  // At-risk customers
  const atRiskList = customers.filter(c => c.churn_risk === 'high_risk' || c.churn_risk === 'at_risk').slice(0, 10);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Customer Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Customers */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground">{totalCustomers}</p>
              <p className="text-xs text-muted-foreground">
                {activeCustomers} active ({((activeCustomers / totalCustomers) * 100).toFixed(0)}%)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Acquisition Source */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Acquisition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-green-600">{referralPercentage}%</p>
              <p className="text-xs text-muted-foreground">
                From referrals ({referralAcquired} customers)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Average CLV */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Avg Lifetime Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-blue-600">
                RM {avgLifetimeValue.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">Per customer</p>
            </div>
          </CardContent>
        </Card>

        {/* At Risk */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              At Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-orange-600">{atRiskCustomers}</p>
              <p className="text-xs text-muted-foreground">
                {((atRiskCustomers / totalCustomers) * 100).toFixed(1)}% of total
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Charts */}
      <CustomerInsightsCharts 
        segmentationBySpend={{
          vip: vipCustomers,
          high: highSpenders,
          medium: mediumSpenders,
          low: lowSpenders
        }}
        segmentationByActivity={{
          super_active: superActive,
          active: activeSegment,
          moderate: moderate,
          one_time: oneTime
        }}
        acquisitionData={{
          referral: referralAcquired,
          walk_in: walkInAcquired
        }}
      />

      {/* Customer Segmentation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* By Spend */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Award className="h-5 w-5" />
              Segmentation by Spend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <div>
                  <p className="font-semibold text-foreground">VIP</p>
                  <p className="text-xs text-muted-foreground">&gt;RM 500</p>
                </div>
                <p className="text-2xl font-bold text-yellow-600">{vipCustomers}</p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div>
                  <p className="font-semibold text-foreground">High</p>
                  <p className="text-xs text-muted-foreground">RM 200-500</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">{highSpenders}</p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div>
                  <p className="font-semibold text-foreground">Medium</p>
                  <p className="text-xs text-muted-foreground">RM 100-200</p>
                </div>
                <p className="text-2xl font-bold text-green-600">{mediumSpenders}</p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/20">
                <div>
                  <p className="font-semibold text-foreground">Low</p>
                  <p className="text-xs text-muted-foreground">&lt;RM 100</p>
                </div>
                <p className="text-2xl font-bold text-gray-600">{lowSpenders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* By Activity */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Target className="h-5 w-5" />
              Segmentation by Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <div>
                  <p className="font-semibold text-foreground">Super Active</p>
                  <p className="text-xs text-muted-foreground">&gt;10 visits</p>
                </div>
                <p className="text-2xl font-bold text-purple-600">{superActive}</p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div>
                  <p className="font-semibold text-foreground">Active</p>
                  <p className="text-xs text-muted-foreground">5-10 visits</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">{activeSegment}</p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div>
                  <p className="font-semibold text-foreground">Moderate</p>
                  <p className="text-xs text-muted-foreground">2-4 visits</p>
                </div>
                <p className="text-2xl font-bold text-green-600">{moderate}</p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/20">
                <div>
                  <p className="font-semibold text-foreground">One-time</p>
                  <p className="text-xs text-muted-foreground">1 visit</p>
                </div>
                <p className="text-2xl font-bold text-gray-600">{oneTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <Award className="h-5 w-5" />
            Top 10 Customers by Spend
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topCustomers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No customer data available yet.
            </p>
          ) : (
            <div className="space-y-2">
              {topCustomers.map((customer, index) => (
                <div
                  key={customer.customer_id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                      ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-muted text-muted-foreground'}
                    `}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{customer.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.total_visits} visits • {customer.activity_segment}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">
                      RM {customer.total_spent.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {customer.spend_segment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* At-Risk Customers */}
      {atRiskList.length > 0 && (
        <Card className="border-border/50 border-orange-200 dark:border-orange-900">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              At-Risk Customers (Need Re-engagement)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {atRiskList.map((customer) => (
                <div
                  key={customer.customer_id}
                  className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                >
                  <div>
                    <p className="font-semibold text-sm">{customer.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Last visit: {customer.days_since_last_visit} days ago • 
                      {customer.churn_risk === 'high_risk' ? ' High risk' : ' At risk'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">
                      RM {customer.total_spent.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {customer.total_visits} visits
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-orange-600 mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              💡 Tip: Send these customers a special offer or bonus to re-engage them!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Acquisition Breakdown */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Customer Acquisition Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-sm text-muted-foreground mb-1">Referrals</p>
              <p className="text-3xl font-bold text-green-600">{referralAcquired}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {referralPercentage}% of total
              </p>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-muted-foreground mb-1">Walk-ins</p>
              <p className="text-3xl font-bold text-blue-600">{walkInAcquired}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {(100 - parseFloat(referralPercentage)).toFixed(1)}% of total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon */}
      <Card className="border-border/50 bg-muted/30">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            👥 More customer insights coming soon: Cohort retention analysis, CLV predictions, churn forecasting, visit frequency patterns
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
