import { ADD_ADDRESS, DELETE_ADDRESS, SET_DEFAULT_ADDRESS } from "./actionTypes";
import type { AddressAction, AddAddressAction, DeleteAddressAction, SetDefaultAddressAction } from "./addressAction";
import { addressInitialState, type AddressState } from "./addressInitialState";
import type { UnknownAction } from "redux";

const addressReducer = (
  state = addressInitialState,
  action: AddressAction | UnknownAction
): AddressState => {
  switch (action.type) {
    case ADD_ADDRESS: {
      const newAddress = (action as AddAddressAction).payload;
      return {
        ...state,
        address: [...state.address, newAddress], // เอาของเก่ามากาง แล้วต่อท้ายด้วยของใหม่
      };
    }

    case DELETE_ADDRESS: {
      const idToDelete = (action as DeleteAddressAction).payload;
      const targetAddress = state.address.find(a => a.id === idToDelete);
      
      // ลบรายการนั้นออก
      let updatedAddresses = state.address.filter(a => a.id !== idToDelete);

      // (Logic พิเศษ) ถ้าลบตัวที่เป็นค่าเริ่มต้นไป แล้วยังมีที่อยู่เหลืออยู่ ให้ตัวแรกกลายเป็นค่าเริ่มต้นแทน
      if (targetAddress?.isDefault && updatedAddresses.length > 0) {
        updatedAddresses = updatedAddresses.map((address, index) => 
          index === 0 ? { ...address, isDefault: true } : address
        );
      }

      return {
        ...state,
        address: updatedAddresses,
      };
    }

    case SET_DEFAULT_ADDRESS: {
      const idToDefault = (action as SetDefaultAddressAction).payload;
      
      // วนลูปเพื่อเซ็ตตัวที่ ID ตรงกันให้ isDefault เป็น true และตัวอื่นเป็น false
      const updatedAddresses = state.address.map(address => ({
        ...address,
        isDefault: address.id === idToDefault
      }));

      return {
        ...state,
        address: updatedAddresses,
      };
    }

    default:
      return state;
  }
};

export default addressReducer;