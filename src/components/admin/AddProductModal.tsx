import React, { useRef, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
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
// 2. HELPER FUNCTIONS
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

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSuccess, product }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State สำหรับจัดการรูปภาพหลายรูป
  const [existingImages, setExistingImages] = useState<{ id: number; url: string }[]>([]);
  const [newImages, setNewImages] = useState<{ file: File; preview: string }[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);
  
  const [fullProduct, setFullProduct] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const isEditMode = !!product;

  useEffect(() => {
    let isMounted = true;

    const fetchDetail = async () => {
      if (isOpen && isEditMode && product?.id) {
        const detail = await ProductService.getProductById(product.id);
        if (isMounted) {
          setFullProduct(detail);
          if (detail.productImages?.length > 0) {
            // โหลดรูปภาพเดิมจาก Database
            setExistingImages(
              detail.productImages.map((img: any) => ({
                id: img.id,
                url: img.imageUrl,
              }))
            );
          }
        }
      } else if (!isOpen) {
        // เคลียร์ค่าเมื่อปิด Modal
        setExistingImages([]);
        setNewImages([]);
        setRemovedImageIds([]);
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

  const showConfirmToast = (message: string, isDanger = false): Promise<boolean> => {
    return new Promise((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col items-center justify-center text-center p-1 w-full min-w-[250px]">
            <p className="mb-4 text-gray-800 font-medium">{message}</p>
            <div className="flex justify-center gap-3 w-full">
              <button
                onClick={() => { toast.dismiss(t.id); resolve(true); }}
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

  // จัดการลบสินค้า
  const handleDelete = async () => {
    if (!product) return;
    const isConfirmed = await showConfirmToast("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?", true);
    if (!isConfirmed) return;

    try {
      await dispatch(deleteProduct(product.id)).unwrap();
      toast.success("ลบสินค้าสำเร็จ");
      refreshProductList();
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.message || "ไม่สามารถลบสินค้าที่มีประวัติการสั่งซื้อได้", { duration: 1000 });
      onClose();
    }
  };

  const isImagesDirty = newImages.length > 0 || removedImageIds.length > 0;

  // ยกเลิกการแก้ไขข้อมูลสินค้า
  const handleCancel = async (isDirty: boolean) => {
    if (!isDirty && !isImagesDirty) {
      onClose();
      return;
    }
    const isConfirmed = await showConfirmToast("คุณต้องการละทิ้งการเปลี่ยนแปลงหรือไม่?");
    if (isConfirmed) onClose();
  };

  // จัดการเลือกไฟล์รูปภาพ (หลายรูป)
  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    const validFiles: { file: File; preview: string }[] = [];
    
    Array.from(files).forEach((file) => {
      if (["image/png", "image/jpeg", "image/jpg"].includes(file.type) && file.size <= 5 * 1024 * 1024) {
        validFiles.push({ file, preview: URL.createObjectURL(file) });
      } else {
        toast.error(`ไฟล์ ${file.name} ไม่รองรับ หรือขนาดใหญ่เกิน 5MB`);
      }
    });

    setNewImages((prev) => [...prev, ...validFiles]);
  };

  // จัดการลบรูปภาพ (ทั้งรูปเก่าและรูปใหม่)
  const handleRemoveImage = (index: number) => {
    if (index < existingImages.length) {
      // ลบรูปภาพที่มีอยู่ในระบบ
      const imgToRemove = existingImages[index];
      setRemovedImageIds((prev) => [...prev, imgToRemove.id]);
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      // ลบรูปภาพที่เพิ่งเลือกมาใหม่
      const newIndex = index - existingImages.length;
      setNewImages((prev) => prev.filter((_, i) => i !== newIndex));
    }
  };

  // รวมรูปภาพทั้งหมดเพื่อแสดงผลใน UI
  const displayImages = [
    ...existingImages.map((img) => img.url),
    ...newImages.map((img) => img.preview)
  ];

  const formInitialValues: FormValues = {
    productName: product?.productName || "",
    categoryName: normalizeCategory(product?.category),
    price: product?.price ?? "",
    stockQuantity: product?.stockQuantity ?? "",
    status: normalizeStatus(fullProduct?.status || product?.status),
    description: fullProduct?.description || product?.description || "",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[600px] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#1e3a8a] px-6 py-5 text-center shrink-0">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
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

                // ป้องกันกรณีที่ไม่ได้ใส่รูปเลย (ถ้า Business logic บังคับให้มีรูป)
                if (displayImages.length === 0) {
                  toast.error("กรุณาเพิ่มรูปภาพสินค้าอย่างน้อย 1 รูป");
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
                  removeImages: removedImageIds, // ส่ง Array ของ ID รูปที่ต้องการลบ
                };

                formData.append("request", JSON.stringify(requestPayload));
                
                // Append ไฟล์ใหม่ทั้งหมดเข้าไป (ชื่อ Key "files" ใช้สำหรับรับแบบ List/Array ในฝั่ง Backend)
                newImages.forEach((img) => {
                  formData.append("files", img.file);
                });

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
            {({ isSubmitting, dirty }) => (
              <Form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า</label>
                    <Field
                      type="text"
                      name="productName"
                      placeholder="ชื่อสินค้า"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400"
                    />
                    <ErrorMessage name="productName" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div className="md:col-span-1">
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
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700 placeholder-gray-400"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                {/* ==============================================
                    ส่วนแสดงและอัปโหลดรูปภาพ (UI ตาม Figma) 
                    ============================================== */}
                <div className="flex flex-col gap-4 mt-2 w-full">
                  {/* รูปภาพหลัก (รูปแรก) */}
                  {displayImages.length > 0 && (
                    <div className="relative w-full max-w-[220px] h-[220px] mx-auto border border-gray-200 rounded-xl p-2 bg-white shadow-sm">
                      <img
                        src={displayImages[0]}
                        alt="Main Product"
                        className="w-full h-full object-contain rounded-lg"
                      />
                      <button 
                        type="button"
                        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 w-7 h-7 flex items-center justify-center text-xs shadow-md hover:bg-red-600 transition-colors"
                        onClick={() => handleRemoveImage(0)}
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* รูปภาพย่อย (Thumbnail) */}
                  {displayImages.length > 1 && (
                    <div className="flex flex-wrap gap-4 justify-center mt-2">
                      {displayImages.slice(1, 4).map((img, index) => (
                        <div key={index + 1} className="relative w-24 h-24 border border-gray-200 rounded-lg p-1 bg-white shadow-sm">
                          <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-contain rounded-md"
                          />
                          <button 
                            type="button"
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] shadow-md hover:bg-red-600 transition-colors"
                            onClick={() => handleRemoveImage(index + 1)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      
                      {/* กล่องแสดงจำนวนรูปที่เหลือ (ถ้ามีมากกว่า 4 รูป) */}
                      {displayImages.length > 4 && (
                        <div className="w-24 h-24 bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 font-bold text-lg">
                          +{displayImages.length - 4}
                        </div>
                      )}
                    </div>
                  )}

                  {/* พื้นที่อัปโหลดรูปภาพ (Drag & Drop Zone) */}
                  <div 
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors mt-2"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFileChange(e.dataTransfer.files);
                    }}
                  >
                    <input 
                      type="file" 
                      multiple 
                      accept="image/png, image/jpeg, image/jpg" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={(e) => handleFileChange(e.target.files)} 
                    />
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mb-2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span className="text-gray-700 font-medium mb-1">คลิกเพื่ออัพโหลดหรือลากวาง</span>
                    <span className="text-gray-400 text-xs">PNG, JPG up to 5 MB</span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-center gap-4 pt-4 mt-6">
                  {isEditMode && (
                    <button
                      type="button"
                      data-test={`delete-product-${product?.id}`}
                      onClick={handleDelete}
                      className="px-6 py-2 bg-[#EF4444] hover:bg-red-600 text-white rounded-md font-medium transition-colors cursor-pointer"
                    >
                      ลบสินค้า
                    </button>
                  )}
                  <button
                    type="submit"
                    data-test={isEditMode ? `submit-product-${product?.id}` : "submit-product-add"}
                    disabled={isSubmitting || (isEditMode && !dirty && !isImagesDirty)}
                    className="px-8 py-2 bg-[#1e3a8a] hover:bg-blue-800 text-white rounded-md font-medium transition-colors disabled:bg-gray-400 cursor-pointer"
                  >
                    {isEditMode ? "แก้ไขสินค้า" : "บันทึก"}
                  </button>
                  <button
                    type="button"
                    data-test="cancel-edit-product"
                    onClick={() => handleCancel(dirty)}
                    className="px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md font-medium transition-colors cursor-pointer"
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