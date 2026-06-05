import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import ProfileSidebar from "../../components/user/ProfileSidebar";
import { toast } from "react-hot-toast";
import {
  fetchAllAddresses,
  deleteAddress,
  addAdressDefault,
  addAddress,
  updateAddress,
  addressDropdown,
} from "../../redux/address/addressReducer";
import type { Address } from "../../types/address";
import { Icon } from "@iconify/react";

const AddressProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const addresses = useSelector((state: RootState) => state.address.addresses);
  const { provinces, districts, subdistricts } = useSelector(
    (state: RootState) => state.address,
  );
  const [zipcodes, setZipcodes] = useState<{ id: number; name: string }[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [targetAddressId, setTargetAddressId] = useState<string | null>(null);
  const [isBlocking, setIsBlocking] = useState(false);

  const [formData, setFormData] = useState({
    streetAddress: "",
    subDistrict: 0,
    district: 0,
    province: 0,
    zipcode: "",
    zipcodeId: 0,
  });

  const loadProvinces = async () => {
    try {
      await dispatch(
        addressDropdown({ provinceId: 0, districtId: 0, subdistrictId: 0 }),
      ).unwrap();
    } catch (error) {
      console.error("Failed to load provinces:", error);
    }
  };

  useEffect(() => {
    dispatch(fetchAllAddresses());
    loadProvinces(); // โหลดครั้งเดียว
  }, [dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openEditModal = (address: Address) => {
    setIsEditMode(true);
    setTargetAddressId(String(address.id));

    setIsModalOpen(true);

    fillAddressData(address);
  };

  const parseDropdownResponse = (response: any) => {
    if (Array.isArray(response)) return response;
    return response?.data || [];
  };

  const fillAddressData = async (address: Address) => {
    const streetAddress = address.streetAddress;
    const districtName = address.district;
    const subDistrictName = address.subdistrict;
    const provinceName = address.province;

    // จังหวัด
    const provinceRes = await dispatch(
      addressDropdown({ provinceId: 0, districtId: 0, subdistrictId: 0 }),
    ).unwrap();

    const province =
      provinceRes.find(
        (p: { id: number; name: string }) =>
          String(p.name).trim() === String(provinceName).trim(),
      )?.id || 0;

    setFormData((prev) => ({
      ...prev,
      streetAddress,
      province,
    }));

    //อำเภอ
    const districtRes = await dispatch(
      addressDropdown({
        provinceId: province,
        districtId: 0,
        subdistrictId: 0,
      }),
    ).unwrap();

    const district =
      districtRes.find(
        (d: { id: number; name: string }) =>
          String(d.name).trim() === String(districtName).trim(),
      )?.id || 0;

    setFormData((prev) => ({
      ...prev,
      district,
    }));

    //ตำบล
    const subRes = await dispatch(
      addressDropdown({
        provinceId: province,
        districtId: district,
        subdistrictId: 0,
      }),
    ).unwrap();

    const selectedSub = subRes.find(
      (s: { id: number; name: string }) =>
        String(s.name).trim() === String(subDistrictName).trim(),
    );

    const subDistrict = selectedSub?.id || 0;

    const zipRes = await dispatch(
      addressDropdown({
        provinceId: province,
        districtId: district,
        subdistrictId: subDistrict,
      }),
    ).unwrap();

    setZipcodes(zipRes);

    const zipcode = zipRes[0]?.name || "";
    const zipcodeId = zipRes[0]?.id || 0;

    setFormData((prev) => ({
      ...prev,
      subDistrict,
      zipcode,
      zipcodeId,
    }));
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({
      streetAddress: "",
      subDistrict: 0,
      district: 0,
      province: 0,
      zipcode: "",
      zipcodeId: 0,
    });
    setIsModalOpen(true);
  };

  const handleProvinceChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const pId = Number(e.target.value);

    setFormData((prev) => ({
      ...prev,
      province: pId,
      district: 0,
      subDistrict: 0,
      zipcode: "",
      zipcodeId: 0,
    }));

    setZipcodes([]);

    await dispatch(
      addressDropdown({
        provinceId: pId,
        districtId: 0,
        subdistrictId: 0,
      }),
    ).unwrap();
  };

  const handleSaveAddress = async () => {
    console.log("Current Form Data:", formData);
    const {
      streetAddress,
      subDistrict,
      district,
      province,
      zipcode,
      zipcodeId,
    } = formData;

    const fetchZipcodeInfo = async (zip: string, zipId: number) => {
      if (zip && zipId) {
        return { zipcode: zip, zipcodeId: zipId };
      }
      if (!province || !district || !subDistrict) {
        return { zipcode: "", zipcodeId: 0 };
      }

      const zipResRaw = await dispatch(
        addressDropdown({
          provinceId: province,
          districtId: district,
          subdistrictId: subDistrict,
        }),
      ).unwrap();
      const zipRes = parseDropdownResponse(zipResRaw);
      return {
        zipcode: zipRes?.[0]?.name || "",
        zipcodeId: zipRes?.[0]?.id || 0,
      };
    };

    const { zipcodeId: finalZipcodeId } = await fetchZipcodeInfo(
      zipcode,
      zipcodeId,
    );

    if (
      !streetAddress ||
      !subDistrict ||
      !district ||
      !province ||
      !finalZipcodeId
    ) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const isEdit = isEditMode && targetAddressId;

    if (isEdit) {
      const currentAddress = addresses.find(
        (a) => a.id === Number(targetAddressId),
      );

      await dispatch(
        updateAddress({
          id: Number(targetAddressId),
          data: {
            streetAddress,
            zipcodeId: finalZipcodeId,
            isDefault: currentAddress?.isDefault || false,
          },
        }),
      );

      toast.success("แก้ไขที่อยู่สำเร็จ");
    } else {
      await dispatch(
        addAddress({
          streetAddress,
          zipcodeId: finalZipcodeId,
          isDefault: false,
        }),
      );

      toast.success("เพิ่มที่อยู่สำเร็จ");
    }
    dispatch(fetchAllAddresses());
    setIsModalOpen(false);
  };

  //ลบที่อยู่
  const handleDeleteAddress = (addressId: number) => {
    setIsBlocking(true);

    const confirmDelete = (toastId: string) => {
      toast.dismiss(toastId);
      setIsBlocking(false);
      dispatch(deleteAddress(addressId));
      toast.success("ลบที่อยู่สำเร็จ", { duration: 800 });
    };

    const cancelDelete = (toastId: string) => {
      toast.dismiss(toastId);
      setIsBlocking(false);
    };

    toast(
      (t) => (
        <div className="flex flex-col gap-3 items-center p-3">
          <span className="text-gray-800 font-medium text-base">
            คุณต้องการลบที่อยู่นี้ใช่หรือไม่?
          </span>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => confirmDelete(t.id)}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              ลบ
            </button>
            <button
              onClick={() => cancelDelete(t.id)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: "top-center" },
    );
  };
  return (
    <div className="min-h-screen bg-white font-anuphan text-gray-950 pt-10 sm:pt-20 pb-20">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* 1. Nav อยู่ด้านบนสุด */}
        <div className="hidden md:block">
          <nav className="flex flex-wrap items-center text-sm md:text-md text-black mb-4 md:mb-4 font-medium">
            <Link
              data-test="click-home"
              to="/"
              className="transition-colors cursor-pointer"
            >
              หน้าหลัก
            </Link>
            <Icon
              icon="material-symbols:chevron-right-rounded"
              className="w-5 h-5 mx-1 text-black"
            />
            <Link
              to="/profile"
              data-test="click-profile"
              className="transition-colors cursor-pointer"
            >
              โปรไฟล์
            </Link>
            <Icon
              icon="material-symbols:chevron-right-rounded"
              className="w-5 h-5 mx-1 text-black"
            />
            <span className="text-black">จัดการที่อยู่</span>
          </nav>
        </div>
        <div className="md:hidden bg-white pt-2 pb-4">
          <div className="flex items-center gap-3">
            <button
              className="mt-[2px] text-black p-0 flex-shrink-0 -ml-2"
              onClick={() => navigate("/profile")}
            >
              <Icon icon="material-symbols:arrow-back" className="w-5 h-5" />
            </button>

            <div className="flex-1">
              <h1 className="text-[16px] leading-[28px] font-bold text-black">
                ที่อยู่ของฉัน
              </h1>
            </div>
          </div>

          <div className=" w-[calc(95%+16px)] border-t border-black mt-3 pt-1" />
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="hidden md:block">
            <ProfileSidebar />
          </div>

          <main className="flex flex-col flex-1 w-full bg-white md:rounded-lg shadow-none md:shadow-sm border-none md:border-gray-100 min-h-[calc(100vh-80px)] md:min-h-[500px] relative">
            <div className="flex justify-between items-center p-5 border-b border-none md:border-gray-100">
              <h1 className="hidden md:block text-[20px] sm:text-[20px] font-bold">
                ที่อยู่ของฉัน
              </h1>
              <button
                data-test="btn-add-address"
                onClick={openAddModal}
                className="hidden md:flex bg-[#4285F4] hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="text-xl leading-none">+</span> เพิ่มที่อยู่
              </button>
            </div>

            <div className="flex flex-col flex-1 w-full">
              {addresses.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                  <Icon
                    icon="basil:location-outline"
                    className="w-10 h-10 sm:w-30 sm:h-30 text-black mb-6"
                  />
                  <p className="text-[20px] sm:text-[36px] font-medium text-black mb-6">
                    ไม่มีข้อมูลที่อยู่
                  </p>
                </div>
              ) : (
                addresses.map((address: Address) => (
                  <div
                    key={address.id}
                    className="p-4 sm:p-5 flex flex-col gap-2 sm:gap-3 border-b border-gray-300 last:border-0"
                  >
                    {/* แถวที่ 1: ชื่อ | เบอร์โทร และปุ่ม แก้ไข | ลบ */}
                    <div className="flex justify-between items-start w-full">
                      <div className="flex items-center gap-2 text-sm sm:text-base">
                        <span className="font-medium text-black">
                          {address.receiverName}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500">
                          {address.receiverPhone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm shrink-0 ml-2">
                        <button
                          data-test="btn-edit-address"
                          onClick={() => openEditModal(address)}
                          className="text-[#4285F4] hover:underline cursor-pointer"
                        >
                          แก้ไข
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          data-test="btn-delete-address"
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-orange-500 hover:underline cursor-pointer"
                        >
                          ลบ
                        </button>
                      </div>
                    </div>

                    {/* แถวที่ 2: ที่อยู่ และปุ่ม ตั้งเป็นค่าเริ่มต้น */}
                    <div className="flex justify-between items-end gap-3 w-full">
                      <div className="text-sm text-gray-500 leading-relaxed flex-1">
                        {address.streetAddress} ต.{address.subdistrict} อ.
                        {address.district} จ.{address.province}{" "}
                        {address.zipcode}
                      </div>
                      <button
                        data-test="btn-set-default"
                        disabled={address.isDefault}
                        onClick={() => dispatch(addAdressDefault(address.id))}
                        className={`shrink-0 px-2 py-1 border rounded text-[12px] transition-colors ${
                          address.isDefault
                            ? "bg-white text-gray-400 border-gray-300 cursor-not-allowed"
                            : "bg-white text-gray-600 border-gray-400 hover:bg-gray-50 cursor-pointer"
                        }`}
                      >
                        ตั้งเป็นค่าเริ่มต้น
                      </button>
                    </div>

                    {/* แถวที่ 3: ป้าย Tag*/}
                    <div className="flex flex-wrap gap-2 mt-1">
                      {address.isDefault && (
                        <span className="px-2 py-0.5 text-[12px] bg-white text-[#4285F4] border border-[#4285F4]">
                          ค่าเริ่มต้น
                        </span>
                      )}
                      <span className="px-2 py-0.5 text-[12px] bg-white text-gray-500 border border-gray-400">
                        ที่อยู่ในการรับสินค้า
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div className="md:hidden sticky bottom-0 w-full p-4 bg-white border-t border-gray-100 z-50 mt-auto">
                <button
                  data-test="btn-add-address-mobile"
                  onClick={openAddModal}
                  className="w-full bg-[#4285F4] active:bg-blue-600 text-white py-2.5 rounded-md text-[15px] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <span className="text-xl leading-none mt-[-2px]">+</span>
                  เพิ่มที่อยู่
                </button>
              </div>
            </div>
          </main>
        </div>

        {isModalOpen && (
          <div className="fixed inset-x-0 top-[75px] bottom-0 z-[100] md:inset-0 p-4 flex items-start md:items-center justify-center md:p-6 bg-white md:bg-transparent overflow-y-auto">
            <div
              className="hidden md:block absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            />
            <div className="relative w-full min-h-full md:min-h-0 md:h-auto md:max-w-2xl bg-white md:rounded-xl md:shadow-2xl flex flex-col">
              {/* Header */}
              <div className="md:hidden bg-white pt-2 pb-4">
                <div className="flex items-center gap-3 pb-3">
                  <button
                    className="text-black p-0 flex-shrink-0"
                    onClick={() => navigate("/address-profile")}
                  >
                    <Icon
                      icon="material-symbols:arrow-back"
                      className="w-5 h-5"
                    />
                  </button>

                  <h1 className="text-[16px] leading-[28px] font-bold text-black">
                    {isEditMode ? "แก้ไขข้อมูลที่อยู่" : "ที่อยู่ใหม่"}
                  </h1>
                </div>
                <hr className="sm:hidden border-t-2 border-black w-full" />
              </div>
              <div className="hidden md:block px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                <h2 className="text-xl font-bold text-gray-800 text-[36px] stroke-[600px]">
                  {isEditMode ? "แก้ไขข้อมูลที่อยู่" : "ที่อยู่ใหม่"}
                </h2>
              </div>

              {/* Body: Scrollable area if content is long */}
              <div className="flex-1 md:flex-none p-4 md:p-6 overflow-y-auto md:max-h-[70vh]">
                <div className="space-y-5">
                  {/* ที่อยู่รายละเอียด */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      ที่อยู่ (บ้านเลขที่ / ถนน / ซอย)
                    </label>
                    <textarea
                      id="streetAddress"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      placeholder="ตัวอย่าง: 123/45 หมู่ 6 ซอยสุขุมวิท..."
                      className="w-full min-h-[100px] border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-[#4285F4] outline-none transition-all resize-none"
                    />
                  </div>

                  {/* แถวที่ 1: จังหวัด & อำเภอ */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-base md:text-sm font-normal md:font-semibold text-gray-700">
                        จังหวัด
                      </label>
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleProvinceChange}
                        className="w-full h-11 rounded-lg px-3 text-base md:text-sm bg-gray-100 md:bg-white border border-transparent md:border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#4285F4] outline-none appearance-none cursor-pointer"
                      >
                        <option value={0} hidden>กรุณาเลือกจังหวัด</option>
                        {provinces.map((p: { id: number; name: string }) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-base md:text-sm font-normal md:font-semibold text-gray-700">
                        เขต/อำเภอ
                      </label>
                      <select
                        name="district"
                        value={formData.district}
                        disabled={!formData.province}
                        onChange={async (
                          e: React.ChangeEvent<HTMLSelectElement>,
                        ) => {
                          const dId = Number(e.target.value);
                          setFormData((prev) => ({
                            ...prev,
                            district: dId,
                            subDistrict: 0,
                            zipcode: "",
                            zipcodeId: 0,
                          }));
                          setZipcodes([]);
                          await dispatch(
                            addressDropdown({
                              provinceId: formData.province,
                              districtId: dId,
                              subdistrictId: 0,
                            }),
                          ).unwrap();
                        }}
                        className="w-full h-11 rounded-lg px-3 text-base md:text-sm bg-gray-100 md:bg-white border border-transparent md:border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#4285F4] outline-none disabled:bg-gray-50 md:disabled:bg-gray-50 disabled:text-gray-400 appearance-none cursor-pointer"
                      >
                        <option value="" hidden>กรุณาเลือกอำเภอ</option>
                        {districts.map((d: { id: number; name: string }) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* แถวที่ 2: ตำบล & รหัสไปรษณีย์ */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-base md:text-sm font-normal md:font-semibold text-gray-700">
                        แขวง/ตำบล
                      </label>
                      <select
                        name="subDistrict"
                        value={formData.subDistrict}
                        disabled={!formData.district}
                        onChange={async (
                          e: React.ChangeEvent<HTMLSelectElement>,
                        ) => {
                          const sId = Number(e.target.value);
                          setFormData((prev) => ({
                            ...prev,
                            subDistrict: sId,
                            zipcode: "",
                          }));
                          const resRaw = await dispatch(
                            addressDropdown({
                              provinceId: formData.province,
                              districtId: formData.district,
                              subdistrictId: sId,
                            }),
                          ).unwrap();

                          const res = parseDropdownResponse(resRaw);
                          setZipcodes(res || []);

                          if (res?.length) {
                            setFormData((prev) => ({
                              ...prev,
                              zipcode: res?.[0]?.name || "",
                              zipcodeId: res?.[0]?.id || 0,
                            }));
                          }
                        }}
                        className="w-full h-11 rounded-lg px-3 text-base md:text-sm bg-gray-100 md:bg-white border border-transparent md:border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#4285F4] outline-none disabled:bg-gray-50 md:disabled:bg-gray-50 disabled:text-gray-400 appearance-none cursor-pointer"
                      >
                        <option value="" hidden>กรุณาเลือกตำบล</option>
                        {subdistricts.map((s: { id: number; name: string }) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-base md:text-sm font-normal md:font-semibold text-gray-700">
                        รหัสไปรษณีย์
                      </label>
                      <select
                        value={formData.zipcodeId}
                        disabled={!zipcodes.length}
                        onChange={(e) => {
                          const zId = Number(e.target.value);
                          const selected = zipcodes.find((z) => z.id === zId);

                          setFormData((prev) => ({
                            ...prev,
                            zipcodeId: zId,
                            zipcode: selected?.name || "",
                          }));
                        }}
                        className="w-full h-11 rounded-lg px-3 text-base md:text-sm bg-gray-100 md:bg-white border border-transparent md:border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-[#4285F4] outline-none disabled:bg-gray-50 md:disabled:bg-gray-50 disabled:text-gray-400 appearance-none cursor-pointer"
                      >
                        <option value="" hidden>กรุณาเลือกรหัสไปรษณีย์</option>
                        {zipcodes.map((z) => (
                          <option key={z.id} value={z.id}>
                            {z.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {/* Footer Actions */}
              <div className="p-4 md:px-6 md:py-5 bg-white md:bg-gray-50 flex flex-col-reverse md:flex-row gap-3 border-t border-gray-100 mt-auto">
                <button
                  data-test="btn-save-address"
                  onClick={handleSaveAddress}
                  className="w-full md:flex-[2] py-3 md:py-2.5 bg-green-500 md:bg-green-500 text-white rounded-md md:rounded-lg text-[15px] md:text-sm font-medium md:shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  {isEditMode ? "บันทึก" : "บันทึก"}
                </button>
                <button
                  data-test="btn-cancel-address"
                  onClick={() => setIsModalOpen(false)}
                  className="hidden md:block flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-white hover:border-gray-400 transition-all cursor-pointer"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}

        {isBlocking && (
          <div className="fixed inset-0 bg-white/20 z-[999] cursor-wait backdrop-blur-[1px]" />
        )}
      </div>
    </div>
  );
};

export default AddressProfile;
