// src/pages/Profile/Profile.tsx
import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User } from 'lucide-react'; 
import Swal from 'sweetalert2'; // <-- Import SweetAlert2
import { updateProfile } from '../../redux/auth/action';
import type { RootState } from '../../redux/store';
import ProfileSidebar from '../../components/user/ProfileSidebar';

// --- Component Modal ---
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div 
        id={`modal-content-${elementId}`}
        className="bg-white rounded-lg shadow-xl w-full max-w-[400px] sm:max-w-[500px] p-5 sm:p-6 animate-fade-in-up"
      >
        <div className="flex items-center justify-between mb-6">
            <h3 id={`modal-title-${elementId}`} className="text-lg sm:text-xl font-bold text-gray-800">{title}</h3>
        </div>
        
        <div className="space-y-5 py-2">
            {children}
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8">
          <button 
            id={`btn-cancel-modal-${elementId}`}
            onClick={onClose} 
            className="w-full sm:w-auto border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
          >
            ยกเลิก
          </button>
          <button 
            id={`btn-save-modal-${elementId}`}
            onClick={onSave} 
            className="w-full sm:w-auto bg-[#26c195] hover:bg-[#1fa17d] text-white px-8 py-2.5 rounded-md shadow-sm text-sm font-medium transition-colors"
          >
            บันทึกข้อมูล
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tempData, setTempData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    image: user.image || '',
  });

  const openModal = (field: string) => {
    setActiveModal(field);
  };

  const validateData = () => {
    if (!tempData.firstName.trim() || !tempData.lastName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณากรอกชื่อและนามสกุลให้ครบถ้วน',
        confirmButtonColor: '#26c195'
      });
      return false; 
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(tempData.email)) {
      Swal.fire({
        icon: 'warning',
        title: 'อีเมลไม่ถูกต้อง',
        text: 'รูปแบบอีเมลไม่ถูกต้อง',
        confirmButtonColor: '#26c195'
      });
      return false; 
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(tempData.phone)) {
      Swal.fire({
        icon: 'warning',
        title: 'เบอร์โทรศัพท์ไม่ถูกต้อง',
        text: 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก',
        confirmButtonColor: '#26c195'
      });
      return false; 
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateData()) return;
    try {
      dispatch(updateProfile(tempData));
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: 'แก้ไขข้อมูลโปรไฟล์สำเร็จ',
        confirmButtonColor: '#26c195',
        timer: 2000,
        showConfirmButton: false
      });
      setActiveModal(null);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
        confirmButtonColor: '#26c195'
        
      });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        Swal.fire({
          icon: 'warning',
          title: 'ไฟล์ขนาดใหญ่เกินไป',
          text: 'ขนาดไฟล์สูงสุดไม่เกิน 1 MB',
          confirmButtonColor: '#26c195'
        });
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setTempData({ ...tempData, image: imageUrl });
    }
  };

  return (
    <div id="page-profile" className="min-h-screen bg-white font-sans text-gray-950 pt-4 sm:pt-12 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row gap-6">
        
        <ProfileSidebar />

        {/* === RIGHT CONTENT === */}
        <main className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-5 sm:p-8 relative min-h-[500px]">
          
         <div className="border-b border-gray-100 pb-4 mb-6 md:mb-8">
            <h1 id="title-profile-page" className="text-lg sm:text-xl font-bold text-black">ข้อมูลของฉัน</h1>
            <p id="desc-profile-page" className="text-sm text-black mt-1">จัดการข้อมูลส่วนตัวคุณเพื่อความปลอดภัยของบัญชีผู้ใช้นี้</p>
          </div>

          <div className="flex flex-col md:flex-row md:gap-8">
            
            {/* --- Right Image Section --- */}
            <div className="flex flex-col items-center justify-start order-1 md:order-2 md:w-72 md:border-l md:border-gray-100 md:pl-8">
               <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-50 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm mb-4">
                  {tempData.image ? (
                    <img id="img-profile-main" src={tempData.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User id="icon-profile-placeholder" className="w-18 h-18 sm:w-20 sm:h-20 text-black stroke-[0.5]" />
                  )}
               </div>
               
               <input 
                  id="input-file-image"
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept=".jpg, .jpeg, .png" 
                  className="hidden" 
               />

               <button 
                id="btn-upload-image"
                onClick={handleImageClick}
                className="border border-gray-300 bg-white px-6 py-2 text-md front-normal text-black rounded hover:bg-gray-50 transition-colors shadow-sm font-medium mb-3"
               >
                 เลือกรูป
               </button>

               <div id="desc-upload-limits" className="text-md front-normal text-black text-center space-y-1">
                 <p>ขนาดไฟล์: สูงสุด 1 MB</p>
                 <p>ไฟล์ที่รองรับ: .JPEG, .PNG</p>
               </div>          
            </div>
 
            {/* เส้นคั่น (แสดงเฉพาะบนมือถือ) */}
            <hr className="w-full border-gray-300 my-6 order-2 md:hidden" />

            {/* --- Left Form Section --- */}
            <div className="flex-1 space-y-5 sm:space-y-7 order-3 md:order-1">
              
              {/* Row: Name */}
              <div className="flex justify-between md:justify-start items-center md:gap-6">
                <label className="text-black font-medium text-sm md:w-40 md:text-right">ชื่อ - นามสกุล</label>
                <div className="flex-1 text-black font-normal text-sm flex items-center justify-end md:justify-start">
                    <span id="display-fullname" className="mr-3 md:mr-4 truncate">{tempData.firstName} {tempData.lastName}</span>
                    <button 
                        id="btn-edit-name"
                        onClick={() => openModal('name')} 
                        className="text-blue-500 transition-colors text-sm font-medium"
                    >
                        เปลี่ยน
                    </button>
                </div>
              </div>

              {/* Row: Email */}
              <div className="flex justify-between md:justify-start items-center md:gap-6">
                <label className="text-black font-medium text-sm md:w-40 md:text-right">อีเมล</label>
                <div className="flex-1 text-black font-normal text-sm flex items-center justify-end md:justify-start">
                    <span id="display-email" className="mr-3 md:mr-4 truncate">
                        {tempData.email.replace(/(.{3})(.*)(@.*)/, "$1******$3")}
                    </span>
                    <button 
                        id="btn-edit-email"
                        onClick={() => openModal('email')} 
                        className="text-blue-500  transition-colors text-sm font-medium"
                    >
                        เปลี่ยน
                    </button>   
                </div>
              </div>

               {/* Row: Phone */}
              <div className="flex justify-between md:justify-start items-center md:gap-6">
                <label className="text-black font-medium text-sm md:w-40 md:text-right">หมายเลขโทรศัพท์</label>
                <div className="flex-1 text-black font-normal text-sm flex items-center justify-end md:justify-start">
                    <span id="display-phone" className="mr-3 md:mr-4 truncate">
                        {tempData.phone.replace(/^(.*)(.{2})$/, "********$2")}
                    </span>
                    <button 
                        id="btn-edit-phone"
                        onClick={() => openModal('phone')} 
                        className="text-blue-500 transition-colors text-sm font-medium"
                    >
                        เปลี่ยน
                    </button>
                </div>
              </div>

              {/* Row: Date */}
              <div className="flex justify-between md:justify-start items-center md:gap-6">
                 <label className="text-black font-medium text-sm md:w-40 md:text-right">วันที่สมัคร</label>
                 <div className="flex-1 text-black font-normal text-sm flex items-center justify-end md:justify-start">
                    <span id="display-joindate" className="md:mr-4 truncate">{user.joinDate || '-'}</span>
                 </div>
              </div>
              
              {/* Main Save Button */}
              <div className="flex md:items-center mt-8 pt-4">
                 <div className="hidden md:block md:w-40 md:mr-6"></div>
                 <div className="w-full flex justify-center md:justify-start">
                    <button 
                        id="btn-main-save"
                        onClick={handleSave}
                        className="w-full md:w-auto md:min-w-[150px] bg-green-500 transition-colors text-white px-8 py-3 md:py-2.5 rounded text-sm md:text-base shadow-sm font-medium"
                    >
                        บันทึกข้อมูล
                    </button>
                 </div>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* --- Modals --- */}
      <EditModal 
        elementId="name" 
        isOpen={activeModal === 'name'} 
        title="เปลี่ยน ชื่อ - นามสกุล" 
        onClose={() => {
            setActiveModal(null);
            setTempData({ ...tempData, firstName: user.firstName, lastName: user.lastName });
        }} 
        onSave={handleSave} 
      >
         <div className="space-y-4">
             <div>
                <label htmlFor="input-firstname" className="text-sm text-gray-600 font-medium mb-1.5 block">ชื่อ</label>
                <input 
                    id="input-firstname"
                    type="text" 
                    className="w-full border border-gray-300 px-3 py-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm"
                    value={tempData.firstName} 
                    onChange={e => setTempData({...tempData, firstName: e.target.value})} 
                />
             </div>
             <div>
                <label htmlFor="input-lastname" className="text-sm text-gray-600 font-medium mb-1.5 block">นามสกุล</label>
                <input 
                    id="input-lastname"
                    type="text" 
                    className="w-full border border-gray-300 px-3 py-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm"
                    value={tempData.lastName} 
                    onChange={e => setTempData({...tempData, lastName: e.target.value})} 
                />
             </div>
         </div>
      </EditModal>

      <EditModal 
        elementId="email"
        isOpen={activeModal === 'email'} 
        title="เปลี่ยนอีเมล" 
        onClose={() => {
            setActiveModal(null);
            setTempData({ ...tempData, email: user.email });
        }} 
        onSave={handleSave}
      >
         <div>
            <label htmlFor="input-email" className="text-sm text-black font-medium mb-1.5 block">อีเมล</label>
            <input 
                id="input-email"
                type="email" 
                className="w-full border border-gray-300 px-3 py-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm"
                value={tempData.email} 
                onChange={e => setTempData({...tempData, email: e.target.value})} 
            />
         </div>
      </EditModal>

      <EditModal 
        elementId="phone"
        isOpen={activeModal === 'phone'} 
        title="เปลี่ยนเบอร์โทร" 
        onClose={() => {
            setActiveModal(null);
            setTempData({ ...tempData, phone: user.phone });
        }} 
        onSave={handleSave}
      >
         <div>
            <label htmlFor="input-phone" className="text-sm text-gray-600 font-medium mb-1.5 block">เบอร์โทรศัพท์ (10 หลัก)</label>
            <input 
                id="input-phone"
                type="text" 
                maxLength={10}
                className="w-full border border-gray-300 px-3 py-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm"
                value={tempData.phone} 
                onChange={e => setTempData({...tempData, phone: e.target.value.replace(/[^0-9]/g, '')})} 
            />
         </div>
      </EditModal>

    </div>
  );
};

export default Profile;