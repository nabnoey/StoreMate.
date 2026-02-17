import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";
import { logout } from "../redux/auth/action";
import Swal from "sweetalert2";

const UserProfile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
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
      localStorage.removeItem("auth");
      sessionStorage.removeItem("auth");
      dispatch(logout());

      Swal.fire({
         title: "ออกจากระบบสำเร็จ",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(()=>navigate("/"))

      
    }
  };

  return (
    <div className="dropdown dropdown-end" id="user-profile-dropdown">
      {/* 1. ปุ่มกดเปิด Dropdown */}
      <label 
        id="user-avatar-button"
        tabIndex={0} 
        className="cursor-pointer"
        data-testid="user-avatar-trigger"
      >
        <div className="w-11 h-11 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center border border-gray-100 shadow-sm hover:bg-gray-100 transition-all">
          <FaRegUser size={20} />
        </div>
      </label>

      {/* 2. รายการเมนูภายใน */}
      <ul 
        id="user-profile-menu"
        tabIndex={0} 
        className="dropdown-content menu p-2 shadow-xl bg-white rounded-box w-52 mt-4 border border-gray-100 z-50 text-black"
      >
        <li>
          <a 
            id="menu-my-profile" 
            onClick={() => navigate("/profile")}
            data-testid="link-profile"
          >
            โปรไฟล์ของฉัน
          </a>
        </li>
        <hr className="my-1 border-gray-100" />
        <li>
          <a 
            id="menu-logout" 
            onClick={handleLogout} 
            className="text-red-500 font-bold"
            data-testid="link-logout"
          > 
            ออกจากระบบ
          </a>
        </li>
      </ul>
    </div>
  );
};

export default UserProfile;