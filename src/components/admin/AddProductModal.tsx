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

// ==========================================
// 1. TYPES & CONSTANTS
// ==========================================
interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  product?: ProductMod | null;
}

interface FormValues {
  productName: string;
  categoryName: string;
  price: number | "";
  stockQuantity: number | "";
  status: "ACTIVE" | "CHECKED_OUT";
  description: string;
  files: File | null;
}

const CATEGORY_MAP: Record<string, number> = {
  "โปรโมชั่น": 1,
  "สบู่": 2,
  "เครื่องดื่ม": 3,
  "ผลิตภัณฑ์ดูแลผม": 4,
};

const STATUS_MAP: Record<string, number> = {
  "ACTIVE": 1,
  "CHECKED_OUT": 2,
};

// ==========================================
// 2. HELPER FUNCTIONS (Pure Functions)
// ==========================================
const normalizeCategory = (category: string | number | undefined): string => {
  if (!category) return "";
  const catStr = String(category).toLowerCase().trim();

  if (["1", "promotion", "โปรโมชั่น", "โปรโมชัน"].includes(catStr)) return "โปรโมชั่น";
  if (["2", "soap", "สบู่"].includes(catStr)) return "สบู่";
  if (["3", "drink", "drinks", "เครื่องดื่ม"].includes(catStr)) return "เครื่องดื่ม";
  if (["4", "hair", "shampoo", "แชมพู", "ผลิตภัณฑ์ดูแลผม"].includes(catStr)) return "ผลิตภัณฑ์ดูแลผม";

  return String(category);
};

const normalizeStatus = (status: any): "ACTIVE" | "CHECKED_OUT" => {
  if (!status) return "ACTIVE";
  const statStr = String(typeof status === "object" ? (status.name || status.statusName || status.id) : status)
    .toUpperCase()
    .trim();

  if (["2", "CHECKED_OUT", "INACTIVE", "ไม่พร้อมจำหน่าย", "ไม่จำหน่าย"].includes(statStr)) {
    return "CHECKED_OUT";
  }
  return "ACTIVE";
};

// ==========================================
// 3. VALIDATION SCHEMA
// ==========================================
const ProductSchema = Yup.object().shape({
  productName: Yup.string().required("กรอกข้อมูลสินค้าไม่ครบถ้วน"),
  categoryName: Yup.string().required("กรอกข้อมูลสินค้าไม่ครบถ้วน"),
  price: Yup.number().typeError("ราคาสินค้าควรเป็นตัวเลข").min(0, "ราคาต้องไม่ต่ำกว่า 0").required("กรอกข้อมูลสินค้าไม่ครบถ้วน"),
  stockQuantity: Yup.number().typeError("จำนวนสินค้าควรเป็นตัวเลข").min(0, "จำนวนต้องไม่ต่ำกว่า 0").required("กรอกข้อมูลสินค้าไม่ครบถ้วน"),
  status: Yup.string().required("กรอกข้อมูลสินค้าไม่ครบถ้วน"),
  description: Yup.string().required("กรอกข้อมูลสินค้าไม่ครบถ้วน"),
});

