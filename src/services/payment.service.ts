import api from "./api";
import type { PaymentIntentRequest } from "../types/payment";

const createPaymentIntent = async (data: PaymentIntentRequest) => {
  const res = await api.post(
    `${import.meta.env.VITE_ORDER_API}/${import.meta.env.VITE_PAYMENT_API}/intent`,
    data,
  );
  return res.data;
};

export const PaymentService = {
  createPaymentIntent,
};
