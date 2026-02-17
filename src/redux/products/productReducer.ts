import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialState as initialStateProduct } from "./initailState";
import type { Product } from '../../types/product';;


type ProductState = {
  items: Product[]
  search: string
}

const initialState:ProductState = {
  items:initialStateProduct,
  search:""
}


const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {

    // เพิ่มสินค้าใหม่
    addProduct: (state, action: PayloadAction<Product>) => {
      const newProduct = {
        ...action.payload,
        id: Date.now() 
      };
      state.items.unshift(newProduct);
    },

    // เพิ่มจำนวนสินค้าตอนกด +
    addQuantity: (state, action: PayloadAction<number>) => {
      const product = state.items.find(p => p.id === action.payload);
      if (product && product.quantity < 10) {
        product.quantity += 1;
      }
    },

    // ลดจำนวนสินค้า 
    removeQuantity: (state, action: PayloadAction<number>) => {
      const product = state.items.find(p => p.id === action.payload);
      if (product && product.quantity > 0) {
        product.quantity -= 1;
      }
    },

    // คืนของเข้าสต็อก (ตอนลบจาก cart)
    returnQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const product = state.items.find(p => p.id === action.payload.id);
      if (product) {
        product.quantity += action.payload.quantity;
      }
    },

    //ค้นหาสินค้า

    searchProduct:(
      state,
      action:PayloadAction<string>
    ) => {
      state.search = action.payload
    } 

  },
});

export const {
  addProduct,
  addQuantity,
  removeQuantity,
  returnQuantity,
  searchProduct
} = productsSlice.actions;

export default productsSlice.reducer;