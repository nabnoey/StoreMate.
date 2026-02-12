
import { TokenService } from "./token.service"
import axios from "axios"


const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = TokenService.getAccessToken()


// ช่วยให้ token ถูกยิงไปมั่ว 
  if (
    token &&
    !config.url?.includes("login") &&
    !config.url?.includes("register")
  ) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
export default api

