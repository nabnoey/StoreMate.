import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useNavigate,
  useLocation,
  Link,
  useSearchParams,
} from "react-router-dom";
import { Icon } from "@iconify/react";
import type { RootState } from "../../redux/store";

const ProfileSidebar = () => {
  const user = useSelector((state: RootState) => state?.auth?.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const status: string = searchParams.get("status") || "ALL";

  // State สำหรับ Desktop Menu (แบบพับขึ้นลง)
  const [isDesktopProfileOpen, setIsDesktopProfileOpen] = useState(true);

  // State สำหรับ Mobile Dropdown
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  // ฟังก์ชันเช็คว่าหน้าปัจจุบันตรงกับ URL นี้ไหม
  const isActive = (path: string) => location.pathname === path;

  // ปิด Mobile Dropdown เมื่อคลิกที่อื่น (Click Outside)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMobileProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // สไตล์สำหรับเมนู Desktop
  const getDesktopMenuClass = (path: string) => {
    return isActive(path)
      ? "flex items-center gap-2 px-4 py-2 text-[#4285F4] font-medium transition-all rounded-md w-full text-left"
      : "flex items-center gap-2 px-4 py-2 text-black font-medium hover:text-[#4285F4] transition-all rounded-md w-full text-left";
  };

  return (
    <div className="flex flex-col gap-4 font-['Anuphan'] w-full md:w-auto">
      {/* ================= MOBILE VIEW ================= */}
      {/* 🔴 แก้ไข z-50 เป็น z-10 เพื่อไม่ให้ไปทับ Dropdown จาก Header */}
      <div className="md:hidden mt-2 relative z-10 w-full">
        <div className="flex flex-wrap items-center gap-2 w-full">
          {/* กล่องที่ 1: ชื่อโปรไฟล์ */}
          <div className="flex-1 min-w-[160px] max-w-full bg-white rounded-lg shadow-sm border border-gray-100 px-3 py-2.5 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
              {user?.image_url || user?.image ? (
                <img
                  src={user.image_url || user.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Icon
                  icon="ph:user"
                  width="16"
                  height="16"
                  className="text-gray-500"
                />
              )}
            </div>
            <span className="text-sm font-normal text-gray-800 truncate flex-1">
              {user?.name || "กำลังโหลด..."}
            </span>
            <button
              onClick={() => navigate("/profile")}
              className="cursor-pointer shrink-0 ml-1"
            >
              <Icon
                icon="ph:pencil-simple"
                width="16"
                height="16"
                className="text-gray-800"
              />
            </button>
          </div>

          {/* กล่องที่ 2: โปรไฟล์ของฉัน (Dropdown) */}
          <div className="relative shrink-0" ref={mobileDropdownRef}>
            <button
              onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
              className={`rounded-lg px-3 py-2.5 flex items-center gap-1.5 text-sm transition-colors shadow-sm border border-gray-100 cursor-pointer ${
                isMobileProfileOpen
                  ? "bg-gray-200 text-gray-800"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              }`}
            >
              โปรไฟล์ของฉัน
              <Icon
                icon="ic:round-menu"
                width="18"
                height="18"
                className="text-gray-800"
              />
            </button>

            {/* Dropdown Menu */}
            {isMobileProfileOpen && (
              /* 🔴 แก้ไข z-50 เป็น z-20 ให้อยู่เหนือเนื้อหาในหน้าตัวเอง แต่ต่ำกว่า Header */
              <div className="absolute left-0 top-full mt-2 w-[160px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-50 py-2 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-100 z-20">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsMobileProfileOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                    isActive("/profile")
                      ? "text-[#4285F4]"
                      : "text-[#374151] hover:bg-gray-50"
                  }`}
                >
                  โปรไฟล์
                </button>
                <button
                  onClick={() => {
                    navigate("/address-profile");
                    setIsMobileProfileOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                    isActive("/address-profile")
                      ? "text-[#4285F4]"
                      : "text-[#374151] hover:bg-gray-50"
                  }`}
                >
                  จัดการที่อยู่
                </button>
                <button
                  onClick={() => {
                    navigate("/change-password");
                    setIsMobileProfileOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                    isActive("/change-password")
                      ? "text-[#4285F4]"
                      : "text-[#374151] hover:bg-gray-50"
                  }`}
                >
                  เปลี่ยนรหัสผ่าน
                </button>
              </div>
            )}
          </div>

          {/* กล่องที่ 3: การซื้อของฉัน */}
          <Link
            to={`/orders?status=${status}`}
            className={`shrink-0 rounded-lg px-3 py-2.5 text-sm transition-colors shadow-sm border border-gray-100 whitespace-nowrap cursor-pointer ${
              isActive("/orders") || isActive("/history-shop")
                ? "bg-white text-[#4285F4]"
                : "bg-white text-gray-800 hover:text-[#4285F4]"
            }`}
          >
            การซื้อของฉัน
          </Link>
        </div>
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <aside className="hidden md:flex flex-col w-[260px] shrink-0 gap-4">
        {/* Desktop Profile Card */}
        <div className="bg-[#F3F4F6] rounded-xl shadow-md border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-14 h-14 bg-[#F3F4F6] overflow-hidden border border-gray-200 rounded-full flex items-center justify-center shrink-0">
            {user?.image_url || user?.image ? (
              <img
                src={user.image_url || user.image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <Icon
                icon="ph:user"
                width="28"
                height="28"
                className="text-gray-500"
              />
            )}
          </div>
          <div className="overflow-hidden flex-1">
            <p
              id="sidebar-text-name"
              className="font-medium text-black text-base truncate mb-1"
            >
              {user?.name || "กำลังโหลด..."}
            </p>
            <div className="flex items-center gap-1">
              <Icon
                icon="ph:pencil-simple"
                width="14"
                height="14"
                className="cursor-pointer"
                data-test="btn-edit-profile"
              />
              <button
                data-test="btn-edit-profile-mobile"
                className="cursor-pointer text-black text-xs flex items-center gap-1.5 transition-colors font-medium hover:text-[#4285F4]"
                onClick={() => navigate("/profile")}
              >
                แก้ไขโปรไฟล์
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="bg-[#F3F4F6] rounded-xl shadow-md border border-gray-100 p-3">
          <div className="mb-2">
            <button
              className="w-full flex items-center justify-between font-medium text-black text-base p-3 rounded-lg hover:text-[#4285F4] transition-colors cursor-pointer"
              onClick={() => setIsDesktopProfileOpen(!isDesktopProfileOpen)}
            >
              <div
                data-test="btn-profile-menu-toggle"
                className="flex items-center gap-2"
              >
                <span>โปรไฟล์ของฉัน</span>
              </div>
              {isDesktopProfileOpen ? (
                <Icon
                  icon="ph:chevron-up"
                  width="16"
                  height="16"
                  className="text-black"
                />
              ) : (
                <Icon
                  icon="ph:chevron-down"
                  width="16"
                  height="16"
                  className="text-black"
                />
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

          <div className="pt-2 mt-2">
            <Link
              data-test="btn-profile-menu-history"
              to={`/orders?status=${status}`}
              className={`cursor-pointer w-full flex items-center gap-2 font-medium text-base p-3 transition-colors rounded-lg ${
                isActive("/orders")
                  ? "text-[#4285F4]"
                  : "text-black hover:text-[#4285F4]"
              }`}
            >
              การซื้อของฉัน
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ProfileSidebar;