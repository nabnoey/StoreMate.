import { GoSearch } from "react-icons/go";
import { useNavigate } from "react-router-dom";


const Navbar: React.FC = () => {
  const navigate = useNavigate();


  return (
    <div className="navbar bg-base-100 shadow-sm h-[101px] w-full bg-gray-100">
      {/* LEFT */}
      <div className="navbar-start">
        <img src="/src/assets/logo.png" className="w-40 mt-7" />
      </div>

      {/* CENTER */}
      <div className="navbar-center hidden lg:flex text-[#74768f] text-18">
        <ul className="menu menu-horizontal gap-7 font-semibold">
          <li><a>Product</a></li>
          <li><a>Promotion</a></li>
          <li><a>About us</a></li>
          <li><a>Contact</a></li>
        </ul>
      </div>

      {/* RIGHT */}
      <div className="navbar-end flex gap-3 text-black font-light px-15 ">
        <GoSearch size={24} className="stroke-[0.6]" />
        <button className="bg-[#0A157A] text-white w-25 h-13  px-4 py-2 rounded-[10px]  " onClick={()=> navigate("/login")}>Sign In</button>
        <button className="btn btn-outline text-[#0A157A]  w-25 h-13 rounded-[10px] " onClick={()=> navigate("/register")}>Sign Up</button>

       
      </div>
    </div>
  );
};

export default Navbar;
            