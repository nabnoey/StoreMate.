import { useState } from "react";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import { CiSearch } from "react-icons/ci";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { AddProductModal } from "../../components/admin/AddProductModal";
import { deleteProduct } from "../../redux/moderator/ModeratorReducer";
import { toast } from "react-hot-toast";

function Stock() {
  const [products, setProducts] = useState([
    {
      id: "PRD-001",
      name: "แชมพูสูตรฟื้นฟู",
      categoryId: 4,
      category: "Shampoo",
      price: 100,
      stock: 999,
      statusId: 1,
      status: "พร้อมจำหน่าย",
      description: "แชมพูบำรุงผม",
    },
    {
      id: "PRD-002",
      name: "ครีมนวดผมสมุนไพร",
      categoryId: 4,
      category: "Shampoo",
      price: 100,
      stock: 999,
      statusId: 1,
      status: "พร้อมจำหน่าย",
      description: "ครีมนวดบำรุงผม",
    },
  ]);

  const dispatch = useDispatch<AppDispatch>();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddProduct = () => {

    setIsAddModalOpen(true);
  };

  const handleDeleteProduct = async (idStr: string) => {
    if (window.confirm("คุณต้องการลบสินค้านี้ใช่หรือไม่?")) {
      try {
        const numericId = parseInt(idStr.split("-")[1]) || 1;
        await dispatch(deleteProduct(numericId)).unwrap();
        toast.success("ลบสินค้าสำเร็จ");
        setProducts(products.filter((p) => p.id !== idStr));
      } catch (error: any) {
        toast.error(error.message || "ลบสินค้าไม่สำเร็จ");
      }
    }
  };

  return (
    <div className="max-h-screen bg-[#F8F9FA] flex flex-col w-full p-0 ">
      <HeaderAdmin
        title="จัดการสินค้าในคลัง"
        subtitle="เพิ่ม แก้ไข ลบสินค้า ปรับสถานะสินค้า และจัดการจำนวนสินค้าคงเหลือ"
      />

  
      <div className="p-6 text-[#374151]">
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-[#374151]">
            ค้นหาสินค้า
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-[400px]">
              <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] text-xl font-bold" />
              <input
                type="text"
                placeholder="ค้นหาโดยชื่อสินค้า หรือ รหัสสินค้า"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-600"
              />
            </div>
            <button
              type="button"
              onClick={handleAddProduct}
              className="bg-indigo-800 transition-colors text-gray-200 px-5 py-2 rounded-md flex items-center gap-2 text-sm font-medium"
            >
              <span>+</span> เพิ่มสินค้า
            </button>
          </div>
        </div>

        {/* ส่วนตารางสินค้า */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm overflow-x-auto text-black">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[#374151] border-b border-gray-200">
                <th className="pb-4 font-normal whitespace-nowrap">รหัสสินค้า</th>
                <th className="pb-4 font-normal whitespace-nowrap">ชื่อสินค้า</th>
                <th className="pb-4 font-normal whitespace-nowrap">หมวดหมู่</th>
                <th className="pb-4 font-normal whitespace-nowrap">ราคา</th>
                <th className="pb-4 font-normal whitespace-nowrap">จำนวนคงเหลือ</th>
                <th className="pb-4 font-normal whitespace-nowrap">สถานะ</th>
                <th className="pb-4 font-normal whitespace-nowrap">จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4">
                    <button
                      type="button"
                      className="text-[#073A8D] cursor-pointer hover:underline bg-transparent border-none p-0 text-left"
                    >
                      {product.id}
                    </button>
                  </td>
                  <td className="py-4">{product.name}</td>
                  <td className="py-4">{product.category}</td>
                  <td className="py-4">{product.price}</td>
                  <td className="py-4">{product.stock}</td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.statusId === 1
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {product.statusId === 1 ? "พร้อมจำหน่าย" : "ไม่พร้อมจำหน่าย"}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        // onClick={() => handleEditProduct(product)}
                        className="text-blue-600 flex items-center gap-1.5 hover:underline font-medium bg-transparent border-none p-0"
                      >
                        <FiEdit className="text-blue-600" /> แก้ไข
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-500 flex items-center gap-1.5 hover:underline font-medium bg-transparent border-none p-0"
                      >
                        <FiTrash2 className="text-red-500" /> ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}

export default Stock;
