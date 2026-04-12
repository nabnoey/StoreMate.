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
  const { provinces, districts } = useSelector(
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

    const zipcode = zipRes[0]?.name || "";

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
    }));

    await dispatch(
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

    const isEdit = isEditMode && targetAddressId;

    if (isEdit) {
      const currentAddress = addresses.find(
        (a) => a.id === Number(targetAddressId),
      );

      await dispatch(
        updateAddress({
          id: Number(targetAddressId),
          data: {
            streetAddress: streetAddress,
            zipcode: zipcode || currentAddress?.zipcode,
            isDefault: currentAddress?.isDefault || false,
          },
        }),
      );

      toast.success("แก้ไขที่อยู่สำเร็จ");
    } else {
      await dispatch(
        addAddress({
          streetAddress: streetAddress,
          zipcode: zipcode,
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
                      {address.streetAddress} ต.{address.subdistrict} อ.
                      {address.district} จ.{address.province} {address.zipcode}
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Overlay พร้อม Blur */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <h2 className="text-xl font-bold text-gray-800 text-[36px] stroke-[600px]">
                {isEditMode ? "แก้ไขข้อมูลที่อยู่" : "เพิ่มที่อยู่ใหม่"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body: Scrollable area if content is long */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      จังหวัด
                    </label>
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleProvinceChange}
                      className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-[#4285F4] outline-none bg-white appearance-none cursor-pointer"
                    >
                      <option value={0}>กรุณาเลือกจังหวัด</option>
                      {provinces.map((p: { id: number; name: string }) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">
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
                        }));
                        await dispatch(
                          addressDropdown({
                            provinceId: formData.province,
                            districtId: dId,
                            subdistrictId: 0,
                          }),
                        ).unwrap();
                      }}
                      className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-[#4285F4] outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400 appearance-none cursor-pointer"
                    >
                      <option value="">กรุณาเลือกอำเภอ</option>
                      {districts.map((d: { id: number; name: string }) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* แถวที่ 2: ตำบล & รหัสไปรษณีย์ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">
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
                        const res = await dispatch(
                          addressDropdown({
                            provinceId: formData.province,
                            districtId: formData.district,
                            subdistrictId: sId,
                          }),
                        ).unwrap();
                        setFormData((prev) => ({
                          ...prev,
                          zipcode: res?.[0]?.name || "",
                        }));
                      }}
                      className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-[#4285F4] outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400 appearance-none cursor-pointer"
                    >
                      <option value="">กรุณาเลือกตำบล</option>
                      {subdistricts.map((s: { id: number; name: string }) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      รหัสไปรษณีย์
                    </label>
                    <input
                      id="zipcode"
                      name="zipcode"
                      value={formData.zipcode}
                      readOnly
                      placeholder="อัตโนมัติ"
                      className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm bg-gray-50 text-gray-500 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-5 bg-gray-50 flex flex-col-reverse sm:flex-row gap-3 border-t border-gray-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-white hover:border-gray-400 transition-all active:scale-95"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSaveAddress}
                className="flex-[2] px-4 py-2.5 bg-[#4285F4] hover:bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-md shadow-blue-200 transition-all active:scale-95"
              >
                {isEditMode ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มที่อยู่นี้"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isBlocking && (
        <div className="fixed inset-0 bg-white/20 z-[999] cursor-wait backdrop-blur-[1px]" />
      )}
    </div>
  );
};

export default AddressProfile;
