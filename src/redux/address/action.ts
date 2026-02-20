import { ADD_ADDRESS, DELETE_ADDRESS, SET_DEFAULT_ADDRESS } from "./actionTypes";
import type { AddAddressAction, DeleteAddressAction, SetDefaultAddressAction } from "./addressAction";
import type { AddressItem } from "./addressInitialState";

export const addAddress = (
  payload: AddressItem
): AddAddressAction => ({
  type: ADD_ADDRESS,
  payload
});

export const deleteAddress = (
  id: string
): DeleteAddressAction => ({
  type: DELETE_ADDRESS,
  payload: id
});

export const setDefaultAddress = (
  id: string
): SetDefaultAddressAction => ({
  type: SET_DEFAULT_ADDRESS,
  payload: id
});