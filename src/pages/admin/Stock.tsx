import React from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import { CiSearch } from "react-icons/ci";
import { FiEdit } from "react-icons/fi"; // อย่าลืมติดตั้ง react-icons ถ้ายังไม่มี

function Stock() {
  // ข้อมูลจำลองสำหรับแสดงผลในตารางให้เหมือนภาพตัวอย่าง
  const products = [
    { id: 'PRD-001', name: 'แชมพูสูตรฟื้นฟู', category: 'เครื่องดื่ม', price: 100, stock: 999, status: 'พร้อมจำหน่าย' },
    { id: 'PRD-002', name: 'ครีมนวดผมสมุนไพร', category: 'ผลิตภัณฑ์ดูแลผม', price: 100, stock: 999, status: 'พร้อมจำหน่าย' },
    { id: 'PRD-003', name: 'น้ำมะม่วงหาวมะนาวโห่', category: 'เครื่องดื่ม', price: 100, stock: 999, status: 'พร้อมจำหน่าย' },
    { id: 'PRD-004', name: 'น้ำสมุนไพรสูตรน้ำผึ้ง', category: 'เครื่องดื่ม', price: 100, stock: 999, status: 'ไม่พร้อมจำหน่าย' },
    { id: 'PRD-005', name: 'มะม่วงหาวแช่อิ่ม', category: 'เครื่องดื่ม', price: 100, stock: 999, status: 'ไม่พร้อมจำหน่าย' },
  ];

  return (
    <div className="max-h-screen bg-[#F8F9FA] flex flex-col w-full p-0 ">
      <HeaderAdmin
        title="จัดการสินค้าในคลัง"
        subtitle="เพิ่ม แก้ไข ลบสินค้า ปรับสถานะสินค้า และจัดการจำนวนสินค้าคงเหลือ"
      />
 
      {/* Main Content Area */}
      <div className="p-6 text-[#374151]">
        
        {/* ส่วนค้นหาสินค้า */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-[#374151]">ค้นหาสินค้า</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Input ค้นหา */}
            <div className="relative w-full sm:w-[400px]">
              <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] text-xl font-bold" />
              <input
                type="text"
                placeholder="ค้นหาโดยชื่อสินค้า หรือ รหัสสินค้า"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            {/* ปุ่มเพิ่มสินค้า */}
            <button className="bg-indigo-800 transition-colors text-gray-200 px-5 py-2 rounded-md flex items-center gap-2 text-sm font-medium">
              <span>+</span> เพิ่มสินค้า
            </button>
          </div>
        </div>

        {/* ส่วนตารางสินค้า */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[#374151] border-b border-gray-200">
                <th className="pb-4 font-normal whitespace-nowrap">รหัสสินค้า</th>
                <th className="pb-4 font-normal whitespace-nowrap">ชื่อสินค้า</th>
                <th className="pb-4 font-normal whitespace-nowrap">หมวดหมู่</th>
                <th className="pb-4 font-normal whitespace-nowrap">ราคา</th>
                <th className="pb-4 font-normal whitespace-nowrap">จำนวนคงเหลือ</th>
                <th className="pb-4 font-normal whitespace-nowrap">สถานะ</th>
                <th className="pb-4 font-normal whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-4 text-[#073A8D] cursor-pointer hover:underline">{product.id}</td>
                  <td className="py-4">{product.name}</td>
                  <td className="py-4">{product.category}</td>
                  <td className="py-4">{product.price}</td>
                  <td className="py-4">{product.stock}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === 'พร้อมจำหน่าย'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="text-blue-600 flex items-center gap-1.5 hover:underline font-medium">
                      <FiEdit className="text-gray-600" /> จัดการ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default Stock;