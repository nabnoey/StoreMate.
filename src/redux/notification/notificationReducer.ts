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

// ✨ ปรับปรุง: การันตีการส่ง ID กลับไปที่ Reducer เพื่อป้องกันปัญหา API ไม่คืนค่า ID
export const deleteNotify = createAsyncThunk(
  "notification/delete",
  async (id: number) => {
    await NotificationService.deleteNotify(id);
    return id; // ส่ง id ตัวเลขออกไปแน่นอน ไม่ต้องลุ้น payload จาก backend
  },
);

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
        // ดันขึ้นบนสุด สภาพพร้อมใช้งาน Realtime
        state.items.unshift({ ...action.payload, isNew: true, isRead: false });
      }
    },
    clearUnreadBadge: (state) => {
      state.items = state.items.map((item) => ({
        ...item,
        isNew: false,
      }));
    },
    markAsReadInStore: (state, action: PayloadAction<number>) => {
      const target = state.items.find((item) => item.id === action.payload);
      if (target) {
        target.isRead = true;
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
        state.items = (action.payload.content || []).map(
          (item: Notification) => ({
            ...item,
            isNew: false,
            isRead: false, // หมายเหตุ: หาก Backend มีฟิลด์สถานะการอ่าน ให้เปลี่ยนเป็น item.isRead แทนข้อมูล Hardcode
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
        state.items = (action.payload || []).map((item: Notification) => ({
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
        // ลบข้อมูลออกจากตารางในสเตตทันทีตาม postcondition ของ UC-43
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteNotify.rejected, (state) => {
        state.isSubmitting = false;
      });
  },
});

export const {
  addNotificationFromSocket,
  clearUnreadBadge,
  markAsReadInStore,
} = notificationSlice.actions;
export default notificationSlice.reducer;