import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, X } from 'lucide-react'; 
import { updateProfile } from '../../redux/auth/action';
import type { RootState } from '../../redux/store';
import ProfileSidebar from '../../components/user/ProfileSidebar';

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
            <h3 id={`modal-title-${elementId}`} className="text-xl font-normal text-black">{title}</h3>
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

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [tempData, setTempData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
  });

  const openModal = (field: string) => {
    setActiveModal(field);
  };

  const handleSave = () => {
    // อัพเดตข้อมูลใน Redux
    dispatch(updateProfile(tempData));
    setActiveModal(null);
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-950 pt-12 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row gap-6">
        
        {/* 1. เรียกใช้ Sidebar Component ตรงนี้แทน <aside> ของเดิม */}
        <ProfileSidebar />

        {/* === RIGHT CONTENT (กรอบใหญ่ขวา) === */}
        <main className="flex-1 bg-white rounded-sm shadow-sm border border-gray-100 p-8 relative min-h-[500px]">
          
         <div className="border-b border-gray-100 pb-4 mb-8">
            <h1 className="text-lg font-medium text-black">ข้อมูลของฉัน</h1>
            <p className="text-sm text-black mt-1">จัดการข้อมูลส่วนตัวคุณเพื่อความปลอดภัยของบัญชีผู้ใช้นี้</p>
          </div>

          <div className="flex flex-col-reverse md:flex-row gap-8">
            
            {/* --- Left Form Section --- */}
            <div className="flex-1 space-y-7 pr-4">
              
              {/* Row: Name */}
              <div className="flex items-center">
                <label className="w-32 md:w-40 text-right text-black text-sm mr-6">ชื่อ - นามสกุล</label>
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
                <label className="w-32 md:w-40 text-right text-black text-sm mr-6">อีเมล</label>
                <div className="flex-1 text-gray-900 font-normal text-sm flex items-center">
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
                <label className="w-32 md:w-40 text-right text-black text-sm mr-6">หมายเลขโทรศัพท์</label>
                <div className="flex-1 text-gray-900 font-normal text-sm flex items-center">
                    <span id="text-display-phone" className="mr-4">
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
                 <label className="w-32 md:w-40 text-right text-black text-sm mr-6">วันที่สมัคร</label>
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
                className="border border-gray-200 bg-white px-5 py-2 text-sm text-black rounded-sm hover:bg-gray-50 transition-colors shadow-sm"
               >
                 เลือกรูป
               </button>

               <div className="text-xs text-black text-center space-y-1">
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