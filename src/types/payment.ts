export type SavedCard = {
  id: string;
  brand: string;
  bankName: string;
  last4: string;
};

export type PaymentIntentRequest = {
  ids: string[];
  [key: string]: number | string[];
};
