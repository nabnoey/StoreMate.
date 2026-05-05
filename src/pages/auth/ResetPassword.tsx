import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetPasswordService } from "../../services/auth.service";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { password: "", confirmPassword: "" };

    if (!password) {
      newErrors.password = "กรุณากรอกรหัสผ่านใหม่";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร"; // 5.1.1
      isValid = false;
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัวอักษร"; // 5.1.2
      isValid = false;
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัวอักษร"; // 5.1.3
      isValid = false;
    } else if (!/\d/.test(password)) {
      newErrors.password = "รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัวอักษร"; // 5.1.4
      isValid = false;
    } else if (
      !/^[a-zA-Z0-9\u0400-\u04FF~!@#$%^&*_\-+=()[\]{}></\\|"'.,:;]+$/.test(
        password,
      )
    ) {
      newErrors.password =
        "ห้ามเว้นวรรค และต้องเป็นตัวอักษรหรือสัญลักษณ์ที่กำหนดเท่านั้น";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "กรุณายืนยันรหัสผ่านใหม่";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน"; // 5.2
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("ไม่พบข้อมูล Token ยืนยันตัวตน");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      await resetPasswordService(token, password, confirmPassword);

      toast.success("เปลี่ยนรหัสผ่านสำเร็จ");

      setPassword("");
      setConfirmPassword("");
      setErrors({ password: "", confirmPassword: "" });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const apiMessage = error.response?.data?.message?.toLowerCase() || "";
        const status = error.response?.status;

        if (
          status === 401 ||
          status === 400 ||
          apiMessage.includes("expire") ||
          apiMessage.includes("invalid")
        ) {
          toast.error("ลิงก์หมดอายุ กรุณารีเซ็ตรหัสผ่านใหม่อีกครั้ง");
        } else {
          toast.error(
            error.response?.data?.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้",
          );
        }
      } else {
        toast.error("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white lg:bg-gray-50/50">
      <div className="flex-grow flex items-center justify-center px-4 py-8 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-20 w-full max-w-6xl">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col min-h-[calc(100vh-100px)] lg:min-h-fit bg-white lg:rounded-2xl lg:shadow-2xl w-full max-w-md lg:max-w-[450px] p-6 sm:p-8 relative"
          >
            <h2 className="text-[30px] sm:text-[32px] font-medium font-jakarta mb-6 text-[#111827] text-center">
              กู้คืนรหัสผ่าน
            </h2>
            {/* 1. รหัสผ่านเดิม */}
            <div className="mb-4">
              <label
                htmlFor="new-password"
                className="font-medium lg:font-semibold text-[16px] text-black"
              >
                รหัสผ่านเดิม
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  data-test="new-password"
                  placeholder="อย่างน้อย 8 ตัว"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`input input-bordered w-full border bg-white text-[#4B5563] border-[#6B7280] pr-10 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#4B5563]"
                  }`}
                />
                <button
                  data-test="toggle-old-password"
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirm-password"
                className="font-medium lg:font-semibold text-[16px] text-black"
              >
                ยืนยันรหัสผ่านใหม่
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  data-test="confirm-password"
                  placeholder="อย่างน้อย 8 ตัว"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`input input-bordered w-full border bg-white text-[#4B5563] border-[#6B7280] pr-10 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#4B5563]"
                  }`}
                />
                <button
                  data-test="toggle-confirm-password"
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <Eye size={20} />
                  ) : (
                    <EyeOff size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-auto lg:mt-10 flex flex-col gap-3 pb-0 pt-6 lg:pt-0">
              <button
                data-test="submit-btn"
                type="submit"
                disabled={loading}
                className="mx-auto btn bg-[#16A249] border-0 text-white mt-4 transition-colors disabled:opacity-50 w-full max-w-[368px] h-[52px] rounded-[8px] p-[10px] flex items-center justify-center gap-[10px]"
              >
                {loading ? "กำลังดำเนินการ..." : "ยืนยัน"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
