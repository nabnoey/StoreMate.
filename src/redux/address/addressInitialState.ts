// D:\storemate\src\redux\address\addressInitialState.ts

// 1. ปรับปรุง Type ให้แยกฟิลด์ย่อยชัดเจน
export interface AddressItem {
  id: string;
  fullName: string;
  phone: string;
  addressLine: string;   // บ้านเลขที่ / ถนน / ซอย
  subDistrict: string;   // ตำบล
  district: string;      // อำเภอ
  province: string;      // จังหวัด
  zipcode: string;       // รหัสไปรษณีย์
  isDefault: boolean;
  isPickup: boolean;
}

export interface AddressState {
  address: AddressItem[];
}

// 2. ปรับ Mock Data ให้ตรงกับ Type ใหม่
export const addressInitialState: AddressState = {
  address: [
    {
      id: '1',
      fullName: 'บุญรักษา วินานนท์',
      phone: '(+66) 98 406 6454',
      addressLine: '116/1 ม.1',
      subDistrict: 'ห้วยขวาง',
      district: 'กำแพงแสน',
      province: 'นครปฐม',
      zipcode: '73140',
      isDefault: true,
      isPickup: true,
    }
  ],
};