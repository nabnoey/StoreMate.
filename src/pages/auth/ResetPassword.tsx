import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { resetPasswordService } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function ResetPassword() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");

  const handleSubmit = async () => {

    if (!token) {
      Swal.fire("Error","Token not found","error");
      return;
    }

    if (!password || !confirmPassword) {
      Swal.fire("Error","กรุณากรอกรหัสผ่านให้ครบ","error");
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire("Error","รหัสผ่านไม่ตรงกัน","error");
      return;
    }

    try {
      await resetPasswordService(token,password, confirmPassword);

      Swal.fire("Success","ระบบบันทึกรหัสผ่านแล้ว","success");

      setPassword("");
      setConfirmPassword("");

      navigate("/login");

    } catch (error: unknown) {
      let message = "Reset password failed";

      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ||
          error.response?.data ||
          error.message;
      }

      Swal.fire("Error",message,"error");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="bg-white rounded-2xl shadow-2xl w-[571px] p-6">

        <h2 className="text-[36px] font-semibold mb-6 text-black">
          กู้คืนรหัสผ่าน
        </h2>

        <div className="flex flex-col gap-3 text-black">

          รหัสผ่านใหม่
          <input
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="อย่างน้อย 8 ตัว"
            className="input input-bordered w-full bg-white text-black"
          />

          ยืนยันรหัสผ่านใหม่
          <input
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            placeholder="อย่างน้อย 8 ตัว"
            className="input input-bordered w-full bg-white text-black"
          />

          <button
            onClick={handleSubmit}
            className="btn bg-[#16A249] text-white mt-4"
          >
            ยืนยัน
          </button>

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
