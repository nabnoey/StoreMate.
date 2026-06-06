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
} from "lucide-react";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/auth/authReducer";
import { TokenService } from "../../services/token.service";
import { toast } from "react-hot-toast";
import type { RootState } from "../../redux/store";

function SidebarAdmin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = Array.isArray(user?.roles)
    ? user.roles.some(
        (role: any) => role === "ADMIN" || role?.roleName === "ADMIN",
      )
    : false;

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
    <div className="w-72 h-screen bg-[#ffffff] text-black p-4 flex flex-col justify-between border-r border-[#6B7280] print:hidden">
      {/* TOP */}
      <div>
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-6 text-center">
          <div className="avatar">
            <button onClick={() => navigate("/")}>
              <img
                src={logo}
                className="w-27 lg:w-38 cursor-pointer mt-5 -ml-8 lg:mt-5 cursor-pointer"
                alt="Logo"
                data-test="logo"
              />
            </button>

            <h1 className="font-medium   mt-8 text-[30px] leading-none ">
              Owner
            </h1>
          </div>
        </div>

        {/* MENU */}
        <ul className="menu rounded-box gap-3">
          <li>
            <button
              data-test="dashboard-button"
              className="cursor-pointer w-full text-left hover:bg-blue-100 
     hover:text-blue-600 rounded-lg transition-all -mt-7.5"
              onClick={() => navigate("/owner/dashboard")}
            >
              <LayoutDashboard size={18} />
              แดชบอร์ด
            </button>
          </li>

          <li>
            <button
              data-test="stock-button"
              className="cursor-pointer w-full text-left hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all"
              onClick={() =>
                navigate(isAdmin ? "/owner/stock" : "/moderator/stock")
              }
            >
              <TrendingUp size={18} />
              รายงานยอดขาย
            </button>
          </li>

          <li>
            <button
              data-test="stock-button"
              className="cursor-pointer w-full text-left hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all"
              onClick={() =>
                navigate(isAdmin ? "/owner/stock" : "/moderator/stock")
              }
            >
              <Package size={18} />
              จัดการสินค้าในคลัง
            </button>
          </li>

          <li>
            <button
              className="hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all"
              onClick={() =>
                navigate(isAdmin ? "/owner/ordersMod" : "/moderator/ordersMod")
              }
            >
              <Truck size={18} />
              จัดการคำสั่งซื้อ
            </button>
          </li>

          <li>
            <button
              className="hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all"
              onClick={() =>
                navigate(isAdmin ? "/owner/refund" : "/moderator/refund")
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
                  className="hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all"
                  onClick={() => navigate("/owner/user-edit")}
                >
                  <Users size={18} />
                  จัดการผู้ใช้
                </button>
              </li>

              <li>
                <button
                  className="hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all"
                  onClick={() => navigate("/owner/store-edit")}
                >
                  <Settings size={18} />
                  ตั้งค่าร้านค้า
                </button>
              </li>

              <li>
                <button
                  className="hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all"
                  // onClick={() => navigate("/owner/notify")}
                  onClick={() => navigate("/owner/notification")}
                >
                  <Bell size={18} />
                  จัดการแจ้งเตือน
                </button>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* BOTTOM USER */}
      <div className="border-t pt-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src="https://i.pravatar.cc/100" alt="bottom user" />
            </div>
          </div>
          <div>
            <p className="font-medium text-sm">สุดหล่อ มากเสน่ห์</p>
            <p className="text-xs text-gray-500">aom@gmail.com</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          data-test="logout-button"
          className=" cursor-pointer btn btn-ghost hover:bg-blue-100 hover:text-blue-600 w-full justify-start text-gray-600 border-amber-50"
        >
          <LogOut size={18} />
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
}

export default SidebarAdmin;
