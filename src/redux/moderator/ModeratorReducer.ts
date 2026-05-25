import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {ModeratorService} from "../../services/moderator.service";
import type { OrderMod } from "../../types/moderator/ordersMod";
import type {Product} from "../../types/product";

interface ModeratorState {
    orders: OrderMod[];
    orderToPrint: OrderMod[];
    loading: boolean;
    error: string | null;
}

const initialState: ModeratorState = {
    orders: [],
    orderToPrint: [],
    loading: false,
    error: null,
};



export const fetchAllOrders = createAsyncThunk(
    "moderator/fetchAllOrders",
    async () => {
        const res = await ModeratorService.getAllOrders();
        return res;
    });

    export const shippingOrder = createAsyncThunk(
    "moderator/shippingOrder",
    async (orderNo: number) => {
        const res = await ModeratorService.shippingOrder(orderNo);
        return res;
    }); 

    export const getoOrder = createAsyncThunk(
        "moderator/getoOrder",
        async (orderNo: number) => {
            const res = await ModeratorService.getoOrder(orderNo);
            return res;
        });

export const getoOrderByOrderNo = createAsyncThunk(
    "moderator/getoOrderByOrderNo",
    async (orderNo: number) => {
        const res = await ModeratorService.getoOrderByOrderNo(orderNo);
        return res;
    }
)

        export const addProduct = createAsyncThunk(
            "moderator/addProduct",
            async (data: Product) => {
                const res = await ModeratorService.addProduct(data);
                return res;
            }
        )
    



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
      .addCase(getoOrderByOrderNo.fulfilled, (state, action) => {
        state.orderToPrint = [action.payload];
      })     
    }

    
});

export default moderatorSlice.reducer;


