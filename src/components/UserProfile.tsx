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
      navigate("/");
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="cursor-pointer">
        {/* วงกลม Profile สีเทาจาง (Gray-50) ตามภาพตัวอย่าง */}
        <div className="w-11 h-11 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center border border-gray-100 shadow-sm hover:bg-gray-100 transition-all">
          <FaRegUser size={20} />
        </div>
      </label>
      <ul tabIndex={0} className="dropdown-content menu p-2 shadow-xl bg-base-100 rounded-box w-52 mt-4 border border-gray-100 z-50 text-black">
        <li><a onClick={() => navigate("/profile")}>My Profile</a></li>
        <hr className="my-1 border-gray-100" />
        <li><a onClick={handleLogout} className="text-red-500 font-bold">Logout</a></li>
      </ul>
    </div>
  );
};

export default UserProfile;