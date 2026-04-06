import type { Product } from "./product";

export interface OrderItem {
  productId: string;
  quantity: number;
  productDetail?: Product;
}

export interface Order {
  id: string;
  shopName: string;
  statusDelivery: string;
  statusPayment: string;
  items: OrderItem[];
  totalPrice: number;
}