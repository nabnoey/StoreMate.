import { createContext } from "react";



/** สิ่งที่ Context นี้จะให้ component ใช้ */
export interface UserContextType {
  // userInfo: User 
  isAuthenticated: boolean;
  logIn: (token: string) => void;
  logout: () => void;
}

/** สร้าง Context (เริ่มต้นเป็น null เพราะยังไม่มี Provider) */
export const UserContext = createContext<UserContextType | null>(null);
