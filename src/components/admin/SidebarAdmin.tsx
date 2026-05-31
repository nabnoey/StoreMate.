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

function SidebarAdmin() {
  const navigate = useNavigate();

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
              onClick={() => navigate("/admin/dashboard")}
            >
              <LayoutDashboard size={18} />
              แดชบอร์ด
            </button>
          </li>

          <li>
            <button
              data-test="stock-button"
              className="cursor-pointer w-full text-left hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all"
              onClick={() => navigate("/moderator/stock")}
            >
              <TrendingUp size={18} />
              รายงานยอดขาย
            </button>
          </li>

          <li>
            <button
              data-test="stock-button"
              className="cursor-pointer w-full text-left hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all"
              onClick={() => navigate("/moderator/stock")}
            >
              <Package size={18} />
              จัดการสินค้าในคลัง
            </button>
          </li>

          <li>
            <button
              className="hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all"
              onClick={() => navigate("/moderator/orders?page=0&size=10")}
            >
              <Truck size={18} />
              จัดการคำสั่งซื้อ
            </button>
          </li>

          <li>
            <button
              className="hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all"
              onClick={() => navigate("/moderator/refund")}
            >
              <CircleDollarSign size={18} />
              จัดการคำขอคืนเงิน
            </button>
          </li>

          <li>
            <button
              className="hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all"
              onClick={() => navigate("/admin/user-edit")}
            >
              <Users size={18} />
              จัดการผู้ใช้
            </button>
          </li>

          <li>
            <button
              className="hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all"
              onClick={() => navigate("/admin/store-edit")}
            >
              <Settings size={18} />
              ตั้งค่าร้านค้า
            </button>
          </li>

          <li>
            <button
              className="hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all"
              // onClick={() => navigate("/admin/notify")}
              onClick={() => navigate("/admin/notification")}
            >
              <Bell size={18} />
              จัดการแจ้งเตือน
            </button>
          </li>
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
