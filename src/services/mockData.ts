
import { Price, Product, PriceType, PriceInterval } from "@/models/price";

// Mock products data
export const products: Product[] = [
  { id: "prod_1", name: "Basic Plan" },
  { id: "prod_2", name: "Premium Plan" },
  { id: "prod_3", name: "Enterprise Plan" },
  { id: "prod_4", name: "Starter Pack" },
  { id: "prod_5", name: "Pro Bundle" },
];

// Mock prices data
export const prices: Price[] = [
  {
    id: "price_1",
    productId: "prod_1",
    interval: "month",
    intervalCount: 1,
    trialPeriodDays: 14,
    type: "recurring",
    unitAmount: 1999,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "price_2",
    productId: "prod_2",
    interval: "year",
    intervalCount: 1,
    trialPeriodDays: 30,
    type: "recurring",
    unitAmount: 19900,
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-03-05"),
  },
  {
    id: "price_3",
    productId: "prod_3",
    type: "one_time",
    unitAmount: 99900,
    createdAt: new Date("2023-04-20"),
    updatedAt: new Date("2023-04-20"),
  },
];

// Mock API functions
export const fetchProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products);
    }, 500);
  });
};

export const fetchPrices = (): Promise<Price[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(prices);
    }, 500);
  });
};

export const fetchPriceById = (id: string): Promise<Price | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const price = prices.find((p) => p.id === id);
      resolve(price);
    }, 500);
  });
};

export const createPrice = (priceData: any): Promise<Price> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPrice: Price = {
        id: `price_${Math.random().toString(36).substring(2, 9)}`,
        ...priceData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      resolve(newPrice);
    }, 500);
  });
};

export const updatePrice = (id: string, priceData: any): Promise<Price> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const priceIndex = prices.findIndex((p) => p.id === id);
      if (priceIndex === -1) {
        reject(new Error("Price not found"));
        return;
      }

      const updatedPrice: Price = {
        ...prices[priceIndex],
        ...priceData,
        updatedAt: new Date(),
      };
      resolve(updatedPrice);
    }, 500);
  });
};
