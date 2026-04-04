import { useState, useEffect } from "react";
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

const AddressProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const addresses = useSelector((state: RootState) => state.address.addresses);
  const { provinces, districts, subdistricts } = useSelector(
    (state: RootState) => state.address,
  );

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
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

  const fillAddressData = async (address: Address) => {
    const full = address.fullAddress;

    const streetAddress = full.split(" ต.")[0] || "";
    const subDistrictName = full.split("ต.")[1]?.split(" ")[0] || "";
    const districtName = full.split("อ.")[1]?.split(" ")[0] || "";
    const provinceName = full.split("จ.")[1]?.split(" ")[0] || "";

    // จังหวัด
    const provinceRes = await dispatch(
      addressDropdown({ provinceId: 0, districtId: 0, subdistrictId: 0 }),
    ).unwrap();

    const province = provinceRes.find((p) => p.name === provinceName)?.id || 0;

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

    const district = districtRes.find((d) => d.name === districtName)?.id || 0;

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

    const selectedSub = subRes.find((s) => s.name === subDistrictName);

    const subDistrict = selectedSub?.id || 0;
    const zipcode = selectedSub?.zipcode || "";

    setFormData((prev) => ({
      ...prev,
      subDistrict,
      zipcode,
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
    });
    setIsModalOpen(true);
  };

  const handleProvinceChange = async (e) => {
    const pId = Number(e.target.value);

    setFormData((prev) => ({
      ...prev,
      province: pId,
      district: 0,
      subDistrict: 0,
      zipcode: "",
    }));

    const res = await dispatch(
      addressDropdown({
        provinceId: pId,
        districtId: 0,
        subdistrictId: 0,
      }),
    ).unwrap();
  };

  const handleSaveAddress = async () => {
    const { streetAddress, subDistrict, district, province, zipcode } =
      formData;
    if (!streetAddress || !subDistrict || !district || !province || !zipcode) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const selectedSubdistrict = subdistricts.find((s) => s.id === subDistrict);
    const selectedDistrict = districts.find((d) => d.id === district);
    const selectedProvince = provinces.find((p) => p.id === province);
    const fullAddress = `${streetAddress} ต.${selectedSubdistrict?.name || ""} อ.${selectedDistrict?.name || ""} จ.${selectedProvince?.name || ""} ${zipcode || ""}`;

    if (isEditMode && targetAddressId) {
      await dispatch(
        updateAddress({
          id: Number(targetAddressId),
          data: {
            streetAddress: streetAddress,
            zipcodeId: zipcode,
            isDefault:
              addresses.find((a) => a.id === Number(targetAddressId))
                ?.isDefault || false,
          },
        }),
      );
      toast.success("แก้ไขที่อยู่สำเร็จ");
    } else {
      await dispatch(
        addAddress({
          streetAddress: streetAddress,
          zipcodeId: zipcode,
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
    <div className="min-h-screen bg-[#f5f5f5] pt-4 sm:pt-12 pb-20 font-sans text-gray-800">
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row gap-6">
        <ProfileSidebar />

        <main className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 min-h-[500px] overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <h1 className="text-lg font-bold">ที่อยู่ของฉัน</h1>
            <button
              data-test="btn-add-address"
              onClick={openAddModal}
              className="bg-[#4285F4] hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span className="text-xl leading-none ">+</span> เพิ่มที่อยู่
            </button>
          </div>

          <div className="flex flex-col">
            {addresses.length === 0 ? (
              <div className="p-20 text-center text-gray-400 text-sm">
                ยังไม่มีข้อมูลที่อยู่
              </div>
            ) : (
              addresses.map((address: Address) => (
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
                      {address.isDefault ? (
                        <span className="px-2 py-0.5 text-xs bg-white text-blue-500 rounded border border-blue-500">
                          ค่าเริ่มต้น
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded border border-gray-200">
                          ที่อยู่จัดส่ง
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between min-w-[120px]">
                    <div className="flex items-center gap-2 text-sm order-2 sm:order-1">
                      <button
                        data-test={`btn-edit-address-${address.id}`}
                        onClick={() => openEditModal(address)}
                        className="text-[#4285F4] hover:underline cursor-pointer"
                      >
                        แก้ไข
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        data-test={`btn-delete-address-${address.id}`}
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-orange-500 hover:underline cursor-pointer"
                      >
                        ลบ
                      </button>
                    </div>
                    <button
                      data-test={`btn-set-default-${address.id}`}
                      disabled={address.isDefault}
                      onClick={() => dispatch(addAdressDefault(address.id))}
                      className={`order-1 sm:order-2 px-3 py-1 border rounded text-[12px] transition-colors cursor-pointer ${
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
          <div className="bg-white rounded-lg w-full max-w-[650px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold">
                {isEditMode ? "แก้ไขที่อยู่" : "ที่อยู่ใหม่"}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label htmlFor="addressLine" className="text-sm text-gray-500">
                  ที่อยู่ (บ้านเลขที่ / ถนน / ซอย)
                </label>
                <textarea
                  id="streetAddress"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  placeholder="กรอกรายละเอียดที่อยู่"
                  className="w-full border border-gray-300 rounded-[4px] p-3 text-sm focus:border-[#4285F4] outline-none h-20 resize-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="province" className="text-sm text-gray-500">
                    จังหวัด
                  </label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleProvinceChange}
                    className="w-full border p-2"
                  >
                    <option value={0}>เลือกจังหวัด</option>
                    {provinces.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="district" className="text-sm text-gray-500">
                    อำเภอ
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={async (e) => {
                      const dId = Number(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        district: dId,
                        subDistrict: 0,
                        zipcode: "",
                      }));

                      const res = await dispatch(
                        addressDropdown({
                          provinceId: formData.province,
                          districtId: dId,
                          subdistrictId: 0,
                        }),
                      ).unwrap();
                    }}
                  >
                    <option value="">เลือกอำเภอ</option>
                    {districts.map((d: any) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="subDistrict"
                    className="text-sm text-gray-500"
                  >
                    ตำบล
                  </label>
                  <select
                    name="subDistrict"
                    value={formData.subDistrict}
                    onChange={async (e) => {
                      const sId = Number(e.target.value);

                      // const selected = subdistricts.find((s: any) => s.id === sId);

                      setFormData((prev) => ({
                        ...prev,
                        subDistrict: sId,
                        zipcode: "",
                      }));

                      const res = await dispatch(
                        addressDropdown({
                          provinceId: formData.province,
                          districtId: formData.district,
                          subdistrictId: sId,
                        }),
                      ).unwrap();

                      setFormData((prev) => ({
                        ...prev,
                        zipcode: res?.[0]?.id || "",
                      }));
                    }}
                  >
                    <option value="">เลือกตำบล</option>
                    {subdistricts.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="zipcode" className="text-sm text-gray-500">
                    รหัสไปรษณีย์
                  </label>
                  <input
                    id="zipcode"
                    name="zipcode"
                    value={formData.zipcode}
                    readOnly
                    onChange={handleInputChange}
                    placeholder="รหัสไปรษณีย์"
                    className="w-full border border-gray-300 rounded-[4px] p-2.5 text-sm focus:border-[#4285F4] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSaveAddress}
                className="flex-1 bg-[#4285F4] hover:bg-blue-600 text-white py-2.5 rounded-[4px] text-sm font-medium transition-colors"
              >
                {isEditMode ? "ยืนยันการแก้ไข" : "บันทึกที่อยู่"}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {isBlocking && (
        <div className="fixed inset-0 bg-black/40 z-[999] pointer-events-auto" />
      )}
    </div>
  );
};

export default AddressProfile;
