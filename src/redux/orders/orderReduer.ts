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
  },
);

export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (orderNo: string) => {
    const res = await OrdersService.orderDetails(orderNo);
    return res;
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
ล
        state.loading = false;
develop
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "เกิดข้อผิดพลาด";
      })

      // ✅ จัดการ fetchOrderDetails
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        const orderIndex = state.orders.findIndex(
          (order) => order.orderNo === action.payload.orderNo
        );
        if (orderIndex !== -1) {
          // ถ้าพบอันที่เหมือน ให้อัพเดท
          state.orders[orderIndex] = { ...state.orders[orderIndex], ...action.payload };
        } else {
          // ถ้าไม่พบ ให้เพิ่มใหม่
          state.orders.push(action.payload);
        }
        state.loading = false;
      })

      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching orders";
      });
  },
});

export default ordersSlice.reducer;
