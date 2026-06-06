import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  LogOut,
  TrendingUp,
  Truck,
  CircleDollarSign,
  Bell,
  Store,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/auth/authReducer";
import { TokenService } from "../../services/token.service";
import { toast } from "react-hot-toast";
import type { RootState } from "../../redux/store";

function SidebarAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = Array.isArray(user?.roles)
    ? user.roles.some(
        (role: any) => role === "ADMIN" || role?.roleName === "ADMIN",
      )
    : false;

  const getMenuClass = (paths: string[]) => {
    const isActive = paths.some((path) => location.pathname === path);
    const baseClass =
      "cursor-pointer w-full text-left flex items-center gap-3 px-4 py-2.5 text-[15px] font-medium rounded-lg transition-all";
    return isActive
      ? `${baseClass} bg-blue-50 text-blue-600 font-semibold`
      : `${baseClass} text-gray-700 hover:bg-gray-50 hover:text-blue-600`;
  };

  const handleLogout = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 items-center p-2">
          <span className="text-gray-800 font-medium text-base">
            คุณต้องการออกจากระบบใช่หรือไม่?
          </span>
          <div className="flex gap-3 mt-2">
            <button
              data-test="btn-confirm-logout-admin"
              type="button"
              onClick={() => {
                toast.dismiss(t.id);
                TokenService.removeToken();
                dispatch(logout());

                toast.dismiss();
                toast.success("ออกจากระบบสำเร็จ");
                navigate("/login");
              }}
              className="cursor-pointer px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              ออกจากระบบ
            </button>
            <button
              data-test="btn-cancel-logout-admin"
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors border border-gray-200"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        id: "logout-confirm",
      },
    );
  };

  return (
    <div className="w-72 h-screen sticky top-0 bg-[#ffffff] text-black p-4 flex flex-col justify-between border-r border-gray-200 print:hidden overflow-y-auto">
      <div>
        <div className="flex flex-col items-center justify-center mt-2">
          <img
            src={logo}
            className="w-40 h-40 object-contain"
            alt="Logo"
            data-test="logo"
          />
        </div>

        <ul className="menu rounded-box gap-1 px-0">
          <li>
            <button
              data-test="dashboard-button"
              className={getMenuClass(["/admin/dashboard"])}
              onClick={() => navigate("/admin/dashboard")}
            >
              <LayoutDashboard size={18} />
              แดชบอร์ด
            </button>
          </li>

          <li>
            <button
              data-test="stock-button"
              className={getMenuClass(["/admin/stock", "/moderator/stock"])}
              onClick={() =>
                navigate(isAdmin ? "/admin/stock" : "/moderator/stock")
              }
            >
              <TrendingUp size={18} />
              รายงานยอดขาย
            </button>
          </li>

          <li>
            <button
              data-test="stock-button"
              className={getMenuClass(["/admin/stock", "/moderator/stock"])}
              onClick={() =>
                navigate("/moderator/stock")
              }
            >
              <Package size={18} />
              จัดการสินค้าในคลัง
            </button>
          </li>

          <li>
            <button
              className={getMenuClass([
                "/admin/ordersMod",
                "/moderator/ordersMod",
              ])}
              onClick={() =>
                navigate(isAdmin ? "/admin/orders" : "/moderator/orders")
              }
            >
              <Truck size={18} />
              จัดการคำสั่งซื้อ
            </button>
          </li>

          <li>
            <button
              className={getMenuClass(["/admin/refund", "/moderator/refund"])}
              onClick={() =>
                navigate(isAdmin ? "/admin/refund" : "/moderator/refund")
              }
            >
              <CircleDollarSign size={18} />
              จัดการคำขอคืนเงิน
            </button>
          </li>

          {isAdmin && (
            <>
              <li>
                <button
                  className={getMenuClass(["/admin/user-edit"])}
                  onClick={() => navigate("/admin/user-edit")}
                >
                  <Users size={18} />
                  จัดการผู้ใช้
                </button>
              </li>

              <li>
                <button
                  className={getMenuClass(["/admin/store-edit"])}
                  onClick={() => navigate("/admin/store-edit")}
                >
                  <Settings size={18} />
                  ตั้งค่าร้านค้า
                </button>
              </li>

              <li>
                <button
                  className={getMenuClass([
                    "/admin/notification",
                    "/moderator/notification",
                  ])}
                  onClick={() =>
                    navigate(
                      isAdmin
                        ? "/admin/notification"
                        : "/moderator/notification",
                    )
                  }
                >
                  <Bell size={18} />
                  จัดการแจ้งเตือน
                </button>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="border-t border-gray-100 pt-4 flex flex-col gap-1">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
              {user?.image_url || user?.image ? (
                <img
                  src={user.image_url || user.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Users size={20} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="font-medium text-sm text-gray-900 truncate">
              {user?.name || user?.email?.split("@")[0] || "กำลังโหลด..."}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || "กำลังโหลด..."}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="cursor-pointer flex items-center gap-3 px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-all w-full text-left"
        >
          <Store size={18} />
          หน้าหลักร้านค้า
        </button>

        <button
          onClick={handleLogout}
          data-test="logout-button"
          className="cursor-pointer flex items-center gap-3 px-4 py-2.5 text-[15px] font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all w-full text-left"
        >
          <LogOut size={18} />
          ลงชื่อออกจากระบบ
        </button>
      </div>
    </div>
  );
}

export default SidebarAdmin;
