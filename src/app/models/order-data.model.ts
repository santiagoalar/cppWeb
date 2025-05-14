export interface Order {
  id: string;
  date: string; 
  status: string;
  subtotal: number;
  taxes: number;
  total: number;
  currency: string;
  clientId: string;
  client_name?: string;
  paymentId: string;
  transactionStatus: string;
  transactionDate: string;
  transactionId: string;
  orderItems: OrderItem[] | null;
  orderHistory: OrderHistory[] | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
}

export interface OrderHistory {
  id: string;
  orderId: string;
  status: string;
  description: string;
  date: string;
}