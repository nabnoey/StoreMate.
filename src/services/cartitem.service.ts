import api from "./api"
import type { CartItem } from "../types/cartItem"


const addToCart = async (data: CartItem) => {
  const res = await api.post(
    `${import.meta.env.VITE_CART_API}/items`,
    data
  )
  return res.data
}

export const CartItemService = {
addToCart
}