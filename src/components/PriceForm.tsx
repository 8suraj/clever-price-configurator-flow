
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchProducts } from "@/services/mockData";
import { PriceFormData, Product, PriceInterval, PriceType } from "@/models/price";

interface PriceFormProps {
  initialData?: PriceFormData;
  onSubmit: (data: PriceFormData) => Promise<void>;
  title: string;
  submitButtonText: string;
  isLoading?: boolean;
}

const PriceForm = ({
  initialData,
  onSubmit,
  title,
  submitButtonText,
  isLoading = false,
}: PriceFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<PriceFormData>({
    productId: "",
    interval: "month",
    intervalCount: 1,
    trialPeriodDays: 0,
    type: "recurring",
    unitAmount: 0,
  });
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        toast({
          title: "Error loading products",
          description: "Unable to load products. Please try again.",
          variant: "destructive",
        });
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, [toast]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | { name: string; value: string | number }
  ) => {
    const { name, value } = "target" in e ? e.target : e;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? 0 : parseInt(value, 10),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await onSubmit(formData);
      toast({
        title: "Success",
        description: "Price has been saved successfully.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save price. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Configure your pricing plan with the options below.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="productId">Product</Label>
            <Select
              name="productId"
              value={formData.productId}
              onValueChange={(value) => handleSelectChange("productId", value)}
              disabled={productsLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Price Type</Label>
            <Select
              name="type"
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value as PriceType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a price type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one_time">One-time</SelectItem>
                <SelectItem value="recurring">Recurring</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === "recurring" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="interval">Billing Interval</Label>
                <Select
                  name="interval"
                  value={formData.interval || "month"}
                  onValueChange={(value) => handleSelectChange("interval", value as PriceInterval)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a billing interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="intervalCount">Interval Count</Label>
                <Input
                  type="number"
                  id="intervalCount"
                  name="intervalCount"
                  value={formData.intervalCount || 1}
                  onChange={handleNumberChange}
                  min={1}
                  className="w-full"
                />
                <p className="text-sm text-gray-500">
                  Number of intervals between billings (e.g., billing every 3 months)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trialPeriodDays">Trial Period Days</Label>
                <Input
                  type="number"
                  id="trialPeriodDays"
                  name="trialPeriodDays"
                  value={formData.trialPeriodDays || 0}
                  onChange={handleNumberChange}
                  min={0}
                  className="w-full"
                />
                <p className="text-sm text-gray-500">
                  Number of trial days before the first charge (0 for no trial)
                </p>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="unitAmount">
              Amount ({formData.type === "recurring" ? "per " + formData.interval : "one-time"})
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                $
              </span>
              <Input
                type="number"
                id="unitAmount"
                name="unitAmount"
                value={formData.unitAmount / 100 || ""}
                onChange={(e) => {
                  const value = e.target.value === "" ? 0 : parseFloat(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    unitAmount: Math.round(value * 100), // Store as cents
                  }));
                }}
                min={0}
                step="0.01"
                className="pl-7 w-full"
                placeholder="0.00"
              />
            </div>
            <p className="text-sm text-gray-500">
              Enter the amount in dollars. It will be stored in cents internally.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || productsLoading || !formData.productId}
          >
            {isLoading ? "Saving..." : submitButtonText}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PriceForm;
