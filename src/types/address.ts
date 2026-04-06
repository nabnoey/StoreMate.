 interface Address {
    id: number;
    streetAddress: string;
    provinceId: number;
    districtId: number;
    subdistrictId: number;
    receiverName: string;
    receiverPhone: string;
    fullAddress: string;
    zipcodeId: string;
    isDefault: boolean;

}

type DropdownItem = {
  id: number;
  name: string;
};

 type AddressState = {
  addresses: Address[];
  defaultAddress: Address | null;
  provinces: DropdownItem[];
  districts: DropdownItem[];
  subdistricts: DropdownItem[];
  zipcodeId: DropdownItem[]
};

export type { Address, DropdownItem, AddressState };