import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  NotificationService,
  type FetchNotifyParams,
} from "../../services/notification.service"; // ปรับ path ให้ตรงกับไฟล์ Service ของคุณ
import type {
  Notification,
  NotificationRequest,
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

interface NotificationState {
  items: Notification[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
}

const initialState: NotificationState = {
  items: [],
  isLoading: false,
  totalPages: 0,
  currentPage: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotificationFromSocket: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // จัดการตอนดึงข้อมูล Admin / User
      .addCase(fetchOwnerNotify.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOwnerNotify.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.content || [];
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.number || 0;
      })
      .addCase(fetchUserNotify.fulfilled, (state, action) => {
        state.items = action.payload;
      })

      //สร้างการแจ้งเตือน
      .addCase(createNotify.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })

      // ลบการแจ้งเตือน
      .addCase(deleteNotify.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { addNotificationFromSocket } = notificationSlice.actions;
export default notificationSlice.reducer;
