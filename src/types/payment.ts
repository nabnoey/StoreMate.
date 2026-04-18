export type PaymentMethod = "credit" | "qr" | "cod";

export type SavedCard = {
  id: string;
  brand: string;
  bankName: string;
  last4: string;
};

export type BasePaymentRequest = {
  ids: number[];
  isBuyNow: boolean;
};

export type CreditPaymentRequest = BasePaymentRequest & {
  paymentMethod: "credit";
  cardId: string;
};

export type QRPaymentRequest = BasePaymentRequest & {
  paymentMethod: "qr";
};

export type CODPaymentRequest = BasePaymentRequest & {
  paymentMethod: "cod";
};

export type PaymentIntentRequest =
  | CreditPaymentRequest
  | QRPaymentRequest
  | CODPaymentRequest;
