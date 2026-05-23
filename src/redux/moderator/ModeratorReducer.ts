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

// type Product = {
//   id: string;
//   name: string;
//   category: string;
//   price: number;
//   stock: number;
//   status: string;
// };

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
                
            })
           
    }
});

export default moderatorSlice.reducer;


// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { ModeratorService } from "../../services/moderator.service";
// import type { OrderMod } from "../../types/moderator/ordersMod";

// interface ModeratorState {
//     orders: OrderMod[];
//     orderToPrint: OrderMod[];
//     loading: boolean;
//     error: string | null;
// }

// const initialState: ModeratorState = {
//     orders: [],
//     orderToPrint: [],
//     loading: false,
//     error: null,
// };

// export const fetchAllOrders = createAsyncThunk(
//     "moderator/fetchAllOrders",
//     async () => {
//         const res = await ModeratorService.getAllOrders();
//         // 💡 แนะนำเพิ่มเติม: ถ้า API ของคุณส่งคืนเป็นก้อน object เช่น { data: [...] } 
//         // ให้แก้ไขบรรทัดล่างนี้เป็น return res.data; เพื่อแก้บั๊กเรื่องอาเรย์ที่ต้นเหตุ
//         return res; 
//     }
// );

// export const shippingOrder = createAsyncThunk(
//     "moderator/shippingOrder",
//     async (orderNo: number) => {
//         const res = await ModeratorService.shippingOrder(orderNo);
//         return res;
//     }
// ); 

// const moderatorSlice = createSlice({
//     name: "moderator",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             // Fetch All Orders
//             .addCase(fetchAllOrders.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchAllOrders.fulfilled, (state, action) => {
//                 state.loading = false;
//                 // ตรวจสอบว่า action.payload เป็น array หรือไม่ ถ้าไม่ชัวร์ใช้: action.payload?.data || action.payload
//                 state.orders = Array.isArray(action.payload) ? action.payload : [];
//             })
//             .addCase(fetchAllOrders.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
//             })
            
//             // Shipping Order
//             .addCase(shippingOrder.fulfilled, (state, action) => {
//                 state.loading = false;
//                 if (Array.isArray(state.orders)) {
//                     state.orders = state.orders.map(order =>
//                         order.orderNo === action.payload.orderNo ? { ...order, ...action.payload } : order
//                     );
//                 }
//             })
//             .addCase(shippingOrder.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || "เกิดข้อผิดพลาดในการอัพเดตสถานะการจัดส่ง";
//             });
//     }
// });

// export default moderatorSlice.reducer;