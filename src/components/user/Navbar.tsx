import React, { useState} from "react";
import { GoSearch } from "react-icons/go";
import { BiSolidBell } from "react-icons/bi";
import { FaCartShopping } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../redux/store";
import { useSelector,useDispatch } from "react-redux";
import {search} from "../../redux/products/productReducer";

import type { RootState } from "../../redux/store";
import UserProfile from "./UserProfile";
import logo from "../../assets/logo.png";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()

  
const searchResult = useSelector(
  (state: RootState) => state.products.searchResult
)



const [inputValue, setInputValue] = useState("")

const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value
  setInputValue(value)

  if (value.trim() !== "") {
    dispatch(search(value))
  }
}

const handleSubmitSearch = () => {
  if (!inputValue.trim()) {
   navigate("/")
    return
  }
    navigate(`/search?keyword=${inputValue}`)
    setOpenSearch(false)

}








  const [openSearch, setOpenSearch] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

const cartItems = useSelector((state: RootState) => state.carts.items); 


const totalItems = cartItems.reduce(
  (total: number, item: { quantity: number }) => total + item.quantity,
  0
);

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );



  return (

    <nav className="navbar bg-white shadow-sm h-[50px] lg:h-[101px] px-4 lg:px-10 relative">


      {/* LOGO */}
      <div className="navbar-start">
        <img
          src={logo}
          className="w-27 lg:w-38 cursor-pointer mt-6"
          onClick={() => navigate("/")}
          alt="Logo"
          data-test="logo"
        />
      </div>

      {/* MENU DESKTOP */}
      <div className="navbar-center hidden lg:flex text-[#74768f] font-semibold text-lg">
        <ul className="menu menu-horizontal gap-7 text-[15px]">

          <li><a className="hover:text-indigo-600 cursor-pointer" data-test="product-link" onClick={()=>navigate("/search")}>สินค้า</a></li>
          <li><a className="hover:text-indigo-600 cursor-pointer" data-test="promotion-link">โปรโมชั่น</a></li>
          <li><a className="hover:text-indigo-600 cursor-pointer" data-test="about-link">เกี่ยวกับร้าน</a></li>
          <li><a className="hover:text-indigo-600 cursor-pointer" data-test="contact-link">ติดต่อ</a></li>

        </ul>
      </div>

      {/* RIGHT */}
      <div className="navbar-end flex items-center gap-4">

        {/* SEARCH */}
  <div className="relative">

  <GoSearch
  size={22}
  className="cursor-pointer hover:text-black text-black z-50"
  data-test="search"
  onClick={() => {
    if (openSearch) {
      handleSubmitSearch()
    } else {
      setOpenSearch(true)
    }
  }}
/>

  {openSearch && (
    <>
    <input
  type="text"
  data-test="search-input"
  placeholder="ค้นหาสินค้า..."
  value={inputValue}
  onChange={handleSearch}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSubmitSearch()
    }
  }}
  className="absolute right-8 -top-2 input input-bordered bg-white w-35 sm:w-40 md:w-48 h-10 text-[#74768f] z-50"
  autoFocus
/>
{inputValue && searchResult.length > 0 && (
  <div className="absolute right-8 top-10 w-60 bg-white shadow-lg rounded-md z-50 max-h-60 overflow-y-auto text-black">
    {searchResult.map((product) => (
      <div
        key={product.id}
        className="p-3 hover:bg-gray-100 cursor-pointer"
        onClick={() => {
          navigate(`/product/${product.id}`)
          setOpenSearch(false)
          setInputValue("")
        }}
      >
        {product.productName}
      </div>
    ))}
  </div>
)}

    

    </>
  )}

</div>

        {/* LOGIN แล้ว */}
        {isAuthenticated ? (
          <>
            <div className="flex gap-4 items-center mr-2 text-gray-600">

              {/* CART */}
             <div 
                className="relative cursor-pointer p-1" 
                onClick={() => navigate("/shopping-cart")}
              >
                <FaCartShopping
                  size={22}
                  data-test="cart-shopping"
                  className="hover:text-black"
                />

                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                    {totalItems}
                  </span>
                )}
              </div>

              {/* BELL */}
              <BiSolidBell size={22} className="cursor-pointer hover:text-black" />
            </div>

            <UserProfile />
          </>
        ) : (
          <div className="hidden lg:flex items-center gap-3">
            <button
            data-test="login-btn"
              className="bg-[#0A157A] text-white w-24 h-11 rounded-[10px]"
              onClick={() => navigate("/login")}
            >
              เข้าสู่ระบบ
            </button>

            <button
            data-test="register-btn"
              className="btn btn-outline text-[#0A157A] w-30 h-11 rounded-[10px]"
              onClick={() => navigate("/register")}
            >
              สมัครสมาชิก
            </button>
          </div>
        )}

        {/*  HAMBURGER */}
        <div className="flex-none lg:hidden">
          <button
            className="btn btn-square btn-ghost"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24"
              className="h-6 w-6 stroke-current text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

      </div>

      {/* MOBILE MENU */}
      {openMenu && (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl z-50 lg:hidden border-t">

          {!isAuthenticated && (
            <div className="flex items-center justify-center gap-6 p-4">
              <button
                className="text-gray-500 font-semibold"
                onClick={() => { navigate("/login"); setOpenMenu(false); }}
              >
                เข้าสู่ระบบ
              </button>
              <button
                className="border-2 border-[#0A157A] text-[#0A157A] px-6 py-2 rounded-xl font-bold"
                onClick={() => { navigate("/register"); setOpenMenu(false); }}
              >
                สมัครสมาชิก
              </button>
            </div>
          )}

          <div className="p-6 flex flex-col gap-6 text-lg text-gray-700">
            <a>สินค้า</a>
            <a>โปรโมชั่น</a>
            <a>เกี่ยวกับเรา</a>
            <a>ติดต่อ</a>
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
