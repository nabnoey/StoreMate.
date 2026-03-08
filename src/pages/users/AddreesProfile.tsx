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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [targetAddressId, setTargetAddressId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    addressLine: '',
    subDistrict: '',
    district: '',
    province: '',
    zipcode: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      fullName: `${user.firstName} ${user.lastName}`,
      phone: user.phone,
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
    setFormData({ addressLine: '', subDistrict: '', district: '', province: '', zipcode: '' });
    alert("เพิ่มที่อยู่สำเร็จ");
  };

  const confirmDelete = () => {
    if (targetAddressId) {
      dispatch(deleteAddress(targetAddressId));
    }
    setIsDeleteModalOpen(false);
    setTargetAddressId(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-4 sm:pt-12 pb-20 font-sans text-gray-800">
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row gap-6">
        <ProfileSidebar />

        <main className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 min-h-[500px] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <h1 className="text-lg font-bold">ที่อยู่ของฉัน</h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#4285F4] hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm flex items-center gap-1 transition-colors"
            >
              <span className="text-xl leading-none">+</span> เพิ่มที่อยู่
            </button>
          </div>

          {/* Address List */}
          <div className="flex flex-col">
            {addresses.length === 0 ? (
              <div className="p-20 text-center text-gray-400 text-sm">ยังไม่มีข้อมูลที่อยู่</div>
            ) : (
              addresses.map((address: AddressItem) => (
                <div key={address.id} className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between border-b border-gray-50 last:border-0 gap-4">
                  <div className="flex-1 space-y-2">
                    {/* Name & Phone */}
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                      <span className="font-medium">{address.fullName}</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-500">{address.phone}</span>
                    </div>

                    {/* Address Detail */}
                    <div className="text-sm text-gray-500 leading-relaxed">
                      {address.addressLine} ต.{address.subDistrict} อ.{address.district} จ.{address.province} {address.zipcode}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {address.isDefault && (
                        <span className="px-2 py-0.5 border border-[#4285F4] text-[#4285F4] text-[11px] rounded-[3px]">
                          ค่าเริ่มต้น
                        </span>
                      )}
                      {address.isPickup && (
                        <span className="px-2 py-0.5 border border-gray-300 text-gray-400 text-[11px] rounded-[3px]">
                          ที่อยู่ในการรับสินค้า
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between min-w-[120px]">
                    <div className="flex items-center gap-2 text-sm order-2 sm:order-1">
                      <button className="text-[#4285F4] hover:underline">แก้ไข</button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => { setTargetAddressId(address.id); setIsDeleteModalOpen(true); }}
                        className="text-orange-500 hover:underline"
                      >
                        ลบ
                      </button>
                    </div>

                    <button
                      onClick={() => dispatch(setDefaultAddress(address.id))}
                      disabled={address.isDefault}
                      className={`order-1 sm:order-2 px-3 py-1 border rounded text-[12px] transition-colors ${
                        address.isDefault 
                        ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed' 
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
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

      {/* --- Add Modal (Image_803344) --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex justify-center items-center p-4 backdrop-blur-[1px]">
          <div className="bg-white rounded-lg w-full max-w-[650px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold">ที่อยู่ใหม่</h2>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Address Line */}
              <div className="space-y-1">
                <label className="text-sm text-gray-500">ที่อยู่</label>
                <textarea
                  name="addressLine"
                  value={formData.addressLine}
                  onChange={handleInputChange}
                  placeholder="บ้านเลขที่ / ถนน / ซอย"
                  className="w-full border border-gray-300 rounded-[4px] p-3 text-sm focus:border-[#4285F4] outline-none h-20 resize-none transition-colors"
                />
              </div>

              {/* Province & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-500">จังหวัด</label>
                  <input name="province" value={formData.province} onChange={handleInputChange} placeholder="จังหวัด" className="w-full border border-gray-300 rounded-[4px] p-2.5 text-sm focus:border-[#4285F4] outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-500">อำเภอ</label>
                  <input name="district" value={formData.district} onChange={handleInputChange} placeholder="อำเภอ" className="w-full border border-gray-300 rounded-[4px] p-2.5 text-sm focus:border-[#4285F4] outline-none" />
                </div>
              </div>

              {/* Sub-district & Zipcode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-500">ตำบล</label>
                  <input name="subDistrict" value={formData.subDistrict} onChange={handleInputChange} placeholder="ตำบล" className="w-full border border-gray-300 rounded-[4px] p-2.5 text-sm focus:border-[#4285F4] outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-500">รหัสไปรษณีย์</label>
                  <input name="zipcode" value={formData.zipcode} onChange={handleInputChange} placeholder="XXXXX" className="w-full border border-gray-300 rounded-[4px] p-2.5 text-sm focus:border-[#4285F4] outline-none" />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSaveAddress}
                className="flex-1 bg-[#4285F4] hover:bg-blue-600 text-white py-2.5 rounded-[4px] text-sm font-medium transition-colors"
              >
                บันทึกที่อยู่
              </button>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Delete Modal --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-[350px] shadow-xl text-center">
            <p className="text-gray-700 mb-6 font-medium">ยืนยันการลบที่อยู่นี้หรือไม่?</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2 border border-gray-300 rounded-[4px] text-sm hover:bg-gray-50">ยกเลิก</button>
              <button onClick={confirmDelete} className="flex-1 py-2 bg-orange-500 text-white rounded-[4px] text-sm hover:bg-orange-600">ลบ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressProfile;