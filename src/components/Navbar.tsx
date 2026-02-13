import React, { useState } from "react";
import { GoSearch } from "react-icons/go";
import { BiSolidBell } from "react-icons/bi";
import { FaCartShopping } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; 
import type { RootState } from "../redux/store"; 
import UserProfile from "./UserProfile";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
    const cartItems = useSelector((state: RootState) => state.carts);
    const totalItems = cartItems.reduce(
    (total: number, item: { quantity: number }) => total + item.quantity,
    0
  );

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <nav id="main-navbar" className="navbar bg-white shadow-sm h-[80px] lg:h-[101px] px-4 lg:px-10 relative">
      {/* LEFT: Logo */}
      <div className="navbar-start">
        <img 
          id="navbar-logo"
          src="/src/assets/logo.png" 
          className="w-32 lg:w-40 cursor-pointer" 
          onClick={() => navigate("/")} 
          alt="Logo"
        />
      </div>

      {/* CENTER: Desktop Menu */}
      <div className="navbar-center hidden lg:flex text-[#74768f] font-semibold text-lg">
        <ul id="desktop-menu" className="menu menu-horizontal gap-7">
          <li><a id="nav-product" className="hover:text-indigo-600 cursor-pointer">สินค้า</a></li>
          <li><a id="nav-promotion" className="hover:text-indigo-600 cursor-pointer">โปรโมชั่น</a></li>
          <li><a id="nav-about" className="hover:text-indigo-600 cursor-pointer">เกี่ยวกับร้าน</a></li>
          <li><a id="nav-contact" className="hover:text-indigo-600 cursor-pointer">ติดต่อ</a></li>
        </ul>
      </div>

      {/* RIGHT: Search -> Profile -> Hamburger */}                 
      <div className="navbar-end flex items-center gap-1 lg:gap-4">
        
        {/* Mobile Search */}
        <div className="lg:hidden">
          <button id="mobile-search-btn" className="btn btn-ghost btn-circle">
            <GoSearch size={22} className="text-gray-700" />
          </button>
        </div>

        {isAuthenticated ? (
          <>
            <div className="hidden lg:flex gap-4 items-center mr-4 text-gray-600">
              <GoSearch id="desktop-search-icon" size={22} className="cursor-pointer hover:text-black" />

             <div className="relative cursor-pointer">

  <FaCartShopping
    id="desktop-cart-icon"
    size={22}
    className="hover:text-black"
    onClick={()=>navigate("/cart")}
  />

  {totalItems > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
      {totalItems}
    </span>
  )}

</div>

              

              <BiSolidBell id="desktop-bell-icon" size={22} className="cursor-pointer hover:text-black" />
            </div>
            <UserProfile />
          </>
        ) : (
          <div id="auth-buttons-desktop" className="hidden lg:flex items-center gap-3">
            <GoSearch id="guest-search-icon" size={24} className="stroke-[0.6] cursor-pointer mr-2" />
            <button 
              id="btn-login-desktop"
              className="bg-[#0A157A] text-white w-24 h-11 rounded-[10px]" 
              onClick={() => navigate("/login")}
            >
              เข้าสู่ระบบ
            </button>
            <button 
              id="btn-register-desktop"
              className="btn btn-outline text-[#0A157A] w-30 h-11 rounded-[11px]" 
              onClick={() => navigate("/register")}
            >
              สมัครสมาชิก
            </button>
          </div>
        )}

        {/* Hamburger Button */}
        <div className="flex-none lg:hidden">
          <button 
            id="hamburger-menu-btn"
            onClick={() => setIsOpen(!isOpen)} 
            className="btn btn-square btn-ghost"
            aria-label="menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-6 w-6 stroke-current text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <div id="mobile-drawer" className="absolute top-full left-0 w-full bg-white shadow-xl z-50 lg:hidden border-t">
          <div className="p-6 flex flex-col gap-6">
            {!isAuthenticated && (
              <div id="auth-buttons-mobile" className="flex items-center justify-end gap-6 mb-2">
                <button 
                  id="btn-login-mobile"
                  className="text-gray-400 font-semibold text-lg" 
                  onClick={() => { navigate("/login"); setIsOpen(false); }}
                >
                  เข้าสู่ระบบ
                </button>
                <button 
                  id="btn-register-mobile"
                  className="border-2 border-[#0A157A] text-[#0A157A] px-6 py-2 rounded-xl font-bold" 
                  onClick={() => { navigate("/register"); setIsOpen(false); }}
                >
                  สมัครสมาชิก
                </button>
              </div>
            )}
            <ul id="mobile-menu-list" className="flex flex-col gap-8 text-xl font-medium text-gray-400">
              <li><a id="mobile-nav-product" onClick={() => setIsOpen(false)}>สินค้า</a></li>
              <li><a id="mobile-nav-promotion" onClick={() => setIsOpen(false)}>โปรโมชั่น</a></li>
              <li><a id="mobile-nav-about" onClick={() => setIsOpen(false)}>เกี่ยวกับร้าน</a></li>
              <li><a id="mobile-nav-contact" onClick={() => setIsOpen(false)}>ติดต่อ</a></li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;