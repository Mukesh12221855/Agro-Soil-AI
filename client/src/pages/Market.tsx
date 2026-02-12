import { useMarketPrices } from "@/hooks/use-market";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function Market() {
  const { data: prices, isLoading } = useMarketPrices();

  // Mock trend calculation for UI demo
  const getTrendIcon = (index: number) => {
    if (index % 3 === 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (index % 3 === 1) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Market Prices" 
        description="Real-time crop prices from local mandi across districts." 
      />

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle>Live Mandi Prices</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[200px]">Crop Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price (₹/Quintal)</TableHead>
                <TableHead className="text-right">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                prices?.map((item, i) => (
                  <TableRow key={item.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium text-foreground capitalize">
                      {item.cropName}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{item.district || "District"}</span>
                        <span className="text-xs text-muted-foreground">{item.state}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      ₹{Number(item.price).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {getTrendIcon(i)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
