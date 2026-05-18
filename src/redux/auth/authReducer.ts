import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginService, registerService } from "../../services/auth.service";
import { TokenService } from "../../services/token.service";
import { jwtDecode } from "jwt-decode";
import { UserService } from "../../services/users.service";
import type { User } from "../../types/user";

interface AuthState {
  token: string;
  isAuthenticated: boolean;
  loading: boolean;
  user: any;
  error: string | null;
}

const getUserFromToken = (tokenStr: string) => {
  if (!tokenStr) return null;
  try {
    const decoded: any = jwtDecode(tokenStr);
    //เช็คว่า token หมดวัยรึยัง
    if (decoded.exp * 1000 < Date.now()) {
      TokenService.removeToken();
      return null;
    }

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

const currentToken = TokenService.getAccessToken() || "";
const currentUser = getUserFromToken(currentToken);

const initialState: AuthState = {
  token: currentToken,
  isAuthenticated: !!currentToken && !!currentUser, // จะเป็น true ก็ต่อเมื่อมี Token และถอดรหัสสำเร็จ
  loading: false,
  user: currentUser,
  error: null,
};

export const register = createAsyncThunk(
  "auth/register",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await registerService(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ",
      );
    }
  },
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
      return rejectWithValue(
        error.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ",
      );
    }
  },
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserService.getProfile();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "ไม่สามารถดึงข้อมูลโปรไฟล์ได้",
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data: Partial<User> | FormData, { rejectWithValue }) => {
    try {
      const response = await UserService.updateProfile(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "ไม่สามารถอัปเดตโปรไฟล์ได้",
      );
    }
  },
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
    },

    setToken: (state, action) => {
      const token = action.payload;
      state.token = token;
      state.user = getUserFromToken(token);
      state.isAuthenticated = true;
    },
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
      state.user = { ...state.user, ...getUserFromToken(newToken) };
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.user = { ...state.user, ...action.payload };
    });

    builder.addCase(updateProfile.fulfilled, (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    });
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;
