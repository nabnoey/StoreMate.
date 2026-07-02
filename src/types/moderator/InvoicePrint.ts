export interface ShippingItem {
  productName: string;
  quantity: number;
  price: number;
}

export interface PersonInfo {
  name: string;
  phone: string;
  address: string;
}

export interface InvoicePrintData {
  orderNo: string;
  shippingItems: ShippingItem[];
  total: number;
  checkoutType: string;
  senderInfo: PersonInfo;
  receiverInfo: PersonInfo;
}