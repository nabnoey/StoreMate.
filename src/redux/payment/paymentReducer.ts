import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// สร้าง Type สำหรับบัตร (ถ้าคุณมีในไฟล์ types อยู่แล้วให้ import มาแทนได้เลย)
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
  savedCards: [], // เริ่มต้นให้รายการบัตรว่างเปล่า
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    // 🌟 นี่คือฟังก์ชัน addSavedCard ที่เราสร้างขึ้นมาใหม่!
    addSavedCard: (state, action: PayloadAction<SavedCard>) => {
      // เช็คก่อนว่ามีบัตรใบนี้อยู่แล้วหรือยัง (เช็คจาก id) ป้องกันบัตรซ้ำ
      const isExist = state.savedCards.find(
        (card) => card.id === action.payload.id,
      );
      if (!isExist) {
        // ถ้ายังไม่มี ให้จับใส่เข้าไปใน list
        state.savedCards.push(action.payload);
      }
    },
  },
});

export const { addSavedCard } = paymentSlice.actions;
export default paymentSlice.reducer;
