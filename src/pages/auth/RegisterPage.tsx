import { useState  } from "react"
import Swal from "sweetalert2"
import axios from "axios"
import { registerService } from "../../services/auth.service"
import { useNavigate } from "react-router-dom"
// import Loading from "../../components/Loading"
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

  // const [loading,setLoading] = useState(false)


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
    //  setLoading(true)   // เพิ่มlottie react ตรงนี้

    try {
      const res = await registerService(user)

      Swal.fire({
        title: "Success",
        text: res?.message ?? "ลงทะเบียนสำเร็จ",
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

  //  if(loading){
  //   return <Loading/>
  // }

 return (
    <div
      id="register-page-container"
      className="min-h-screen flex flex-col lg:flex-row bg-white justify-center lg:justify-end items-center lg:items-start gap-8 lg:gap-20 px-4 lg:mr-40 pt-8 lg:pt-24"
    >
      <div className="flex flex-col items-center justify-center mb-10 lg:mb-0 lg:mr-20">
        <img
          id="register-illustration"
          src={Auth}
          alt="Auth"
          className="w-75 sm:w-100 lg:w-128.25 h-auto lg:-mt-37.5 lg:mb-[-37.5px]"
        />
        <p className="text-black font-bold text-center text-2xl sm:text-3xl lg:text-4xl mt-4 lg:-mt-45 ml-4 lg:ml-10">
          Create your Store mate Account
        </p>
      </div>

      {/* Register Card */}
      <form
        id="register-form"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-105 p-6 relative"
      >
        {/* Logo */}
        <div className="absolute top-4 right-4 -mt-12">
          <img
            id="register-logo"
            src={logo}
            alt="logo"
            className="w-20 sm:w-24 lg:w-40 h-auto"
          />
        </div>

        <h2 className="text-xl font-bold mb-6 text-black">
          REGISTRATION
        </h2>

        {/* Name Input */}
        <input
          id="reg-name"
          name="name"
          value={user.name}
          onChange={handleChange}
          placeholder="name"
          className="input input-bordered w-full mb-4 bg-white text-black border-gray-300"
          data-testid="reg-input-name"
        />

        {/* Email Input */}
        <input
          id="reg-email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="example@gmail.com"
          className="input input-bordered w-full mb-4 bg-white text-black border-gray-300"
          data-testid="reg-input-email"
        />

        {/* Phone Input */}
        <input
          id="reg-phone"
          name="phone"
          value={user.phone}
          onChange={handleChange}
          placeholder="081-234-5678"
          className="input input-bordered w-full mb-4 bg-white text-black border-gray-300"
          data-testid="reg-input-phone"
        />

        {/* Password Input */}
        <input
          id="reg-password"
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          placeholder="at least 8 digits"
          className="input input-bordered w-full mb-4 bg-white text-black border-gray-300"
          data-testid="reg-input-password"
        />

        {/* Confirm Password Input */}
        <input
          id="reg-confirm-password"
          type="password"
          name="confirmPassword"
          value={user.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="input input-bordered w-full mb-6 bg-white text-black border-gray-300"
          data-testid="reg-input-confirm"
        />

        {/* Submit Button */}
        <button
          id="btn-register-submit"
          type="submit"
          className="btn w-full bg-green-400 text-black border-none font-bold"
          data-testid="reg-btn-submit"
        >
          Register
        </button>
      </form>
    </div>
  )
}

export default RegisterPage