import type { PaymentMethod } from "./payment";

export interface OrderAddress {
  id: number;
  streetAddress: string;
  subdistrict: string;
  district: string;
  province: string;
  zipcode: string;
}
export type OrderStatus =
  | "ALL"
  | "COMPLETED"
  | "PENDING"
  | "PROCESSING"
  | "RECEIVE"
  | "CANCELLED"
  | "REFUND";

export interface OrderItem {
  id: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  subTotal: number;
}

export interface Order {
  id: number;
  orderNo: string;
  status: OrderStatus;
  totalPrice: number;
  statusDelivery?: string;
  checkoutType: PaymentMethod;

  orderAddress: OrderAddress[];
  orderItems: OrderItem[];

  total: number;
  paidAt: string;
}

export interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

export interface StatusOrderTabsProps {
  activeTab: string;
  onTabChange: (tabName: string) => void;
}
