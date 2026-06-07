import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { NotificationService } from "../../services/notification.service";
import type {
  Notification,
  NotificationRequest,
  FetchNotifyParams,
} from "../../types/notification";

export const fetchOwnerNotify = createAsyncThunk(
  "notification/fetchOwner",
  async (params: FetchNotifyParams) => {
    return await NotificationService.getNotifyOwner(params);
  },
);

export const fetchUserNotify = createAsyncThunk(
  "notification/fetchUser",
  async () => {
    return await NotificationService.getNotifyUser();
  },
);

export const createNotify = createAsyncThunk(
  "notification/create",
  async (data: NotificationRequest) => {
    return await NotificationService.createNotifyOwner(data);
  },
);

export const deleteNotify = createAsyncThunk(
  "notification/delete",
  async (id: number) => {
    return await NotificationService.deleteNotify(id);
  },
);

// ✅ 1. เพิ่มฟิลด์ isRead ควบคู่ไปกับ isNew เพื่อใช้จัดการสถานะรายชิ้นในแรม
export interface ClientNotification extends Notification {
  isNew?: boolean;
  isRead?: boolean;
}

interface NotificationState {
  items: ClientNotification[];
  isLoading: boolean;
  isSubmitting: boolean;
  totalPages: number;
  currentPage: number;
}

const initialState: NotificationState = {
  items: [],
  isLoading: false,
  isSubmitting: false,
  totalPages: 0,
  currentPage: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotificationFromSocket: (state, action: PayloadAction<Notification>) => {
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (!exists) {
        // ✅ ข้อมูลใหม่จาก Socket: เซ็ตเป็นของใหม่ชัวร์ (isNew: true) และยังไม่ได้เปิดอ่าน (isRead: false)
        state.items.unshift({ ...action.payload, isNew: true, isRead: false });
      }
    },
    clearUnreadBadge: (state) => {
      // เมื่อกดเปิดดูที่กระดิ่ง เคลียร์เม็ดสีแดงแจ้งเตือนรวมออกอย่างเดียว
      state.items = state.items.map((item) => ({
        ...item,
        isNew: false,
      }));
    },
    // ✅ 2. เพิ่ม Reducer สำหรับการกดคลิกอ่านทีละข้อความในแรม (In-Memory)
    markAsReadInStore: (state, action: PayloadAction<number>) => {
      const target = state.items.find((item) => item.id === action.payload);
      if (target) {
        target.isRead = true; // ปรับชิ้นที่คลิกให้เป็นอ่านแล้วทันที
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Owner Notify ---
      .addCase(fetchOwnerNotify.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOwnerNotify.fulfilled, (state, action) => {
        state.isLoading = false;
        // ✅ แปลงข้อมูลที่โหลดมา: ให้เริ่มต้นสถานะเป็นยังไม่ได้อ่าน (isRead: false) เพื่อรอให้ยูสเซอร์มากดอ่านทีละกล่อง
        state.items = (action.payload.content || []).map(
          (item: Notification) => ({
            ...item,
            isNew: false,
            isRead: false,
          }),
        );
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.number || 0;
      })
      .addCase(fetchOwnerNotify.rejected, (state) => {
        state.isLoading = false;
      })

      // --- Fetch User Notify ---
      .addCase(fetchUserNotify.fulfilled, (state, action) => {
        // ✅ ปรับพฤติกรรมเหมือนฝั่ง Owner คือเซ็ตให้ทุกรายการเริ่มต้นเป็นยังไม่ได้อ่าน (isRead: false) เพื่อให้กดอ่านทีละชิ้นได้
        state.items = action.payload.map((item: Notification) => ({
          ...item,
          isNew: false,
          isRead: false,
        }));
      })

      // --- Create Notify ---
      .addCase(createNotify.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(createNotify.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (!action.payload) return;
        const exists = state.items.some(
          (item) => item.id === action.payload.id,
        );
        if (!exists) {
          // เพิ่มฟิลด์เริ่มต้นให้ไอเทมใหม่ที่เพิ่งสร้างขึ้น
          state.items.unshift({
            ...action.payload,
            isNew: false,
            isRead: false,
          });
        }
      })
      .addCase(createNotify.rejected, (state) => {
        state.isSubmitting = false;
      })

      // --- Delete Notify ---
      .addCase(deleteNotify.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(deleteNotify.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteNotify.rejected, (state) => {
        state.isSubmitting = false;
      });
  },
});

// ✅ 3. Export "markAsReadInStore" ออกไปใช้งานที่หน้า NotificationPage ด้วยครับ
export const {
  addNotificationFromSocket,
  clearUnreadBadge,
  markAsReadInStore,
} = notificationSlice.actions;
export default notificationSlice.reducer;
