import React, { useState } from "react";
import { GoSearch } from "react-icons/go";
import { BiSolidBell } from "react-icons/bi";
import { FaRegUser, FaCartShopping, FaBars } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import type { RootState } from "../redux/store";
import { logout } from "../redux/auth/action"; 
import UserProfile from "./UserProfile";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

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
      try {
        localStorage.removeItem("auth");
        sessionStorage.removeItem("auth");
        dispatch(logout()); 
        await Swal.fire({
          title: "ออกจากระบบสำเร็จ",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/");
      } catch (err) {
        Swal.fire({ title: "เกิดข้อผิดพลาด", icon: "error" });
      }
    }
  };

  return (
    <nav className="navbar bg-white shadow-sm h-[80px] lg:h-[101px] px-4 lg:px-10 relative">
      {/* LEFT: Logo */}
      <div className="navbar-start">
        <img 
          src="/src/assets/logo.png" 
          className="w-32 lg:w-40 cursor-pointer" 
          onClick={() => navigate("/")} 
        />
      </div>

      {/* CENTER: Desktop Menu */}
      <div className="navbar-center hidden lg:flex text-[#74768f] font-semibold text-lg">
        <ul className="menu menu-horizontal gap-7">
          <li><a className="hover:text-indigo-600 cursor-pointer">Product</a></li>
          <li><a className="hover:text-indigo-600 cursor-pointer">Promotion</a></li>
          <li><a className="hover:text-indigo-600 cursor-pointer">About us</a></li>
          <li><a className="hover:text-indigo-600 cursor-pointer">Contact</a></li>
        </ul>
      </div>

      {/* RIGHT: Search -> Profile -> Hamburger */}
      <div className="navbar-end flex items-center gap-1 lg:gap-4">
        
        {/* 1. ไอคอน Search (แสดงข้างหน้าสุดใน Mobile) */}
        <div className="lg:hidden">
          <button className="btn btn-ghost btn-circle">
            <GoSearch size={22} className="text-gray-700" />
          </button>
        </div>

        {/* 2. ส่วน Profile หรือ ปุ่ม Sign In (Desktop) */}
        {isAuthenticated ? (
          <>
            <div className="hidden lg:flex gap-4 items-center mr-4 text-gray-600">
              <GoSearch size={22} className="cursor-pointer hover:text-black" />
              <FaCartShopping size={22} className="cursor-pointer hover:text-black" />
              <BiSolidBell size={22} className="cursor-pointer hover:text-black" />
            </div>
            <UserProfile />
          </>
        ) : (
         <div className="hidden lg:flex items-center gap-3">
            <GoSearch size={24} className="stroke-[0.6] cursor-pointer mr-2" />
            <button className="bg-[#0A157A] text-white w-24 h-11 rounded-[10px]" onClick={() => navigate("/login")}>Sign In</button>
            <button className="btn btn-outline text-[#0A157A] w-24 h-11 rounded-[10px]" onClick={() => navigate("/register")}>Sign Up</button>
          </div>
        )}

        {/* 3. Hamburger Button (SVG) - อยู่ขวาสุดเสมอ */}
        <div className="flex-none lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-6 w-6 stroke-current text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER (สไลด์ลงมาจาก Navbar) */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl z-50 lg:hidden border-t">
          <div className="p-6 flex flex-col gap-6">
            {!isAuthenticated && (
              <div className="flex items-center justify-end gap-6 mb-2">
                <button className="text-gray-400 font-semibold text-lg" onClick={() => { navigate("/login"); setIsOpen(false); }}>Sign In</button>
                <button className="border-2 border-[#0A157A] text-[#0A157A] px-6 py-2 rounded-xl font-bold" onClick={() => { navigate("/register"); setIsOpen(false); }}>Sign Up</button>
              </div>
            )}
            <ul className="flex flex-col gap-8 text-xl font-medium text-gray-400">
              <li className="cursor-pointer hover:text-[#0A157A]" onClick={() => setIsOpen(false)}>Product</li>
              <li className="cursor-pointer hover:text-[#0A157A]" onClick={() => setIsOpen(false)}>Promotion</li>
              <li className="cursor-pointer hover:text-[#0A157A]" onClick={() => setIsOpen(false)}>About us</li>
              <li className="cursor-pointer hover:text-[#0A157A]" onClick={() => setIsOpen(false)}>Contact</li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;