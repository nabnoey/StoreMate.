import React, { useRef, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FiUpload } from "react-icons/fi";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { addProduct, editProduct, getproducts, deleteProduct } from "../../redux/moderator/ModeratorReducer";
import type { ProductMod } from "../../types/moderator/productMod";
import { toast } from "react-hot-toast";
import { ProductService } from "../../services/product.service";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  product?: ProductMod | null;
}

const ProductSchema = Yup.object().shape({
  productName: Yup.string().required("กรุณากรอกชื่อสินค้า"),
  categoryName: Yup.string().required("กรุณาเลือกหมวดหมู่"),
  price: Yup.number().typeError("ราคาต้องเป็นตัวเลข").min(0, "ราคาต้องไม่ต่ำกว่า 0").required("กรุณากรอกราคา"),
  stockQuantity: Yup.number().typeError("จำนวนต้องเป็นตัวเลข").min(0, "จำนวนต้องไม่ต่ำกว่า 0").required("กรุณากรอกจำนวนสินค้า"),
  status: Yup.string().required("กรุณาเลือกสถานะ"),
  description: Yup.string().required("กรุณากรอกรายละเอียดสินค้า"),
});

const normalizeCategory = (category: string | number | undefined): string => {
  if (!category) return "";
  const catStr = String(category).toLowerCase().trim();

  if (["1", "promotion", "โปรโมชั่น", "โปรโมชัน"].includes(catStr)) return "โปรโมชั่น";
  if (["2", "soap", "สบู่"].includes(catStr)) return "สบู่";
  if (["3", "drink", "drinks", "เครื่องดื่ม"].includes(catStr)) return "เครื่องดื่ม";
  if (["4", "hair", "shampoo", "แชมพู", "ผลิตภัณฑ์ดูแลผม"].includes(catStr)) return "ผลิตภัณฑ์ดูแลผม";

  return String(category);
};

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSuccess, product }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fullProduct, setFullProduct] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const isEditMode = !!product;

  const handleDelete = () => {
    if (!product) return;
    toast(
      (t) => (
        <div>
          <p className="mb-3 text-gray-800 font-medium">คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await dispatch(deleteProduct(product.id)).unwrap();
                  toast.success("ลบสินค้าสำเร็จ");
                  dispatch(getproducts({ page: 0, size: 1000 }));
                  if (onSuccess) onSuccess();
                  else onClose();
                } catch (error: any) {
                  toast.error(error.message || "เกิดข้อผิดพลาดในการลบสินค้า");
                }
              }}
              className="px-4 py-1.5 bg-[#EF4444] hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors cursor-pointer"
            >
              ลบสินค้า
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium transition-colors cursor-pointer "
            >
              ยกเลิก
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, id: "delete-confirm" }
    );
  };

  useEffect(() => {
    const fetchDetail = async () => {
      if (isOpen && isEditMode && product?.id) {
        try {
          const detail = await ProductService.getProductById(product.id);
          setFullProduct(detail);
          if (detail.productImages && detail.productImages.length > 0) {
            setPreviewImage(detail.productImages[0].imageUrl);
          }
        } catch (err) {
          console.error("Failed to fetch product details", err);
        }
      } else if (!isOpen) {
        setPreviewImage(null);
        setFullProduct(null);
      }
    };
    fetchDetail();
  }, [isOpen, isEditMode, product]);

  if (!isOpen) return null;

  // 📌 เตรียม Initial Values แบบปลอดภัย (Type-Safe) ไม่พึ่งพาเครื่องหมาย ! อีกต่อไป
  const formInitialValues = {
    productName: product?.productName || "",
    categoryName: normalizeCategory(product?.category),
    price: product?.price ?? "",
    stockQuantity: product?.stockQuantity ?? "",
    status: product?.status || "ACTIVE",
    description: fullProduct?.description || product?.description || "",
    files: null,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#003399] px-6 py-6 text-center">
          <h2 className="text-2xl font-bold text-white tracking-wide">
            {isEditMode ? "แก้ไขข้อมูลสินค้า" : "จัดการสินค้าในคลัง"}
          </h2>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          <Formik
            enableReinitialize={true}
            initialValues={formInitialValues}
            validationSchema={ProductSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const formData = new FormData();

                const categoryMap: Record<string, number> = {
                  "โปรโมชั่น": 1,
                  "สบู่": 2,
                  "เครื่องดื่ม": 3,
                  "ผลิตภัณฑ์ดูแลผม": 4,
                };

                const statusMap: Record<string, number> = {
                  "ACTIVE": 1,
                  "CHECKED_OUT": 2,
                };

// 1. สร้างก้อนข้อมูลพื้นฐาน 6 ตัว (ใช้ได้ทั้ง Add และ Edit)
// ใส่ type : any ไว้ก่อนเพื่อที่เราจะยัดฟิลด์เพิ่มเข้าไปทีหลังได้
const requestPayload: any = {
  productName: values.productName,
  categoryId: categoryMap[values.categoryName] || 2,
  price: Number(values.price),
  stockQuantity: Number(values.stockQuantity),
  statusId: statusMap[values.status] || 1,
  description: values.description,
};

// 2. ถ้าเป็นโหมดแก้ไข (Edit) ค่อยแอบเติม removeImages เข้าไป
if (isEditMode) {
  requestPayload.removeImages = values.files && fullProduct?.productImages 
    ? fullProduct.productImages.map((img: any) => img.id) 
    : [];
}
                formData.append("request", JSON.stringify(requestPayload));

                if (values.files) {
                  formData.append("files", values.files);
                }

                if (isEditMode) {
                  await dispatch(editProduct({ id: product!.id, data: formData })).unwrap();
                  toast.success("แก้ไขสินค้าสำเร็จ");
                } else {
                  await dispatch(addProduct(formData)).unwrap();
                  toast.success("เพิ่มสินค้าสำเร็จ");
                }
                
                dispatch(getproducts({ page: 0, size: 1000 }));
                
                if (onSuccess) {
                  onSuccess();
                } else {
                  onClose();
                }
              } catch (error: any) {
                toast.error(error.message || (isEditMode ? "เกิดข้อผิดพลาดในการแก้ไขสินค้า" : "เกิดข้อผิดพลาดในการเพิ่มสินค้า"));
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
                      <option value="" disabled>-- เลือกหมวดหมู่ --</option>
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
                        setFieldValue("files", file);
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
                          setFieldValue("files", file);
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
                        <p className="text-sm text-gray-700 font-medium">
                          {isEditMode ? "คลิกเพื่ออัพโหลดหรือลากวางรูปใหม่" : "คลิกเพื่ออัพโหลดหรือลากวาง"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5 MB</p>
                        {isEditMode && <p className="text-xs text-blue-500 mt-2">(หากไม่ต้องการเปลี่ยนรูป ให้ปล่อยว่างไว้)</p>}
                      </>
                    )}
                  </div>
                  <ErrorMessage name="files" component="div" className="text-red-500 text-xs mt-1 text-center" />
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-center gap-4 pt-4 border-t border-gray-100 mt-4">
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-8 py-2 bg-[#EF4444] hover:bg-red-600 text-white rounded-md font-medium transition-colors c"
                    >
                      ลบสินค้า
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-2 bg-[#003399] hover:bg-blue-800 text-white rounded-md font-medium transition-colors disabled:bg-gray-400"
                  >
                    {isSubmitting ? "กำลังบันทึก..." : (isEditMode ? "แก้ไขสินค้า" : "บันทึก")}
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