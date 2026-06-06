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
  recipientName?: string;
   phone?: string;
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
  PENDING: "รอดำเนินการ, รอชำระเงิน",
  PROCESSING: "ที่ต้องจัดส่ง",
  RECEIVED: "ที่ต้องได้รับ",
  COMPLETED: "คำสั่งซื้อสำเร็จ",
};

export const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  RECEIVED: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-green-100 text-green-700",
};