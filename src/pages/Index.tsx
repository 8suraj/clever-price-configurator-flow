
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Price, Product } from "@/models/price";
import { fetchPrices, fetchProducts } from "@/services/mockData";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Plus, CircleDollarSign } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prices, setPrices] = useState<Price[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pricesData, productsData] = await Promise.all([
          fetchPrices(),
          fetchProducts()
        ]);
        
        setPrices(pricesData);
        
        // Convert products array to a lookup object
        const productsMap = productsData.reduce((acc, product) => {
          acc[product.id] = product;
          return acc;
        }, {} as Record<string, Product>);
        
        setProducts(productsMap);
      } catch (error) {
        toast({
          title: "Error loading data",
          description: "Failed to load prices and products. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Layout title="Price Configurator Dashboard">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pricing Management</CardTitle>
            <CardDescription className="mt-1">
              Create and manage prices for your products
            </CardDescription>
          </div>
          <Button onClick={() => navigate("/create-price")}>
            <Plus className="mr-2 h-4 w-4" /> Create Price
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : prices.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-lg">
              <CircleDollarSign className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No prices</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new price configuration.
              </p>
              <div className="mt-6">
                <Button onClick={() => navigate("/create-price")}>
                  <Plus className="mr-2 h-4 w-4" /> Create Price
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Billing</TableHead>
                  <TableHead>Trial Period</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prices.map((price) => (
                  <TableRow key={price.id}>
                    <TableCell className="font-medium">
                      {products[price.productId]?.name || "Unknown Product"}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        price.type === "recurring" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-purple-100 text-purple-800"
                      }`}>
                        {price.type === "recurring" ? "Recurring" : "One-time"}
                      </span>
                    </TableCell>
                    <TableCell>{formatCurrency(price.unitAmount)}</TableCell>
                    <TableCell>
                      {price.type === "recurring" && price.interval ? (
                        <>
                          {price.intervalCount && price.intervalCount > 1 
                            ? `Every ${price.intervalCount} ${price.interval}s` 
                            : `${price.interval === "month" ? "Monthly" : "Yearly"}`}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      {price.trialPeriodDays ? `${price.trialPeriodDays} days` : "No trial"}
                    </TableCell>
                    <TableCell>{formatDate(price.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/update-price/${price.id}`)}
                      >
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Index;
