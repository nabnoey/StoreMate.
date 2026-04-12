import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { OrdersService } from "../../services/orders.service";
import type { Order, OrderStatus } from "../../types/orders";

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (status: OrderStatus) => {
    const res = await OrdersService.getOrders(status);
    return res;
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    //   .addCase(fetchOrders.pending, (state) => {
    //     state.loading = true;
    //   })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        // state.loading = false;
        state.orders = action.payload;
      })
    //   .addCase(fetchOrders.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message || "Error";
    //   });
  },
});

export default ordersSlice.reducer;