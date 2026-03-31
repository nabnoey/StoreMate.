import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { changePasswordService } from "../../services/auth.service";
import { TokenService } from "../../services/token.service";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";

function ChangePassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("กรุณากรอกรหัสผ่านเดิม"),
    newPassword: Yup.string()
      .min(8, "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร")
      .max(128, "รหัสผ่านต้องไม่เกิน 128 ตัวอักษร")
      .matches(/[A-Z]/, "ต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว")
      .matches(/[a-z]/, "ต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว")
      .matches(/\d/, "ต้องมีตัวเลขอย่างน้อย 1 ตัว")
      .matches(
        /^[a-zA-Z0-9\u0400-\u04FF~!@#$%^&*_\-+=()[\]{}></\\|"'.,:;]+$/,
        "ตัวอักษรละติน/ซีริลลิก ตัวเลข หรือสัญลักษณ์เท่านั้น และห้ามเว้นวรรค",
      )
      .required("กรุณากรอกรหัสผ่านใหม่"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน")
      .required("กรุณายืนยันรหัสผ่านใหม่"),
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);

      try {
        await changePasswordService(
          values.oldPassword,
          values.newPassword,
          values.confirmPassword,
        );

        toast.success("เปลี่ยนรหัสผ่านสำเร็จ");

        formik.resetForm();

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
            toast.error("รหัสผ่านเก่าไม่ถูกต้อง");
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
    },
  });

  return (
    <div className="min-h-screen flex justify-center items-center bg-white p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[571px] p-6 sm:p-8">
        <h2 className="text-2xl sm:text-[36px] font-semibold mb-6 text-black text-center">
          เปลี่ยนรหัสผ่าน
        </h2>

        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-4 text-black"
        >
          {/* 1. รหัสผ่านเดิม */}
          <div className="flex flex-col gap-1">
            <label htmlFor="old-password" className="text-sm">
              รหัสผ่านเดิม
            </label>
            <div className="relative">
              <input
                id="old-password"
                type={showOldPassword ? "text" : "password"}
                data-test="old-password"
                placeholder="อย่างน้อย 8 ตัว"
                className={`input input-bordered w-full border bg-white text-[#4B5563] focus:border-[#6B7280] pr-10 ${
                  formik.touched.oldPassword && formik.errors.oldPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                {...formik.getFieldProps("oldPassword")}
              />
              <button
                data-test="toggle-old-password"
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            {formik.touched.oldPassword && formik.errors.oldPassword && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.oldPassword}
              </div>
            )}
          </div>

          {/* รหัสผ่านใหม่ */}
          <div className="flex flex-col gap-1">
            <label htmlFor="new-password" className="text-sm">
              รหัสผ่านใหม่
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                data-test="new-password"
                placeholder="อย่างน้อย 8 ตัว"
                className={`input input-bordered w-full border bg-white text-[#4B5563] focus:border-[#6B7280] pr-10 ${
                  formik.touched.newPassword && formik.errors.newPassword
                    ? "border-red-500  focus:border-red-500"
                    : "border-gray-300"
                }`}
                {...formik.getFieldProps("newPassword")}
              />
              <button
                data-test="toggle-new-password"
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            {formik.touched.newPassword && formik.errors.newPassword && (
              <div className="text-red-500 text-xs mt-1 whitespace-pre-line">
                {formik.errors.newPassword}
              </div>
            )}
          </div>

          {/* ยืนยันรหัสผ่านใหม่ */}
          <div className="flex flex-col gap-1">
            <label htmlFor="confirm-password" className="text-sm">
              ยืนยันรหัสผ่านใหม่
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                data-test="confirm-password"
                placeholder="อย่างน้อย 8 ตัว"
                className={`input input-bordered w-full border bg-white text-[#4B5563] focus:border-[#6B7280] pr-10 ${
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                {...formik.getFieldProps("confirmPassword")}
              />
              <button
                data-test="show-confirm-password"
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.confirmPassword}
                </div>
              )}
          </div>

          <button
            data-test="submit-btn"
            type="submit"
            disabled={loading}
            className="btn bg-[#16A249] border-0 text-white mt-4 hover:bg-[#12863c] transition-colors disabled:opacity-50"
          >
            {loading ? "กำลังเปลี่ยนรหัสผ่าน..." : "เปลี่ยนรหัสผ่าน"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
