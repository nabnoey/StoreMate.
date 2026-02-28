
import api from "./api";
import type { CreateReviewPayload } from "../types/review"; 

const createReviews = async (id: number, payload: CreateReviewPayload) => {
    const res = await api.post(`${import.meta.env.VITE_PRODUCT_API}/${id}/${import.meta.env.VITE_REVIEW_API}`, payload)
    return res.data
}

export const ReviewsService = {
    createReviews,
}