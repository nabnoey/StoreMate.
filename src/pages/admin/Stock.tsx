import { useState } from "react";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import { CiSearch } from "react-icons/ci";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addProductThunk } from "../../redux/products/productReducer";
import type { Product } from "../../types/product";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import type { AppDispatch } from "../../redux/store";

 function Stock() {
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);




  const categoryMap: Record<string, number> = {
    "โปรโมชั่น": 1,
    "สบู่": 2,
    "แชมพู": 3,
    "เครื่องดื่ม": 4
  };

 
 const schema = Yup.object({
    productName: Yup.string().required("กรุณากรอกชื่อสินค้า"),
    categoryId: Yup.string().required("กรุณาเลือกหมวดหมู่"),
    price: Yup.number().moreThan(0, "ราคาต้องมากกว่า 0").required(),
    stockQuantity: Yup.number().min(0, "จำนวนต้องไม่ติดลบ").required(),
  });

 

    const payload: Product = {
      productName: form.productName,
      categoryId: categoryMap[form.categoryId],
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      status: form.status,
      description: form.description
    } as any;

    try {
      setLoading(true);
      await dispatch(addProductThunk(payload)).unwrap();
      toast.success("เพิ่มสินค้าเรียบร้อยแล้ว");

  
      setForm({
        productName: "",
        categoryId: "",
        price: "",
        stockQuantity: "",
        status: "พร้อมจำหน่าย",
        description: ""
      });

      setOpenModal(false);
    } catch (error: any) {
      toast.error(error?.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };


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
                  <input  value={form.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
              placeholder="ชื่อสินค้า" className="w-full border rounded-md p-2 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="ชื่อสินค้า" />
                </div>
                <div>
                  <label className="block mb-1 text-xs">หมวดหมู่</label>
                  <select value={form.categoryId}
              onChange={(e) => handleChange("categoryId", e.target.value)} className="w-full border rounded-md p-2 outline-none">
                 <option>โปรโมชั่น</option>
                 <option>สบู่</option>
                 <option>แชมพู</option>
                 <option>เครื่องดื่ม</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs">ราคา</label>
                  <input  type="number"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              placeholder="ราคา" className="w-full border rounded-md p-2 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="ราคา" />
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
                <label   className="block mb-1 text-xs">รายละเอียดสินค้า</label>
                <textarea  value={form.description}
              onChange={(e) => handleChange("description", e.target.value)} className="w-full border rounded-md p-2 h-[100px] outline-none" placeholder="รายละเอียดสินค้า" />
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
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
             onClick={handleAddProduct}
                disabled={loading}>
                  {loading ? "กำลังเพิ่ม..." : "เพิ่มสินค้า"}
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