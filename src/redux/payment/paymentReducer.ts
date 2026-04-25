import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  bankName: string;
}

interface PaymentState {
  savedCards: SavedCard[];
  status: "IDLE" | "PENDING" | "SUCCESS" | "FAILED";
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
      state.status = action.payload.status;
      if (action.payload.orderId) {
        state.orderId = action.payload.orderId;
      }
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
