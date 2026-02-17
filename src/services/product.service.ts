import api from "./api";
// import type { Product } from "../types/product";


//  const getAllProducts = async () => {
//     const res = await api.get(`${import.meta.env.VITE_PRODUCT_API}/products`)
//     return res.data
// }

 const getAllCategories = async () => {
    const res = await api.get(`${import.meta.env.VITE_PRODUCT_API}/grouped-by-category`)
    return res.data
}

 const getProductById = async (id: number) => {
    const res = await api.get(`${import.meta.env.VITE_PRODUCT_API}/${id}`)
    return res.data
}

 const getProductBySearch = async (query: string) => {
    const res = await api.get(`${import.meta.env.VITE_PRODUCT_API}/search?query=${query}`)
    return res.data
}

export const ProductService = {
    // getAllProducts,
    getAllCategories,
    getProductById,
    getProductBySearch
}
