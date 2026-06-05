import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ModeratorService } from "../../services/moderator.service";
import type { OrderMod } from "../../types/moderator/ordersMod";
import type { ProductMod } from "../../types/moderator/productMod"; 


interface ModeratorState {
  orders: OrderMod[];
  orderToPrint: OrderMod[];
  products: ProductMod[];
  loading: boolean;
  error: string | null;
  totalPages: number;
}

const initialState: ModeratorState = {
  orders: [],
  orderToPrint: [],
  products: [],
  loading: false,
  error: null,
  totalPages: 0,
};

export const fetchAllOrders = createAsyncThunk(
  "moderator/fetchAllOrders",
  async ({ keyword, startDate, endDate, period, page, size }: { keyword?: string; startDate?: string; endDate?: string; period?: string; page: number; size: number }) => {
    const res = await ModeratorService.getAllOrders(keyword, startDate, endDate, period, page, size);
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


export const getoOrderByOrderNo = createAsyncThunk(
  "moderator/getoOrderByOrderNo",
  async (orderNo: string) => {
    const res = await ModeratorService.getoOrderByOrderNo(orderNo);
    return res;
  },
);

        export const addProduct = createAsyncThunk(
            "moderator/addProduct",
            async (data: FormData) => {
                const res = await ModeratorService.addProduct(data);
                return res;
            }
        )

export const getproducts = createAsyncThunk(
  "moderator/getproducts",
  async ({ page, size }: { page: number; size: number }) => {
    const res = await ModeratorService.getproducts(page, size);
    return res;
  }
)

export const editProduct = createAsyncThunk(
  "moderator/editProduct",
  async ({ id, data }: { id: number; data: FormData }) => {
    const res = await ModeratorService.updateProduct(id, data);
    return res;
  }
)

  export const deleteProduct = createAsyncThunk(
    "moderator/deleteProduct",
    async (id: number) =>{
        const res = await ModeratorService.deleteProduct(id);
        return res;
    }
  )


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
                state.totalPages = action.payload.totalPages
                console.log("Orders fetched successfully:", state.orders);
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
            });
        builder
          
            .addCase(shippingOrder.fulfilled, (state, action) => {
                if (Array.isArray(action.payload)) {
                    const updatedIds = action.payload.map((o: any) => o.id);
                    state.orders = state.orders.map(order => 
                        updatedIds.includes(order.id) ? action.payload.find((o: any) => o.id === order.id) : order
                    );
                }
                state.loading = false;
            })

            .addCase(shippingOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "เกิดข้อผิดพลาดในการอัพเดตสถานะการจัดส่ง";
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
  
.addCase(addProduct.fulfilled, (state, action) => {
    if (Array.isArray(state.products)) {
        state.products.push(action.payload.data);
    }
})


            builder
            .addCase(getproducts.fulfilled, (state, action) => {
                const items = action.payload?.data?.data 
                console.log("payload:", action.payload);
                if (Array.isArray(items)) {
                  state.products = items;
                  state.totalPages = action.payload.data.totalPages;
                }
            })
            }

            


    });

  

export default moderatorSlice.reducer;
