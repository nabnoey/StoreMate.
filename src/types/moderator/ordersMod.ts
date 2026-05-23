// ordersMod.ts

export interface OrderMod {
  id: string;
  orderNo: string;
  recipientName: string;
  phone: string;
  total: number;
  shippingFrom: string;
  status: string;
  is_printed: boolean;
  createdAt: string;
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