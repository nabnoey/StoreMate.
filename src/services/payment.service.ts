import api from "./api";
// import type {
//   PaymentIntentRequest,
//   PaymentIntentResponse,
// } from "../types/payment";

//เพิ่มบัตรเครดิต/เดบิต
//บัก back ทำให้กูด้วยมันเพิ่มไม่ได้กูจนปรีชาสามารถแล้ว
const createSetupIntent = async () => {
  const res = await api.post(
    `${import.meta.env.VITE_ORDER_API}/${import.meta.env.VITE_PAYMENT_API}/intent`,
    {
      type: "setup",
    },
  );
  return res.data;
};

//จ่ายตัง
const createPaymentIntent = async (data: { ids: number[] }) => {
  const res = await api.post(
    `${import.meta.env.VITE_ORDER_API}/${import.meta.env.VITE_PAYMENT_API}/intent`,
    {
      type: "payment",
      ids: data.ids,
    },
  );
  return res.data;
};

export const PaymentService = {
  createPaymentIntent,
  createSetupIntent,
};
