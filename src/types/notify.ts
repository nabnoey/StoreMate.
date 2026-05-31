//เพิ่มแจ้งเตือน
export interface NoifyRequest {
  title: string;
  message: string;
  sendTo: string;
}

//ดูการแจ้งเตือน
export interface NoifyResponse {
  id: number;
  title: string;
  message: string;
  sendTo: string;
  createdAt: string;
}

export type UserNotifyResponse = Omit<NoifyResponse, "sendTo">;
