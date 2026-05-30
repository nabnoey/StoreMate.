import api from "./api";
import type { Product } from "../types/product";

// const getAllOrders = async (
//     page?: number,
//     size?: number
// ) => {
//     const res = await api.get(`${import.meta.env.VITE_MOD_API}/orders`),{
//         params: {
//            page,
//            size
//         }
//     });
//     return res.data
// }

const getAllOrders = async (page?: number, size?: number) => {
    const res = await api.get(`${import.meta.env.VITE_MOD_API}/orders`, {
        params: { page, size },
    });
    return res.data;
}

const shippingOrder = async (orderNo: string) => {
    const res = await api.post(`${import.meta.env.VITE_MOD_API}/orders/${orderNo}/shipping-label`)
    return res.data
}

const getoOrder = async (orderNo: number) => {
    const res = await api.get(`${import.meta.env.VITE_MOD_API}/orders/${orderNo}`)
    return res.data
}

const getoOrderByOrderNo = async (orderNo: string) => {
    const res = await api.get(`${import.meta.env.VITE_MOD_API}/orders/${orderNo}`)
    return res.data
}

const addProduct = async (data: Product) => {
    const res = await api.post (`${import.meta.env.VITE_MOD_API}/products`, data,)
    return res.data
}

export const ModeratorService = {
    getAllOrders,
    shippingOrder,
    getoOrder,
    addProduct,
    getoOrderByOrderNo
}