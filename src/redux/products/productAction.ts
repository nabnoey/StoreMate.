import {
  ADD_PRODUCT,
  ADD_QUANTITY,
  REMOVE_QUANTITY
} from "./actionTypes"

export type AddProductAction = {
  type: typeof ADD_PRODUCT
  payload: {
  id: number;
  name: string;
  product_type_id: number;
  price: number;
  status_id: number;
  description: string;
  image: string;
  quantity: number;
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
