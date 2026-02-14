import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Edit3, X, Camera, ClipboardList, MapPin, KeyRound } from 'lucide-react';
import { updateProfile } from '../../redux/auth/action';
import type { RootState } from '../../redux/store';

// --- Component Modal (หน้าต่างเด้ง) ---
interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
  elementId: string;
}

const EditModal = ({ isOpen, title, onClose, onSave, children, elementId }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div 
        id={`modal-overlay-${elementId}`} 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div 
        id={`modal-content-${elementId}`}
        className="bg-white rounded-lg shadow-xl w-[500px] p-6 animate-fade-in-up"
      >
        <div className="flex items-center justify-between mb-6">
            <h3 id={`modal-title-${elementId}`} className="text-xl font-normal text-gray-800">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
        </div>
        
        <div className="space-y-6 py-2">
            {children}
        </div>

        <div className="flex justify-end gap-3 mt-8">
           <button 
            id={`btn-save-${elementId}`}
            onClick={onSave} 
            className="bg-[#26c195] hover:bg-[#1fa17d] text-white px-8 py-2 rounded shadow-sm text-sm"
          >
            บันทึกข้อมูล
          </button>
          <button 
            id={`btn-cancel-${elementId}`}
            onClick={onClose} 
            className="border border-gray-200 text-gray-500 hover:bg-gray-50 px-8 py-2 rounded text-sm"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [activeModal, setActiveModal] = useState<'name' | 'email' | 'phone' | null>(null);
  
  const [tempData, setTempData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const openModal = (type: 'name' | 'email' | 'phone') => {
    setTempData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone
    });
    setActiveModal(type);
  };

  const handleSave = () => {
    if (activeModal === 'name') {
      dispatch(updateProfile({ firstName: tempData.firstName, lastName: tempData.lastName }));
    } else if (activeModal === 'email') {
      dispatch(updateProfile({ email: tempData.email }));
    } else if (activeModal === 'phone') {
      dispatch(updateProfile({ phone: tempData.phone }));
    }
    setActiveModal(null);
  };

  return (
<div className="min-h-screen bg-white font-sans text-gray-950 pt-12 pb-20">
      
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row gap-6">
        
        {/* === LEFT SIDEBAR === */}
        <aside className="w-full md:w-[250px] flex-shrink-0 space-y-4">
          
          {/* Card 1: User Info (กรอบบนซ้าย) */}
          <div className="bg-white rounded-sm shadow-sm p-4 flex items-center gap-3 border-b md:border-none">
             <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300 overflow-hidden shrink-0">
                {user.image ? (
                    <img id="sidebar-img-profile" src={user.image} alt="User" className="w-full h-full object-cover"/> 
                ) : (
                    <User className="w-6 h-6 text-gray-400" />
                )}
             </div>
             <div className="overflow-hidden">
               <p id="sidebar-text-fullname" className="font-semibold text-gray-800 text-sm truncate mb-0.5">
                 {user.firstName}
               </p>
               <button 
                 id="sidebar-btn-edit-profile"
                 className="text-gray-500 text-xs flex items-center gap-1 hover:text-blue-500"
               >
                 <Edit3 className="w-3 h-3" /> แก้ไขโปรไฟล์
               </button>
             </div>
          </div>

          {/* Card 2: Menu (กรอบล่างซ้าย) */}
          <div className="bg-white rounded-sm shadow-sm hidden md:block"> 
             <div className="py-2">
               <div className="px-4 py-2">
                 <h3 className="flex items-center gap-3 font-medium text-gray-800">
                   <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                     <User className="w-3.5 h-3.5 text-blue-500" />
                   </div>
                   บัญชีของฉัน
                 </h3>
                 <ul className="mt-2 space-y-3 pl-10 text-sm">
                   <li><a id="menu-profile" href="#" className="text-blue-500 font-medium block">โปรไฟล์</a></li>
                   <li><a id="menu-address" href="#" className="text-gray-500 hover:text-blue-500 transition-colors block">จัดการที่อยู่</a></li>
                   <li><a id="menu-password" href="#" className="text-gray-500 hover:text-blue-500 transition-colors block">เปลี่ยนรหัสผ่าน</a></li>
                 </ul>
               </div>
               
               <div className="px-4 py-2 mt-2">
                 <h3 className="flex items-center gap-3 font-medium text-gray-500 hover:text-gray-800 cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                        <ClipboardList className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                    การซื้อของฉัน
                 </h3>
               </div>
             </div>
          </div>
        </aside>

        {/* === RIGHT CONTENT (กรอบใหญ่ขวา) === */}
        <main className="flex-1 bg-white rounded-sm shadow-sm p-8 relative min-h-[500px]">
          
          <div className="border-b border-gray-100 pb-4 mb-8">
            <h1 className="text-lg font-medium text-gray-800">ข้อมูลของฉัน</h1>
            <p className="text-sm text-gray-500 mt-1">จัดการข้อมูลส่วนตัวคุณเพื่อความปลอดภัยของบัญชีผู้ใช้นี้</p>
          </div>

          <div className="flex flex-col-reverse md:flex-row gap-8">
            
            {/* --- Left Form Section --- */}
            <div className="flex-1 space-y-7 pr-4">
              
              {/* Row: Name */}
              <div className="flex items-center">
                <label className="w-32 md:w-40 text-right text-gray-500 text-sm mr-6">ชื่อ - นามสกุล</label>
                <div className="flex-1 text-gray-900 font-normal text-sm flex items-center">
                    <span id="text-display-fullname" className="mr-4">{user.firstName} {user.lastName}</span>
                    <button 
                        id="btn-edit-name"
                        onClick={() => openModal('name')} 
                        className="text-[#4a90e2] hover:underline text-xs"
                    >
                        เปลี่ยน
                    </button>
                </div>
              </div>

              {/* Row: Email */}
              <div className="flex items-center">
                <label className="w-32 md:w-40 text-right text-gray-500 text-sm mr-6">อีเมล</label>
                <div className="flex-1 text-gray-900 font-normal text-sm flex items-center">
                    {/* Masking Email for display similar to image */}
                    <span id="text-display-email" className="mr-4">
                        {user.email.replace(/(.{4})(.*)(@.*)/, "$1******$3")}
                    </span>
                    <button 
                        id="btn-edit-email"
                        onClick={() => openModal('email')} 
                        className="text-[#4a90e2] hover:underline text-xs"
                    >
                        เปลี่ยน
                    </button>
                    
                </div>
              </div>

               {/* Row: Phone */}
              <div className="flex items-center">
                <label className="w-32 md:w-40 text-right text-gray-500 text-sm mr-6">หมายเลขโทรศัพท์</label>
                <div className="flex-1 text-gray-900 font-normal text-sm flex items-center">
                    <span id="text-display-phone" className="mr-4">
                        {/* Regex อธิบาย:
                           ^(.{2}) = เก็บ 2 ตัวแรกไว้ ($1)
                           (.*)    = ตรงกลาง (จะถูกแทนที่ด้วยดอกจัน)
                           (.{2})$ = เก็บ 2 ตัวสุดท้ายไว้ ($3)
                        */}
                        {user.phone.replace(/^(.*)(.*)(.{2})$/, "********$3")}
                    </span>
                    <button 
                        id="btn-edit-phone"
                        onClick={() => openModal('phone')} 
                        className="text-[#4a90e2] hover:underline text-xs"
                    >
                        เปลี่ยน
                    </button>
                </div>
              </div>

              {/* Row: Date */}
              <div className="flex items-center">
                 <label className="w-32 md:w-40 text-right text-gray-500 text-sm mr-6">วันที่สมัคร</label>
                 <div className="flex-1 text-gray-900 font-normal text-sm flex items-center">
                    <span id="text-display-joindate" className="mr-4">{user.joinDate}</span>
                 </div>
              </div>
              
              {/* Main Save Button */}
              <div className="flex items-center mt-10 pt-4">
                 <div className="w-32 md:w-40 mr-6"></div>
                 <button 
                    id="btn-main-save"
                    className="bg-[#26c195] hover:bg-[#1fa17d] text-white px-6 py-2.5 rounded text-sm shadow-sm min-w-[100px]"
                 >
                    บันทึกข้อมูล
                 </button>
              </div>

            </div>

            {/* --- Right Image Section --- */}
            {/* Vertical Divider */}
            <div className="hidden md:block w-[1px] bg-gray-200"></div>

            <div className="flex flex-col items-center justify-start pt-2 gap-5 md:w-72">
               <div className="w-28 h-28 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden">
                  {user.image ? (
                    <img id="img-profile-main" src={user.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-300 stroke-[1.5]" />
                  )}
               </div>
               
               <button 
                id="btn-upload-image"
                className="border border-gray-200 bg-white px-5 py-2 text-sm text-gray-600 rounded-sm hover:bg-gray-50 transition-colors shadow-sm"
               >
                 เลือกรูป
               </button>

               <div className="text-xs text-gray-400 text-center space-y-1">
                 <p>ขนาดไฟล์: สูงสุด 1 MB</p>
                 <p>ไฟล์ที่รองรับ: .JPEG, .PNG</p>
               </div>
            </div>

          </div>
        </main>
      </div>

      {/* --- Modals (Keep Hidden Logic) --- */}

      {/* 1. Modal แก้ไขชื่อ */}
      <EditModal 
        elementId="name-modal" 
        isOpen={activeModal === 'name'} 
        title="เปลี่ยน ชื่อ - นามสกุล" 
        onClose={() => setActiveModal(null)} 
        onSave={handleSave}
      >
         <div className="space-y-4">
             <div>
                <label className="text-sm text-gray-500 mb-2 block">ชื่อ</label>
                <input 
                    id="input-firstname"
                    type="text" 
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-[#26c195] text-sm"
                    value={tempData.firstName} 
                    onChange={e => setTempData({...tempData, firstName: e.target.value})} 
                />
             </div>
             <div>
                <label className="text-sm text-gray-500 mb-2 block">นามสกุล</label>
                <input 
                    id="input-lastname"
                    type="text" 
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-[#26c195] text-sm"
                    value={tempData.lastName} 
                    onChange={e => setTempData({...tempData, lastName: e.target.value})} 
                />
             </div>
         </div>
      </EditModal>

      {/* 2. Modal แก้ไขอีเมล */}
      <EditModal 
        elementId="email-modal"
        isOpen={activeModal === 'email'} 
        title="เปลี่ยนอีเมล" 
        onClose={() => setActiveModal(null)} 
        onSave={handleSave}
      >
         <div>
            <label className="text-sm text-gray-500 mb-2 block">อีเมล</label>
            <input 
                id="input-email"
                type="email" 
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-[#26c195] text-sm"
                value={tempData.email} 
                onChange={e => setTempData({...tempData, email: e.target.value})} 
            />
         </div>
      </EditModal>

      {/* 3. Modal แก้ไขเบอร์โทร */}
      <EditModal 
        elementId="phone-modal"
        isOpen={activeModal === 'phone'} 
        title="เปลี่ยนเบอร์โทร" 
        onClose={() => setActiveModal(null)} 
        onSave={handleSave}
      >
         <div>
            <label className="text-sm text-gray-500 mb-2 block">เบอร์โทร</label>
            <input 
                id="input-phone"
                type="text" 
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-[#26c195] text-sm"
                value={tempData.phone} 
                onChange={e => setTempData({...tempData, phone: e.target.value})} 
            />
         </div>
      </EditModal>

    </div>
  );
};

export default Profile;