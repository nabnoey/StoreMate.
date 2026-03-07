import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { LoginDTO, User } from "../../types/user";
import { AuthService } from '../../services/auth.service';

interface AuthState {
  isLoading: boolean;
  error: string | null;
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isLoading: false,
  error: null,
  token: null,
  user: null,
  isAuthenticated: false
};

export const Login = createAsyncThunk(
  'auth/login',
  async (data: LoginDTO, { rejectWithValue }) => {
    try {
      const response = await AuthService.loginService(data); 
      return response; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null; 
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem("auth");
      sessionStorage.removeItem("auth");
    },

    setAuth: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },

    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        
        try {
            const authData = JSON.parse(localStorage.getItem("auth") || "{}");
            authData.user = state.user;
            localStorage.setItem("auth", JSON.stringify(authData));
        } catch(e) {
            console.error("Failed to update localStorage", e);
        }
      } 
    },
  }, 

  extraReducers: (builder) => {
    builder
      .addCase(Login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(Login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setAuth, updateProfile } = AuthSlice.actions;
export default AuthSlice.reducer;