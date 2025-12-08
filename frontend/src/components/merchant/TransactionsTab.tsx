import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import {
  Card,
  CardContent,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { getTranslation, type Language } from "../../translations";
import { format } from "date-fns";

// Define transaction type for the table
interface TransactionWithDetails {
  id: string;
  transaction_date: string;
  bill_amount: number;
  final_amount: number;
  total_discount: number;
  is_first_transaction: boolean;
  customer: {
    full_name: string;
    email: string;
  };
  branch: {
    name: string;
  };
  staff: {
    full_name: string;
  };
}

interface TransactionsTabProps {
  restaurantId: string;
  language: Language;
}

export function TransactionsTab({
  restaurantId,
  language,
}: TransactionsTabProps) {
  // Cast to any to avoid TS error while type inference updates
  const t = getTranslation(language) as any;
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<"today" | "7d" | "30d" | "all">("30d");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [totalCount, setTotalCount] = useState(0);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchTransactions();
  }, [restaurantId, debouncedSearch, dateRange, page]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      // Base query
      let query = supabase
        .from("transactions")
        .select(
          `
          id,
          transaction_date,
          bill_amount,
          final_amount,
          total_discount,
          is_first_transaction,
          customer:users!transactions_customer_id_fkey(full_name, email),
          branch:branches!transactions_branch_id_fkey(name, restaurant_id),
          staff:users!transactions_staff_id_fkey(full_name)
          `,
          { count: "exact" }
        )
        // Filter by restaurant indirectly via branches
        .eq("branch.restaurant_id", restaurantId); 

      // Apply Date Filter
      const now = new Date();
      if (dateRange === "today") {
        const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        query = query.gte("transaction_date", startOfDay);
      } else if (dateRange === "7d") {
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7)).toISOString();
        query = query.gte("transaction_date", sevenDaysAgo);
      } else if (dateRange === "30d") {
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30)).toISOString();
        query = query.gte("transaction_date", thirtyDaysAgo);
      }

      // Apply Search
      if (debouncedSearch) {
         // Simple ID search if it looks like a UUID
         if (debouncedSearch.length > 20) {
             query = query.eq("id", debouncedSearch);
         }
      }

      // Pagination
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      // We need to order by date desc
      query = query.order("transaction_date", { ascending: false }).range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      // Filter null branches and map data
      const formattedData: TransactionWithDetails[] = (data || [])
        .filter((tx: any) => tx.branch !== null)
        .map((tx: any) => ({
          id: tx.id,
          transaction_date: tx.transaction_date,
          bill_amount: tx.bill_amount,
          final_amount: tx.final_amount,
          total_discount: tx.total_discount,
          is_first_transaction: tx.is_first_transaction,
          // Handle joined data which might be arrays or objects depending on Supabase client version/config
          customer: Array.isArray(tx.customer) ? tx.customer[0] : tx.customer,
          branch: Array.isArray(tx.branch) ? tx.branch[0] : tx.branch,
          staff: Array.isArray(tx.staff) ? tx.staff[0] : tx.staff,
        }));
      
      setTransactions(formattedData);
      if (count) {
        setTotalCount(count);
        setTotalPages(Math.ceil(count / itemsPerPage));
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.merchantDashboard.transactions.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border/50"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex bg-muted/50 p-1 rounded-lg">
            {(["today", "7d", "30d", "all"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  dateRange === range
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.merchantDashboard.transactions.filter[range]}
              </button>
            ))}
          </div>
          
          <Button variant="outline" size="icon" title="Export CSV" disabled>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/30 text-muted-foreground font-medium border-b border-border/50">
                <tr>
                  <th className="px-4 py-3">{t.merchantDashboard.transactions.columns.date}</th>
                  <th className="px-4 py-3">{t.merchantDashboard.transactions.columns.customer}</th>
                  <th className="px-4 py-3">{t.merchantDashboard.transactions.columns.branch}</th>
                  <th className="px-4 py-3 text-right">{t.merchantDashboard.transactions.columns.amount}</th>
                  <th className="px-4 py-3 text-right">{t.merchantDashboard.transactions.columns.discount}</th>
                  <th className="px-4 py-3 text-right">{t.merchantDashboard.transactions.columns.net}</th>
                  <th className="px-4 py-3 text-center">{t.merchantDashboard.transactions.columns.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  // Skeleton Rows
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3"><div className="h-4 w-24 bg-muted rounded"></div></td>
                      <td className="px-4 py-3"><div className="h-4 w-32 bg-muted rounded"></div></td>
                      <td className="px-4 py-3"><div className="h-4 w-20 bg-muted rounded"></div></td>
                      <td className="px-4 py-3"><div className="h-4 w-16 bg-muted rounded ml-auto"></div></td>
                      <td className="px-4 py-3"><div className="h-4 w-12 bg-muted rounded ml-auto"></div></td>
                      <td className="px-4 py-3"><div className="h-4 w-16 bg-muted rounded ml-auto"></div></td>
                      <td className="px-4 py-3"><div className="h-4 w-16 bg-muted rounded mx-auto"></div></td>
                    </tr>
                  ))
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 opacity-20" />
                        <p>{t.merchantDashboard.transactions.noData}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 text-foreground whitespace-nowrap">
                        {format(new Date(tx.transaction_date), "dd MMM yyyy")}
                        <span className="block text-xs text-muted-foreground">
                          {format(new Date(tx.transaction_date), "h:mm a")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground truncate max-w-[150px]">
                          {tx.customer?.full_name || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {tx.customer?.email}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {tx.branch?.name}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-foreground">
                        RM {tx.bill_amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-red-500">
                        {tx.total_discount > 0 ? `-RM ${tx.total_discount.toFixed(2)}` : "-"}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-green-600">
                        RM {tx.final_amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {tx.is_first_transaction && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {t.merchantDashboard.transactions.status.firstVisit}
                          </span>
                        )}
                        {!tx.is_first_transaction && (
                           <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                           {t.merchantDashboard.transactions.status.returning}
                         </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border/50 pt-4">
        <p className="text-sm text-muted-foreground">
          {t.merchantDashboard.transactions.showing} <span className="font-medium">{transactions.length}</span> {t.merchantDashboard.transactions.of} <span className="font-medium">{totalCount}</span> {t.merchantDashboard.transactions.results}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
