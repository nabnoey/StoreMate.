import api from "./api";
// import type { Product } from "../types/product";


 const getAllCategories = async () => {
    const res = await api.get(`${import.meta.env.VITE_PRODUCT_API}/grouped-by-category`)
    return res.data
}
const searchProducts = async (keyword: string) => {
    const res = await api.get(`${import.meta.env.VITE_PRODUCT_API}/search?keyword=${keyword}`)
    return res.data
}


 const getProductById = async (id: number) => {
    const res = await api.get(`${import.meta.env.VITE_PRODUCT_API}/${id}`)
    return res.data
}


export const ProductService = {
    getAllCategories,
    getProductById,
    searchProducts

}

