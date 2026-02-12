import {
  ADD_PRODUCT,
  ADD_QUANTITY,
  REMOVE_QUANTITY,
} from "./actionTypes";

import type {
  AddProductAction,
  QuantityAction,
} from "./ProductAction";

export const addProduct = (
  payload: AddProductAction["payload"]
): AddProductAction => ({
  type: ADD_PRODUCT,
  payload,
});

export const addQuantity = (
  productId: number,
): QuantityAction => ({
  type: ADD_QUANTITY,
  payload: { productId },
});

export const removeQuantity = (id:number) => ({
  type: REMOVE_QUANTITY,
  payload: { productId:id }
})