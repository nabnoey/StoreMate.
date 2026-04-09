import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SavedCard } from "../../types/payment";

interface PaymentState {
  savedCards: SavedCard[];
  selectedCardId: string | null;
}

//  ฟังก์ชันโหลด State จาก LocalStorage
//ใช้แค่กะไฟล์นี้
const loadState = (): PaymentState => {
  try {
    const serialized = localStorage.getItem("payment");
    if (serialized) {
      const parsed = JSON.parse(serialized);

      // กันพัง
      if (parsed && Array.isArray(parsed.savedCards)) {
        return parsed as PaymentState;
      }
    }
  } catch (e) {
    console.error("ไม่สามารถโหลดข้อมูล Payment ได้", e);
  }

  // ถ้าไม่มีข้อมูลคืนค่าเริ่มต้น
  return { savedCards: [], selectedCardId: null };
};

//  กำหนดค่าเริ่มต้นโดยดึงมาจาก loadState()
const initialState: PaymentState = loadState();

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    addCard: (state, action: PayloadAction<SavedCard>) => {
      const exists = state.savedCards.find((c) => c.id === action.payload.id);
      if (!exists) {
        state.savedCards.push(action.payload);
      }
    },
    setSelectedCard: (state, action: PayloadAction<string>) => {
      const exists = state.savedCards.find((c) => c.id === action.payload);
      if (exists) {
        state.selectedCardId = action.payload;
      }
    },
    setCards: (state, action: PayloadAction<SavedCard[]>) => {
      state.savedCards = action.payload;
    },
  },
});

export const { addCard, setSelectedCard, setCards } = paymentSlice.actions;
export default paymentSlice.reducer;

// ==========================================
// สร้าง Middleware สำหรับเซฟลง LocalStorage โดยเฉพาะ
// ==========================================
export const paymentLocalStorageMiddleware =
  (storeAPI: any) => (next: any) => (action: any) => {
    // ให้ Action ทำงานปกติไปก่อน
    const result = next(action);

    // ถ้า Action ที่กำลังทำงานอยู่ ขึ้นต้นด้วยคำว่า "payment/" (หมายถึง Action ของไฟล์นี้)
    if (action.type && action.type.startsWith("payment/")) {
      // ดึง State ปัจจุบันเฉพาะส่วน payment มาเซฟลง LocalStorage
      const paymentState = storeAPI.getState().payment;
      localStorage.setItem("payment", JSON.stringify(paymentState));
    }

    return result;
  };
