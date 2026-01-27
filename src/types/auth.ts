export interface AuthUser  {
  type: "Bearer"
  token: string
  // role?: "admin" | "user" | "Bearer" // เผื่ออนาคต
}