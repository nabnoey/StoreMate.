import React, { useState } from "react";
import { GoSearch } from "react-icons/go";
import { BiSolidBell } from "react-icons/bi";
import { FaCartShopping } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import UserProfile from "./UserProfile";
import { searchProduct } from "../redux/products/productReducer";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [text, setText] = useState("");
  const [openSearch, setOpenSearch] = useState(false);

  const cartItems = useSelector((state: RootState) => state.carts);
  const totalItems = cartItems.reduce(
    (total: number, item: { quantity: number }) => total + item.quantity,
    0
  );

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value);
    dispatch(searchProduct(value));
  };

  return (
    <nav className="navbar bg-white shadow-sm h-[80px] lg:h-[101px] px-4 lg:px-10 relative">
      
   
      <div className="navbar-start">
        <img 
          src="/src/assets/logo.png" 
          className="w-32 lg:w-40 cursor-pointer mt-6" 
          onClick={() => navigate("/")} 
          alt="Logo"
        />
      </div>

      {/* CENTER */}
      <div className="navbar-center hidden lg:flex text-[#74768f] font-semibold text-lg">
        <ul className="menu menu-horizontal gap-7">
          <li><a className="hover:text-indigo-600 cursor-pointer">Product</a></li>
          <li><a className="hover:text-indigo-600 cursor-pointer">Promotion</a></li>
          <li><a className="hover:text-indigo-600 cursor-pointer">About us</a></li>
          <li><a className="hover:text-indigo-600 cursor-pointer">Contact</a></li>
        </ul>
      </div>

      {/* RIGHT */}
      <div className="navbar-end flex items-center gap-4">

         <GoSearch
                size={22}
                className="cursor-pointer hover:text-black text-black"
                onClick={() => setOpenSearch(!openSearch)}
              />

           
              {openSearch && (
                <input
                  type="text"
                  placeholder="ค้นหาสินค้า..."
                  value={text}
                  onChange={handleSearch}
                  className="input input-bordered bg-white w-48 h-10 text-[#74768f]"
                  autoFocus
                />
              )}

        {isAuthenticated ? (
          <>
            <div className="flex gap-4 items-center mr-4 text-gray-600">
              
   
             

              {/* 🛒 CART */}
              <div className="relative cursor-pointer">
                <FaCartShopping
                  size={22}
                  className="hover:text-black"
                  onClick={() => navigate("/cart")}
                />

                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                    {totalItems}
                  </span>
                )}
              </div>

              {/* 🔔 */}
              <BiSolidBell size={22} className="cursor-pointer hover:text-black" />
            </div>

            <UserProfile />
          </>
        ) : (
          <div className="hidden lg:flex items-center gap-3">
            <button 
              className="bg-[#0A157A] text-white w-24 h-11 rounded-[10px]" 
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
            <button 
              className="btn btn-outline text-[#0A157A] w-24 h-11 rounded-[10px]" 
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* 🍔 hamburger (ยังอยู่ได้) */}
        <div className="flex-none lg:hidden">
          <button className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              className="inline-block h-6 w-6 stroke-current text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
