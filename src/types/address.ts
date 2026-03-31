// export interface Address {
//    streetAddress: string;
//    zipcodeId: number;
//    isDefault: boolean;
// }



export interface AddressRequest {
  streetAddress: string;
  zipcodeId: number;
  isDefault: boolean;
}

export interface AddressResponse {
  id: number;
  receiverName: string;
  receiverPhone: string;
  fullAddress: string;
  isDefault: boolean;
}