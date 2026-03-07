import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User as UserIcon } from 'lucide-react'; 
import Swal from 'sweetalert2'; 
import { updateProfile } from '../../redux/auth/authReducer';
import type { RootState } from '../../redux/store';
import ProfileSidebar from '../../components/user/ProfileSidebar';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}

const EditModal = ({ isOpen, title, onClose, onSave, children }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[450px] p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">{title}</h3>
        <div className="space-y-4">{children}</div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8">
          <button onClick={onClose} className="w-full sm:w-auto border border-gray-300 text-gray-600 px-6 py-2.5 rounded-lg text-sm font-medium">ยกเลิก</button>
          <button onClick={onSave} className="w-full sm:w-auto bg-[#26c195] text-white px-8 py-2.5 rounded-lg shadow-md text-sm font-medium">ยืนยันการแก้ไข</button>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [tempData, setTempData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    image: '',
  });

  useEffect(() => {
    if (user) {
      const nameParts = (user.name || '').trim().split(/\s+/);
      setTempData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        image: user.image || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    Swal.fire({ title: 'กำลังอัปเดต...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
      const updatedData = {
        ...tempData,
        name: `${tempData.firstName.trim()} ${tempData.lastName.trim()}`
      };
      await dispatch(updateProfile(updatedData) as any);
      Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', timer: 1500, showConfirmButton: false });
      setActiveModal(null);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTempData({ ...tempData, image: imageUrl });
    }
  };

  if (!user) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-10">
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row gap-6">
        
        {/* --- Left Sidebar Area --- */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg p-4 mb-4 flex items-center gap-3 shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {tempData.image ? <img src={tempData.image} className="w-full h-full object-cover" /> : <UserIcon className="w-full h-full p-2 text-gray-400" />}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">{user.name || 'User'}</p>
              <button className="text-xs text-gray-400 flex items-center gap-1">✎ แก้ไขโปรไฟล์</button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <ProfileSidebar />
          </div>
        </div>

        {/* --- Right Content Area --- */}
        <main className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="border-b border-gray-100 pb-4 mb-8">
            <h1 className="text-xl font-bold text-gray-800">ข้อมูลของฉัน</h1>
            <p className="text-sm text-gray-500 mt-1">จัดการข้อมูลส่วนตัวของคุณเพื่อความปลอดภัยของบัญชีผู้ใช้นี้</p>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* ฟอร์มข้อมูล */}
            <div className="flex-1 space-y-7 order-2 lg:order-1 lg:pr-12">
              <div className="flex items-center gap-6">
                <label className="w-32 text-sm text-gray-500 text-right">ชื่อ - นามสกุล</label>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-800">{tempData.firstName} {tempData.lastName}</span>
                  <button onClick={() => setActiveModal('name')} className="text-blue-500 text-xs hover:underline">เปลี่ยน</button>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="w-32 text-sm text-gray-500 text-right">อีเมล</label>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-800">{tempData.email.replace(/(.{4})(.*)(@.*)/, "$1********$3")}</span>
                  <button onClick={() => setActiveModal('email')} className="text-blue-500 text-xs hover:underline">เปลี่ยน</button>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="w-32 text-sm text-gray-500 text-right">หมายเลขโทรศัพท์</label>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-800">{tempData.phone ? tempData.phone.replace(/(\d{3})(\d{4})(\d{3})/, "********$3") : 'ยังไม่ได้ระบุ'}</span>
                  <button onClick={() => setActiveModal('phone')} className="text-blue-500 text-xs hover:underline">เปลี่ยน</button>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="w-32 text-sm text-gray-500 text-right">วันที่สมัคร</label>
                <span className="text-sm text-gray-800">13/2/2026</span>
              </div>

              <div className="pt-4 lg:pl-38">
                <button onClick={handleSave} className="bg-[#26c195] text-white px-8 py-2 rounded shadow-sm hover:bg-[#1fa17d] text-sm font-medium">บันทึก</button>
              </div>
            </div>

            {/* เส้นคั่นกลาง */}
            <div className="hidden lg:block w-[1px] bg-gray-100 mx-8"></div>

            {/* ส่วนรูปภาพ */}
            <div className="flex flex-col items-center w-full lg:w-64 order-1 lg:order-2 mb-10 lg:mb-0">
              <div className="w-36 h-36 rounded-full border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center mb-4">
                {tempData.image ? <img src={tempData.image} className="w-full h-full object-cover" /> : <UserIcon className="w-20 h-20 text-gray-200" />}
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="border border-gray-300 px-4 py-2 text-sm text-gray-600 rounded hover:bg-gray-50">เลือกรูป</button>
              <input type="file" ref={fileInputRef} className="hidden" accept=".jpeg,.png" onChange={handleImageChange} />
              <div className="mt-4 text-center text-xs text-gray-400 space-y-1">
                <p>ไฟล์ที่อนุญาต: .JPEG, .PNG</p>
                <p>ขนาดไฟล์: สูงสุด 1 MB</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* --- Render Modals --- */}
      <EditModal isOpen={activeModal === 'name'} title="แก้ไขชื่อ-นามสกุล" onClose={() => setActiveModal(null)} onSave={handleSave}>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" className="border p-3 rounded-lg outline-[#26c195]" placeholder="ชื่อ" value={tempData.firstName} onChange={e => setTempData({...tempData, firstName: e.target.value})} />
          <input type="text" className="border p-3 rounded-lg outline-[#26c195]" placeholder="นามสกุล" value={tempData.lastName} onChange={e => setTempData({...tempData, lastName: e.target.value})} />
        </div>
      </EditModal>

      <EditModal isOpen={activeModal === 'email'} title="เปลี่ยนที่อยู่อีเมล" onClose={() => setActiveModal(null)} onSave={handleSave}>
        <input type="email" className="w-full border p-3 rounded-lg outline-[#26c195]" value={tempData.email} onChange={e => setTempData({...tempData, email: e.target.value})} />
      </EditModal>

      <EditModal isOpen={activeModal === 'phone'} title="เบอร์โทรศัพท์" onClose={() => setActiveModal(null)} onSave={handleSave}>
        <input type="text" maxLength={10} className="w-full border p-3 rounded-lg outline-[#26c195]" value={tempData.phone} onChange={e => setTempData({...tempData, phone: e.target.value.replace(/\D/g, '')})} />
      </EditModal>
    </div>
  );
};

export default ProfilePage;