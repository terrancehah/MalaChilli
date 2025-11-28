import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { ArrowLeft, Receipt } from 'lucide-react';

export default function MerchantTransactions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-light px-6 pt-10 pb-7 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/merchant/dashboard')}
            className="text-primary-foreground hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-1">
              Transaction History
            </h1>
            <p className="text-primary-foreground/80 text-sm">
              View all restaurant transactions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-6">
        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Transaction History Coming Soon
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              This feature will allow you to:
            </p>
            <ul className="text-left text-sm text-muted-foreground space-y-2 max-w-md mx-auto mb-6">
              <li>• View all transactions across all branches</li>
              <li>• Filter by date range, branch, or staff member</li>
              <li>• See detailed transaction breakdown (discounts, VC redemption)</li>
              <li>• Export transaction data for accounting</li>
              <li>• Track revenue trends and patterns</li>
            </ul>
            <Button onClick={() => navigate('/merchant/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
