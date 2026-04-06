import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

function SidebarAdmin() {
  const navigate = useNavigate();

  return (
    <div className="w-72 h-screen bg-[#ffffff] text-black  p-4 flex flex-col">
      {/* TOP */}
      <div>
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-6 text-center">
          <div className="flex flex-col items-center justify-center w-full mb-6 text-center">
  <button onClick={() => navigate("/")}>
    <img
      src={logo}
      className="w-[81px] lg:w-38 mt-5 lg:mt-2 cursor-pointer"
      alt="Logo"
      data-test="logo"
    />
  </button>
</div>
        </div>

        {/* MENU */}
        <ul className="menu rounded-box gap-3 -mt-10">
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
            <div
              className="hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all"
              onClick={() => navigate("/admin/stock")}
            >
              <Package size={18} />
              รายงานยอดขาย
            </div>
          </li>

          <li>
            <button
              data-test="stock-button"
              className="cursor-pointer w-full text-left hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all"
              onClick={() => navigate("/admin/stock")}
            >
              <Package size={18} />
              จัดการสินค้าในคลัง
            </button>
          </li>
      

          <li>
            <div
              className="hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all"
              onClick={() => navigate("/admin/orders")}
            >
              <ShoppingCart size={18} />
              จัดการคำสั่งซื้อ
            </div>
          </li>

          <li>
            <div
              className="hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all"
              onClick={() => navigate("/admin/user-edit")}
            >
              <Users size={18} />
              จัดการผู้ใช้
            </div>
          </li>

          <li>
            <div
              className="hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all"
              onClick={() => navigate("/admin/store-edit")}
            >
              <Settings size={18} />
              ตั้งค่าร้านค้า
            </div>
          </li>
        </ul>
      </div>

      {/* BOTTOM USER */}
      <div className="border-t pt-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src="https://i.pinimg.com/736x/48/ba/96/48ba960bbe24be9b33a363629dda7ee1.jpg" />
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
