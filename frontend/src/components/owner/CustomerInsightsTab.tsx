import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { supabase } from '../../lib/supabase';
import type { DashboardSummary, CustomerSegmentation, CustomerAcquisitionSource } from '../../types/analytics.types';
import { Users, UserPlus, TrendingUp, AlertTriangle, Award, Target, PieChart, X } from 'lucide-react';
import { getTranslation, type Language } from '../../translations';
import { InfoButton } from '../shared';

interface CustomerInsightsTabProps {
  restaurantId: string;
  summary: DashboardSummary | null;
  language: Language;
}

interface CustomerDetail {
  customer_id: string;
  full_name: string;
  total_visits: number;
  total_spent: number;
  rfm_segment: string;
  days_since_last_visit: number;
}

export function CustomerInsightsTab({ restaurantId, summary, language }: CustomerInsightsTabProps) {
  const t = getTranslation(language);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<CustomerSegmentation[]>([]);
  const [acquisitionData, setAcquisitionData] = useState<CustomerAcquisitionSource[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string>('');
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerDetail[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  // Helper function to translate RFM segment names
  const translateSegment = (segment: string): string => {
    const segmentMap: Record<string, string> = {
      'Champions': t.ownerDashboard.customerInsights.segmentChampions,
      'Loyal Customers': t.ownerDashboard.customerInsights.segmentLoyal,
      'Potential Loyalists': t.ownerDashboard.customerInsights.segmentPotentialLoyalists,
      'New Customers': t.ownerDashboard.customerInsights.segmentNewCustomers,
      'Promising': t.ownerDashboard.customerInsights.segmentPromising,
      'At Risk': t.ownerDashboard.customerInsights.segmentAtRisk,
      'Cant Lose Them': t.ownerDashboard.customerInsights.segmentCantLoseThem,
      'Hibernating': t.ownerDashboard.customerInsights.segmentHibernating,
    };
    return segmentMap[segment] || segment;
  };

  // Helper function to get segment info/description
  const getSegmentInfo = (segment: string): string => {
    const segmentInfoMap: Record<string, string> = {
      'Champions': t.ownerDashboard.customerInsights.segmentChampionsInfo,
      'Loyal Customers': t.ownerDashboard.customerInsights.segmentLoyalInfo,
      'Potential Loyalists': t.ownerDashboard.customerInsights.segmentPotentialLoyalistsInfo,
      'New Customers': t.ownerDashboard.customerInsights.segmentNewCustomersInfo,
      'Promising': t.ownerDashboard.customerInsights.segmentPromisingInfo,
      'At Risk': t.ownerDashboard.customerInsights.segmentAtRiskInfo,
      'Cant Lose Them': t.ownerDashboard.customerInsights.segmentCantLoseThemInfo,
      'Hibernating': t.ownerDashboard.customerInsights.segmentHibernatingInfo,
    };
    return segmentInfoMap[segment] || '';
  };

  // Function to fetch customers by segment
  const fetchCustomersBySegment = async (segment: string) => {
    setLoadingCustomers(true);
    try {
      const { data, error } = await supabase
        .from('customer_segmentation')
        .select('customer_id, full_name, total_visits, total_spent, rfm_segment, days_since_last_visit')
        .eq('restaurant_id', restaurantId)
        .eq('rfm_segment', segment)
        .order('total_spent', { ascending: false });

      if (error) throw error;
      setFilteredCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setFilteredCustomers([]);
    } finally {
      setLoadingCustomers(false);
    }
  };

  // Handle segment card click
  const handleSegmentClick = async (segment: string) => {
    setSelectedSegment(segment);
    setShowModal(true);
    await fetchCustomersBySegment(segment);
  };

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

  // Calculate RFM segmentation stats
  const rfmSegments = customerInsights?.rfm_segmentation;
  const champions = rfmSegments?.Champions || 0;
  const loyalCustomers = rfmSegments?.['Loyal Customers'] || 0;
  const potentialLoyalists = rfmSegments?.['Potential Loyalists'] || 0;
  const atRiskSegment = rfmSegments?.['At Risk'] || 0;
  const cantLoseThem = rfmSegments?.['Cant Lose Them'] || 0;
  const hibernating = rfmSegments?.Hibernating || 0;
  const newCustomers = rfmSegments?.['New Customers'] || 0;
  const promising = rfmSegments?.Promising || 0;

  // Calculate acquisition stats
  const referralAcquired = acquisitionData.filter(a => a.acquisition_source === 'referral').length;
  const walkInAcquired = acquisitionData.filter(a => a.acquisition_source === 'walk_in').length;
  const referralPercentage = acquisitionData.length > 0 
    ? ((referralAcquired / acquisitionData.length) * 100).toFixed(1) 
    : '0';

  // Top customers by spend
  const topCustomers = customers.slice(0, 10);

  // At-risk customers (based on RFM)
  const atRiskList = customers.filter(c => 
    c.rfm_segment === 'At Risk' || 
    c.rfm_segment === 'Cant Lose Them' || 
    c.rfm_segment === 'Hibernating'
  ).slice(0, 10);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Customer Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Customers */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t.ownerDashboard.customerInsights.totalCustomers}
              <InfoButton 
                title={t.ownerDashboard.customerInsights.totalCustomers}
                description={t.ownerDashboard.customerInsights.totalCustomersInfo}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground">{totalCustomers}</p>
              <p className="text-xs text-muted-foreground">
                {activeCustomers} {t.ownerDashboard.customerInsights.active} ({((activeCustomers / totalCustomers) * 100).toFixed(0)}%)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Active Customers */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              {t.ownerDashboard.customerInsights.activeCustomers}
              <InfoButton 
                title={t.ownerDashboard.customerInsights.activeCustomers}
                description={t.ownerDashboard.customerInsights.activeCustomersInfo}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-green-600">{activeCustomers}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'zh' 
                  ? `(${t.ownerDashboard.customerInsights.ofTotal} ${((activeCustomers / totalCustomers) * 100).toFixed(0)}%)`
                  : `(${((activeCustomers / totalCustomers) * 100).toFixed(0)}% ${t.ownerDashboard.customerInsights.ofTotal})`
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Acquisition Source */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              {t.ownerDashboard.customerInsights.acquisition}
              <InfoButton 
                title={t.ownerDashboard.customerInsights.acquisition}
                description={t.ownerDashboard.customerInsights.fromReferrals}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-green-600">{referralPercentage}%</p>
              <p className="text-xs text-muted-foreground">
                {t.ownerDashboard.customerInsights.fromReferrals} ({referralAcquired} {t.ownerDashboard.customerInsights.customers})
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Avg Lifetime Value */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t.ownerDashboard.customerInsights.avgLifetimeValue}
              <InfoButton 
                title={t.ownerDashboard.customerInsights.avgLifetimeValue}
                description={t.ownerDashboard.customerInsights.avgLifetimeValueInfo}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-blue-600">
                RM {avgLifetimeValue.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">{t.ownerDashboard.customerInsights.perCustomer}</p>
            </div>
          </CardContent>
        </Card>

        {/* At Risk */}
        <Card className="border-border/50 border-orange-200 dark:border-orange-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {t.ownerDashboard.customerInsights.atRiskCustomers}
              <InfoButton 
                title={t.ownerDashboard.customerInsights.atRiskCustomers}
                description={t.ownerDashboard.customerInsights.atRiskCustomersInfo}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-orange-600">{atRiskCustomers}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'zh'
                  ? `${t.ownerDashboard.customerInsights.ofTotal} ${((atRiskCustomers / totalCustomers) * 100).toFixed(1)}%`
                  : `${((atRiskCustomers / totalCustomers) * 100).toFixed(1)}% ${t.ownerDashboard.customerInsights.ofTotal}`
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RFM Customer Segmentation */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t.ownerDashboard.customerInsights.rfmSegmentation}
            <InfoButton 
              title={t.ownerDashboard.customerInsights.rfmSegmentation}
              description={t.ownerDashboard.customerInsights.rfmSegmentationInfo}
            />
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            {t.ownerDashboard.customerInsights.rfmSegmentationSubtitle}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Champions */}
            <div 
              onClick={() => handleSegmentClick('Champions')}
              className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 cursor-pointer shadow-md hover:shadow-sm active:shadow-none transition-shadow"
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">{t.ownerDashboard.customerInsights.champions}</p>
              <p className="text-2xl font-bold text-yellow-600">{champions}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.ownerDashboard.customerInsights.championsDesc}</p>
            </div>

            {/* Loyal Customers */}
            <div 
              onClick={() => handleSegmentClick('Loyal Customers')}
              className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 cursor-pointer shadow-md hover:shadow-sm active:shadow-none transition-shadow"
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">{t.ownerDashboard.customerInsights.loyal}</p>
              <p className="text-2xl font-bold text-blue-600">{loyalCustomers}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.ownerDashboard.customerInsights.loyalDesc}</p>
            </div>

            {/* Potential Loyalists */}
            <div 
              onClick={() => handleSegmentClick('Potential Loyalists')}
              className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 cursor-pointer shadow-md hover:shadow-sm active:shadow-none transition-shadow"
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">{t.ownerDashboard.customerInsights.potential}</p>
              <p className="text-2xl font-bold text-green-600">{potentialLoyalists}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.ownerDashboard.customerInsights.potentialDesc}</p>
            </div>

            {/* New Customers */}
            <div 
              onClick={() => handleSegmentClick('New Customers')}
              className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 cursor-pointer shadow-md hover:shadow-sm active:shadow-none transition-shadow"
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">{t.ownerDashboard.customerInsights.newCustomers}</p>
              <p className="text-2xl font-bold text-purple-600">{newCustomers}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.ownerDashboard.customerInsights.newCustomersDesc}</p>
            </div>

            {/* At Risk */}
            <div 
              onClick={() => handleSegmentClick('At Risk')}
              className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 cursor-pointer shadow-md hover:shadow-sm active:shadow-none transition-shadow"
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">{t.ownerDashboard.customerInsights.atRisk}</p>
              <p className="text-2xl font-bold text-orange-600">{atRiskSegment}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.ownerDashboard.customerInsights.atRiskDesc}</p>
            </div>

            {/* Can't Lose Them */}
            <div 
              onClick={() => handleSegmentClick('Cant Lose Them')}
              className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 cursor-pointer shadow-md hover:shadow-sm active:shadow-none transition-shadow"
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">{t.ownerDashboard.customerInsights.cantLose}</p>
              <p className="text-2xl font-bold text-red-600">{cantLoseThem}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.ownerDashboard.customerInsights.cantLoseDesc}</p>
            </div>

            {/* Hibernating */}
            <div 
              onClick={() => handleSegmentClick('Hibernating')}
              className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 cursor-pointer shadow-md hover:shadow-sm active:shadow-none transition-shadow"
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">{t.ownerDashboard.customerInsights.hibernating}</p>
              <p className="text-2xl font-bold text-gray-600">{hibernating}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.ownerDashboard.customerInsights.hibernatingDesc}</p>
            </div>

            {/* Promising */}
            <div 
              onClick={() => handleSegmentClick('Promising')}
              className="p-3 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 cursor-pointer shadow-md hover:shadow-sm active:shadow-none transition-shadow"
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">{t.ownerDashboard.customerInsights.promising}</p>
              <p className="text-2xl font-bold text-teal-600">{promising}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.ownerDashboard.customerInsights.promisingDesc}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acquisition Sources */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            {t.ownerDashboard.customerInsights.customerAcquisitionSources}
            <InfoButton 
              title={t.ownerDashboard.customerInsights.customerAcquisitionSources}
              description={t.ownerDashboard.customerInsights.fromReferrals}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-sm font-medium text-muted-foreground mb-2">{t.ownerDashboard.customerInsights.referrals}</p>
              <p className="text-3xl font-bold text-green-600">{referralAcquired}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'zh'
                  ? `${t.ownerDashboard.customerInsights.ofTotal} ${referralPercentage}%`
                  : `${referralPercentage}% ${t.ownerDashboard.customerInsights.ofTotal}`
                }
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-muted-foreground mb-2">{t.ownerDashboard.customerInsights.walkIns}</p>
              <p className="text-3xl font-bold text-blue-600">{walkInAcquired}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'zh'
                  ? `${t.ownerDashboard.customerInsights.ofTotal} ${(100 - parseFloat(referralPercentage)).toFixed(1)}%`
                  : `${(100 - parseFloat(referralPercentage)).toFixed(1)}% ${t.ownerDashboard.customerInsights.ofTotal}`
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <Award className="h-5 w-5" />
            {t.ownerDashboard.customerInsights.topCustomers}
            <InfoButton 
              title={t.ownerDashboard.customerInsights.topCustomers}
              description={t.ownerDashboard.customerInsights.topCustomersInfo}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topCustomers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {t.ownerDashboard.customerInsights.noCustomers}
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
                        {customer.total_visits} {t.ownerDashboard.customerInsights.visits}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">
                      RM {customer.total_spent.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {translateSegment(customer.rfm_segment)}
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
              {t.ownerDashboard.customerInsights.atRiskList}
              <InfoButton 
                title={t.ownerDashboard.customerInsights.atRiskList}
                description={t.ownerDashboard.customerInsights.atRiskListInfo}
              />
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
                      {t.ownerDashboard.customerInsights.lastVisit}: {customer.days_since_last_visit} {t.ownerDashboard.customerInsights.daysAgo} • {translateSegment(customer.rfm_segment)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">
                      RM {customer.total_spent.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {customer.total_visits} {t.ownerDashboard.customerInsights.visits}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-orange-600 mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              {t.ownerDashboard.customerInsights.reengagementTip}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Coming Soon */}
      <Card className="border-border/50 bg-muted/30">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            {t.ownerDashboard.customerInsights.comingSoon}
          </p>
        </CardContent>
      </Card>

      {/* Customer List Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
            {/* Close Button - Positioned Absolutely */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 h-8 w-8 z-10"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Modal Header */}
            <div className="p-4 pr-12 border-b border-border">
              <h2 className="text-lg font-semibold">{translateSegment(selectedSegment)}</h2>
              <p className="text-sm text-muted-foreground mt-1">{getSegmentInfo(selectedSegment)}</p>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
              {loadingCustomers ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : filteredCustomers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {t.ownerDashboard.customerInsights.noCustomers}
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.customer_id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-sm">{customer.full_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {customer.total_visits} {t.ownerDashboard.customerInsights.visits} • 
                          {t.ownerDashboard.customerInsights.lastVisit}: {customer.days_since_last_visit} {t.ownerDashboard.customerInsights.daysAgo}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">
                          RM {customer.total_spent.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {translateSegment(customer.rfm_segment)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
