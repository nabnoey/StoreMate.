import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PaymentState {
  status: "IDLE" | "PENDING" | "PAYMENT_SUCCESS" | "PAYMENT_FAILS";
  orderId: string | null;
}

const initialState: PaymentState = {
  status: "IDLE",
  orderId: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentStatus: (
      state,
      action: PayloadAction<{
        status: PaymentState["status"];
        orderId?: string;
      }>,
    ) => {
      if (state.status === action.payload.status) return;

      state.status = action.payload.status;
      state.orderId = action.payload.orderId || null;
    },

    resetPaymentStatus: (state) => {
      state.status = "IDLE";
      state.orderId = null;
    },
  },
});

export const { setPaymentStatus, resetPaymentStatus } = paymentSlice.actions;
export default paymentSlice.reducer;
