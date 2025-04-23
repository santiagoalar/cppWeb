export interface ProductDetails {
    color: string;
    talla: string;
    material: string;
    suela: string;
    cordones: string;
  }
  
  export interface ProductData {
    id: string;
    name: string;
    brand: string;
    manufacturerId: string;
    description: string;
    details: ProductDetails;
    storageConditions: string;
    price: number;
    currency: string;
    deliveryTime: number;
    images: string[];
  }