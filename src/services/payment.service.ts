import api from "./api";
import type {
  PaymentIntentPayload,
  PaymentNowPayload,
  RetryPaymentRequest,
} from "../types/payment";
import type { RefundRequest } from "../types/orders";

const createPaymentIntent = async (data: PaymentIntentPayload) => {
  const res = await api.post(
    `${import.meta.env.VITE_ORDER_API}/${import.meta.env.VITE_PAYMENT_API}/intent`,
    data, // ส่ง data ไปทั้งก้อนเลย Backend จะได้รับทั้ง ids, isBuyNow และ cardId
  );
  return res.data;
};

const paymentNow = async (data: PaymentNowPayload) => {
  const res = await api.post(
    `${import.meta.env.VITE_ORDER_API}/${import.meta.env.VITE_PAYMENT_API}/now`,
    data,
  );
  return res.data;
};

const sendRefund = async (data: RefundRequest) => {
  const res = await api.post(
    `${import.meta.env.VITE_PAYMENT_REFUND}/send`,
    data,
  );
  return res.data;
};

const retryPayment = async (data: RetryPaymentRequest) => {
  const res = await api.post("/retry", data);
  return res.data;
};

export const PaymentService = {
  createPaymentIntent,
  paymentNow,
  sendRefund,
  retryPayment,
};
