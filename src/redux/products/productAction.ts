import {
  ADD_PRODUCT,
  ADD_QUANTITY,
  REMOVE_QUANTITY
} from "./actionTypes"

export type AddProductAction = {
  type: typeof ADD_PRODUCT
  payload: {
  id: number
  productName: string
  imageUrl: string 
  categoryName: string
  price: number
  summary: string
  status: string
  stockQuantity: number
}
}

export type QuantityAction = {
  type: typeof ADD_QUANTITY 
  payload: {
    productId: number
   
  }
}

export type removeQuantityAction = {
    type: typeof REMOVE_QUANTITY
    payload: {
      productId: number
      
    
}
}

export type ProductAction = AddProductAction | QuantityAction | removeQuantityAction