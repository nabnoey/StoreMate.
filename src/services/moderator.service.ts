import api from "./api";
// refundOrder
import type { RefundsResponse, RefundItem } from "../types/moderator/refundMod";

const getAllOrders = async () => {
  const res = await api.get(`${import.meta.env.VITE_MOD_API}/orders`);
  return res.data;
};

//  refundOrder
const getRefunds = async (
  page: number,
  size: number,
): Promise<RefundsResponse> => {
  const res = await api.get(`${import.meta.env.VITE_PAYMENT_REFUND}/refund`, {
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
export const ModeratorService = {
  getAllOrders,
  getRefunds,
  getRefundDetail,
  approveRefund,
  rejectRefund,
};
