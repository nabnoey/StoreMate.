import type { Product } from "./product";

interface OrderItem {
  productId: string;
  quantity: number;
  productDetail?: Product;
}

interface Order {
  id: string;
  shopName: string;
  statusDelivery: string;
  statusPayment: string;
  items: OrderItem[];
  totalPrice: number;
}