import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import logo from "../../assets/logo.png"
import { useNavigate } from "react-router-dom";


function SidebarAdmin() {
  const navigate = useNavigate();


  return (
    <div className="w-72 h-screen bg-[#ffffff] text-black  p-4 flex flex-col">
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
        

        <h1 className="font-medium   mt-8 text-[30px] leading-none ">Owner</h1>
          </div>
          
        </div>

        {/* MENU */}
        <ul className="menu rounded-box gap-3">

      <li>
    <a className="hover:bg-blue-100 
     hover:text-blue-600 rounded-lg transition-all -mt-7.5" onClick={()=>navigate("/admin/dashboard")}>
      <LayoutDashboard size={18}/>
      แดชบอร์ด
    </a>
  </li>

 <li>
    <div className="hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all" onClick={() => navigate("/admin/stock")}>
      <Package size={18}/>
      จัดการสินค้าในคลัง
    </div>
  </li>

  <li>
    <div className="hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all" onClick={() => navigate("/admin/orders")}>
      <ShoppingCart size={18}/>
      จัดการคำสั่งซื้อ
    </div>
  </li>

  <li>
    <div className="hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all" onClick={() => navigate("/admin/user-edit")}>
      <Users size={18}/>
      จัดการผู้ใช้
    </div>
  </li>

  <li>
    <div className="hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all" onClick={()=>navigate("/admin/store-edit")}>
      <Settings size={18}/>
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
        <img src="https://i.pravatar.cc/100" />
      </div>
    </div>
    <div>
      <p className="font-medium text-sm">สุดหล่อ มากเสน่ห์</p>
      <p className="text-xs text-gray-500">aom@gmail.com</p>
    </div>
  </div>

  <button className="btn btn-ghost hover:bg-blue-100 hover:text-blue-600 w-full justify-start text-gray-600 border-amber-50">
    <LogOut size={18} />
    ออกจากระบบ
  </button>
</div>
    </div>
  );
}

export default SidebarAdmin;
