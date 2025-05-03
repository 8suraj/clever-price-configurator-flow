
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import PriceForm from "@/components/PriceForm";
import { PriceFormData } from "@/models/price";
import { fetchPriceById, updatePrice } from "@/services/mockData";

const UpdatePrice = () => {
  const { priceId } = useParams<{ priceId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [initialData, setInitialData] = useState<PriceFormData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadPrice = async () => {
      if (!priceId) return;
      
      try {
        const priceData = await fetchPriceById(priceId);
        if (priceData) {
          setInitialData({
            productId: priceData.productId,
            interval: priceData.interval,
            intervalCount: priceData.intervalCount,
            trialPeriodDays: priceData.trialPeriodDays,
            type: priceData.type,
            unitAmount: priceData.unitAmount,
          });
        } else {
          toast({
            title: "Error",
            description: "Price not found",
            variant: "destructive",
          });
          navigate("/");
        }
      } catch (error) {
        toast({
          title: "Error loading price",
          description: "Unable to load price data. Please try again.",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    loadPrice();
  }, [priceId, navigate, toast]);

  const handleUpdatePrice = async (data: PriceFormData) => {
    if (!priceId) return;
    
    setIsSubmitting(true);
    try {
      await updatePrice(priceId, data);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout title="Update Price">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading price data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Update Price" 
      description={`Editing price configuration ${priceId}`}
    >
      {initialData && (
        <PriceForm
          initialData={initialData}
          onSubmit={handleUpdatePrice}
          title="Edit Price Configuration"
          submitButtonText="Update Price"
          isLoading={isSubmitting}
        />
      )}
    </Layout>
  );
};

export default UpdatePrice;
