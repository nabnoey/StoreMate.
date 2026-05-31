//เพิ่มแจ้งเตือน
export interface NoificationRequest {
  title: string;
  message: string;
  sendTo: string;
}

//ดูการแจ้งเตือน
export interface Noification {
  id: number;
  title: string;
  message: string;
  sendTo: string;
  createdAt: string;
}

export type UserNotifyResponse = Omit<Noification, "sendTo">;
