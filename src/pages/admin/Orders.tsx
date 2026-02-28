import React from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
// นำเข้า Icons ต่างๆ ที่ใช้ในหน้า UI
import { FiArrowLeft, FiClock, FiPackage, FiTruck, FiCheckCircle, FiUser, FiPhone, FiMapPin, FiBox, FiClipboard } from "react-icons/fi";
import { FaHistory } from "react-icons/fa";
import {Users} from "lucide-react"

function Orders() { // หรืออาจจะเปลี่ยนชื่อคอมโพเนนต์เป็น OrderDetails ตามความเหมาะสมครับ
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-start text-left w-full">
      
      <HeaderAdmin
        title="จัดการคำสั่งซื้อ"
        subtitle="ตรวจสอบ ติดตามสถานะ และดำเนินการจัดการคำสั่งซื้อ"
      />

      {/* Main Content Container */}
      <div className="p-6 w-full text-[#374151] max-w-7xl mx-auto">
        
        {/* Top Header: Back button & Status Badge */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <button className="flex items-center gap-4 hover:opacity-70 transition-opacity text-left">
            <FiArrowLeft className="text-xl text-gray-700" />
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">รายละเอียดคำสั่งซื้อ</h2>
              <p className="text-sm text-[#64748B]">ORD-2024-001</p>
            </div>
          </button>
          <span className="bg-[#BFDBFE] text-[#2563EB] px-4 py-1.5 rounded-full text-sm font-semibold border border-blue-100">
            กำลังเตรียมสินค้า
          </span>
        </div>

        {/* Grid Layout: 2 Columns on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ---------------- Left Column (Main Content) ---------------- */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* 1. Stepper Card (สถานะการจัดส่ง) */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm relative">
              {/* Background Line */}
              <div className="absolute top-[3rem] left-12 right-12 h-0.5 bg-gray-200 -z-0"></div>
              
              <div className="flex justify-between items-center relative z-10">
                {/* Step 1 */}
                <div className="flex flex-col items-center gap-2">
                 <div className="bg-white border-2 border-gray-800 text-black w-10 h-10 rounded-full flex items-center justify-center text-bold shadow-sm">
                    <FiClock />
                  </div>
                  <span className="text-xs font-medium text-gray-500">รอชำระเงิน</span>
                </div>
                {/* Step 2 (Active) */}
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-white border-2 border-black text-black w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm">
                    <FiClipboard />
                  </div>
                  <span className="text-xs font-bold text-gray-800">กำลังเตรียมสินค้า</span>
                </div>
                {/* Step 3 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-white border-2 border-[#F1F5F9] text-black w-10 h-10 rounded-full flex items-center justify-center text-lg">
                    <FiTruck />
                  </div>
                  <span className="text-xs font-medium text-gray-400">จัดส่งแล้ว</span>
                </div>
                {/* Step 4 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-white border-2 border-[#F1F5F9] text-black w-10 h-10 rounded-full flex items-center justify-center text-lg">
                    <FiCheckCircle />
                  </div>
                  <span className="text-xs font-medium text-gray-400">สำเร็จแล้ว</span>
                </div>
              </div>
            </div>

            {/* 2. Change Status Card (เปลี่ยนสถานะคำสั่งซื้อ) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                <FiClipboard className="text-lg" /> เปลี่ยนสถานะคำสั่งซื้อ
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-[#94A3B8] mb-1 font-bold">เลือกสถานะใหม่</label>
                  <select className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                    <option>กำลังเตรียมสินค้า</option>
                    <option>จัดส่งแล้ว</option>
                    <option>สำเร็จแล้ว</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="bg-gray-500 hover:bg-gray-600 transition-colors text-white px-6 py-2.5 rounded-md text-sm font-medium flex items-center gap-2 w-full sm:w-auto justify-center">
                    <FiCheckCircle /> บันทึกการเปลี่ยนแปลง
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Product List Card (รายการสินค้า) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                <FiBox className="text-lg" /> รายการสินค้า ( 1 )
              </h3>
              
              {/* Product Item */}
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-2xl">
                    <FiPackage />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">น้ำมะม่วงหาวมะนาวโห่</p>
                    <p className="text-xs text-gray-500 mt-1">จำนวน: 1</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">฿ 4,990</p>
                  <p className="text-[10px] text-gray-400 font-medium">UNIT PRICE</p>
                </div>
              </div>

              {/* Total Price */}
              <div className="flex justify-between items-end pt-2">
                <span className="text-sm font-bold text-gray-600">ราคาสุทธิรวมภาษี</span>
                <div className="text-right">
                  <p className="text-xl font-black text-gray-900">฿ 4,990</p>
                  <p className="text-[10px] text-gray-400 font-bold">THB</p>
                </div>
              </div>
            </div>

            {/* 4. History Card (ประวัติการเปลี่ยนแปลง) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-6">
                <FaHistory className="text-lg" /> ประวัติการเปลี่ยนแปลง
              </h3>
              
              <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
                {/* Timeline Item 1 */}
                <div className="relative pl-6">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 bg-green-500 rounded-full ring-4 ring-green-100"></div>
                  <p className="font-bold text-sm text-gray-800">อัปเดตสถานะเป็น: กำลังเตรียมสินค้า</p>
                  <p className="text-xs text-gray-400 mt-1">วันนี้, 14:02 น. โดย Admin Root</p>
                </div>
                
                {/* Timeline Item 2 */}
                <div className="relative pl-6">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 bg-gray-300 rounded-full ring-4 ring-gray-100"></div>
                  <p className="font-medium text-sm text-gray-500">รับคำสั่งซื้อเข้าระบบ</p>
                  <p className="text-xs text-gray-400 mt-1">2024-05-15 14:30 น.</p>
                </div>
              </div>
            </div>

          </div>

          {/* ---------------- Right Column (Sidebar Content) ---------------- */}
          <div className="lg:col-span-1">
            
            {/* Customer Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-6">
              {/* Header */}
              <div className="bg-[#0B1A28] text-white px-5 py-3 flex items-center gap-2">
                <Users className="text-lg" />
                <h3 className="font-bold text-sm">ข้อมูลผู้รับ</h3>
              </div>
              
              {/* Body */}
              <div className="p-5 flex flex-col gap-5">
                
                <div>
                  <label className="text-xs text-[#94A3B8] font-normal mb-2 block">ชื่อผู้สั่งซื้อ</label>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-black">
                      <FiUser />
                    </div>
                    <p className="font-bold text-sm text-[#0F172A]">สมชาย ใจดี</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#94A3B8] font-normal mb-2 block">เบอร์โทรศัพท์</label>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-black">
                      <FiPhone />
                    </div>
                    <p className="font-bold text-sm text-[#0F172A]">081-234-5678</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#94A3B8] font-normal mb-2 block">ที่อยู่สำหรับการจัดส่ง</label>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-black shrink-0">
                      <FiMapPin />
                    </div>
                    <p className="font-sans text-sm text-black leading-relaxed">
                      116/1 ม.1 ต.ห้วยขวาง<br/>
                      อ.กำแพงแสน จ.นครปฐม<br/>
                      73140
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Orders;