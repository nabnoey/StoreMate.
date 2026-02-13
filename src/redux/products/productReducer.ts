import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./initailState";
import type { Product } from '../../types/product';;


const productsSlice = createSlice({
  name: "products",
  initialState: initialState as Product[],
  reducers: {

    // เพิ่มสินค้าใหม่
    addProduct: (state, action: PayloadAction<Product>) => {
      const newProduct = {
        ...action.payload,
        id: Date.now() 
      };
      state.unshift(newProduct);
    },

    // เพิ่มจำนวนสินค้าตอนกด +
    addQuantity: (state, action: PayloadAction<number>) => {
      const product = state.find(p => p.id === action.payload);
      if (product && product.quantity < 10) {
        product.quantity += 1;
      }
    },

    // ลดจำนวนสินค้า 
    removeQuantity: (state, action: PayloadAction<number>) => {
      const product = state.find(p => p.id === action.payload);
      if (product && product.quantity > 0) {
        product.quantity -= 1;
      }
    },

    // คืนของเข้าสต็อก (ตอนลบจาก cart)
    returnQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const product = state.find(p => p.id === action.payload.id);
      if (product) {
        product.quantity += action.payload.quantity;
      }
    }

  },
});

export const {
  addProduct,
  addQuantity,
  removeQuantity,
  returnQuantity
} = productsSlice.actions;

export default productsSlice.reducer;