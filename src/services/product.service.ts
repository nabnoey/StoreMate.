import api from "./api";

 const getAllCategories = async () => {
    const res = await api.get(`${import.meta.env.VITE_PRODUCT_API}/grouped-by-category`)
    return res.data
}

const searchProducts = async ( keyword: string,
  category: string,
  minPrice?: number,
  maxPrice?: number,
  size?:1,
  page?:1000
 ) => {
    const res = await api.get(`${import.meta.env.VITE_PRODUCT_API}/search?keyword=${encodeURIComponent(keyword)}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&size=${size}&page=${page}`)
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

