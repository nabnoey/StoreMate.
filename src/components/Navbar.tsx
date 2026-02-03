import { useContext } from "react";
import { BiSolidBell } from "react-icons/bi";
import { FaRegUser, FaCartShopping } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Navbar: React.FC = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("UserContext must be used within UserContextProvider");
  }

  const { isAuthenticated, logout } = context;
  const navigate = useNavigate();

const handleLogout = () => {
  Swal.fire({
    title: "ออกจากระบบ?",
    text: "คุณต้องการออกจากระบบใช่หรือไม่",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ออกจากระบบ",
    cancelButtonText: "ยกเลิก",
  }).then((result) => {
    if (result.isConfirmed) {
      logout();

      Swal.fire({
        title: "ออกจากระบบสำเร็จ",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/");
      });
    }
  });
};
  return (
    <div className="navbar bg-base-100 shadow-sm h-[101px] w-full bg-gray-100">
      {/* LEFT */}
      <div className="navbar-start">
        <img src="/src/assets/logo.png" className="w-40 mt-7" />
      </div>

      {/* CENTER */}
      <div className="navbar-center hidden lg:flex text-black text-18">
        <ul className="menu menu-horizontal gap-7 font-semibold">
          <li><a>Product</a></li>
          <li><a>Promotion</a></li>
          <li><a>About us</a></li>
             <li><a>Contact</a></li>
        </ul>
      </div>

      {/* RIGHT */}
      <div className="navbar-end flex gap-8 text-black px-15 ">
        <FiSearch size={24} />
        <FaCartShopping size={24} />
        <BiSolidBell size={24} />

        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="cursor-pointer">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <FaRegUser  size={24} />
              </div>
            </label>

            <ul className="menu dropdown-content bg-white w-40 p-2 shadow">
              <li className="text-sm text-black">👋 ยินดีต้อนรับ</li>
              <li>
                <button
                  className="text-red-500 font-bold"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <button>
          <FaRegUser
            size={24}
            className="cursor-pointer"
            onClick={() => navigate("/login")}
            
          />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
