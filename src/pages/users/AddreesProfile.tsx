import { useState, useEffect } from "react";
import {
  getProvinces,
  getDistricts,
  getSubDistricts,
  getZipcode,
} from "../../utils/addressHelper";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import {
  addAddress,
  fetchAllAddresses,

} from "../../redux/address/addressReducer";
import ProfileSidebar from "../../components/user/ProfileSidebar";
import { useFormik } from "formik";
import type { AddressRequest, AddressResponse } from "../../types/address";
import toast from "react-hot-toast";


const AddressProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const addresses = useSelector((state: RootState) => state.address.addresses);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [targetAddressId, setTargetAddressId] = useState<number | null>(null);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [subDistricts, setSubDistricts] = useState<string[]>([]);

  

  useEffect(() => {
    dispatch(fetchAllAddresses());
    setProvinces(getProvinces());
   
  }, [dispatch]);

  const openAddModal = () => {
    formik.resetForm();
    setIsModalOpen(true);
  };

  const formik = useFormik({
    initialValues: {
      addressLine: "",
      province: "",
      district: "",
      subDistrict: "",
      zipcode: "",
      isDefault: false,
    },
    onSubmit: (values) => {
      // รวมข้อมูลเป็น string เดียวเพื่อส่งให้ API ตาม Swagger
      const combinedStreetAddress = `${values.addressLine} ต.${values.subDistrict} อ.${values.district} จ.${values.province}`;

      const payload: AddressRequest = {
        streetAddress: combinedStreetAddress,
        zipcodeId: Number(values.zipcode),
        isDefault: values.isDefault,
      };

      dispatch(addAddress(payload))
        .unwrap()
        .then(() => {
          toast.success("เพิ่มที่อยู่สำเร็จ");
          setIsModalOpen(false);
          formik.resetForm();
        })
        .catch(() => {
          toast.error("เพิ่มที่อยู่ไม่สำเร็จ");
        });
    },
  });

  const handleProvinceChange = (value: string) => {
    formik.setFieldValue("province", value);

    const d = getDistricts(value);
    setDistricts(d);

    setSubDistricts([]);
    formik.setFieldValue("district", "");
    formik.setFieldValue("subDistrict", "");
  };

  const handleDistrictChange = (value: string) => {
    formik.setFieldValue("district", value);

    const s = getSubDistricts(formik.values.province, value);
    setSubDistricts(s);

    formik.setFieldValue("subDistrict", "");
  };

  const handleSubDistrictChange = (value: string) => {
    formik.setFieldValue("subDistrict", value);

    const zip = getZipcode(
      formik.values.province,
      formik.values.district,
      value,
    );

    formik.setFieldValue("zipcode", zip);
  };

  const confirmDelete = () => {
    // ใส่ logic ลบที่อยู่ตรงนี้ (ถ้ามี reducer ลบ)
    console.log("Delete ID:", targetAddressId);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-4 sm:pt-12 pb-20 font-sans text-gray-800">
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row gap-6">
        <ProfileSidebar />

        <main className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 min-h-[500px] overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <h1 className="text-lg font-bold">ที่อยู่ของฉัน</h1>
            <button
              onClick={openAddModal}
              className="bg-[#4285F4] hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm flex items-center gap-1 transition-colors"
            >
              <span className="text-xl leading-none">+</span> เพิ่มที่อยู่
            </button>
          </div>

          <div className="flex flex-col">
            {addresses.length === 0 ? (
              <div className="p-20 text-center text-gray-400 text-sm">
                ยังไม่มีข้อมูลที่อยู่
              </div>
            ) : (
              addresses.map((address: AddressResponse) => (
                <div
                  key={address.id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between border-b border-gray-50 last:border-0 gap-4"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                      <span className="font-medium text-black">
                        {address.receiverName}
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-500">
                        {address.receiverPhone}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 leading-relaxed">
                      {address.fullAddress}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {address.isDefault && (
                        <span className="px-2 py-0.5 border border-[#4285F4] text-[#4285F4] text-[11px] rounded-[3px]">
                          ค่าเริ่มต้น
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between min-w-[120px]">
                    <div className="flex items-center gap-2 text-sm order-2 sm:order-1">
                      <button className="text-[#4285F4] hover:underline">
                        แก้ไข
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => {
                          setTargetAddressId(address.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-orange-500 hover:underline"
                      >
                        ลบ
                      </button>
                    </div>
                    <button
                      disabled={address.isDefault}
                      className={`order-1 sm:order-2 px-3 py-1 border rounded text-[12px] transition-colors ${
                        address.isDefault
                          ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      ตั้งเป็นค่าเริ่มต้น
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex justify-center items-center p-4 backdrop-blur-[1px]">
          <div className="bg-white rounded-lg w-full max-w-[550px] shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">ที่อยู่ใหม่</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-600">ที่อยู่</label>
                <input
                  name="addressLine"
                  value={formik.values.addressLine}
                  onChange={formik.handleChange}
                  placeholder="บ้านเลขที่ / ถนน / ซอย"
                  className="w-full border border-gray-300 rounded-[4px] p-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">จังหวัด</label>
                  <select
                    name="province"
                    value={formik.values.province}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-[4px] p-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="">เลือกจังหวัด</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">อำเภอ</label>

                  <select
                    name="district"
                    value={formik.values.district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    disabled={!formik.values.province}
                    className="w-full border border-gray-300  rounded-[4px] p-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="">เลือกอำเภอ</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
  <label className="text-sm text-gray-600">ตำบล</label>

  <select
    name="subDistrict"
    value={formik.values.subDistrict}
    onChange={(e) => handleSubDistrictChange(e.target.value)}
    disabled={!formik.values.district}
    className="w-full border border-gray-300 rounded-[4px] p-2.5 text-sm outline-none focus:border-blue-500"
  >
    <option value="">เลือกตำบล</option>

    {subDistricts.map((subDistrict) => (
      <option key={subDistrict} value={subDistrict}>
        {subDistrict}
      </option>
    ))}
  </select>
</div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">รหัสไปรษณีย์</label>
                  <input
                    name="zipcode"
                    value={formik.values.zipcode}
                    readOnly
                    placeholder="xxxxx"
                    className="w-full border border-gray-300 rounded-[4px] p-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => formik.handleSubmit()}
                className="flex-1 bg-[#4285F4] hover:bg-blue-600 text-white py-2.5 rounded-[4px] text-sm font-medium"
              >
                บันทึกที่อยู่
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-[4px] text-sm font-medium hover:bg-gray-50"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-[350px] shadow-xl text-center">
            <p className="text-gray-700 mb-6 font-medium">
              ยืนยันการลบที่อยู่นี้หรือไม่?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2 border border-gray-300 rounded-[4px] text-sm hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 bg-orange-500 text-white rounded-[4px] text-sm hover:bg-orange-600"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressProfile;
