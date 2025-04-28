export interface ProductData {
    id: string;
    name: string;
    brand: string;
    manufacturerId: string;
    description: string;
    details: Map<string, string>;
    storageConditions: string;
    price: number;
    currency: string;
    deliveryTime: number;
    images: string[];
    stock: number;
    created_at: string;
    updated_at: string;
  }