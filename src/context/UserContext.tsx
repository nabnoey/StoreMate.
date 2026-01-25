import { createContext } from "react";
import type { User } from "../types/user"

/** รูปแบบข้อมูล User (ปรับให้ตรง backend ได้) */
// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: "admin" | "user";
// }

/** สิ่งที่ Context นี้จะให้ component ใช้ */
export interface UserContextType {
  userInfo: User | null;
  logIn: (user: User) => void;
  logout: () => void;
}

/** สร้าง Context (เริ่มต้นเป็น null เพราะยังไม่มี Provider) */
export const UserContext = createContext<UserContextType | null>(null);
