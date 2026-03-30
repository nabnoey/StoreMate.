import { useState } from "react";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import { CiSearch } from "react-icons/ci";
import { FiEdit } from "react-icons/fi";

function Stock() {
  const [openModal, setOpenModal] = useState(false);

  const products = [
    { id: "PRD-001", name: "แชมพูสูตรฟื้นฟู", category: "เครื่องดื่ม", price: 100, stock: 999, status: "พร้อมจำหน่าย" },
    { id: "PRD-002", name: "ครีมนวดผมสมุนไพร", category: "ผลิตภัณฑ์ดูแลผม", price: 100, stock: 999, status: "พร้อมจำหน่าย" },
    { id: "PRD-003", name: "น้ำมะม่วงหาวมะนาวโห่", category: "เครื่องดื่ม", price: 100, stock: 999, status: "พร้อมจำหน่าย" },
    { id: "PRD-004", name: "น้ำสมุนไพรสูตรน้ำผึ้ง", category: "เครื่องดื่ม", price: 100, stock: 999, status: "ไม่พร้อมจำหน่าย" },
    { id: "PRD-005", name: "มะม่วงหาวแช่อิ่ม", category: "เครื่องดื่ม", price: 100, stock: 999, status: "ไม่พร้อมจำหน่าย" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col w-full p-0">
      <HeaderAdmin
        title="จัดการสินค้าในคลัง"
        subtitle="เพิ่ม แก้ไข ลบสินค้า ปรับสถานะสินค้า และจัดการจำนวนสินค้าคงเหลือ"
      />

      <div className="p-4 sm:p-6 text-[#374151]">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-[#374151]">ค้นหาสินค้า</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-[400px]">
              <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] text-xl font-bold" />
              <input
                type="text"
                placeholder="ค้นหาโดยชื่อสินค้า หรือ รหัสสินค้า"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => setOpenModal(true)}
              className="w-full sm:w-auto bg-indigo-800 transition-colors text-gray-200 px-5 py-2 rounded-md flex items-center justify-center gap-2 text-sm font-medium"
            >
              <span>+</span> เพิ่มสินค้า
            </button>
          </div>
        </div>

    
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[800px]">
              <thead className="bg-gray-50">
                <tr className="text-[#374151] border-b border-gray-200">
                  <th className="p-4 font-semibold whitespace-nowrap">รหัสสินค้า</th>
                  <th className="p-4 font-semibold whitespace-nowrap">ชื่อสินค้า</th>
                  <th className="p-4 font-semibold whitespace-nowrap">หมวดหมู่</th>
                  <th className="p-4 font-semibold whitespace-nowrap">ราคา</th>
                  <th className="p-4 font-semibold whitespace-nowrap">จำนวนคงเหลือ</th>
                  <th className="p-4 font-semibold whitespace-nowrap">สถานะ</th>
                  <th className="p-4 font-semibold whitespace-nowrap text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <button type="button" className="text-[#073A8D] cursor-pointer hover:underline bg-transparent border-none p-0 text-left">
                        {product.id}
                      </button>
                    </td>
                    <td className="p-4">{product.name}</td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4 font-medium">{product.price.toLocaleString()}</td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.status === "พร้อมจำหน่าย" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button type="button" className="text-blue-600 inline-flex items-center gap-1.5 hover:underline font-medium bg-transparent border-none p-0">
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

      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-[95%] max-w-[620px] rounded-xl shadow-xl overflow-hidden flex flex-col ">
            
            <div className="bg-blue-500 text-white text-center py-5 text-xl font-semibold">
              จัดการสินค้าในคลัง
            </div>

           
            <div className="p-6 space-y-5 text-sm text-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs">ชื่อสินค้า</label>
                  <input className="w-full border rounded-md p-2 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="ชื่อสินค้า" />
                </div>
                <div>
                  <label className="block mb-1 text-xs">หมวดหมู่</label>
                  <select className="w-full border rounded-md p-2 outline-none">
                    <option>หมวดหมู่</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs">ราคา</label>
                  <input className="w-full border rounded-md p-2 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="ราคา" />
                </div>
                <div>
                  <label className="block mb-1 text-xs">จำนวนสินค้าในคลัง</label>
                  <input className="w-full border rounded-md p-2 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="จำนวนสินค้า" />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs">สถานะสินค้า</label>
                <select className="w-full sm:w-[150px] border rounded-md p-2 outline-none">
                  <option>พร้อมจำหน่าย</option>
                  <option>ไม่พร้อมจำหน่าย</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-xs">รายละเอียดสินค้า</label>
                <textarea className="w-full border rounded-md p-2 h-[100px] outline-none" placeholder="รายละเอียดสินค้า" />
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
                <div className="flex justify-center items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="text-gray-500">
                    <path fill="currentColor" d="M12 18.16V5.91l5.25 5.25l.75-.66L11.5 4L5 10.5l.75.66L11 5.91v12.25zM3 19h1v2h15v-2h1v3H3z" />
                  </svg>
                </div>
                <p className="text-sm">คลิกเพื่ออัพโหลดหรือวาง</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5 MB</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 flex-shrink-0">
              <button onClick={() => setOpenModal(false)} className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
                ยกเลิก
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                เพิ่มสินค้า
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Stock;