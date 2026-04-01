import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Edit3, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import type { RootState } from "../../redux/store";

const ProfileSidebar = () => {
  const user = useSelector((state: RootState) => state?.auth?.user);
  const navigate = useNavigate();
  const location = useLocation();

  const [isDesktopProfileOpen, setIsDesktopProfileOpen] = useState(true);

  // ฟังก์ชันเช็คว่าหน้าปัจจุบันตรงกับ URL นี้ไหม
  const isActive = (path: string) => location.pathname === path;

  // สไตล์สำหรับเมนู Desktop (มีไฮไลท์สีฟ้าเมื่อเลือก)
  const getDesktopMenuClass = (path: string) => {
    return isActive(path)
      ? "flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#4285F4] font-medium transition-all rounded-md w-full text-left"
      : "flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-[#4285F4] transition-all rounded-md w-full text-left";
  };

  // สไตล์สำหรับเมนู Mobile แบบปุ่ม Pill
  const getMobileTabClass = (path: string) => {
    return isActive(path)
      ? "flex-shrink-0 px-5 py-2 bg-[#4285F4] text-white text-sm font-medium rounded-full shadow-sm transition-all"
      : "flex-shrink-0 px-5 py-2 bg-white text-gray-600 text-sm font-medium rounded-full shadow-sm border border-gray-100 hover:text-[#4285F4] transition-all";
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ================= MOBILE VIEW ================= */}
      <div className="md:hidden flex flex-col gap-3 relative z-20 mb-2">
        {/* Mobile Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-11 h-11 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-blue-500" />
            </div>
            <div className="truncate">
              <p className="text-sm font-bold text-gray-900 truncate">
                {user?.name || "กำลังโหลด..."}
              </p>
              <button
                onClick={() => navigate("/profile")}
                className="text-xs text-gray-500 hover:text-blue-500 flex items-center gap-1 mt-0.5"
              >
                <Edit3 className="w-3 h-3"
                
                /> แก้ไขโปรไฟล์
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Menu (Scrollable Pills) */}
        {/* ใช้ [&::-webkit-scrollbar]:hidden เพื่อซ่อน scrollbar แต่ยังปัดซ้ายขวาได้ */}
        <div className="flex overflow-x-auto gap-2 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            data-test="btn-profile-tab-profile"
            className={getMobileTabClass("/profile")}
            onClick={() => navigate("/profile")}
          >
            โปรไฟล์
          </button>
          <button
            className={getMobileTabClass("/address-profile")}
            onClick={() => navigate("/address-profile")}
          >
            จัดการที่อยู่
          </button>
          <button
          data-test="btn-profile-tab-password"
            className={getMobileTabClass("/change-password")}
            onClick={() => navigate("/change-password")}
          >
            รหัสผ่าน
          </button>
          <button
          data-test="btn-profile-tab-history"
            className={getMobileTabClass("/history-shop")}
            onClick={() => navigate("/history-shop")}
          >
            การซื้อของฉัน
          </button>
        </div>
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <aside className="hidden md:flex flex-col w-[260px] flex-shrink-0 gap-4">
        {/* Desktop Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center shrink-0">
            <User className="w-7 h-7 text-[#4285F4]" />
          </div>
          <div className="overflow-hidden flex-1">
            <p
              id="sidebar-text-fullname"
              className="font-bold text-gray-900 text-base truncate mb-1"
            >
              {user?.name || "กำลังโหลด..."}
            </p>
            <button
              id="sidebar-btn-edit-profile"
              className="text-gray-500 text-xs flex items-center gap-1.5 hover:text-[#4285F4] transition-colors font-medium"
              onClick={() => navigate("/profile")}
            >
              <Edit3 className="w-3.5 h-3.5 cursor-pointer"
                data-test="btn-edit-profile"
              /> แก้ไขโปรไฟล์
            </button>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
          <div className="mb-2">
            <button
              className="w-full flex items-center justify-between font-bold text-gray-800 text-sm p-3 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setIsDesktopProfileOpen(!isDesktopProfileOpen)}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span>บัญชีของฉัน</span>
              </div>
              {isDesktopProfileOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {isDesktopProfileOpen && (
              <ul className="space-y-1 mt-1 pl-6 pr-2 text-sm animate-in slide-in-from-top-2 fade-in duration-200">
                <li>
                  <button
                  data-test="btn-profile-menu-profile"
                    className={`${getDesktopMenuClass("/profile")} cursor-pointer`}
                    onClick={() => navigate("/profile")}
                  >
                    โปรไฟล์
                  </button>
                </li>
                <li>
                  <button
                    data-test="btn-profile-menu-address"
                    className={`${getDesktopMenuClass("/address-profile")} cursor-pointer`}
                    onClick={() => navigate("/address-profile")}
                  >
                    จัดการที่อยู่
                  </button>
                </li>
                <li>
                  <button
                    data-test="btn-profile-menu-password"
                    className={`${getDesktopMenuClass("/change-password")} cursor-pointer`}
                    onClick={() => navigate("/change-password")}
                  >
                    เปลี่ยนรหัสผ่าน
                  </button>
                </li>
              </ul>
            )}
          </div>

          <div className="pt-2 mt-2 border-t border-gray-100">
            <button
              data-test="click-history-shop"
              className={`w-full flex items-center gap-2 font-bold text-sm p-3 rounded-lg transition-colors ${
                isActive("/history-shop")
                  ? "bg-blue-50 text-[#4285F4]"
                  : "text-gray-800 hover:bg-gray-50 hover:text-[#4285F4]"
              }`}
              onClick={() => navigate("/history-shop")}
            >
              <ShoppingBag
                className={`w-4 h-4${isActive("/history-shop") ? "text-[#4285F4]" : "text-gray-500"}`}
              />
              <span className="cursor-pointer">การซื้อของฉัน</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ProfileSidebar;
