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
  NotificationType,
} from "../../types/notification";

export const fetchOwnerNotify = createAsyncThunk(
  "notification/fetchOwner",
  async (params: FetchNotifyParams) => {
    return await NotificationService.getNotifyOwner(params);
  },
);

export const fetchUserNotify = createAsyncThunk(
  "notification/fetchUser",
  async (type: NotificationType = "ALL") => {
    return await NotificationService.getNotifyUser(type);
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

const getSafeReadIds = (): number[] => {
  try {
    return JSON.parse(localStorage.getItem("read_notifications") || "[]");
  } catch (e) {
    console.error("Failed to parse read_notifications from localStorage", e);
    return [];
  }
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // รับข้อมูลจาก WebSocket
    addNotificationFromSocket: (state, action: PayloadAction<Notification>) => {
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (!exists) {
        // ดึงจาก local มาเช็กซ้ำ
        const readIds = getSafeReadIds();
        state.items.unshift({
          ...action.payload,
          isNew: true,
          isRead: readIds.includes(action.payload.id),
        });
      }
    },

    // กดเปิดกระดิ่งแล้วให้เคลียร์ตัวเลข Badge ทั้งหมดทันที
    clearUnreadBadge: (state) => {
      const readIds = getSafeReadIds();

      state.items = state.items.map((item) => {
        if (!item.isRead && !readIds.includes(item.id)) {
          readIds.push(item.id);
        }
        return {
          ...item,
          isNew: false,
          isRead: true, // ปรับเป็นอ่านแล้วเพื่อลดจำนวน unreadCount ใน Navbar
        };
      });

      // บันทึกก้อน ID ทั้งหมดกลับลงฐานข้อมูลจำลอง (localStorage)
      try {
        localStorage.setItem("read_notifications", JSON.stringify(readIds));
      } catch (e) {
        console.error(
          "Failed to update clearUnreadBadge inside localStorage",
          e,
        );
      }
    },

    markAsReadInStore: (state, action: PayloadAction<number | string>) => {
      const targetId = String(action.payload);
      state.items = state.items.map((item) => {
        if (String(item.id) === targetId) {
          return { ...item, isRead: true, isNew: false };
        }
        return item;
      });

      // บันทึกลง LocalStorage
      try {
        const readIds = getSafeReadIds().map(String); // แปลงของเก่าในเครื่องเป็น String ให้หมด
        if (!readIds.includes(targetId)) {
          readIds.push(targetId);
          localStorage.setItem("read_notifications", JSON.stringify(readIds));
        }
      } catch (e) {
        console.error("Failed to save read status", e);
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
        const readIds = getSafeReadIds();

        state.items = (action.payload.content || []).map(
          (item: Notification) => ({
            ...item,
            isNew: false,
            isRead: readIds.includes(item.id),
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
        const readIds = getSafeReadIds().map(String);

        state.items = (action.payload || []).map((item: Notification) => ({
          ...item,
          isNew: false,
          isRead: readIds.includes(String(item.id)),
        }));
      })
      .addCase(fetchUserNotify.rejected, (state) => {
        state.isLoading = false;
      })

      // --- Create Notify ---
      .addCase(createNotify.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(createNotify.fulfilled, (state) => {
        state.isSubmitting = false;
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
