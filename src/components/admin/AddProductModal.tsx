import React, { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FiUpload } from "react-icons/fi";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { addProduct } from "../../redux/moderator/ModeratorReducer";
// import type { Product } from "../../types/product";
import { toast } from "react-hot-toast";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductSchema = Yup.object().shape({
  productName: Yup.string().required("กรุณากรอกชื่อสินค้า"),
  categoryName: Yup.string().required("กรุณาเลือกหมวดหมู่"),
  price: Yup.number().typeError("ราคาต้องเป็นตัวเลข").min(0, "ราคาต้องไม่ต่ำกว่า 0").required("กรุณากรอกราคา"),
  stockQuantity: Yup.number().typeError("จำนวนต้องเป็นตัวเลข").min(0, "จำนวนต้องไม่ต่ำกว่า 0").required("กรุณากรอกจำนวนสินค้า"),
  status: Yup.string().required("กรุณาเลือกสถานะ"),
  description: Yup.string().required("กรุณากรอกรายละเอียดสินค้า"),
});

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-6 text-center">
          <h2 className="text-2xl font-bold text-white tracking-wide">จัดการสินค้าในคลัง</h2>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          <Formik
            initialValues={{
              productName: "",
              categoryName: "",
              price: "",
              stockQuantity: "",
              status: "ACTIVE",
              description: "",
              image: null,
            }}
            validationSchema={ProductSchema}
            // onSubmit={async (values, { setSubmitting }) => {
            //   try {
            //     const newProduct: Product = {
            //       id: 0, 
            //       productName: values.productName,
            //       imageUrl: previewImage || "https://example.com/image.jpg",
            //       price: Number(values.price),
            //       categoryName: values.categoryName,
            //       sammary: "",
            //       description: values.description,
            //       status: values.status as "ACTIVE" | "CHECKED_OUT",
            //       createAt: new Date().toISOString(),
            //       stockQuantity: Number(values.stockQuantity),
            //     };

            //     await dispatch(addProduct(newProduct)).unwrap();
            //     toast.success("เพิ่มสินค้าสำเร็จ");
            //     onClose();
            //   } catch (error: any) {
            //     toast.error(error.message || "เกิดข้อผิดพลาดในการเพิ่มสินค้า");
            //   } finally {
            //     setSubmitting(false);
            //   }
            // }}

            onSubmit={async (values, { setSubmitting }) => {
  try {
    const formData = new FormData();

    formData.append("productName", values.productName);
    formData.append("categoryName", values.categoryName);
    formData.append("price", values.price.toString());
    formData.append("stockQuantity", values.stockQuantity.toString());
    formData.append("status", values.status);
    formData.append("description", values.description);

    if (values.image) {
      formData.append("image", values.image);
    }

    await dispatch(addProduct(formData)).unwrap();

    toast.success("เพิ่มสินค้าสำเร็จ");
    onClose();

  } catch (error: any) {
    toast.error(error.message || "เกิดข้อผิดพลาดในการเพิ่มสินค้า");
  } finally {
    setSubmitting(false);
  }
}}
          >
            {({ setFieldValue, isSubmitting }) => (
              <Form className="space-y-5">
                {/* Row 1: ชื่อสินค้า, หมวดหมู่ */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า</label>
                    <Field
                      type="text"
                      name="productName"
                      placeholder="ชื่อสินค้า"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400"
                    />
                    <ErrorMessage name="productName" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
                    <Field
                      as="select"
                      name="categoryName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                    >
                       <option value="โปรโมชั่น">โปรโมชั่น</option>
                      <option value="เครื่องดื่ม">เครื่องดื่ม</option>
                      <option value="สบู่">สบู่</option>
                      <option value="ผลิตภัณฑ์ดูแลผม">แชมพู</option>
                      
                    </Field>
                    <ErrorMessage name="categoryName" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                {/* Row 2: ราคา, จำนวนสินค้า */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ราคา</label>
                    <Field
                      type="number"
                      name="price"
                      placeholder="ราคา"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400"
                    />
                    <ErrorMessage name="price" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนสินค้าในคลัง</label>
                    <Field
                      type="number"
                      name="stockQuantity"
                      placeholder="จำนวนสินค้า"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400"
                    />
                    <ErrorMessage name="stockQuantity" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                {/* Row 3: สถานะสินค้า */}
                <div className="w-1/2 pr-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">สถานะสินค้า</label>
                  <Field
                    as="select"
                    name="status"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  >
                    <option value="ACTIVE">พร้อมจำหน่าย</option>
                    <option value="CHECKED_OUT">ไม่พร้อมจำหน่าย</option>
                  </Field>
                  <ErrorMessage name="status" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                {/* Row 4: รายละเอียดสินค้า */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดสินค้า</label>
                  <Field
                    as="textarea"
                    name="description"
                    placeholder="รายละเอียดสินค้า"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700 placeholder-gray-400"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                {/* Row 5: Image Upload Area */}
                <div>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        setFieldValue("image", file);
                        setPreviewImage(URL.createObjectURL(file));
                      }
                    }}
                  >
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFieldValue("image", file);
                          setPreviewImage(URL.createObjectURL(file));
                        }
                      }}
                    />
                    
                    {previewImage ? (
                      <div className="relative w-full h-32 flex justify-center">
                        <img src={previewImage} alt="Preview" className="h-full object-contain rounded-md" />
                      </div>
                    ) : (
                      <>
                        <FiUpload className="text-gray-400 text-3xl mb-2" />
                        <p className="text-sm text-gray-700 font-medium">คลิกเพื่ออัพโหลดหรือลากวาง</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5 MB</p>
                      </>
                    )}
                  </div>
                  <ErrorMessage name="image" component="div" className="text-red-500 text-xs mt-1 text-center" />
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-center gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-2 bg-[#003399] hover:bหมวดg-blue-800 text-white rounded-md font-medium transition-colors disabled:bg-gray-400"
                  >
                    {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-8 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md font-medium transition-colors"
                  >
                    ยกเลิก
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
