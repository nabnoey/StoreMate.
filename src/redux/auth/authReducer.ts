import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginService, registerService } from "../../services/auth.service";
import { TokenService } from '../../services/token.service';

interface AuthState {
  token: string;
  isAuthenticated: boolean;
  loading: boolean;
  user: any | null; 
}

const sessionData = JSON.parse(localStorage.getItem('auth_session') || '{}');

const initialState: AuthState = {
  token: TokenService.getAccessToken() || "",
  isAuthenticated: !!TokenService.getAccessToken(),
  loading: false,
  //ดึงข้อมูล user มาใส่ค่าเริ่มต้น
  user: sessionData.user || null 
};

export const register = createAsyncThunk(
  "auth/register",
  async (data: any) => {
    const response = await registerService(data);
    
    // เก็ยข้อมูลไว้ที่ local ชื่อว่า mock_users
    const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    
   //เช็คเรื่อง email ห้ามซ้ำ
    const isExist = mockUsers.find((u: any) => u.email === data.email);
    if (!isExist) {
      mockUsers.push({ ...data, image: '' }); 
      localStorage.setItem('mock_users', JSON.stringify(mockUsers));
    }

    return response;
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }) => {
    const response = await loginService(data); 
     
    const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    let matchedUser = mockUsers.find((user: any) => user.email === data.email);

    if (!matchedUser) {
      matchedUser = { name: "User", email: data.email, phone: "", image: "" };
    }

    const payload = {
      token: response.token, 
      user: matchedUser
    };

    localStorage.setItem('auth_session', JSON.stringify(payload));
    TokenService.setToken(payload.token);

    return payload; 
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: any, { getState }) => {
    const state: any = getState();
    const currentUserEmail = state.auth.user?.email;

    const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const userIndex = mockUsers.findIndex((user: any) => user.email === currentUserEmail);
    
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
      localStorage.setItem('mock_users', JSON.stringify(mockUsers));
    }

    const currentSession = JSON.parse(localStorage.getItem('auth_session') || '{}');
    if (currentSession.user) {
      currentSession.user = { ...currentSession.user, ...data };
      localStorage.setItem('auth_session', JSON.stringify(currentSession));
    }

    return data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //ถ้า logout ข้อมูลที่เก็บไว้ใน local จะหายไปด้วย
    logout: (state) => {
      state.token = "";
      state.isAuthenticated = false;
      state.user = null; 
      TokenService.removeToken();
      localStorage.removeItem('auth_session');
    }
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user; 
      state.isAuthenticated = true;
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