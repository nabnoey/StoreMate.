import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { OrdersService } from "../../services/orders.service";
import type { Order, OrderStatus } from "../../types/orders";

interface OrdersState {
  orders: Order[];
  orderDetail: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  orderDetail: null,
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (status: OrderStatus) => {
    const res = await OrdersService.getOrders(status);
    return res;
  },
);

export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (orderNo: string) => {
    const res = await OrdersService.orderDetails(orderNo);
    return res;
  },
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.orders = [];
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "เกิดข้อผิดพลาด";
      })

      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.orderDetail = null;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.orderDetail = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "เกิดข้อผิดพลาดในการโหลดรายละเอียด";
      });
  },
});

export default ordersSlice.reducer;
