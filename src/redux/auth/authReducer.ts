import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginService, registerService } from "../../services/auth.service";
import { TokenService } from '../../services/token.service';
import { jwtDecode } from "jwt-decode";


interface AuthState {
  token: string;
  isAuthenticated: boolean;
  loading: boolean;
  user: any | null; 
  error: string | null;
}

const getUserFromToken = (tokenStr: string) => {
  if (!tokenStr) return null;
  try {
    const decoded: any = jwtDecode(tokenStr);
    //ดึงมาจาก backend ดูที่ jwt.io
    return {
      userId: decoded.userId,
      email: decoded.sub,
      roles: decoded.roles,
    };
  } catch (error) {
    console.error("ถอดรหัส Token ไม่สำเร็จ", error);
    return null;
  }
};

const currentToken = TokenService.getToken() || "";
const currentUser = getUserFromToken(currentToken);

const initialState: AuthState = {
  token: currentToken,
  isAuthenticated: !!currentToken && !!currentUser, // จะเป็น true ก็ต่อเมื่อมี Token และถอดรหัสสำเร็จ
  loading: false,
  user: currentUser,
  error: null
};

export const register = createAsyncThunk(
  "auth/register",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await registerService(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ");
    }
  }
);


export const login = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginService(data); 
      
      const token = response.token; 
      TokenService.setToken(token);

      return token; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ");
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: any, { rejectWithValue }) => {
    try {
      // 💡 ข้อแนะนำ: ตรงนี้ในอนาคตคุณควรเรียก API อัปเดตโปรไฟล์ เช่น
      // const response = await updateProfileService(data);
      
      // เมื่อ Backend อัปเดตสำเร็จ เราก็ส่ง data กลับไปทับใน Redux State
      return data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "อัปเดตโปรไฟล์ไม่สำเร็จ");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = "";
      state.isAuthenticated = false;
      state.user = null; 
      state.error = null;
      TokenService.removeToken(); 
    }
  },
  extraReducers: (builder) => {

    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      const newToken = action.payload;
      state.token = newToken;
      state.user = getUserFromToken(newToken); //ถอดToken เพื่อดึง userId, email
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(updateProfile.fulfilled, (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;