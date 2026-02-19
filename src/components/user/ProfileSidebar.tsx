import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Edit3, ChevronDown, ChevronUp } from 'lucide-react';
import type { RootState } from '../../redux/store'; // แก้ Path ให้ตรงกับโปรเจกต์ของคุณ

const ProfileSidebar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  // State สำหรับ Dropdown มือถือ
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State สำหรับ Dropdown เมนู Desktop (ตั้งค่าเริ่มต้นให้เปิดไว้)
  const [isDesktopProfileOpen, setIsDesktopProfileOpen] = useState(true);

  // ฟังก์ชันเช็คว่าตอนนี้อยู่หน้าไหน เพื่อทำตัวหนังสือสีฟ้า
  const getMenuClass = (path: string) => {
    return location.pathname === path
      ? "text-[#4285F4] font-medium transition-colors block text-left w-full"
      : "text-gray-600 hover:text-blue-500 transition-colors block text-left w-full";
  };

  return (
    <>
      {/* =========================================
          MOBILE TOP NAV
      ========================================= */}
      <div className="md:hidden flex gap-2 relative z-20 mb-4">
        <div className="flex-1 bg-white rounded shadow-sm border border-gray-100 p-2.5 flex items-center justify-center gap-2">
          <User className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-bold text-gray-800 truncate">
            {user.firstName}
          </span>
          <button onClick={() => navigate("/profile")}>
            <Edit3 className="w-3.5 h-3.5 text-gray-600 hover:text-blue-500" />
          </button>
        </div>

        <div className="flex-[1.2] flex bg-white rounded shadow-sm border border-gray-100 text-xs font-bold relative">
          <button 
            className={`flex-1 flex items-center justify-center gap-1 rounded-l transition-colors ${isMobileMenuOpen ? 'bg-gray-200' : 'bg-gray-100'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            โปรไฟล์ของฉัน <span className="text-[10px] font-black">≡</span>
          </button>
          <button className="flex-1 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-r">
            การซื้อของฉัน
          </button>

          {isMobileMenuOpen && (
            <div className="absolute top-[110%] left-0 w-[140px] bg-white shadow-xl rounded border border-gray-200 py-1.5 z-50">
              <button className="block w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50" onClick={()=>navigate("/profile")}>โปรไฟล์</button>
              <button className="block w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50" onClick={()=>navigate("/address-profile")}>จัดการที่อยู่</button>
              <button className="block w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50" onClick={()=>navigate("/change-password")}>เปลี่ยนรหัสผ่าน</button>
            </div>
          )}
        </div>
      </div>

      {/* =========================================
          DESKTOP LEFT SIDEBAR
      ========================================= */}
      <aside className="hidden md:block w-[250px] flex-shrink-0 space-y-4">
        {/* Card 1: User Info */}
        <div className="bg-white rounded shadow-sm p-4 flex items-center gap-4">
           <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden shrink-0">
              {user.image ? (
                  <img id="sidebar-img-profile" src={user.image} alt="User" className="w-full h-full object-cover"/> 
              ) : (
                  <User className="w-6 h-6 text-gray-300" />
              )}
           </div>
           <div className="overflow-hidden">
             <p id="sidebar-text-fullname" className="font-bold text-gray-800 text-sm truncate mb-1">
               {user.firstName} {user.lastName} 
             </p>
             <button 
               id="sidebar-btn-edit-profile"
               className="text-gray-500 text-xs flex items-center gap-1.5 hover:text-blue-500 transition-colors"
               onClick={() => navigate("/profile")}
             >
               <Edit3 className="w-3.5 h-3.5" /> แก้ไขโปรไฟล์
             </button>
           </div>
        </div>

        {/* Card 2: Menu */}
        <div className="bg-white rounded shadow-sm py-4"> 
           <div className="px-5 mb-4">
             {/* ปุ่ม Dropdown สำหรับ Desktop */}
             <button 
               className="w-full flex items-center justify-between font-bold text-gray-800 text-sm mb-3 hover:text-blue-500 transition-colors"
               onClick={() => setIsDesktopProfileOpen(!isDesktopProfileOpen)}
             >
               <span>โปรไฟล์ของฉัน</span>
               {isDesktopProfileOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
             </button>

             {/* เนื้อหา Dropdown (จะแสดงเมื่อ isDesktopProfileOpen = true) */}
             {isDesktopProfileOpen && (
               <ul className="space-y-3 pl-4 text-sm animate-in slide-in-from-top-2 fade-in duration-200">
                 <li><button className={getMenuClass("/profile")} onClick={()=>navigate("/profile")}>โปรไฟล์</button></li>
                 <li><button className={getMenuClass("/address-profile")} onClick={()=>navigate("/address-profile")}>จัดการที่อยู่</button></li>
                 <li><button className={getMenuClass("/change-password")} onClick={()=>navigate("/change-password")}>เปลี่ยนรหัสผ่าน</button></li>
               </ul>
             )}
           </div>
           
           <div className="px-5 pt-4 border-t border-gray-100">
             <h3 className="font-bold text-gray-800 hover:text-blue-500 cursor-pointer text-sm">
                การซื้อของฉัน
             </h3>
           </div>
        </div>
      </aside>
    </>
  );
};

export default ProfileSidebar;