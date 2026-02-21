import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types/product';
import { initialState } from "./initailState";

type CartItem = Product & { stockQuantity: number };

const cartsSlice = createSlice({
  name: 'carts',
  initialState: initialState as CartItem[],
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.stockQuantity += 1;
      } else {
        state.push({ ...action.payload, stockQuantity: 1 });
      }
    },


    removeFromCart: (state, action: PayloadAction<number>) => {
      const index = state.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },

    
    increaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.find(item => item.id === action.payload);
      if (item) {
        item.stockQuantity++;
      }
    },

    
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.find(item => item.id === action.payload);
      if (item && item.stockQuantity > 1) {
        item.stockQuantity--;
      }
    },
  },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity } = cartsSlice.actions;

export default cartsSlice.reducer;