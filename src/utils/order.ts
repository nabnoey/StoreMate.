import type { OrderStatus } from "../types/orders";

import type { PaymentMethod } from "../types/payment";

export const statusConfig = {
  ALL: { tab: "ทั้งหมด", color: "text-black" },
  COMPLETED: {
    tab: "คำสั่งซื้อสำเร็จ",
    color: "text-green-500",
  },
  PENDING: { tab: "ที่ต้องชำระ", color: "text-blue-500" },
  PROCESSING: {
    tab: "ที่ต้องจัดส่ง",
    color: "text-blue-500",
  },
  RECEIVE: {
    tab: "ที่ต้องได้รับ",
    color: "text-green-500",
  },
  CANCELLED: {
    tab: "ยกเลิก",
    color: "text-red-500",
  },
  REFUND: {
    tab: "คืนเงิน/คืนสินค้า",
    color: "text-red-500",
  },
} as const;

export const getOrderLabel = (
  status: OrderStatus,
  paymentMethod: PaymentMethod,
) => {
  //ปลายทาง ถ้ายังไม่ถึงสถานะ จัดส่งสำเร็จ มันจะยังขึ้นสถานะว่า รอชำระเงินไปก่อน
  if (paymentMethod === "DESTINATION") {
    if (status === "COMPLETED") {
      return "จัดส่งสำเร็จ";
    }
    return "รอการชำระเงิน";
  }

  //พร้อมเพย์ กับ บัตรเครดิต
  switch (status) {
    case "PENDING":
      return "รอการชำระเงิน"; //ตรง return คือ label
    case "PROCESSING":
      return "ที่ต้องจัดส่ง";
    case "RECEIVE":
      return "ที่ต้องได้รับ";
    case "COMPLETED":
      return "จัดส่งสำเร็จ";
    case "CANCELLED":
      return "ยกเลิกคำสั่งซื้อ";
    case "REFUND":
      return "คืนเงิน/คืนสินค้า";
    default:
      return "-";
  }
};
