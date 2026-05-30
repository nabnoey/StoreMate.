import api from "./api";
// refundOrder
import type { RefundsResponse, RefundItem } from "../types/moderator/refundMod";

import type { Product } from "../types/product";

const getAllOrders = async () => {
  const res = await api.get(`${import.meta.env.VITE_MOD_API}/orders`);
  return res.data;
};

//  refundOrder
const getRefunds = async (
  page: number,
  size: number,
): Promise<RefundsResponse> => {
  const res = await api.get(`${import.meta.env.VITE_MOD_API}/orders/refund`, {
    params: { page, size },
  });
  return res.data;
};

const getRefundDetail = async (refundNo: string): Promise<RefundItem> => {
  const res = await api.get(
    `${import.meta.env.VITE_MOD_API}/orders/${refundNo}`,
  );
  return res.data;
};

const approveRefund = async (id: string): Promise<void> => {
  const res = await api.post(
    `${import.meta.env.VITE_PAYMENT_REFUND}/${id}/approve`,
  );
  return res.data;
};

const rejectRefund = async (id: string): Promise<void> => {
  const res = await api.post(
    `${import.meta.env.VITE_PAYMENT_REFUND}/${id}/reject`,
  );
  return res.data;
};

const shippingOrder = async (orderNo: number) => {
  const res = await api.post(
    `${import.meta.env.VITE_MOD_API}/orders/${orderNo}/shipping-label`,
  );
  return res.data;
};

const getoOrder = async (orderNo: number) => {
  const res = await api.get(
    `${import.meta.env.VITE_MOD_API}/orders/${orderNo}`,
  );
  return res.data;
};

const getoOrderByOrderNo = async (orderNo: number) => {
  const res = await api.get(
    `${import.meta.env.VITE_MOD_API}/orders/orderNo/${orderNo}`,
  );
  return res.data;
};

const addProduct = async (data: Product) => {
  const res = await api.post(`${import.meta.env.VITE_MOD_API}/products`, data);
  return res.data;
};

export const ModeratorService = {
  getAllOrders,
  shippingOrder,
  getoOrder,
  addProduct,
  getRefunds,
  getRefundDetail,
  approveRefund,
  rejectRefund,
  getoOrderByOrderNo,
};
