import { LOGIN, LOGOUT, UPDATE_PROFILE } from "./actionTypes";
// ✅ Import Action types ต้องมี type
import type { LoginAction, LogoutAction, UpdateProfileAction } from "./authAction";
// ✅ Import State types (AuthState) ต้องมี type แต่ค่า (authInitialState) ไม่ต้องมี
import { authInitialState, type AuthState } from "./authInitalState"; 
import type { UnknownAction } from "redux";
// รวม Type Action ในไฟล์นี้ (หรือ import AuthAction มาใช้ก็ได้)
type AuthAction = LoginAction | LogoutAction | UpdateProfileAction;

const authReducer = (
  state = authInitialState,
  action: AuthAction | UnknownAction
): AuthState => { // ระบุ Return Type ให้ชัดเจน
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        token: (action as LoginAction).payload.token,
        isAuthenticated: true,
      };

    case LOGOUT:
      return {
        ...state,
        token: "",
        isAuthenticated: false,
      };

    case UPDATE_PROFILE:{
      // แปลง action เป็น UpdateProfileAction เพื่อดึง payload
      const updatePayload = (action as UpdateProfileAction).payload;
      
      return {
        ...state,
        user: {
          ...state.user,     // 1. กางข้อมูล User เก่าออกมาก่อน
          ...updatePayload,  // 2. เอาข้อมูลใหม่ทับลงไป
        },
      };
    }
      

    default:
      return state;
  }

};

export default authReducer;