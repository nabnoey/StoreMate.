import { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../../redux/auth/authReducer"; // เช็ค path ให้ตรงกับ authReducer ของคุณ
import type { AppDispatch } from "../../redux/store";     // เช็ค path ให้ตรงกับ store ของคุณ
import Swal from "sweetalert2";
import axios from "axios";
// import { registerService } from "../../services/auth.service"; // ไม่ได้ใช้แล้วเพราะย้ายไปเรียกผ่าน Redux
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";

import logo from "../../assets/logo.png";
import Auth from "../../assets/Auth.png";

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  // State สำหรับเปิด-ปิดรหัสผ่าน
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- 1. Validation Schema ---
  const validationSchema = Yup.object({
    name: Yup.string().required("กรุณากรอกชื่อ-นามสกุล"),
    email: Yup.string()
      .email("รูปแบบอีเมลไม่ถูกต้อง")
      .required("กรุณากรอกอีเมล"),
    phone: Yup.string()
      .matches(/^0[0-9]{9}$/, "เบอร์โทรต้องขึ้นต้นด้วย 0 และมี 10 หลัก")
      .required("กรุณากรอกเบอร์โทรศัพท์"),
    password: Yup.string()
      .min(8, "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร")
      .max(128, "รหัสผ่านต้องไม่เกิน 128 ตัวอักษร")
      .matches(/[A-Z]/, "ต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว")
      .matches(/[a-z]/, "ต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว")
      .matches(/[0-9]/, "ต้องมีตัวเลขอย่างน้อย 1 ตัว")
      .matches(
        /^[a-zA-Z0-9\u0400-\u04FF~!@#$%^&*_\-+=()[\]{}></\\|"'.,:;]+$/,
        "ตัวอักษรละติน/ซีริลลิก ตัวเลข หรือสัญลักษณ์เท่านั้น และห้ามเว้นวรรค"
      )
      .required("กรุณากรอกรหัสผ่าน"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "รหัสผ่านไม่ตรงกัน")
      .required("กรุณายืนยันรหัสผ่าน"),
  });

  // --- 2. Formik Setup ---
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);

      // แสดง Loading Popup
      Swal.fire({
        title: "กำลังลงทะเบียน...",
        text: "กรุณารอสักครู่",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        // ใช้ dispatch เรียก action 'register' ที่สร้างไว้ใน authReducer
        // และใช้ .unwrap() เพื่อให้จับ Error ใน block catch ได้
        await dispatch(
          register({
            name: values.name,
            email: values.email.toLowerCase(),
            phone: values.phone,
            password: values.password,
            confirmPassword: values.confirmPassword,
          })
        ).unwrap();

        // สำเร็จ -> Popup Success มาทับ Loading
        await Swal.fire({
          icon: "success",
          title: "ลงทะเบียนสำเร็จ",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/login");
      } catch (error: any) {
        // ปรับ Error Handling ให้รองรับ Error จาก Redux
        let message = "เกิดข้อผิดพลาดในการสมัครสมาชิก";
        if (axios.isAxiosError(error)) {
          message = error.response?.data?.message ?? "Server error";
        } else if (error?.message) {
          message = error.message;
        } else if (typeof error === "string") {
          message = error;
        }

        Swal.fire("สมัครสมาชิกไม่สำเร็จ", message, "error");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div
      id="register-page-container"
      className="min-h-screen flex flex-col lg:flex-row bg-white justify-center lg:justify-end items-center lg:items-start gap-8 lg:gap-20 px-4 lg:mr-40 pt-8 lg:pt-24"
    >
      {/* Illustration Section */}
      <div className="flex flex-col items-center justify-center mb-10 lg:mb-0 lg:mr-20">
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
        onSubmit={formik.handleSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-105 p-6 relative"
      >
        <div className="absolute top-4 right-4 -mt-7.5">
          <img
            src={logo}
            alt="logo"
            className="w-20 sm:w-24 lg:w-40 h-auto"
          />
        </div>

        <h2 className="text-xl font-bold mb-6 text-black">สมัครสมาชิก</h2>

        {/* Name Input */}
        <div className="mb-4">
          <label htmlFor="reg-name" className="label p-0 mb-1">
            <span className="font-semibold text-black">ชื่อ-นามสกุล</span>
          </label>
          <input
            id="reg-input-name"
            type="text"
            placeholder="ชื่อ-นามสกุล"
            className={`input input-bordered w-full bg-white text-black border-gray-300 ${
              formik.touched.name && formik.errors.name ? "border-red-500" : ""
            }`}
            {...formik.getFieldProps("name")}
            data-testid="reg-input-name"
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.name}
            </div>
          )}
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="reg-email" className="label p-0 mb-1">
            <span className="font-semibold text-black">อีเมล</span>
          </label>
          <input
            id="reg-input-email"
            type="email"
            placeholder="example@gmail.com"
            className={`input input-bordered w-full bg-white text-black border-gray-300 ${
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : ""
            }`}
            {...formik.getFieldProps("email")}
            data-testid="reg-input-email"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.email}
            </div>
          )}
        </div>

        {/* Phone Input */}
        <div className="mb-4">
          <label htmlFor="reg-phone" className="label p-0 mb-1">
            <span className="font-semibold text-black">เบอร์โทร</span>
          </label>
          <input
            id="reg-input-phone"
            type="text"
            placeholder="เบอร์โทร"
            className={`input input-bordered w-full bg-white text-black border-gray-300 ${
              formik.touched.phone && formik.errors.phone
                ? "border-red-500"
                : ""
            }`}
            {...formik.getFieldProps("phone")}
            data-testid="reg-input-phone"
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.phone}
            </div>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label htmlFor="reg-password" className="label p-0 mb-1">
            <span className="font-semibold text-black">รหัสผ่าน</span>
          </label>
          <div className="relative">
            <input
              id="reg-input-password"
              type={showPassword ? "text" : "password"}
              placeholder="รหัสผ่านอย่างน้อย 8 ตัว"
              className={`input input-bordered w-full bg-white text-black border-gray-300 pr-10 ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : ""
              }`}
              {...formik.getFieldProps("password")}
              data-test="reg-input-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-xs mt-1 whitespace-pre-line">
              {formik.errors.password}
            </div>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="mb-6">
          <label htmlFor="reg-confirm-password" className="label p-0 mb-1">
            <span className="font-semibold text-black">ยืนยันรหัสผ่าน</span>
          </label>
          <div className="relative">
            <input
              id="reg-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="ยืนยันรหัสผ่าน"
              className={`input input-bordered w-full bg-white text-black border-gray-300 pr-10 ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "border-red-500"
                  : ""
              }`}
              {...formik.getFieldProps("confirmPassword")}
              data-test="reg-input-confirm"
            />
            <button
              data-test="btn-show-confirm"
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.confirmPassword}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          id="btn-register-submit"
          type="submit"
          disabled={loading}
          className="btn w-full bg-green-400 text-black border-none font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500 transition-colors"
          data-testid="reg-btn-submit"
        >
          {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;