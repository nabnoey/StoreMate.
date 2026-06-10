import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import { getStore, updateStore } from "../../redux/owner/ownerReducer";
import { toast } from "react-hot-toast";
import type { AppDispatch, RootState } from "../../redux/store";

const StoreEditSchema = Yup.object().shape({
  storeName: Yup.string().required("กรุณากรอกชื่อร้านค้า"),
  email: Yup.string().email("รูปแบบอีเมลไม่ถูกต้อง").required("กรุณากรอกอีเมลร้านค้า"),
  phone: Yup.string().required("กรุณากรอกเบอร์โทรศัพท์"),
  streetAddress: Yup.string().required("กรุณากรอกที่อยู่"),
  province: Yup.string().required("กรุณาเลือกจังหวัด"),
  district: Yup.string().required("กรุณาเลือกอำเภอ"),
  subdistrict: Yup.string().required("กรุณาเลือกตำบล"),
  zipcode: Yup.string().required("กรุณาเลือกรหัสไปรษณีย์"),
});

function StoreEdit() {
  const dispatch = useDispatch<AppDispatch>();
  const { store, loading } = useSelector((state: RootState) => state.owner);

  useEffect(() => {
    dispatch(getStore());
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: store?.id || 0,
      storeName: store?.storeName || "",
      email: store?.email || "",
      phone: store?.phone || "",
      streetAddress: store?.streetAddress || "",
      province: store?.province || "",
      district: store?.district || "",
      subdistrict: store?.subdistrict || "",
      zipcode: store?.zipcode || "",
      promotionImage: store?.promotionImage || "",
    },
    validationSchema: StoreEditSchema,
    onSubmit: (values) => {
      console.log("Submit values:", values);
      dispatch(updateStore(values as import("../../types/owner").Store))
        .unwrap()
        .then(() => {
          toast.success("บันทึกข้อมูลร้านค้าสำเร็จ");
        })
        .catch((error) => {
          console.error("Update store failed:", error);
          toast.error("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        });
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("promotionImage", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const inputClass = "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
  const errorClass = "border-red-500 focus:ring-red-500/20 focus:border-red-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
  const errorTextClass = "text-red-500 text-xs mt-1";

  const getInputClass = (fieldName: keyof typeof formik.values) => {
    return `${inputClass} ${formik.touched[fieldName] && formik.errors[fieldName] ? errorClass : ""}`;
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <HeaderAdmin
        title="ตั้งค่าร้านค้า"
        subtitle="จัดการข้อมูลและรูปลักษณ์ของร้านค้าของคุณ"
      />

      <div className="p-6 text-[#374151]">
        {/* Main Card Container */}
        <form 
          onSubmit={formik.handleSubmit}
          className="bg-[#F8F9FA] rounded-2xl border border-gray-100 shadow-sm p-8 max-w-4xl mx-auto space-y-8"
        >
          {loading && (
            <div className="text-center text-gray-500 mb-4">กำลังโหลดข้อมูลร้านค้า...</div>
          )}
          
          {/* ข้อมูลร้านค้า */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4">ข้อมูลร้านค้า</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>ชื่อร้านค้า</label>
                <input
                  type="text"
                  name="storeName"
                  placeholder="ชื่อร้านค้า"
                  value={formik.values.storeName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getInputClass("storeName")}
                />
                {formik.touched.storeName && formik.errors.storeName && (
                  <div className={errorTextClass}>{formik.errors.storeName}</div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>อีเมลร้านค้า</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="shop@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={getInputClass("email")}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className={errorTextClass}>{formik.errors.email}</div>
                  )}
                </div>
                <div>
                  <label className={labelClass}>เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="099-999-9999"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={getInputClass("phone")}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <div className={errorTextClass}>{formik.errors.phone}</div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ที่อยู่ร้านค้า */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4">ที่อยู่ร้านค้า</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>ที่อยู่</label>
                <input
                  type="text"
                  name="streetAddress"
                  placeholder="บ้านเลขที่ / ถนน / ซอย"
                  value={formik.values.streetAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getInputClass("streetAddress")}
                />
                {formik.touched.streetAddress && formik.errors.streetAddress && (
                  <div className={errorTextClass}>{formik.errors.streetAddress as string}</div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>จังหวัด</label>
                  <input
                    type="text"
                    name="province"
                    placeholder="จังหวัด"
                    value={formik.values.province}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={getInputClass("province")}
                  />
                  {formik.touched.province && formik.errors.province && (
                    <div className={errorTextClass}>{formik.errors.province as string}</div>
                  )}
                </div>
                <div>
                  <label className={labelClass}>อำเภอ</label>
                  <input
                    type="text"
                    name="district"
                    placeholder="อำเภอ"
                    value={formik.values.district}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={getInputClass("district")}
                  />
                  {formik.touched.district && formik.errors.district && (
                    <div className={errorTextClass}>{formik.errors.district as string}</div>
                  )}
                </div>
                <div>
                  <label className={labelClass}>ตำบล</label>
                  <input
                    type="text"
                    name="subdistrict"
                    placeholder="ตำบล"
                    value={formik.values.subdistrict}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={getInputClass("subdistrict")}
                  />
                  {formik.touched.subdistrict && formik.errors.subdistrict && (
                    <div className={errorTextClass}>{formik.errors.subdistrict as string}</div>
                  )}
                </div>
                <div>
                  <label className={labelClass}>รหัสไปรษณีย์</label>
                  <input
                    type="text"
                    name="zipcode"
                    placeholder="รหัสไปรษณีย์"
                    value={formik.values.zipcode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={getInputClass("zipcode")}
                  />
                  {formik.touched.zipcode && formik.errors.zipcode && (
                    <div className={errorTextClass}>{formik.errors.zipcode as string}</div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* รูปพื้นหลัง */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4">รูปพื้นหลัง</h2>
            <div className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center relative">
              {preview || formik.values.promotionImage ? (
                <div className="mb-4 text-center">
                  <img 
                    src={preview || (typeof formik.values.promotionImage === 'string' ? formik.values.promotionImage : '')} 
                    alt="Preview" 
                    className="max-h-40 rounded-lg object-contain mx-auto mb-2"
                  />
                  <p className="text-sm text-gray-600 truncate max-w-xs">
                    {typeof formik.values.promotionImage === 'object' && formik.values.promotionImage !== null 
                      ? (formik.values.promotionImage as File).name 
                      : 'รูปภาพปัจจุบัน'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 mb-4 text-gray-600 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    ลากและวางไฟล์เพื่ออัพโหลด
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    PNG, JPEG, JPG up to 5 MB
                  </p>
                  <div className="flex items-center w-full max-w-[200px] mb-4">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="px-3 text-xs text-gray-400">หรือ</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                </>
              )}
              
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="px-6 py-2 bg-[#3B82F6] hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {preview || formik.values.promotionImage ? "เปลี่ยนรูปภาพ" : "เลือกไฟล์"}
              </button>
            </div>
          </section>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-8 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              บันทึก
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default StoreEdit;
