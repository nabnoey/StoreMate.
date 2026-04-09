import api from "./api";

const createPaymentIntent = async (data: { ids: number[] }) => {
  const res = await api.post(
    `${import.meta.env.VITE_ORDER_API}/${import.meta.env.VITE_PAYMENT_API}/intent`,
    {
      ids: data.ids,
    },
  );
  return res.data;
};

export const PaymentService = {
  createPaymentIntent,
};
