import { BiSolidBell } from "react-icons/bi";
import { FaRegUser, FaCartShopping } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import UserAvatar from "./UserAvatar";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

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
          <UserAvatar />
        ) : (
          <button onClick={() => navigate("/login")}>
            <FaRegUser size={24} className="cursor-pointer" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
