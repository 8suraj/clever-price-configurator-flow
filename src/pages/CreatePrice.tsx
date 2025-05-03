
import { useState } from "react";
import Layout from "@/components/Layout";
import PriceForm from "@/components/PriceForm";
import { PriceFormData } from "@/models/price";
import { createPrice } from "@/services/mockData";

const CreatePrice = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePrice = async (data: PriceFormData) => {
    setIsSubmitting(true);
    try {
      await createPrice(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout 
      title="Create Price" 
      description="Configure a new price for your product"
    >
      <PriceForm
        onSubmit={handleCreatePrice}
        title="New Price Configuration"
        submitButtonText="Create Price"
        isLoading={isSubmitting}
      />
    </Layout>
  );
};

export default CreatePrice;
