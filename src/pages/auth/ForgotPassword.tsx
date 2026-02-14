import {useState} from "react"
import axios from "axios";
import Swal from "sweetalert2"
import { forgotPasswordService } from "../../services/auth.service";



const ForgotPassword = () => {

    const [email,setEmail] = useState<string>("")

    //สร้าง funtion กดปุ่ม
    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();

        try{
            await forgotPasswordService(email);

            Swal.fire({
                icon:"success",
                title:"ส่งสำเร็จ",
                text: "เราได้ส่งลิงก์รีเซ็ตรหัสผ่านให้คุณแล้ว",
                 confirmButtonColor: "#22c55e"
            })

        }catch(error:unknown){
            if (axios.isAxiosError(error)){
            Swal.fire({
                icon:"error",
                title:"เกิดข้อผิดพลาด",
                text: error.response?.data?.message|| "ไม่สามารถส่งได้",
                confirmButtonColor: "#ef4444"
            })
        }
        }
    }


  return (
    <div
      className="
       min-h-screen flex flex-col lg:flex-row 
      bg-white
      justify-center 
      items-center lg:items-start
      gap-8 lg:gap-20
      px-4  pt-8 lg:pt-24
      "
    >


      <div
        className="
        bg-white rounded-2xl shadow-2xl 
        w-full max-w-105 
        p-6 relative 
        
        
        "
      >


        <h2 className="text-xl text-center font-bold mb-6 text-black">
    RECOVERY PASSWORD
        </h2>
<div className="mt-13 text-black font-bold gap-3 flex flex-col">
    Email
        <input
          name="email"
          value={email}
          onChange={(e) =>setEmail(e.target.value)}
          placeholder="example@gmail.com"
          className="input input-bordered w-full mb-4 bg-white font-light text-black border-gray-300"
        />


   

        <button
          type="submit"
          className="btn w-full bg-green-400 text-black border-none font-bold"
        onClick={handleSubmit}>
         Confirm
        </button>
        </div>
        </div>
      </div>
    
  );
}

export default ForgotPassword