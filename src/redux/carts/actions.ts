import {
ADD_TO_CART,
REMOVE_FROM_CART,
INCREASE_QUANTITY,
DECREASE_QUANTITY
} from "./actionTypes";

import type {
  AddToCart,
  QuantityAction,
  RemoveFromCart,
  DecreaseQuantity

} from "./CartAction";

export const addToCart = (
  payload: AddToCart["payload"]
): AddToCart => ({
  type: ADD_TO_CART,
  payload,
});

export const removeFromCart = (
  productId: number
): RemoveFromCart => ({
  type: REMOVE_FROM_CART,
  payload: { id: productId }
});

export const increaseQuantity = (
  productId: number,
  amount = 1
): QuantityAction => ({
  type: INCREASE_QUANTITY,
  payload: { id:productId, amount },
});

export const decreaseQuantity = (
  productId: number,
  amount = 1
): DecreaseQuantity => ({
  type: DECREASE_QUANTITY,
  payload: { id:productId , amount},
});


