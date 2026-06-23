import api from "./api";
import type {
  NotificationRequest,
  Notification,
  FetchNotifyParams,
} from "../types/notification";

const getNotifyUser = async (): Promise<Notification[]> => {
  const res = await api.get<Notification[]>("/notify");
  return res.data;
};

const getNotifyOwner = async (params: FetchNotifyParams) => {
  const res = await api.get(`${import.meta.env.VITE_OWNER_API}/notify`, {
    params,
  });

  return res.data;
};

const createNotifyOwner = async (
  data: NotificationRequest,
): Promise<Notification> => {
  const res = await api.post<Notification>(
    `${import.meta.env.VITE_OWNER_API}/notify/send`,
    data,
  );
  return res.data;
};

const deleteNotify = async (notifyId: number): Promise<number> => {
  await api.delete(`${import.meta.env.VITE_OWNER_API}/notify/${notifyId}`);
  return notifyId; // ส่ง ID กลับไปเพื่อให้ Redux ไปกรองออก
};

export const NotificationService = {
  getNotifyUser,
  createNotifyOwner,
  getNotifyOwner,
  deleteNotify,
};
