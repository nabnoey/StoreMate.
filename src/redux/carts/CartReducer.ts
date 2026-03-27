import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { CartItem } from "../../types/cartItem";
import { CartItemService } from "../../services/cartitem.service";

// const saveToStorage = (items: any[]) =>
//   localStorage.setItem("cart", JSON.stringify(items));
// const loadFromStorage = () => {
//   const data = localStorage.getItem("cart");
//   return data ? JSON.parse(data) : [];
// };

interface CartState {
  items: CartItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CartState = {
  items: [],
  
  status: "idle",
  error: null,
};

export const fetchCartThunk = createAsyncThunk("cart/fetchCart", async () => {
  const response = await CartItemService.getCart();
  return response;
});


export const addToCartThunk = createAsyncThunk(
  "cart/addToCart",
  async (itemData: CartItem, { rejectWithValue }) => {
    try {
      const response = await CartItemService.addToCart(itemData);
      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "เกิดข้อผิดพลาดในการเพิ่มสินค้า";
      return rejectWithValue({ message: errorMessage });
    }
  },
);

export const incrementCartItemThunk = createAsyncThunk(
  "cart/incrementCartItem",
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await CartItemService.incrementCartItem(productId);
      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "เกิดข้อผิดพลาดในการเพิ่มจำนวนสินค้า";

      return rejectWithValue({ message: errorMessage });
    }
  },
);

export const decrementCartItemThunk = createAsyncThunk(
  "cart/decrementCartItem",
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await CartItemService.decrementCartItem(productId);
      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "เกิดข้อผิดพลาดในการลดจำนวนสินค้า";

      return rejectWithValue({ message: errorMessage });
    }
  },
);

export const deleteCartItemThunk = createAsyncThunk(
  "cart/deleteCartItemThunk",
  async (productId: number) => {
    const response = await CartItemService.removeCartItem(productId);
    return response;
  },
);


const cartSlice = createSlice({
  name: "carts",
  initialState,
  reducers: {
    // เปลี่ยนการลบให้เป็นแบบนี้ ใน CartReducer.ts
    removeFromCart: (state, action: PayloadAction<number | string>) => {
      // บังคับแปลงทั้งสองฝั่งให้เป็น String ก่อนเช็ค และสร้าง Array ใหม่ด้วย filter
      state.items = state.items.filter(
        (item) => String(item.productId) !== String(action.payload),
      );

      // เซฟทับลง LocalStorage
      // saveToStorage(state.items);
    },
  },

  extraReducers: (builder) => {
    builder

    

      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        const newItem = action.meta.arg;

        const existingItem = state.items.find(
          (i) => String(i.productId) === String(newItem.productId),
        );
        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          state.items.push(newItem);
        }
        // saveToStorage(state.items);
      })
      .addCase(addToCartThunk.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload?.message || "เกิดข้อผิดพลาด";
      })
      .addCase(incrementCartItemThunk.fulfilled, (state, action) => {
        const productId = action.meta.arg;

        const item = state.items.find(
          (i) => String(i.productId) === String(productId),
        );
        if (item) {
          item.quantity += 1;
          // saveToStorage(state.items);
        }
      })

      .addCase(decrementCartItemThunk.fulfilled, (state, action) => {
        const productId = action.meta.arg;

        const item = state.items.find(
          (i) => String(i.productId) === String(productId),
        );
        if (item) {
          item.quantity -= 1;
          // saveToStorage(state.items);
        }

      })
      .addCase(deleteCartItemThunk.fulfilled, (state, action) => {
        const productId = action.meta.arg;

        state.items = state.items.filter(
          (item) => item.productId !== productId,
        );

      })
.addCase(fetchCartThunk.pending, (state) => {
  state.status = "loading";
})
.addCase(fetchCartThunk.fulfilled, (state, action) => {
  state.status = "succeeded";
  state.items = action.payload;
})
.addCase(fetchCartThunk.rejected, (state, action) => {
  state.status = "failed";
  state.error = action.payload as string;
});

      
  }
});

export const { removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
