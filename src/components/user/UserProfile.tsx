import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5"; 
import { MdLogout } from "react-icons/md"; 
import { logout } from "../../redux/auth/authReducer";
import type { AppDispatch } from "../../redux/store";
import { TokenService } from "../../services/token.service";
import Swal from "sweetalert2";

interface UserProfileProps {
  variant?: "desktop" | "mobile";
  onCloseMenu?: () => void; // สำหรับปิดเมนู mobile เวลาเลือกเมนู
}

const UserProfile: React.FC<UserProfileProps> = ({ variant = "desktop", onCloseMenu }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (onCloseMenu) onCloseMenu(); // ปิดเมนู mobile ก่อนแสดง Swal

    const result = await Swal.fire({
      title: "ออกจากระบบ?",
      text: "คุณต้องการออกจากระบบใช่หรือไม่",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "ออกจากระบบสำเร็จ",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        TokenService.removeToken();
        dispatch(logout());
        navigate("/login");
      });
    }
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
        <div className="w-11 h-11 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center border border-gray-100 shadow-sm hover:bg-gray-100 transition-all">
          <FaRegUser size={20} />
        </div>
      </label>
      <ul tabIndex={0} className="dropdown-content menu p-2 shadow-xl bg-white rounded-lg w-56 mt-4 border border-gray-100 z-50">
        <li>
          <a onClick={() => navigate("/profile")} className="flex items-center gap-3 py-3">
            <IoSettingsOutline size={22} className="text-gray-600" />
            <span className="font-medium">แก้ไขโปรไฟล์</span>
          </a>
        </li>
        <hr className="my-1 border-gray-50" />
        <li>
          <a onClick={handleLogout} className="flex items-center gap-3 py-3 text-gray-700 hover:text-red-600">
            <MdLogout size={22} className="rotate-180" /> 
            <span className="font-medium">ลงชื่อออกจากระบบ</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default UserProfile;