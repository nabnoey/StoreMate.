import type { Product } from './../types/product';
import api from "./api";

 const getAllCategories = async () => {
    const res = await api.get(`${import.meta.env.VITE_PRODUCT_API}/grouped-by-category`)
    return res.data
}

const searchProducts = async (
  keyword: string,
  categoryId: number | null,
  minPrice?: number,
  maxPrice?: number,
  page?: number,
  size?: number
) => {
  const res = await api.get(`${import.meta.env.VITE_PRODUCT_API}/search`, {
  params: {
    keyword,
    categoryId: categoryId ?? undefined,
    minPrice,
    maxPrice,
    page,
    size
  }
});
  return res.data;
};



 const getProductById = async (id: number) => {
    const res = await api.get(`${import.meta.env.VITE_PRODUCT_API}/${id}`)
    return res.data
}

const addProduct = async (product: Product) => {
    const res = await api.post(`${import.meta.env.VITE_MOD_API}/products` , product)
    return res.data
}

export const ProductService = {
    getAllCategories,
    getProductById,
    searchProducts,
    addProduct

}

