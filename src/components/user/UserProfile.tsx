import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5"; 
import { MdLogout } from "react-icons/md"; 
import { logout } from "../../redux/auth/authReducer";
import type { AppDispatch } from "../../redux/store";
import { TokenService } from "../../services/token.service";
import { toast } from "react-hot-toast"; 

interface UserProfileProps {
  variant?: "desktop" | "mobile";
  onCloseMenu?: () => void; 
}

const UserProfile: React.FC<UserProfileProps> = ({ variant = "desktop", onCloseMenu }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onCloseMenu) onCloseMenu(); 

    // ใช้ Custom Toast เพื่อสร้างหน้าต่างยืนยัน
    toast((t) => (
      <div className="flex flex-col gap-3 items-center p-2">
        <span className="text-gray-800 font-medium text-base">
          คุณต้องการออกจากระบบใช่หรือไม่?
        </span>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id); // ปิด Toast ตัวยืนยัน
              TokenService.removeToken();
              dispatch(logout());
              toast.success("ออกจากระบบสำเร็จ");
              navigate("/login");
            }}
            className="cursor-pointer px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            ออกจากระบบ
          </button>
          <button
            onClick={() => toast.dismiss(t.id)} // ปิด Toast เฉยๆ ถ้ายกเลิก
            className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors border border-gray-200"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    ), {
      duration: Infinity, // ตั้งเป็น Infinity เพื่อไม่ให้ Toast หายไปเองจนกว่าจะกดปุ่ม
      position: "top-center",
      id: "logout-confirm", // ใส่ ID ป้องกันไม่ให้เด้งซ้อนกันหลายอันถ้ากดรัวๆ
    });
  };

  // --- แบบ MOBILE (แสดงใน Dropdown รวมกับเมนูสินค้า) ---
  if (variant === "mobile") {
    return (
      <div className="flex items-center justify-between p-5 border-b border-gray-50 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
            <FaRegUser size={24} />
          </div>
        </div>
        <div className="flex items-center gap-5 text-gray-600">
          <button 
            onClick={() => { navigate("/profile"); if (onCloseMenu) onCloseMenu(); }}
            className="hover:text-[#0A157A] transition-colors"
          >
            <IoSettingsOutline size={26} />
          </button>
          <button 
            onClick={handleLogout}
            className="hover:text-red-500 transition-colors"
          >
            <MdLogout size={26} className="rotate-180" />
          </button>
        </div>
      </div>
    );
  }

  // --- แบบ DESKTOP (Dropdown ปกติ) ---
  return (
    <div className="dropdown dropdown-end lg:block hidden" id="user-profile-dropdown">
      <label tabIndex={0} className="cursor-pointer">
        <div className="cursor-pointer w-11 h-11 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center border border-gray-100 shadow-sm hover:bg-gray-100 transition-all">
          <FaRegUser size={20} />
        </div>
      </label>
      <ul tabIndex={0} className="dropdown-content menu p-2 shadow-xl bg-white rounded-lg w-56 mt-4 border border-gray-100 z-50">
        <li>
          <a onClick={() => navigate("/profile")} className="cursor-pointer flex items-center gap-3 py-3">
            <IoSettingsOutline size={22} className="text-gray-600" />
            <span className="font-medium">แก้ไขโปรไฟล์</span>
          </a>
        </li>
        <hr className="my-1 border-gray-50" />
        <li>
          <a onClick={handleLogout} className=" flex items-center gap-3 py-3 text-gray-700 hover:text-red-600 cursor-pointer">
            <MdLogout size={22} className="rotate-180" /> 
            <span className="font-medium">ลงชื่อออกจากระบบ</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default UserProfile;