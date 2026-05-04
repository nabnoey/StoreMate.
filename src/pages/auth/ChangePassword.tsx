import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { changePasswordService } from "../../services/auth.service";
import { TokenService } from "../../services/token.service";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";

function ChangePassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { oldPassword: "", newPassword: "", confirmPassword: "" };

    if (!oldPassword) {
      newErrors.oldPassword = "กรุณากรอกรหัสผ่านปัจจุบัน";
      isValid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = "กรุณากรอกรหัสผ่านใหม่";
      isValid = false;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร"; // 5.2.1
      isValid = false;
    } else if (!/[A-Z]/.test(newPassword)) {
      newErrors.newPassword = "รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัวอักษร"; // 5.2.2
      isValid = false;
    } else if (!/[a-z]/.test(newPassword)) {
      newErrors.newPassword = "รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัวอักษร"; // 5.2.3
      isValid = false;
    } else if (!/\d/.test(newPassword)) {
      newErrors.newPassword = "รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัวอักษร"; // 5.2.4
      isValid = false;
    } else if (newPassword === oldPassword) {
      newErrors.newPassword = "รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม"; // 5.3
      isValid = false;
    } else if (
      !/^[a-zA-Z0-9\u0400-\u04FF~!@#$%^&*_\-+=()[\]{}></\\|"'.,:;]+$/.test(
        newPassword,
      )
    ) {
      newErrors.newPassword =
        "ตัวอักษรละติน/ซีริลลิก ตัวเลข หรือสัญลักษณ์เท่านั้น และห้ามเว้นวรรค";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "กรุณายืนยันรหัสผ่านใหม่";
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน"; // 5.4
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await changePasswordService(oldPassword, newPassword, confirmPassword);

      toast.success("เปลี่ยนรหัสผ่านสำเร็จ");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({ oldPassword: "", newPassword: "", confirmPassword: "" });

      setTimeout(() => {
        dispatch({ type: "LOGOUT" });
        TokenService.removeToken();
        navigate("/login");
      }, 1500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const apiMessage = error.response?.data?.message?.toLowerCase() || "";
        const status = error.response?.status;

        if (
          status === 401 ||
          status === 400 ||
          apiMessage.includes("incorrect") ||
          apiMessage.includes("invalid") ||
          apiMessage.includes("old password") ||
          apiMessage.includes("match")
        ) {
          toast.error("รหัสผ่านปัจจุบันไม่ถูกต้อง");
        } else {
          toast.error(
            error.response?.data?.message || "เปลี่ยนรหัสผ่านไม่สำเร็จ",
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
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="flex flex-col min-h-[calc(100vh-100px)] bg-white lg:rounded-2xl lg:shadow-2xl w-full max-w-md lg:max-w-[450px] p-6 sm:p-8 relative">
          <h2 className="text-2xl sm:text-[36px] font-semibold mb-6 text-black text-center">
            เปลี่ยนรหัสผ่าน
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 text-black"
          >
            {/* 1. รหัสผ่านเดิม */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="old-password"
                className="font-medium lg:font-semibold text-[16px] text-black"
              >
                รหัสผ่านเดิม
              </label>
              <div className="relative">
                <input
                  id="old-password"
                  type={showOldPassword ? "text" : "password"}
                  data-test="old-password"
                  placeholder="อย่างน้อย 8 ตัว"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className={`input input-bordered w-full bg-white text-[#4B5563] pr-10 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed ${
                    errors.oldPassword ? "border-red-500" : "border-[#4B5563]"
                  }`}
                />
                <button
                  data-test="toggle-old-password"
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black focus:outline-none"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            {/* รหัสผ่านใหม่ */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="new-password"
                className="font-medium lg:font-semibold text-[16px] text-black"
              >
                รหัสผ่านใหม่
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  data-test="new-password"
                  placeholder="อย่างน้อย 8 ตัว"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`input input-bordered w-full bg-white text-[#4B5563] pr-10 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed ${
                    errors.oldPassword ? "border-red-500" : "border-[#4B5563]"
                  }`}
                />
                <button
                  data-test="toggle-new-password"
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black focus:outline-none"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            {/* ยืนยันรหัสผ่านใหม่ */}
            <div className="flex flex-col gap-1">
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
                  className={`input input-bordered w-full bg-white text-[#4B5563] pr-10 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed ${
                    errors.oldPassword ? "border-red-500" : "border-[#4B5563]"
                  }`}
                />
                <button
                  data-test="show-confirm-password"
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

            <div className="mt-auto flex flex-col gap-4 pb-0 pt-70">
              <button
                data-test="submit-btn"
                type="submit"
                disabled={loading}
                className="btn bg-[#16A249] border-0 text-white mt-4 transition-colors disabled:opacity-50"
              >
                {loading ? "กำลังเปลี่ยนรหัสผ่าน..." : "เปลี่ยนรหัสผ่าน"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
