import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  bankName: string;
}

interface PaymentState {
  savedCards: SavedCard[];
  status: "IDLE" | "PENDING" | "PAYMENT_SUCCESS" | "PAYMENT_FAILS";
  orderId: string | null;
}

const initialState: PaymentState = {
  savedCards: [],
  status: "IDLE",
  orderId: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    addSavedCard: (state, action: PayloadAction<SavedCard>) => {
      const isExist = state.savedCards.find(
        (card) => card.id === action.payload.id,
      );
      if (!isExist) {
        state.savedCards.push(action.payload);
      }
    },

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

export const { addSavedCard, setPaymentStatus, resetPaymentStatus } =
  paymentSlice.actions;
export default paymentSlice.reducer;
