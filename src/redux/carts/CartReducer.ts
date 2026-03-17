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
  name: 'carts',
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
// เปลี่ยนการลบให้เป็นแบบนี้ ใน CartReducer.ts
removeFromCart: (state, action: PayloadAction<number | string>) => {
  // บังคับแปลงทั้งสองฝั่งให้เป็น String ก่อนเช็ค และสร้าง Array ใหม่ด้วย filter
  state.items = state.items.filter(
    (item) => String(item.productId) !== String(action.payload)
  );
  
  // เซฟทับลง LocalStorage
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
        
        const existingItem = state.items.find(i => String(i.productId) === String(newItem.productId));
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