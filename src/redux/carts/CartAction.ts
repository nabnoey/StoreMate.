import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  INCREASE_QUANTITY,
  DECREASE_QUANTITY
} from "./actionTypes"

export type AddToCart = {
  type: typeof ADD_TO_CART
  payload: {
    id:number
    title:string
    description: string
    image: string
    category: string
    price: number
    quantity: number
  }
}

export type RemoveFromCart = {
  type: typeof REMOVE_FROM_CART
  payload: {
    id: number
  }
}

export type QuantityAction = {
  type: typeof INCREASE_QUANTITY 
  payload: {
    id: number
    amount:number
  }
}

export type DecreaseQuantity = {
  type: typeof DECREASE_QUANTITY
  payload: {
    id: number
    amount:number
  }
}



export type CartAction = AddToCart | RemoveFromCart | QuantityAction | DecreaseQuantity
