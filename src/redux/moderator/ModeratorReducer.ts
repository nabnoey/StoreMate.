import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {ModeratorService} from "../../services/moderator.service";
import type { OrderMod } from "../../types/moderator/ordersMod";

interface ModeratorState {
    orders: OrderMod[];
    loading: boolean;
    error: string | null;
}

const initialState: ModeratorState = {
    orders: [],
    loading: false,
    error: null,
};

export const fetchAllOrders = createAsyncThunk(
    "moderator/fetchAllOrders",
    async () => {
        const res = await ModeratorService.getAllOrders();
        return res;
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
                state.orders = action.payload;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
            });
    }
});

export default moderatorSlice.reducer;