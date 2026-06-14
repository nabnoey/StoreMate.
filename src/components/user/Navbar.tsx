import { useState, useEffect, useRef } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
// import { search } from "../../redux/products/productReducer";
import { fetchCartThunk } from "../../redux/carts/CartReducer";
import UserProfile from "./UserProfile";
import logo from "../../assets/logo.png";
import { Icon } from "@iconify/react";
import { getProfile } from "../../redux/auth/authReducer";
import {
  fetchUserNotify,
  clearUnreadBadge,
} from "../../redux/notification/notificationReducer";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const location = useLocation();

  const isAuthentication = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    setInputValue(keyword);
  }, [keyword]);

  const notifications = useSelector(
    (state: RootState) => state.notification.items,
  );

  const [openNotifyDropdown, setOpenNotifyDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.isNew).length;

  const previewNotifications = notifications.slice(0, 5);

  useEffect(() => {
    if (isAuthentication) {
      dispatch(fetchCartThunk());
      dispatch(getProfile());
      dispatch(fetchUserNotify());
    }
  }, [dispatch, isAuthentication]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenNotifyDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setOpenNotifyDropdown(!openNotifyDropdown);
    if (!openNotifyDropdown) {
      dispatch(clearUnreadBadge());
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // if (value.trim() !== "") {
    //   dispatch(
    //     search({
    //       keyword: value,
    //       categoryId: 0,
    //       minPrice: 0,
    //       maxPrice: 0,
    //       page: 1,
    //       size: 1000,
    //     }),
    //   );
    // }
  };

  const handleSubmitSearch = () => {
    // if (!inputValue.trim()) {
    //   return;
    // }
    navigate(`/search?keyword=${inputValue}`);
    // setOpenSearch(false);
  };

  const [openSearch, setOpenSearch] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const cartItems = useSelector((state: RootState) => state.carts.items);

  const totalItems = cartItems?.length;
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const isActive = (path: string, searchParam: string = "") => {
    if (searchParam) {
      return (
        location.pathname === path && location.search.includes(searchParam)
      );
    }
    if (path === "/search") {
      return (
        location.pathname === path &&
        !location.search.includes("category=promotion")
      );
    }
    return location.pathname === path;
  };

  return (
    <nav className="flex items-center justify-between bg-white shadow-sm h-[73px] lg:h-[80px] px-4 lg:px-10 relative">
      {/* LOGO */}
      <div className="navbar-start right-5 flex items-center justify-start">
        <button onClick={() => navigate("/")}>
          <img
            src={logo}
            className="w-27 lg:w-38 mt-5 -ml-8 lg:mt-5 cursor-pointer"
            alt="Logo"
            data-test="logo"
          />
        </button>
      </div>

      {/* MENU DESKTOP */}
      <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-Anuphan text-black">
        <ul className="flex items-center gap-6 xl:gap-10 text-[16px] whitespace-nowrap">
          <li>
            <Link
              data-test="list-search"
              className={`cursor-pointer transition-colors duration-200 ${
                isActive("/search")
                  ? "text-blue-600 font-semibold"
                  : "text-black hover:text-blue-600"
              }`}
              to="/search"
            >
              สินค้า
            </Link>
          </li>
          <li>
            <Link
              data-test="list-promo"
              className={`cursor-pointer transition-colors duration-200 ${
                isActive("/search", "category=promotion")
                  ? "text-blue-600 font-semibold"
                  : "text-black hover:text-blue-600"
              }`}
              to={`/search?keyword=${keyword}&category=promotion`}
            >
              โปรโมชั่น
            </Link>
          </li>
          <li>
            <Link
              data-test="list-about"
              className={`cursor-pointer transition-colors duration-200 ${
                isActive("/about-us")
                  ? "text-blue-600 font-semibold"
                  : "text-black hover:text-blue-600"
              }`}
              to="/about-us"
            >
              เกี่ยวกับเรา
            </Link>
          </li>
          <li>
            <Link
              data-test="list-contact"
              className={`cursor-pointer transition-colors duration-200 ${
                isActive("/contact")
                  ? "text-blue-600 font-semibold"
                  : "text-black hover:text-blue-600"
              }`}
              to="/contact"
            >
              ติดต่อ
            </Link>
          </li>
        </ul>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-end gap-3 lg:gap-5 flex-shrink-0 lg:w-1/4">
        {/* SEARCH */}
        <div className="relative flex items-center" data-test="search">
          <Icon
            icon="ph:magnifying-glass"
            width="24"
            height="24"
            className="cursor-pointer text-black hover:text-indigo-600 transition-colors z-50"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (openSearch) {
                handleSubmitSearch();
              } else {
                setOpenSearch(true);
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
                    setOpenSearch(false);
                  }, 150);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmitSearch();
                  }
                }}
                className="absolute right-8 -top-2 input input-bordered bg-white w-35 sm:w-40 md:w-48 h-10 text-[#74768f] z-50"
                autoFocus
              />
            </>
          )}
        </div>

        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-3 lg:gap-4 text-black">
              <button
                data-test="click-shop-cart"
                className="relative cursor-pointer p-1"
                onClick={() => navigate("/shopping-cart")}
              >
                <Icon
                  icon="ph:shopping-cart"
                  width="24"
                  height="24"
                  data-test="cart-shopping"
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                />

                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {totalItems}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  data-test="click-notifications"
                  className="relative cursor-pointer p-1 block"
                  onClick={handleBellClick}
                >
                  <Icon
                    icon="ph:bell"
                    width="24"
                    height="24"
                    className="cursor-pointer hover:text-indigo-600 transition-colors"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {openNotifyDropdown && (
                  <div className="absolute right-0 mt-3 w-[320px] sm:w-[360px] bg-white rounded-lg shadow-xl border border-gray-100 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-[360px] overflow-y-auto font-Anuphan">
                      {previewNotifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 text-sm">
                          ไม่มีการแจ้งเตือนในขณะนี้
                        </div>
                      ) : (
                        previewNotifications.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => {
                              setOpenNotifyDropdown(false);
                              navigate("/notification");
                            }}
                          >
                            <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src={logo}
                                className="w-full h-full object-cover"
                                alt="notify-img"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = logo;
                                }}
                              />
                            </div>

                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="text-sm font-semibold text-gray-800 truncate">
                                {item.title}
                              </span>
                              <span className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                                {item.message}
                              </span>
                              <span className="text-[11px] text-gray-400 mt-1">
                                {item.createdAt}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <button
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 text-center text-sm font-semibold transition-colors font-Anuphan block"
                      onClick={() => {
                        setOpenNotifyDropdown(false);
                        navigate("/notification");
                      }}
                    >
                      ดูทั้งหมด
                    </button>
                  </div>
                )}
              </div>
            </div>

            <UserProfile />
          </>
        ) : (
          <div className="hidden lg:flex items-center gap-3">
            <button
              data-test="login-btn"
              className="bg-[#073A8D] hover:bg-[#052b6b] text-white w-24 h-10 rounded-[10px] text-sm transition-colors cursor-pointer"
              onClick={() => navigate("/login")}
            >
              เข้าสู่ระบบ
            </button>

            <button
              data-test="register-btn"
              className="border border-[#073A8D] text-[#073A8D] hover:bg-gray-50 w-28 h-10 rounded-[10px] text-sm transition-colors cursor-pointer"
              onClick={() => navigate("/register")}
            >
              สมัครสมาชิก
            </button>
          </div>
        )}

        <div className="flex-none lg:hidden ml-1">
          <button
            data-test="btn-open-menu"
            className="p-1 cursor-pointer"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <Icon
              icon="ph:list"
              width="26"
              height="26"
              className="text-gray-800"
            />
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {openMenu && (
        <div className="absolute top-[60px] right-4 w-[280px] sm:w-[320px] bg-white shadow-xl z-50 lg:hidden rounded-lg overflow-hidden border border-gray-100 animate-in fade-in zoom-in origin-top-right">
          {isAuthenticated ? (
            <UserProfile
              variant="mobile"
              onCloseMenu={() => setOpenMenu(false)}
            />
          ) : (
            <div className="flex items-center justify-between gap-3 p-5 border-b border-gray-100">
              <button
                data-test="login-btn"
                className="flex-1 bg-[#0A157A] text-white py-2.5 rounded-xl font-bold text-sm cursor-pointer"
                onClick={() => {
                  navigate("/login");
                  setOpenMenu(false);
                }}
              >
                เข้าสู่ระบบ
              </button>

              <button
                data-test="register-btn"
                className="flex-1 border-2 border-[#0A157A] text-[#0A157A] py-2.5 rounded-xl font-bold text-sm cursor-pointer"
                onClick={() => {
                  navigate("/register");
                  setOpenMenu(false);
                }}
              >
                สมัครสมาชิก
              </button>
            </div>
          )}

          <div className="flex flex-col py-2">
            <Link
              data-test="list-product"
              to="/search"
              onClick={() => setOpenMenu(false)}
              className="cursor-pointer w-full text-left px-6 py-3.5 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              สินค้า
            </Link>
            <Link
              data-test="list-promo"
              to={`/search?category=promotion`}
              onClick={() => setOpenMenu(false)}
              className="cursor-pointer w-full text-left px-6 py-3.5 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              โปรโมชั่น
            </Link>
            <Link
              data-test="list-about"
              to="/about-us"
              onClick={() => setOpenMenu(false)}
              className="cursor-pointer w-full text-left px-6 py-3.5 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              เกี่ยวกับเรา
            </Link>
            <Link
              data-test="list-contact"
              to="/contact"
              onClick={() => setOpenMenu(false)}
              className="cursor-pointer w-full text-left px-6 py-3.5 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              ติดต่อ
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
