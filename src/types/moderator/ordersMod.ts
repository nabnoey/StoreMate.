// ชื่อไฟล์: ordersMod.ts (หรือ path ที่เนยต้องการเก็บ เช่น src/types/ordersMod.ts)

// 1. กำหนด Type สำหรับข้อมูลออเดอร์เดี่ยวๆ อ้างอิงตาม JSON จากหลังบ้าน
export interface OrderMod {
  id: string;
  orderNo: string;
  recipientName: string;
  phone: string;
  total: number;
  shippingFrom: string;
  status: "สำเร็จ" | "ชำระเงินแล้ว" | "รอชำระเงิน" | "คืนเงิน/คืนสินค้า" | "รอการอนุมัติ" | string;
  is_printed: boolean;
  createdAt: string;
}

// 2. ย้ายรูปแบบสีของปุ่มสถานะมาไว้เป็นค่าคงที่ส่วนกลางที่นี่
export const STATUS_STYLES: Record<string, string> = {
  "สำเร็จ": "bg-green-100 text-green-700",
  "ชำระเงินแล้ว": "bg-emerald-100 text-emerald-700",
  "รอชำระเงิน": "bg-amber-100 text-amber-700",
  "คืนเงิน/คืนสินค้า": "bg-red-100 text-red-600",
  "รอการอนุมัติ": "bg-orange-100 text-orange-600",
};