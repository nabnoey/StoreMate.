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
      if (product && product.stockQuantity < 10) {
        product.stockQuantity += 1;
      }
    },

    // ลดจำนวนสินค้า 
    removeQuantity: (state, action: PayloadAction<number>) => {
      const product = state.items.find(p => p.id === action.payload);
      if (product && product.stockQuantity > 0) {
        product.stockQuantity -= 1;
      }
    },

    // คืนของเข้าสต็อก (ตอนลบจาก cart)
    returnQuantity: (
      state,
      action: PayloadAction<{ id: number; stockQuantity: number }>
    ) => {
      const product = state.items.find(p => p.id === action.payload.id);
      if (product) {
        product.stockQuantity += action.payload.stockQuantity;
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