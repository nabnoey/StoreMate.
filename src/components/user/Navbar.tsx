import { use, useState} from "react";
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
import { useSearchParams } from "react-router-dom";



const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  
const searchResult = useSelector(
  (state: RootState) => state.products.searchResult
)


const [inputValue, setInputValue] = useState("")


const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value
  setInputValue(value)

  if (value.trim() !== "") {
    dispatch(search({ keyword: value, category:"", minPrice: 0, maxPrice: 0, page: 1, size: 1000}))
  }
}

const handleSubmitSearch = () => {
  if (!inputValue.trim()) {
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

    <nav className="flex items-center justify-between bg-white shadow-sm h-[60px] lg:h-[101px] px-4 lg:px-10 relative">


      {/* LOGO */}
      <div className="navbar-start right-5 flex items-center justify-start">
        <img
          src={logo}
          className="w-27 lg:w-38 cursor-pointer mt-5 -ml-8 lg:mt-5 cursor-pointer"
          onClick={() => navigate("/")}
          alt="Logo"
          data-test="logo"
        />
      </div>

      {/* MENU DESKTOP */}

      <div className="navbar-center hidden lg:flex  font-Anuphan text-lg text-black ">
        <ul className="menu menu-horizontal gap-7 text-[16px]  ">
          <li><a data-test="list-search" className="hover:text-indigo-600 cursor-pointer" onClick={()=> navigate("/search")}>สินค้า</a></li>
          <li><a 
          data-test="list-promo" 
          className="hover:text-indigo-600 cursor-pointer" 
          onClick={() => navigate(`/search?keyword=${keyword}&category=promotion`)}>โปรโมชั่น</a></li>
          <li><a data-test="list-about" className="hover:text-indigo-600 cursor-pointer" onClick={() => navigate("/about-us")} >เกี่ยวกับเรา</a></li>
          <li><a data-test="list-contact" className="hover:text-indigo-600 cursor-pointer" onClick={()=>navigate("contact")}>ติดต่อ</a></li>

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
   onFocus={() => setOpenSearch(true)}

  onBlur={() => {
    setTimeout(() => {
      setOpenSearch(false)
    },150)
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSubmitSearch()
    }
  }}
  className="absolute  right-8 -top-2 input input-bordered bg-white w-31 sm:w-40 md:w-48 h-10 text-[#74768f] z-50"
  autoFocus
/>
{inputValue && searchResult.length > 0 && (
  <div className="absolute right-8 top-10 w-60 bg-white shadow-lg rounded-md z-50 max-h-60 overflow-y-auto text-black">
    {searchResult.map((product) => (
      <div
        data-test = "click-to-product"
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

        {isAuthenticated ? (
          <>
            <div className="flex gap-3 lg:gap-4 items-center text-gray-600">

             <div 
                data-test="click-shop-cart"
                className="relative cursor-pointer p-1 cursor-pointer" 
                onClick={() => navigate("/shopping-cart")}
              >
                <FaCartShopping
                  size={22}
                  data-test="cart-shopping"
                  className="hover:text-black cursor-pointer"
                />

                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                    {totalItems}
                  </span>
                )}
              </div>

              <BiSolidBell size={22} className="cursor-pointer hover:text-black cursor-pointer" />
            </div>

            <UserProfile />
          </>
        ) : (
          <div className="hidden lg:flex items-center gap-3">
            <button
            data-test="login-btn"
              className="bg-[#073A8D] text-white w-24 h-11 rounded-[10px] cursor-pointer"
              onClick={() => navigate("/login")}
            >
              เข้าสู่ระบบ
            </button>

            <button
            data-test="register-btn" 
              className="btn btn-outline text-[#073A8D] text-[#0A157A] w-30 h-11 rounded-[10px] cursor-pointer"
              onClick={() => navigate("/register")}
            >
              สมัครสมาชิก
            </button>
          </div>
        )}

        <div className="flex-none lg:hidden">
          <button
            data-test = "btn-open-menu"
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

      {openMenu && (
        <div className="absolute top-[60px] right-4 w-[300px] bg-white z-30 lg:hidden rounded-none overflow-hidden animate-in fade-in zoom-in origin-top-right">
    
          {isAuthenticated ? (
            <UserProfile 
            variant="mobile" 
            onCloseMenu={() => setOpenMenu(false)} 
            />
           ) : (
          <div className="flex items-center justify-between gap-3 p-5 border-b border-gray-50">
            <button 
                data-test="btn-login"
                className="flex-1 bg-[#0A157A] text-white py-2.5 rounded-xl font-bold text-sm cursor-pointer"
                  onClick={() => { navigate("/login"); setOpenMenu(false); }}
            >
                เข้าสู่ระบบ
            </button>

            <button 
            data-test="btn-register"
          className="flex-1 border-2 border-[#0A157A] text-[#0A157A] py-2 rounded-xl font-bold text-sm cursor-pointer"
          onClick={() => { navigate("/register"); setOpenMenu(false); }}
            >
          สมัครสมาชิก
            </button>
        </div>
        )}

    <div className="flex flex-col py-2">
      <a data-test="list-product" onClick={() => { navigate("/search"); setOpenMenu(false); }} className=" cursor-pointer px-6 py-4 text-gray-700 font-medium hover:bg-blue-50">สินค้า</a>
      <a data-test="list-promo" onClick={() => navigate(`/search?category=promotion`)} className="cursor-pointer px-6 py-4 text-gray-700 font-medium hover:bg-blue-50">โปรโมชั่น</a>
      <a data-test="list-about" onClick={() => { navigate("/about"); setOpenMenu(false); }} className="cursor-pointer px-6 py-4 text-gray-700 font-medium hover:bg-blue-50">เกี่ยวกับเรา</a>
      <a data-test="list-contact" onClick={() => { navigate("/contact"); setOpenMenu(false); }} className="cursor-pointer px-6 py-4 text-gray-700 font-medium hover:bg-blue-50">ติดต่อ</a>
    </div>
  </div>
)}
    </nav>
  );
};

export default Navbar;