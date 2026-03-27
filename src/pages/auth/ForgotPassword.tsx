import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { forgotPasswordService } from "../../services/auth.service";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await forgotPasswordService(email);
      toast.success("เราได้ส่งลิงก์รีเซ็ตรหัสผ่านให้คุณแล้ว");
      setEmail("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const apiMessage = error.response?.data?.message?.toLowerCase() || "";

        if (
          status === 404 ||
          apiMessage.includes("not found") ||
          apiMessage.includes("user")
        ) {
          toast.error("ไม่พบผู้ใช้งาน");
        } else {
          toast.error(error.response?.data?.message || "ไม่สามารถส่งลิงก์ได้");
        }
      } else {
        toast.error("เกิดข้อผิดพลาดบางอย่าง");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[571px] p-6 sm:p-8 relative">
        <h2 className="text-2xl sm:text-[36px] font-semibold mb-6 text-black">
          กู้คืนรหัสผ่าน
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 text-black text-[16px] font-light"
        >
          <div className="flex flex-col gap-2">
            <label className="font-medium">อีเมล</label>
            <input
              id="forgot-email"
              type="email"
              data-test="input-email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="input input-bordered w-full bg-white font-light text-[#4B5563] focus:border-[#6B7280] border-gray-300 h-[48px]"
              required
            />
          </div>

          <button
            data-test="submit-btn"
            type="submit"
            className="btn w-full sm:w-[368px] sm:mx-auto h-[52px] bg-[#16A249] hover:bg-[#12863c] text-white text-[20px] font-bold border-none mt-4 transition-colors"
          >
            ยืนยัน
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
