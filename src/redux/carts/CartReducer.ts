import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { CartItem, CartItemRequestDTO } from "../../types/cartItem";
import { CartItemService } from "../../services/cartitem.service";

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
  async (itemData: CartItemRequestDTO, { dispatch, rejectWithValue }) => {
    try {
      const response = await CartItemService.addToCart(itemData);
      dispatch(fetchCartThunk());
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
    removeFromCart: (state, action: PayloadAction<number | string>) => {
      state.items = state.items.filter(
        (item) => String(item.productId) !== String(action.payload),
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(addToCartThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        const requestData = action.meta.arg;
        const existingItem = state.items.find(
          (i) => String(i.productId) === String(requestData.productId),
        );

        if (existingItem) {
          existingItem.quantity += requestData.quantity;
        } else {
          if (typeof action.payload === "object" && action.payload !== null) {
            state.items.push(action.payload);
          }
        }
      })
      .addCase(addToCartThunk.rejected, (state, action: any) => {
        state.status = "failed";

        const payload = action.payload as { message?: string } | undefined;
        state.error = payload?.message || "เกิดข้อผิดพลาด";
      })
      .addCase(incrementCartItemThunk.fulfilled, (state, action) => {
        const productId = action.meta.arg;

        const item = state.items.find(
          (i) => String(i.productId) === String(productId),
        );
        if (item) {
          item.quantity += 1;
        }
      })

      .addCase(decrementCartItemThunk.fulfilled, (state, action) => {
        const productId = action.meta.arg;

        const item = state.items.find(
          (i) => String(i.productId) === String(productId),
        );
        if (item) {
          item.quantity -= 1;
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
  },
});

export const { removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
