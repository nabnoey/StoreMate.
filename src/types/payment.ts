export type PaymentMethod = "CARD" | "PROMPTPAY" | "DESTINATION";

export type SavedCard = {
  id: string;
  brand: string;
  bankName: string;
  last4: string;
};

export type PaymentIntentPayload = {
  ids: number;
  checkoutType: PaymentMethod;
  cardId?: string; // จะมีเฉพาะถ้า checkoutType เป็น "CARD"
};

export type PaymentNowPayload = {
  id: number;
  quantity: number;
  checkoutType: PaymentMethod;
  cardId?: string; // จะมีเฉพาะถ้า checkoutType เป็น "CARD"
};
