import api from "./api";
import type {
  NotificationRequest,
  FetchNotifyParams,
  Notification,
  PageableNotificationResponse,
} from "../types/notification";

const getNotifyUser = async (): Promise<Notification[]> => {
  const res = await api.get<Notification[]>("/notify");
  return res.data;
};

const getNotifyOwner = async (
  params?: FetchNotifyParams,
): Promise<PageableNotificationResponse> => {
  const res = await api.get<PageableNotificationResponse>(
    `${import.meta.env.VITE_NOTIFY_API}`,
    { params },
  );
  return res.data;
};

const createNotifyOwner = async (
  data: NotificationRequest,
): Promise<Notification> => {
  const res = await api.post<Notification>(
    `${import.meta.env.VITE_NOTIFY_API}/send`,
    data,
  );
  return res.data;
};

const deleteNotify = async (notifyId: number): Promise<number> => {
  await api.delete(`${import.meta.env.VITE_NOTIFY_API}/${notifyId}`);
  return notifyId; // ส่ง ID กลับไปเพื่อให้ Redux ไปกรองออก
};

export const NotificationService = {
  getNotifyUser,
  createNotifyOwner,
  getNotifyOwner,
  deleteNotify,
};
