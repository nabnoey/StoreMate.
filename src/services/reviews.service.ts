import api from "./api";
import type { CreateReviewPayload } from "../types/review";

//ดูรีวิวสินค้าตาม productId
const getReviews = async (productId: number) => {
  const res = await api.get(`${import.meta.env.VITE_REVIEW_API}/${productId}`);
  return res.data;
};

//ใช้ review สินค้าใน order
const createReviews = async (
  orderItemId: number,
  payload: CreateReviewPayload,
) => {
  const res = await api.post(
    `${import.meta.env.VITE_REVIEW_API}/${orderItemId}`,
    payload,
  );
  return res.data;
};

const editReviews = async (id: number, paypload: CreateReviewPayload) => {
  const res = await api.put(
    `${import.meta.env.VITE_REVIEW_API}/${id}`,
    paypload,
  );
  return res.data;
};
const deleteReviews = async (id: number) => {
  const res = await api.delete(`${import.meta.env.VITE_REVIEW_API}/${id}`);
  return res.data;
};
export const ReviewsService = {
  getReviews,
  createReviews,
  editReviews,
  deleteReviews,
};
