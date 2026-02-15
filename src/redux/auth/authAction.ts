import { LOGIN, LOGOUT, UPDATE_PROFILE } from "./actionTypes";
import type { Profile } from "./authInitalState"; // แก้ path ให้ตรงกับชื่อไฟล์จริง

// --- Type Definitions ---

export type LoginAction = {
  type: typeof LOGIN;
  payload: {
    token: string;
    isAuthenticated: true;
  };
};

export type LogoutAction = {
  type: typeof LOGOUT;
};

export type UpdateProfileAction = {
  type: typeof UPDATE_PROFILE;
  // ใช้ Partial เพื่อให้ส่งมาแค่บางค่าได้
  payload: Partial<Profile>; 
};

// รวม Type ทั้งหมด
export type AuthAction = LoginAction | LogoutAction | UpdateProfileAction;