import api from "./api";
import type { NoifyRequest } from "../types/notify";

const getNotifyUser = async () => {
  const res = await api.get(`/notify`);
  return res.data;
};

const getNotifyOwner = async () => {
  const res = await api.get(`${import.meta.env.VITE_NOTIFY_API}`);
  return res.data;
};

const createNotifyOwner = async (data: NoifyRequest) => {
  const res = await api.post(`${import.meta.env.VITE_NOTIFY_API}/send`, data);
  return res.data;
};

const deleteNotify = async (notifyId: number) => {
  const res = await api.delete(
    `${import.meta.env.VITE_NOTIFY_API}/${notifyId}`,
  );
  return res.data;
};

export const NotifyService = {
  getNotifyUser,
  createNotifyOwner,
  getNotifyOwner,
  deleteNotify,
};