// ==========================================
// 4. MAIN COMPONENT
// ==========================================
export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSuccess, product }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fullProduct, setFullProduct] = useState<any>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const isEditMode = !!product;

  // 🌟 useEffect ถูกหลักอนามัย React ดักจับ Race Condition และใช้ Cleanup Function
  useEffect(() => {
    let isMounted = true;

    const fetchDetail = async () => {
      if (isOpen && isEditMode && product?.id) {
        const detail = await ProductService.getProductById(product.id);
        if (isMounted) {
          setFullProduct(detail);
          if (detail.productImages?.length > 0) {
            setPreviewImage(detail.productImages[0].imageUrl);
          }
        }
      } else if (!isOpen) {
        setPreviewImage(null);
        setFullProduct(null);
      }
    };
    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [isOpen, isEditMode, product?.id]);

  if (!isOpen) return null;

  const handleCloseModal = () => {
    if (onSuccess) onSuccess();
    else onClose();
  };

  const refreshProductList = () => {
    dispatch(getproducts({ page: 0, size: 1000 }));
  };

  const getRemovedImages = (hasNewFile: boolean) => {
    if (isEditMode && hasNewFile && fullProduct?.productImages) {
      return fullProduct.productImages.map((img: any) => img.id);
    }
    return [];
  };

  // 🛠️ ฟังก์ชัน Toast ยืนยันตรงกลาง: เพิ่มพารามิเตอร์ isDanger เพื่อสลับสีปุ่ม ยืนยัน
  const showConfirmToast = (message: string, isDanger = false): Promise<boolean> => {
    return new Promise((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col items-center justify-center text-center p-1 w-full min-w-[250px]">
            <p className="mb-4 text-gray-800 font-medium">{message}</p>
            <div className="flex justify-center gap-3 w-full">
              <button
                onClick={() => { toast.dismiss(t.id); resolve(true); }}
                // 📌 ถ้าเป็นเคสลบ (isDanger === true) จะใช้สีแดง [#EF4444] ถ้าเคสทั่วไปจะใช้สีน้ำเงิน [#003399]
                className={`px-5 py-1.5 text-white rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  isDanger ? "bg-[#EF4444] hover:bg-red-600" : "bg-[#003399] hover:bg-blue-800"
                }`}
              >
                ยืนยัน
              </button>
              <button
                onClick={() => { toast.dismiss(t.id); resolve(false); }}
                className="px-5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        ),
        { duration: Infinity }
      );
    });
  };

  // ลบสินค้า
  const handleDelete = async () => {
    if (!product) return;
    // 📌 ส่งค่า true เข้าไปในพารามิเตอร์ตัวที่สอง เพื่อบอกว่าเป็นเคสอันตราย ปุ่มยืนยันจะเป็นสีแดง
    const isConfirmed = await showConfirmToast("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?", true);
    if (!isConfirmed) return;

    try {
      await dispatch(deleteProduct(product.id)).unwrap();
      toast.success("ลบสินค้าสำเร็จ");
      refreshProductList();
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.message || "เกิดข้อผิดพลาดในการลบสินค้า");
    }
  };

  // ยกเลิกการแก้ไขข้อมูลสินค้า
  const handleCancel = async () => {
    const isConfirmed = await showConfirmToast("คุณต้องการละทิ้งการเปลี่ยนแปลงหรือไม่?");
    if (isConfirmed) onClose();
  };

  const handleFileChange = (file: File | undefined, setFieldValue: any) => {
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      toast.error("ไฟล์รูปภาพไม่รองรับ หรือขนาดใหญ่เกิน 5MB");
      return;
    }

    setFieldValue("files", file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const formInitialValues: FormValues = {
    productName: product?.productName || "",
    categoryName: normalizeCategory(product?.category),
    price: product?.price ?? "",
    stockQuantity: product?.stockQuantity ?? "",
    status: normalizeStatus(fullProduct?.status || product?.status),
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
            enableReinitialize
            initialValues={formInitialValues}
            validationSchema={ProductSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                if (isEditMode && !(await showConfirmToast("คุณแน่ใจหรือไม่ว่าต้องการแก้ไขสินค้านี้?"))) {
                  return;
                }

                const formData = new FormData();
                const requestPayload = {
                  productName: values.productName,
                  categoryId: CATEGORY_MAP[values.categoryName] || 2,
                  price: Number(values.price),
                  stockQuantity: Number(values.stockQuantity),
                  statusId: STATUS_MAP[values.status] || 1,
                  description: values.description,
                  removeImages: getRemovedImages(!!values.files),
                };

                formData.append("request", JSON.stringify(requestPayload));
                if (values.files) formData.append("files", values.files);

                if (isEditMode) {
                  await dispatch(editProduct({ id: product.id, data: formData })).unwrap();
                  toast.success("แก้ไขข้อมูลสินค้าเรียบร้อยแล้ว");
                } else {
                  await dispatch(addProduct(formData)).unwrap();
                  toast.success("เพิ่มสินค้าเรียบร้อยแล้ว");
                }

                refreshProductList();
                handleCloseModal();
              } catch (error: any) {
                toast.error(error.message || (isEditMode ? "เกิดข้อผิดพลาดในการแก้ไขสินค้า" : "เกิดข้อผิดพลาดในการเพิ่มสินค้า"));
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ setFieldValue, isSubmitting }) => (
              <Form className="space-y-5">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ราคา</label>
                    <Field
                      type="number"
                      min={0}
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
                      min={0}
                      name="stockQuantity"
                      placeholder="จำนวนสินค้า"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400"
                    />
                    <ErrorMessage name="stockQuantity" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

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

                {/* Dropzone Area */}
                <div>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFileChange(e.dataTransfer.files[0], setFieldValue);
                    }}
                  >
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={(e) => handleFileChange(e.target.files?.[0], setFieldValue)}
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
                      data-test={`delete-product-${product?.id}`}
                      onClick={handleDelete}
                      className="px-8 py-2 bg-[#EF4444] hover:bg-red-600 text-white rounded-md font-medium transition-colors cursor-pointer"
                    >
                      ลบสินค้า
                    </button>
                  )}
                  <button
                    type="submit"
                    data-test={isEditMode ? `submit-product-${product?.id}` : "submit-product-add"}
                    disabled={isSubmitting}
                    className="px-8 py-2 bg-[#003399] hover:bg-blue-800 text-white rounded-md font-medium transition-colors disabled:bg-gray-400 cursor-pointer"
                  >
                    {isSubmitting ? "กำลังบันทึก..." : (isEditMode ? "แก้ไขสินค้า" : "บันทึก")}
                  </button>
                  <button
                    type="button"
                    data-test="cancel-edit-product"
                    onClick={handleCancel}
                    className="px-8 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md font-medium transition-colors cursor-pointer"
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