export interface User {
  id: number
  name: string
  email: string
  phone: string
  password: string
  accessToken: string
}

// ข้อมูลสำหรับ backend ตอน register
export interface RegisterDTO {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}


export type LoginDTO = Pick<User, "email" | "password">

