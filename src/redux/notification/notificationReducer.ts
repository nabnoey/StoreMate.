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

export const fetchNotificationCounts = createAsyncThunk(
  "notification/counts",
  async () => {
    const [all, ordered, refunded, store] = await Promise.all([
      NotificationService.getNotifyUser("ALL"),
      NotificationService.getNotifyUser("ORDERED"),
      NotificationService.getNotifyUser("REFUNDED"),
      NotificationService.getNotifyUser("STORE"),
    ]);

    return {
      all,
      ordered,
      refunded,
      store,
    };
  },
);

export interface ClientNotification extends Notification {
  isNew?: boolean;
  isRead?: boolean;
}

interface NotificationCount {
  ALL: number;
  ORDERED: number;
  REFUNDED: number;
  STORE: number;
}

interface NotificationState {
  items: ClientNotification[];

  counts: NotificationCount;

  isLoading: boolean;
  isSubmitting: boolean;
  totalPages: number;
  currentPage: number;
}

const initialState: NotificationState = {
  items: [],

  counts: {
    ALL: 0,
    ORDERED: 0,
    REFUNDED: 0,
    STORE: 0,
  },

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

const getNotificationType = (
  title: string,
  message: string,
): NotificationType => {
  const text = `${title} ${message}`;

  if (text.includes("คืนเงิน")) {
    return "REFUNDED";
  }

  if (text.includes("สถานะคำสั่งซื้อ")) {
    return "ORDERED";
  }

  // กรณีไม่รู้จัก ให้ถือเป็น STORE หรือ ORDERED ตามที่ทีมตกลงกัน
  return "STORE";
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    markAllAsReadInStore: (state) => {
      state.items = state.items.map((item) => ({
        ...item,
        isRead: true,
        isNew: false,
      }));

      state.counts = {
        ALL: 0,
        ORDERED: 0,
        REFUNDED: 0,
        STORE: 0,
      };

      try {
        const oldReadIds = getSafeReadIds().map(String);

        const currentReadIds = state.items.map((item) => String(item.id));

        const mergedReadIds = [...new Set([...oldReadIds, ...currentReadIds])];

        localStorage.setItem(
          "read_notifications",
          JSON.stringify(mergedReadIds),
        );
      } catch (e) {
        console.error("Failed to save read status", e);
      }
    },

    clearNewNotifications: (state) => {
      state.items = state.items.map((item) => ({
        ...item,
        isNew: false,
      }));
    },
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

        state.counts.ALL++;

        if (action.payload.type !== "ALL") {
          state.counts[action.payload.type]++;
        }
      }
    },

    markAsReadInStore: (state, action: PayloadAction<number | string>) => {
      const targetId = String(action.payload);

      const notification = state.items.find(
        (item) => String(item.id) === targetId,
      );

      if (!notification || notification.isRead) return;

      notification.isRead = true;
      notification.isNew = false;

      state.counts.ALL = Math.max(0, state.counts.ALL - 1);

      if (
        notification.type === "ORDERED" ||
        notification.type === "REFUNDED" ||
        notification.type === "STORE"
      ) {
        state.counts[notification.type] = Math.max(
          0,
          state.counts[notification.type] - 1,
        );
      }

      try {
        const readIds = getSafeReadIds().map(String);

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

      .addCase(fetchNotificationCounts.fulfilled, (state, action) => {
        const readIds = getSafeReadIds().map(String);

        const countUnread = (list: Notification[]) =>
          list.filter((item) => !readIds.includes(String(item.id))).length;

        state.counts = {
          ALL: countUnread(action.payload.all),
          ORDERED: countUnread(action.payload.ordered),
          REFUNDED: countUnread(action.payload.refunded),
          STORE: countUnread(action.payload.store),
        };
      })

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
          type: getNotificationType(item.title, item.message),
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
  clearNewNotifications,
  markAsReadInStore,
  markAllAsReadInStore,
} = notificationSlice.actions;
export default notificationSlice.reducer;
