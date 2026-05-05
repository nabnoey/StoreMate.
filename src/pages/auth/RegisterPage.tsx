import { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../../redux/auth/authReducer";
import type { AppDispatch } from "../../redux/store";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import logo from "../../assets/logo.png";
import Auth from "../../assets/Auth.png";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) return toast.error("กรุณากรอกชื่อ-นามสกุล");
    if (!email) return toast.error("กรุณากรอกอีเมล");
    if (!phone) return toast.error("กรุณากรอกเบอร์โทรศัพท์");
    if (!password) return toast.error("กรุณากรอกรหัสผ่าน");
    if (!confirmPassword) return toast.error("กรุณายืนยันรหัสผ่าน");

    if (password.length < 8) {
      return toast.error("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
    }
    if (!/[A-Z]/.test(password)) {
      return toast.error("รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัวอักษร");
    }
    if (!/[a-z]/.test(password)) {
      return toast.error("รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัวอักษร");
    }
    if (!/\d/.test(password)) {
      return toast.error("รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัวอักษร");
    }

    if (password !== confirmPassword) {
      return toast.error("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
    }

    setLoading(true);
    const toastId = toast.loading("กำลังลงทะเบียน...");

    try {
      await dispatch(
        register({
          name: name,
          email: email.toLowerCase(),

          phone: phone,
          password: password,
          confirmPassword: confirmPassword,
        }),
      ).unwrap();

      toast.success("ลงทะเบียนสำเร็จ", { id: toastId });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error: any) {
      let message = "เกิดข้อผิดพลาดในการสมัครสมาชิก";

      let apiErrorMsg = "";
      if (axios.isAxiosError(error)) {
        apiErrorMsg = error.response?.data?.message?.toLowerCase() || "";
      } else if (error?.message) {
        apiErrorMsg = error.message.toLowerCase();
      } else if (typeof error === "string") {
        apiErrorMsg = error.toLowerCase();
      }

      if (apiErrorMsg.includes("email") || apiErrorMsg.includes("อีเมล")) {
        message = "อีเมลนี้ถูกใช้งานแล้ว";
      } else if (
        apiErrorMsg.includes("phone") ||
        apiErrorMsg.includes("เบอร์")
      ) {
        message = "เบอร์โทรศัพท์มีผู้ใช้งานแล้ว";
      }

      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white lg:bg-gray-50/50">
      <div className="flex-grow flex items-center justify-center px-4 py-8 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-20 w-full max-w-6xl">
          <div className="hidden lg:flex flex-col items-center justify-center">
            <img
              src={Auth}
              alt="Auth Illustration"
              className="w-[300px] sm:w-[400px] lg:w-[513px] h-auto lg:mt-[-150px] lg:mb-[-37.5px]"
            />
            <p className="text-black font-bold text-center text-2xl sm:text-3xl lg:text-3xl mt-4 lg:mt-[-160px] ml-4 lg:ml-5">
              สร้างบัญชี Storemate ของคุณ
            </p>
          </div>
          {/* Register Card */}
          <form
            id="register-form"
            onSubmit={handleSubmit}
            className="flex flex-col min-h-[calc(100vh-100px)] lg:min-h-fit bg-white lg:rounded-2xl lg:shadow-2xl w-full max-w-md lg:max-w-[450px] p-6 sm:p-8 relative"
          >
            <div className="absolute top-4 right-4 -mt-7.5">
              <img
                src={logo}
                alt="logo"
                className="w-35 sm:w-35 lg:w-40 h-auto"
              />
            </div>

            <h2 className="text-[30px] sm:text-2xl font-medium lg:font-bold mb-6 text-black text-left">
              สมัครสมาชิก
            </h2>

            <div className="mb-4">
              <label htmlFor="reg-input-name" className="label p-0 mb-1">
                <span className="font-medium lg:font-semibold text-[16px] text-black">
                  ชื่อ-นามสกุล
                </span>
                 
              </label>
              <input
                id="reg-input-name"
                data-test="reg-input-name"
                type="text"
                placeholder="ชื่อ-นามสกุล"
                disabled={loading}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full bg-white text-[#4B5563] border-[#4B5563] pr-10 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="reg-input-email" className="label p-0 mb-1">
                <span className="font-medium lg:font-semibold text-[16px] text-black">
                  อีเมล
                </span>
              </label>
              <input
                id="reg-input-email"
                data-test="reg-input-email"
                type="email"
                placeholder="example@gmail.com"
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full bg-white text-[#4B5563] border-[#4B5563] pr-10 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="reg-input-phone" className="label p-0 mb-1">
                <span className="font-medium lg:font-semibold text-[16px] text-black">
                  เบอร์โทร
                </span>
              </label>

              <input
                id="reg-input-phone"
                data-test="reg-input-phone"
                type="text"
                placeholder="เบอร์โทร"
                disabled={loading}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input input-bordered w-full bg-white text-[#4B5563] border-[#4B5563] pr-10 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="reg-input-password" className="label p-0 mb-1">
                <span className="font-medium lg:font-semibold text-[16px] text-black">
                  รหัสผ่าน
                </span>
              </label>

              <div className="relative">
                <input
                  id="reg-input-password"
                  data-test="reg-input-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="รหัสผ่านอย่างน้อย 8 ตัว"
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full bg-white text-[#4B5563] border-[#4B5563] pr-10 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                />

                <button
                  data-test="btn-show-password"
                  type="button"
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="reg-confirm-password" className="label p-0 mb-1">
                <span className="font-medium lg:font-semibold text-[16px] text-black">
                  ยืนยันรหัสผ่าน
                </span>
              </label>

              <div className="relative">
                <input
                  id="reg-input-confirm"
                  data-test="reg-input-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="ยืนยันรหัสผ่าน"
                  disabled={loading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input input-bordered w-full bg-white text-[#4B5563] border-[#4B5563] pr-10 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                />

                <button
                  data-test="btn-show-confirm"
                  type="button"
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black  disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-3 pb-0 pt-6">
              <button
                data-test="btn-register-submit"
                type="submit"
                disabled={loading}
                className="btn w-full h-[52px] bg-[#16A249]  text-white text-lg font-bold border-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg"
              >
                {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
