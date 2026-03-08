import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';
import { addAddress, deleteAddress, setDefaultAddress } from '../../redux/address/action';
import type { AddressItem } from '../../redux/address/addressInitialState';
import ProfileSidebar from '../../components/user/ProfileSidebar';

const AddressProfile = () => {
  const dispatch = useDispatch();
  const addresses = useSelector((state: RootState) => state.address.address);
  const user = useSelector((state: RootState) => state.auth.user);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPromptDefaultModalOpen, setIsPromptDefaultModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [targetAddressId, setTargetAddressId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    addressLine: '',
    subDistrict: '',
    district: '',
    province: '',
    zipcode: ''
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = () => {
    const { addressLine, subDistrict, district, province, zipcode } = formData;

    if (!addressLine || !subDistrict || !district || !province || !zipcode) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const newId = Date.now().toString();
    const isFirstAddress = addresses.length === 0;

    const newAddress: AddressItem = {
      id: newId,
      fullName: user?.name || "ไม่ระบุชื่อ",
      phone: user?.phone || "ไม่ระบุเบอร์โทรศัพท์",
      addressLine,
      subDistrict,
      district,
      province,
      zipcode,
      isDefault: isFirstAddress,
      isPickup: true
    };

    dispatch(addAddress(newAddress));
    setIsAddModalOpen(false);
    setFormData({
      addressLine: '',
      subDistrict: '',
      district: '',
      province: '',
      zipcode: ''
    });

    if (isFirstAddress) {
      alert("เพิ่มที่อยู่สำเร็จ");
    } else {
      setTargetAddressId(newId);
      setIsPromptDefaultModalOpen(true);
    }
  };

  const handlePromptDefault = (confirm: boolean) => {
    if (confirm && targetAddressId) {
      dispatch(setDefaultAddress(targetAddressId));
    }
    setIsPromptDefaultModalOpen(false);
    setTargetAddressId(null);
    alert("เพิ่มที่อยู่สำเร็จ");
  };

  const confirmDelete = () => {
    if (targetAddressId) {
      dispatch(deleteAddress(targetAddressId));
      alert("ลบที่อยู่เรียบร้อยแล้ว");
    }
    setIsDeleteModalOpen(false);
    setTargetAddressId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row gap-6">
        <ProfileSidebar />

        <main className="flex-1 bg-white rounded-lg shadow-sm border relative min-h-[500px]">

          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h1 className="text-xl font-bold">ที่อยู่ของฉัน</h1>
            <button
              data-testid="btn-open-add-address"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#4285F4] text-white px-4 py-2 rounded"
            >
              + เพิ่มที่อยู่
            </button>
          </div>

          {/* Address List */}
          <div className="flex flex-col">
            {addresses.length === 0 ? (
              <div
                data-testid="empty-address"
                className="p-10 text-center text-gray-400"
              >
                ยังไม่มีข้อมูลที่อยู่
              </div>
            ) : (
              addresses.map((address: AddressItem) => (
                <div
                  key={address.id}
                  data-testid={`address-item-${address.id}`}
                  className="p-6 flex flex-col md:flex-row justify-between border-b gap-4"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-3">
                      <span data-testid={`address-name-${address.id}`}>
                        {address.fullName}
                      </span>
                      <span data-testid={`address-phone-${address.id}`}>
                        {address.phone}
                      </span>
                    </div>

                    <div
                      data-testid={`address-detail-${address.id}`}
                      className="text-sm text-gray-600"
                    >
                      {address.addressLine} ต.{address.subDistrict} อ.{address.district} จ.{address.province} {address.zipcode}
                    </div>

                    {address.isDefault && (
                      <span
                        data-testid={`address-default-${address.id}`}
                        className="text-xs text-blue-600"
                      >
                        ค่าเริ่มต้น
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="flex gap-3">
                      <button
                        data-testid={`btn-delete-${address.id}`}
                        onClick={() => {
                          setTargetAddressId(address.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-500"
                      >
                        ลบ
                      </button>
                    </div>

                    <button
                      data-testid={`btn-set-default-${address.id}`}
                      onClick={() => dispatch(setDefaultAddress(address.id))}
                      disabled={address.isDefault}
                      className="px-3 py-1 border rounded text-xs"
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

      {/* Add Modal */}
      {isAddModalOpen && (
        <div data-testid="modal-add-address" className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-full max-w-[600px]">

            <textarea
              data-testid="input-addressLine"
              name="addressLine"
              value={formData.addressLine}
              onChange={handleInputChange}
              placeholder="บ้านเลขที่ / ถนน / ซอย"
              className="w-full border p-3 mb-3"
            />

            <input
              data-testid="input-province"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              placeholder="จังหวัด"
              className="w-full border p-3 mb-3"
            />

            <input
              data-testid="input-district"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              placeholder="อำเภอ"
              className="w-full border p-3 mb-3"
            />

            <input
              data-testid="input-subDistrict"
              name="subDistrict"
              value={formData.subDistrict}
              onChange={handleInputChange}
              placeholder="ตำบล"
              className="w-full border p-3 mb-3"
            />

            <input
              data-testid="input-zipcode"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleInputChange}
              placeholder="รหัสไปรษณีย์"
              className="w-full border p-3 mb-6"
            />

            <div className="grid grid-cols-2 gap-4">
              <button
                data-testid="btn-save-address"
                onClick={handleSaveAddress}
                className="bg-blue-600 text-white py-2 rounded"
              >
                บันทึกที่อยู่
              </button>
              <button
                data-testid="btn-cancel-add-address"
                onClick={() => setIsAddModalOpen(false)}
                className="border py-2 rounded"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Default Modal */}
      {isPromptDefaultModalOpen && (
        <div data-testid="modal-set-default" className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-full max-w-[400px] text-center">
            <p className="mb-6">ตั้งเป็นค่าเริ่มต้นหรือไม่?</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                data-testid="btn-confirm-set-default"
                onClick={() => handlePromptDefault(true)}
                className="bg-blue-600 text-white py-2 rounded"
              >
                ยืนยัน
              </button>
              <button
                data-testid="btn-cancel-set-default"
                onClick={() => handlePromptDefault(false)}
                className="border py-2 rounded"
              >
                ไม่ใช่ตอนนี้
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div data-testid="modal-delete-address" className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-full max-w-[400px] text-center">
            <p className="mb-6">ยืนยันการลบที่อยู่?</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                data-testid="btn-confirm-delete"
                onClick={confirmDelete}
                className="bg-red-600 text-white py-2 rounded"
              >
                ลบ
              </button>
              <button
                data-testid="btn-cancel-delete"
                onClick={() => setIsDeleteModalOpen(false)}
                className="border py-2 rounded"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressProfile;