import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProfileSidebar from '../../components/user/ProfileSidebar';
import type { RootState } from '../../redux/store';
import { useNavigate } from 'react-router';

interface AddressItem {
  id: string;
  fullName: string;
  phone: string;
  detail: string;
  isDefault: boolean;
  isPickup: boolean;
}

const AddressProfile = () => {
const user = useSelector((state: RootState) => state.auth.user);



  // ข้อมูลจำลองให้ตรงกับหน้าจอ
  const [addresses] = useState<AddressItem[]>([
    {
      id: '1',
      fullName: 'บุญรักษา วินานนท์',
      phone: '(+66) 98 406 6454',
      detail: '116/1 ม.1 ต.ห้วยขวาง อ.กำแพงแสน จ.นครปฐม 73140',
      isDefault: true,
      isPickup: true,
    },
    {
      id: '2',
      fullName: 'บุญรักษา วินานนท์',
      phone: '(+66) 98 406 6454',
      detail: 'เลขที่ 88/5 ม.4 ถ.ธรรมศาลา อ.เมืองนครปฐม จ.นครปฐม 73000',
      isDefault: false,
      isPickup: true,
    },
    {
      id: '3',
      fullName: 'บุญรักษา วินานนท์',
      phone: '(+66) 98 406 6454',
      detail: 'เลขที่ 241 ม.7 ต.บ้านเลือก อ.โพธาราม จ.ราชบุรี 70120',
      isDefault: false,
      isPickup: true,
    }
  ]);

  return (
      <div className="min-h-screen bg-white font-sans text-gray-950 pt-12 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row gap-6">
        
        {/* 1. เรียกใช้ Sidebar Component ตรงนี้แทน <aside> ของเดิม */}
        <ProfileSidebar />
      
        {/* =========================================
            RIGHT CONTENT (รายการที่อยู่)
        ========================================= */}
        <main className="flex-1 bg-white rounded shadow-sm relative min-h-[500px]">
          
          {/* Header */}
          <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200">
            <h1 className="text-base md:text-lg font-bold text-gray-900">ที่อยู่ของฉัน</h1>
            <button className="bg-[#4285F4] hover:bg-blue-600 transition-colors text-white text-xs md:text-sm px-4 py-2 rounded shadow-sm">
              <span className="hidden md:inline">+ เพิ่มที่อยู่</span>
              <span className="inline md:hidden">เพิ่มที่อยู่ใหม่</span>
            </button>
          </div>

          {/* Sub Header (Desktop Only) */}
          <div className="p-6 pb-2">
             <h2 className="text-base font-bold text-gray-900">ที่อยู่</h2>
          </div>
          {/* Address List */}
          <div className="flex flex-col">
            {addresses.map((address) => (
              <div 
                key={address.id} 
                className="p-4 md:p-6 flex justify-between border-b border-gray-200 last:border-b-0 gap-2"
              >
                {/* Left Side: Address Details */}
                <div className="flex-1 pr-2 space-y-2 text-xs md:text-sm">
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="font-bold text-gray-800">{address.fullName}</span>
                    <span className="hidden md:inline text-gray-400">|</span>
                    <span className="text-gray-400 md:text-gray-500">{address.phone}</span>
                  </div>

                  <div className="text-gray-500 leading-relaxed md:max-w-[90%]">
                    {address.detail}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1 md:pt-2">
                    {address.isDefault && (
                      <span className="text-[10px] md:text-xs border border-[#4285F4] text-[#4285F4] px-2 py-0.5 rounded-sm">
                        ค่าเริ่มต้น
                      </span>
                    )}
                    {address.isPickup && (
                      <span className="text-[10px] md:text-xs border border-gray-300 text-gray-500 px-2 py-0.5 rounded-sm bg-white">
                        ที่อยู่ในการรับสินค้า
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Side: Actions (Aligns Edit top right, Default button bottom right) */}
                <div className="flex flex-col justify-between items-end min-w-[90px] md:min-w-[150px]">
                  <div className="flex items-center gap-2 text-xs md:text-sm">
                    <button className="text-[#4285F4] hover:underline">แก้ไข</button>
                    {/* ปุ่มลบ ซ่อนในหน้าจอมือถือตามดีไซน์ */}
                    <span className="hidden md:inline text-gray-300">|</span>
                    <button className="hidden md:inline text-red-500 hover:underline">ลบ</button>
                  </div>
                  
                  {/* ปุ่มตั้งเป็นค่าเริ่มต้น */}
                  <button 
                    disabled={address.isDefault}
                    className={`px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs border rounded-sm transition-colors mt-6 md:mt-0 ${
                      address.isDefault 
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    ตั้งเป็นค่าเริ่มต้น
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddressProfile;