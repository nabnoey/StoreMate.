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

