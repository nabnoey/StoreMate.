import api from "./api";
import type { NotificationRequest } from "../types/notification";

const getNotifyUser = async () => {
  const res = await api.get(`/notify`);
  return res.data;
};

export interface FetchNotifyParams {
  keyword?: string;
  page?: number;
  size?: number;
}
const getNotifyOwner = async (params?: FetchNotifyParams) => {
  const res = await api.get(`${import.meta.env.VITE_NOTIFY_API}`, { params });
  return res.data;
};
const createNotifyOwner = async (data: NotificationRequest) => {
  const res = await api.post(`${import.meta.env.VITE_NOTIFY_API}/send`, data);
  return res.data;
};

const deleteNotify = async (notifyId: number) => {
  const res = await api.delete(
    `${import.meta.env.VITE_NOTIFY_API}/${notifyId}`,
  );
  return res.data;
};

export const NotificationService = {
  getNotifyUser,
  createNotifyOwner,
  getNotifyOwner,
  deleteNotify,
};
