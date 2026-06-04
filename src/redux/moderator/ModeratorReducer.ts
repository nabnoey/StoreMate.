import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ModeratorService } from "../../services/moderator.service";
import type { OrderMod } from "../../types/moderator/ordersMod";
import type { Product } from "../../types/product";

interface ModeratorState {
  orders: OrderMod[];
  orderToPrint: OrderMod[];
  loading: boolean;
  error: string | null;
  totalPages: number;
}

const initialState: ModeratorState = {
  orders: [],
  orderToPrint: [],
  loading: false,
  error: null,
  totalPages: 0,
};

export const fetchAllOrders = createAsyncThunk(
  "moderator/fetchAllOrders",
  async ({ page, size }: { page: number; size: number }) => {
    const res = await ModeratorService.getAllOrders(page, size);
    return res;
  },
);

export const shippingOrder = createAsyncThunk(
  "moderator/shippingOrder",
  async (orderNo: number) => {
    const res = await ModeratorService.shippingOrder(orderNo);
    return res;
  },
);

export const getOrder = createAsyncThunk(
  "moderator/getoOrder",
  async (orderNo: number) => {
    const res = await ModeratorService.getoOrder(orderNo);
    return res;
  },
);

export const getoOrderByOrderNo = createAsyncThunk(
  "moderator/getoOrderByOrderNo",
  async (orderNo: string) => {
    const res = await ModeratorService.getoOrderByOrderNo(orderNo);
    return res;
  },
);

export const addProduct = createAsyncThunk(
  "moderator/addProduct",
  async (data: Product) => {
    const res = await ModeratorService.addProduct(data);
    return res;
  },
);

export const updateOrderStatus = createAsyncThunk(
  "moderator/updateOrderStatus",
  async ({ orderNo, status }: { orderNo: string; status: string }) => {
    const res = await ModeratorService.updateOrderStatus(orderNo, status);
    return res;
  },
);

export const changeStatus = createAsyncThunk(
  "moderator/changeStatus",
  async ({ orderNo, status }: { orderNo: string; status: string }) => {
    const res = await ModeratorService.changeStatus(orderNo, status);
    return res;
  },
);

const moderatorSlice = createSlice({
  name: "moderator",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.content;
        state.totalPages = action.payload.totalPages;
        console.log("Orders fetched successfully:", state.orders);
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      });
    builder

      .addCase(shippingOrder.fulfilled, (state, action) => {
        state.orders = state.orders.map((order) =>
          order.orderNo === action.payload.orderNo
            ? { ...order, ...action.payload }
            : order,
        );
        state.loading = false;
      })

      .addCase(shippingOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "เกิดข้อผิดพลาดในการอัพเดตสถานะการจัดส่ง";
      });

    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.orders = [...state.orders, action.payload];
    });

const moderatorSlice = createSlice({
    name: "moderator",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.content;
                state.totalPages = action.payload.totalPages
                console.log("Orders fetched successfully:", state.orders);
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
            });
        builder
          
            .addCase(shippingOrder.fulfilled, (state, action) => {
                state.orders = state.orders.map(order =>
                    order.orderNo === action.payload.orderNo ? { ...order, ...action.payload } : order
                );
                state.loading = false;
            })

            .addCase(shippingOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "เกิดข้อผิดพลาดในการอัพเดตสถานะการจัดส่ง";
            });

        builder
            .addCase(addProduct.fulfilled, (state, action) => {
                state.orders = [...state.orders, action.payload];
                
            });

        builder
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const updatedOrder = action.payload;
                state.orders = state.orders.map(order =>
                    order.orderNo === updatedOrder.orderNo ? { ...order, ...updatedOrder } : order
                );
                state.orderToPrint = updatedOrder ? [updatedOrder] : state.orderToPrint;
                state.loading = false;
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "เกิดข้อผิดพลาดในการอัปเดตสถานะคำสั่งซื้อ";
            });

        builder
            .addCase(getoOrderByOrderNo.fulfilled, (state, action) => {
                state.orderToPrint = [action.payload];
            })
            .addCase(changeStatus.fulfilled, (state, action) => {
                state.orders = state.orders.map(order =>
                    order.orderNo === action.payload.orderNo ? { ...order, ...action.payload } : order
                );
                state.loading = false;
            })
    }
});

export default moderatorSlice.reducer;
