import { useState, useContext, useEffect } from "react"
import Swal from "sweetalert2"
import axios from "axios"
import { registerService } from "../../services/auth.service"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../context/UserContext"
import logo from "../../assets/logo.png"
import Auth from "../../assets/Auth.png"

interface RegisterForm {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

function RegisterPage() {
  const navigate = useNavigate()
  const context = useContext(UserContext);

if (!context) {
  throw new Error("UserContext must be used within UserContextProvider");
}

const { isAuthenticated } = context;
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
  }, [isAuthenticated,navigate])

  const [user, setUser] = useState<RegisterForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!user.name || !user.email || !user.phone || !user.password) {
      Swal.fire("Error", "กรุณากรอกข้อมูลให้ครบ", "error")
      return
    }

    if (user.password !== user.confirmPassword) {
      Swal.fire("Error", "Password ไม่ตรงกัน", "error")
      return
    }

    try {
      const res = await registerService(user)

      Swal.fire({
        title: "Success",
        text: res?.message ?? "สมัครสมาชิกสำเร็จ",
        icon: "success",
        confirmButtonText: "ไปหน้า Login",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login")
      })
    } catch (error: unknown) {
      let message = "เกิดข้อผิดพลาด"

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? "Server error"
      }

      Swal.fire("สมัครสมาชิกไม่สำเร็จ", message, "error")
    }
  }

  return (
    <div className="min-h-screen flex bg-white justify-end mr-40 items-start pt-24 bg-base-100">
      {/* Image */}
      <div className="flex flex-col items-center justify-center ">
        <img src={Auth} alt="Auth" className="w-128.25 h-auto -mt-37.5 mb-[-37.5px] mr-60" />
        <p className="text-black text-[30px] -mt-40 -ml-52.5 font-medium text-center">
          Create your Store mate Account
        </p>
      </div>

      {/* Register Card */}
      <div className="bg-white rounded-2xl shadow-2xl w-105 p-6 relative">
        <div className="absolute top-4 right-4">
          <img src={logo} alt="logo" className="w-40 h-40 -mt-7.5" />
        </div>

        <h2 className="text-xl font-bold mb-6 text-black">REGISTRATION</h2>
<div className="mt-12 ">
        <input name="name" value={user.name} onChange={handleChange} placeholder="name"
          className="input input-bordered w-full mb-4 bg-white text-black border-gray-300" />

        <input name="email" value={user.email} onChange={handleChange} placeholder="example@gmail.com"
          className="input input-bordered w-full mb-4 bg-white text-black  border-gray-300" />

        <input name="phone" value={user.phone} onChange={handleChange} placeholder="081-234-5678"
          className="input input-bordered w-full mb-4 bg-white text-black  border-gray-300" />

        <input type="password" name="password" value={user.password} onChange={handleChange}
          placeholder="at least 8 digits"
          className="input input-bordered w-full mb-4 bg-white text-black  border-gray-300" />

        <input type="password" name="confirmPassword" value={user.confirmPassword} onChange={handleChange}
          placeholder="Confirm Password"
          className="input input-bordered w-full mb-6 bg-white text-black  border-gray-300" />

        <button id="summitRegister" onClick={handleSubmit} className="btn w-full bg-green-400 text-black border-none">
          Register
        </button>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
