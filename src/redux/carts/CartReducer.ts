import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../../types/cartItem';
import { CartItemService } from '../../services/cartitem.service'; 

const saveToStorage = (items: any[]) => localStorage.setItem('cart', JSON.stringify(items));
const loadFromStorage = () => {
  const data = localStorage.getItem('cart');
  return data ? JSON.parse(data) : [];
};

interface CartState {
  items: CartItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; 
  error: string | null;
}

const initialState: CartState = {
  items: loadFromStorage(),
  status: 'idle',
  error: null,
};

export const addToCartThunk = createAsyncThunk(
  'cart/addToCart',
  async (itemData: CartItem, { rejectWithValue }) => {
    try {
      const response = await CartItemService.addToCart(itemData);
      return response; 
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'เกิดข้อผิดพลาดในการเพิ่มสินค้า';
      return rejectWithValue({ message: errorMessage });
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(i => i.productId === action.payload);
      if (item) {
        item.quantity++;
        saveToStorage(state.items);
      }
    },
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(i => i.productId === action.payload);
      if (item && item.quantity > 1) {
        item.quantity--;
        saveToStorage(state.items);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const index = state.items.findIndex(i => i.productId === action.payload);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
      saveToStorage(state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newItem = action.meta.arg;
        
        const existingItem = state.items.find(i => i.productId === newItem.productId);
        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          state.items.push(newItem);
        }
        saveToStorage(state.items);
      })
      .addCase(addToCartThunk.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'เกิดข้อผิดพลาด';
      });
  },
});

export const { increaseQuantity, decreaseQuantity, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;