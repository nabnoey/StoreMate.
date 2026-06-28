export interface Notification {
  id: number;
  title: string;
  message: string;
  sendTo: "MODERATOR" | "CUSTOMER" | "ALL";
  createdAt: string;

  type: NotificationType;
}

export interface NotificationRequest {
  title: string;
  message: string;
  sendTo: "MODERATOR" | "CUSTOMER" | "ALL";
}

export interface FetchNotifyParams {
  keyword: string;
  page: number;
  size: number;
}

export interface PageableNotificationResponse {
  content: Notification[];
  totalPages: number;
  number: number; // currentPage
  totalElements: number;
}

export type NotificationType = "ALL" | "STORE" | "ORDERED" | "REFUNDED";
