import api from "./api";

 const getAllCategories = async () => {
    const res = await api.get(`${import.meta.env.VITE_PRODUCT_API}/grouped-by-category`)
    return res.data
}

const searchProducts = async ( keyword: string,
  categoryId: number | null,
  minPrice?: number,
  maxPrice?: number,
  page?: number,
  size?: number
 ) => {
    const res = await api.get(`${import.meta.env.VITE_PRODUCT_API}/search?keyword=${encodeURIComponent(keyword)}&categoryId=${categoryId}&minPrice=${minPrice}&maxPrice=${maxPrice}&size=${size}&page=${page}`)
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

