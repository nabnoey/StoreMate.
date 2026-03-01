
import api from "./api";
import type { CreateReviewPayload } from "../types/review"; 

const createReviews = async (id: number, payload: CreateReviewPayload) => {
    const res = await api.post(`${import.meta.env.VITE_PRODUCT_API}/${id}/${import.meta.env.VITE_REVIEW_API}`, payload)
    return res.data
}

const editReviews = async (id:number , paypload: CreateReviewPayload) => {
    const res = await api.put (`${import.meta.env.VITE_REVIEW_API}/${id}`,paypload)
    return res.data
}
const deleteReviews = async (id:number) => {
    const res = await api.delete (`${import.meta.env.VITE_REVIEW_API}/${id}`)
    return res.data
}
export const ReviewsService = {
    createReviews,
    editReviews,
    deleteReviews
}