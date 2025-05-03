
export interface Product {
  id: string;
  name: string;
}

export type PriceInterval = "month" | "year";
export type PriceType = "one_time" | "recurring";

export interface Price {
  id: string;
  productId: string;
  interval?: PriceInterval;
  intervalCount?: number;
  trialPeriodDays?: number;
  type: PriceType;
  unitAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PriceFormData {
  productId: string;
  interval?: PriceInterval;
  intervalCount?: number;
  trialPeriodDays?: number;
  type: PriceType;
  unitAmount: number;
}
