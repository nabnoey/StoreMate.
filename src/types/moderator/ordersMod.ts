export interface OrderItem {
  id: number;
  productName?: string;
  imageUrl?: string;
  quantity: number;
  price: number;
  subTotal?: number; // แอบเห็นใน swagger มี subTotal ด้วย เติมเผื่อไว้ครับ
}

export interface OrderMod {
  id: number;
  orderNo: string; 
  status: string;
  total: number;

  shippingFrom?: string;
  is_printed?: boolean;
  createdAt?: string;
  checkoutType?: string;

  orderItems?: OrderItem[];

  // ปรับโครงสร้างตรงนี้ให้ตรงกับ Backend
  orderRecipient?: {
    recipientName?: string;
    phone?: string;
    streetAddress?: string;
    subdistrict?: string;
    district?: string;
    province?: string;
    zipcode?: string;
  };
}

export const STATUS_LABELS: Record<string, string> = {
  PROCESSING: "ที่ต้องจัดส่ง",
  COMPLETED: "สั่งซื้อสำเร็จ",
  PAID: "ชำระเงินแล้ว",
  PENDING: "รอชำระเงิน",
  REFUND: "คืนเงิน/คืนสินค้า",
  APPROVE: "รอการอนุมัติ",
};

export const STATUS_STYLES: Record<string, string> = {
  PROCESSING: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  PAID: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  REFUND: "bg-red-100 text-red-600",
  APPROVE: "bg-orange-100 text-orange-600",
};