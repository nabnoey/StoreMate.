export interface Notification {
  id: number;
  title: string;
  message: string;
  sendTo: string;
  createdAt: string;
}

export interface NotificationResponse {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  type: string; // จำลอง: 'orders' | 'refunds' | 'shop'
  isRead: boolean; // จำลองผ่าน localStorage
}

export interface NotificationRequest {
  title: string;
  message: string;
  sendTo: string;
}
