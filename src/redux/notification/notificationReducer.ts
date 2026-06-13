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
    await NotificationService.deleteNotify(id);
    return id;
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

        // ✅ บันทึก ID การแจ้งเตือนที่อ่านแล้วลง LocalStorage
        try {
          const readIds: number[] = JSON.parse(
            localStorage.getItem("read_notifications") || "[]",
          );
          if (!readIds.includes(action.payload)) {
            readIds.push(action.payload);
            localStorage.setItem("read_notifications", JSON.stringify(readIds));
          }
        } catch (e) {
          console.error("Failed to save read status", e);
        }
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
        // ดึงรายการ ID ที่เคยอ่านแล้วจาก localStorage
        const readIds: number[] = JSON.parse(
          localStorage.getItem("read_notifications") || "[]",
        );

        state.items = (action.payload.content || []).map(
          (item: Notification) => ({
            ...item,
            isNew: false,
            isRead: readIds.includes(item.id), // ✅ เช็กว่าเคยอ่านหรือยัง
          }),
        );
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.number || 0;
      })
      .addCase(fetchOwnerNotify.rejected, (state) => {
        state.isLoading = false;
      })

      // --- Fetch User Notify ---
      .addCase(fetchUserNotify.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserNotify.fulfilled, (state, action) => {
        state.isLoading = false;
        // ✅ ดึงรายการ ID ที่เคยอ่านแล้วจาก localStorage
        const readIds: number[] = JSON.parse(
          localStorage.getItem("read_notifications") || "[]",
        );

        state.items = (action.payload || []).map((item: Notification) => ({
          ...item,
          isNew: false,
          isRead: readIds.includes(item.id), // ✅ ถ้ามี ID ใน localStorage ให้เป็น true ทันที
        }));
      })
      .addCase(fetchUserNotify.rejected, (state) => {
        state.isLoading = false;
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
