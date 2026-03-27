import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { login } from "../../redux/auth/authReducer";
import { toast } from "react-hot-toast";

import logo from "../../assets/logo.png";
import auth from "../../assets/Auth.png";

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("รูปแบบอีเมลไม่ถูกต้อง")
      .required("กรุณากรอกอีเมล"),
    password: Yup.string()
      .required("กรุณากรอกรหัสผ่าน")
      .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
      .max(128, "รหัสผ่านต้องไม่เกิน 128 ตัวอักษร")
      .matches(/[A-Z]/, "ต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว")
      .matches(/[a-z]/, "ต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว")
      .matches(/d/, "ต้องมีตัวเลขอย่างน้อย 1 ตัว")
      .matches(
        /^[a-zA-Z0-9\u0400-\u04FF~!@#$%^&*_\-+=()[\]{}></\\|"'.,:;]+$/,
        "ห้ามเว้นวรรค และต้องเป็นตัวอักษรหรือสัญลักษณ์ที่กำหนดเท่านั้น",
      ),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const toastId = toast.loading("กำลังเข้าสู่ระบบ...");

      try {
        const authData = await dispatch(
          login({
            email: values.email.toLowerCase(),
            password: values.password,
          }),
        ).unwrap();

        if (rememberMe) {
          localStorage.setItem("auth", JSON.stringify(authData));
        } else {
          sessionStorage.setItem("auth", JSON.stringify(authData));
        }

        toast.success("เข้าสู่ระบบสำเร็จ", { id: toastId });

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (error: any) {
        let errorMessage = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
        if (error?.message) {
          errorMessage = error.message;
        } else if (typeof error === "string") {
          errorMessage = error;
        }

        toast.error(errorMessage, { id: toastId });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4 py-8">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-20 w-full max-w-6xl">
        <div className="hidden lg:flex flex-col items-center justify-center">
          <img
            src={auth}
            alt="Auth Illustration"
            className="w-[300px] sm:w-[400px] lg:w-[513px] h-auto lg:mt-[-150px] lg:mb-[-37.5px]"
          />
          <p className="text-black font-bold text-center text-2xl sm:text-3xl lg:text-3xl mt-4 lg:mt-[-160px] ml-4 lg:ml-5">
            เข้าสู่ระบบเพื่อใช้เว็บไซต์
          </p>
        </div>

        {/* ฟอร์มเข้าสู่ระบบ */}
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md lg:max-w-[450px] p-6 sm:p-8 relative"
        >
          <div className="absolute top-4 right-4 -mt-7.5">
            <img
              src={logo}
              alt="logo"
              className="w-35 sm:w-35 lg:w-40 h-auto"
            />
          </div>

          <h2 className="text-2xl sm:text-[32px] font-extrabold mb-6 text-black text-left">
            เข้าสู่ระบบ
          </h2>

          <div className="mb-4">
            <label htmlFor="email" className="label p-0 mb-1">
              <span className="font-semibold text-black">อีเมล</span>
            </label>
            <input
              data-test="email"
              disabled={loading}
              type="email"
              placeholder="example@gmail.com"
              className={`input input-bordered w-full bg-white text-[#4B5563] focus:border-[#6B7280] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed${
                formik.touched.email && formik.errors.email
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }`}
              {...formik.getFieldProps("email")}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="label p-0 mb-1">
              <span className="font-semibold text-black">รหัสผ่าน</span>
            </label>
            <div className="relative">
              <input
                data-test="password"
                disabled={loading}
                type={showPassword ? "text" : "password"}
                placeholder="รหัสผ่าน"
                className={`input input-bordered w-full bg-white text-[#4B5563] focus:border-[#6B7280] pr-10 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }`}
                {...formik.getFieldProps("password")}
              />
              <button
                data-test="show-password"
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-xs mt-1 whitespace-pre-line">
                {formik.errors.password}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <input
              data-test="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-5 h-5 appearance-none rounded-full border border-gray-300 cursor-pointer checked:bg-blue-500 checked:border-blue-500"
            />
            <label
              data-test="remember-me-label"
              htmlFor="remember-me"
              className="text-gray-800 cursor-pointer select-none"
            >
              จดจำฉัน
            </label>
          </div>

          <button
            data-test="btn-submit"
            type="submit"
            disabled={loading}
            className="cursor-pointer btn w-full h-[52px] rounded-lg bg-[#16A249] hover:bg-[#12863c] text-white text-lg font-bold border-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>

          <div className="flex flex-row justify-between items-center text-[13px] sm:text-sm mt-6 w-full text-gray-600">
            {/* ฝั่งซ้าย */}
            <button
              className="hover:underline cursor-pointer"
              onClick={() => navigate("/forgot-password")}
            >
              ลืมรหัสผ่าน
            </button>

            {/* ฝั่งขวา */}
            <div className="flex items-center gap-1">
              <span>ถ้ายังไม่มีบัญชี ?</span>
              <button
                className="text-blue-500 hover:underline cursor-pointer font-medium"
                onClick={() => navigate("/register")}
              >
                สมัครสมาชิก
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
