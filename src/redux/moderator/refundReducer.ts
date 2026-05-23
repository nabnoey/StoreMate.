import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  RefundItem,
  RefundsResponse,
} from "../../types/moderator/refundMod"; // ปรับ path ตามจริง

export interface RefundState {
  refunds: RefundItem[];
  pendingCount: number;
  total: number;
  selectedRefund: RefundItem | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: RefundState = {
  refunds: [],
  pendingCount: 0,
  total: 0,
  selectedRefund: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
};

// --- Async Thunks ---
export const fetchRefunds = createAsyncThunk(
  "refunds/fetchRefunds",
  async (
    { page, size }: { page: number; size: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(
        `/api/v1/moderator/orders/refund?page=${page}&size=${size}`,
      );
      if (!response.ok) throw new Error("เรียกข้อมูลล้มเหลว");
      return (await response.json()) as RefundsResponse;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchRefundDetail = createAsyncThunk(
  "refunds/fetchRefundDetail",
  async (refundNo: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/moderator/orders/${refundNo}`);
      if (!response.ok) throw new Error("ไม่พบรายละเอียดคำขอ");
      return (await response.json()) as RefundItem;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const approveRefund = createAsyncThunk(
  "refunds/approveRefund",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/v1/payment/refund-request/${id}/approve`,
        {
          method: "POST",
        },
      );
      if (!response.ok) throw new Error("ไม่สามารถอนุมัติได้");
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const rejectRefund = createAsyncThunk(
  "refunds/rejectRefund",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/v1/payment/refund-request/${id}/reject`,
        {
          method: "POST",
        },
      );
      if (!response.ok) throw new Error("ไม่สามารถปฏิเสธได้");
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// --- Slice ---
const refundSlice = createSlice({
  name: "refunds",
  initialState,
  reducers: {
    clearSelectedRefund: (state) => {
      state.selectedRefund = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchRefunds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchRefunds.fulfilled,
        (state, action: PayloadAction<RefundsResponse>) => {
          state.isLoading = false;
          state.refunds = action.payload.refunds;
          state.pendingCount = action.payload.pendingCount;
          state.total = action.payload.total;
        },
      )
      .addCase(fetchRefunds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Detail
      .addCase(
        fetchRefundDetail.fulfilled,
        (state, action: PayloadAction<RefundItem>) => {
          state.selectedRefund = action.payload;
        },
      )
      // Actions
      .addMatcher(
        (action) =>
          action.type.endsWith("/pending") && action.type.includes("Refund"),
        (state) => {
          state.isSubmitting = true;
        },
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/fulfilled") && action.type.includes("Refund"),
        (state) => {
          state.isSubmitting = false;
        },
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/rejected") && action.type.includes("Refund"),
        (state, action) => {
          state.isSubmitting = false;
          state.error = action.payload;
        },
      );
  },
});

export const { clearSelectedRefund } = refundSlice.actions;
export default refundSlice.reducer;
