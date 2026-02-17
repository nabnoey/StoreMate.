import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { changePasswordService } from "../../services/auth.service";
// import { TokenService } from "../../services/token.service";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function ChangePassword() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [oldPassword,setOldPassword] = useState("");
  const [newPassword,setNewPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");

  const handleSubmit = async () => {

    if(!oldPassword || !newPassword || !confirmPassword){
      Swal.fire("Error","กรอกข้อมูลให้ครบ","error");
      return;
    }

    if(newPassword !== confirmPassword){
      Swal.fire("Error","รหัสใหม่ไม่ตรงกัน","error");
      return;
    }

    try{
      await changePasswordService(oldPassword,newPassword,confirmPassword);

  
      Swal.fire({
        title:"เปลี่ยนรหัสผ่านสำเร็จ",
        text:"กรุณาเข้าสู่ระบบใหม่",
        icon:"success",
        confirmButtonText:"ไปหน้า Login"
      }).then(()=>{
        dispatch({ type:"LOGOUT" });
        // TokenService.removeToken();
        navigate("/login");
      });

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

    }catch(error:unknown){
      let message = "เปลี่ยนรหัสไม่สำเร็จ";

      if(axios.isAxiosError(error)){
        message =
          error.response?.data?.message ||
          error.message;
      }

      Swal.fire("Error",message,"error");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="bg-white rounded-2xl shadow-2xl w-[571px] p-6">

        <h2 className="text-[36px] font-semibold mb-6 text-black">
            เปลี่ยนรหัสผ่าน
        </h2>

        <div className="flex flex-col gap-3 text-black">

          รหัสผ่านเดิม
          <input
            value={oldPassword}
            onChange={(e)=>setOldPassword(e.target.value)}
            placeholder="อย่างน้อย 8 ตัว"
            className="input input-bordered w-full border border-gray-300 bg-white text-black"
          />

          รหัสผ่านใหม่
          <input
            value={newPassword}
            onChange={(e)=>setNewPassword(e.target.value)}
            placeholder="อย่างน้อย 8 ตัว"
            className="input input-bordered w-full border border-gray-300 bg-white text-black"
          />

          ยืนยันรหัสผ่านใหม่
          <input
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            placeholder="อย่างน้อย 8 ตัว"
            className="input input-bordered w-full border border-gray-300 bg-white text-black"
          />

          <button
            onClick={handleSubmit}
            className="btn bg-[#16A249] border-0 text-white mt-4"
          >
            ยืนยัน
          </button>

        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
