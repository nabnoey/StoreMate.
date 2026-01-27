
import { TokenService } from "./token.service"
import axios from "axios"


const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = TokenService.getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})


export default api

