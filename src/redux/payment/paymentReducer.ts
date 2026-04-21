import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
export interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  bankName: string;
}

interface PaymentState {
  savedCards: SavedCard[];
}

const initialState: PaymentState = {
  savedCards: [],
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
  },
});

export const { addSavedCard } = paymentSlice.actions;
export default paymentSlice.reducer;
