export interface Notification {
  id: number;
  title: string;
  message: string;
  sendTo: string;
  createdAt: string;
}

export interface NotificationRequest {
  title: string;
  message: string;
  sendTo: string;
}

export interface FetchNotifyParams {
  keyword: string;
  page: number;
  size: number;
}
