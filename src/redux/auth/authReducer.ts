import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { loginService, registerService } from "../../services/auth.service"
import { TokenService } from '../../services/token.service';

interface AuthState {
  token:string
   isAuthenticated:boolean
  loading:boolean
}

const initialState:AuthState = {
  token:TokenService.getAccessToken() || "",
   isAuthenticated:!!TokenService.getAccessToken(),
  loading:false

}

export const login = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }) => {
    const response = await loginService(data);
    return response;
  }

)

export const register = createAsyncThunk (
  "auth/register",
  async (data:any) => {
    const response = await registerService(data);
    return response;
  }

)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = ""
      state. isAuthenticated = false
      TokenService.removeToken()
    }
  },


 extraReducers: (builder) => {

    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload.token
      state. isAuthenticated = true
    })

  }

})

export const { logout } = authSlice.actions
export default authSlice.reducer