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
  | "RECEIVED"
  | "CANCELLED"
  | "REFUNDED";

export const statusConfig: Record<
  OrderStatus,
  { label: string; color: string }
> = {
  PENDING: { label: "ที่ต้องชำระ", color: "text-blue-500" },
  PROCESSING: { label: "ที่ต้องจัดส่ง", color: "text-yellow-500" },
  RECEIVED: { label: "ที่ต้องได้รับ", color: "text-orange-500" },
  COMPLETED: { label: "สำเร็จแล้ว", color: "text-green-500" },
  CANCELLED: { label: "ยกเลิกแล้ว", color: "text-red-500" },
  REFUNDED: { label: "คืนเงินแล้ว", color: "text-purple-500" },
  ALL: { label: "ทั้งหมด", color: "text-black" },
};

export const getOrderLabel = (
  status: OrderStatus,
  checkoutType?: string,
): string => {
  if (status === "PROCESSING" && checkoutType === "DISTINATION") {
    return "ที่ต้องจัดส่ง (COD)";
  }

  return statusConfig[status]?.label || status;
};

export interface OrderItem {
  id: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  subTotal: number;
  is_review: boolean;
}

export interface OrderRecipient {
  recipientName?: string;
  phone?: string;
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
  orderRecipient?: OrderRecipient | null;

  total: number;
  createdAt: string;
  reason: RefundRequest["reason"];
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

export interface RefundRequest {
  orderNo: Order["orderNo"];
  reason: string;
  description: string;
}
