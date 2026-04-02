import api from "./api";
import type {
  PaymentIntentRequest,
  PaymentIntentResponse,
} from "../types/payment";

//ชำระเงินด้วย PromptPay QR Code และการเพิ่มบัตรเครดิต/เดบิต
const createPaymentIntent = async (
  data: PaymentIntentRequest,
): Promise<PaymentIntentResponse> => {
  const res = await api.post(
    `${import.meta.env.VITE_ORDER_API}/${import.meta.env.VITE_PAYMENT_API}/intent`,
    data,
  );
  return res.data;
};

// สร้าง Setup Intent สำหรับการเพิ่มบัตรเครดิต/เดบิต
const createSetupIntent = async (): Promise<PaymentIntentResponse> => {
  const res = await api.post(
    `${import.meta.env.VITE_ORDER_API}/${import.meta.env.VITE_PAYMENT_API}/intent`,
    {
      mode: "setup",
    },
  );
  return res.data;
};
export const PaymentService = {
  createPaymentIntent,
  createSetupIntent,
};
