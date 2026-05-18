import { useState } from "react";
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

  const [isDesktopProfileOpen, setIsDesktopProfileOpen] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  const getDesktopMenuClass = (path: string) => {
    return isActive(path)
      ? "flex items-center gap-2 px-4 py-2 text-[#4285F4] font-medium transition-all rounded-md w-full text-left"
      : "flex items-center gap-2 px-4 py-2 text-black font-medium hover:text-[#4285F4] transition-all rounded-md w-full text-left";
  };

  return (
    <div className="flex flex-col gap-4 font-['Anuphan'] w-full md:w-auto">
      <div className="md:hidden w-full bg-[#F9FAFB] border border-gray-200 rounded-md shadow-sm py-2">
        <div className="flex flex-col">
          <button
            onClick={() => navigate("/address-profile")}
            className={`w-full text-left px-4 py-3 text-[14px] font-medium transition-colors ${
              isActive("/address-profile") ? "text-[#4285F4]" : "text-gray-800"
            }`}
          >
            จัดการที่อยู่
          </button>
          <button
            onClick={() => navigate("/change-password")}
            className={`w-full text-left px-4 py-3 text-[14px] font-medium transition-colors ${
              isActive("/change-password") ? "text-[#4285F4]" : "text-gray-800"
            }`}
          >
            เปลี่ยนรหัสผ่าน
          </button>
          <Link
            to={`/orders?status=${status}`}
            className={`block w-full text-left px-4 py-3 text-[14px] font-medium transition-colors ${
              isActive("/orders") || isActive("/history-shop")
                ? "text-[#4285F4]"
                : "text-gray-800"
            }`}
          >
            การซื้อของฉัน
          </Link>
        </div>
      </div>

      <aside className="hidden md:flex flex-col w-[260px] shrink-0 gap-4">
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
