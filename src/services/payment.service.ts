import api from "./api";

// สร้าง Interface มารับ Type ให้ชัดเจน (เพื่อกัน TypeScript บ่นครับ)
interface PaymentIntentPayload {
  ids: number[];
  isBuyNow?: boolean;
  cardId?: string;
}

const createPaymentIntent = async (data: PaymentIntentPayload) => {
  const res = await api.post(
    `${import.meta.env.VITE_ORDER_API}/${import.meta.env.VITE_PAYMENT_API}/intent`,
    data, // ส่ง data ไปทั้งก้อนเลย Backend จะได้รับทั้ง ids, isBuyNow และ cardId
  );
  return res.data;
};

export const PaymentService = {
  createPaymentIntent,
};
