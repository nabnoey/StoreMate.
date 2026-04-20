import type { PaymentMethod } from "../types/payment";

export const PAYMENT_OPTIONS: {
  id: PaymentMethod;
  title: string;
  desc: string;
  icon: string;
}[] = [
  {
    id: "qr",
    title: "พร้อมเพย์ (PromptPay)",
    desc: "สแกน QR Code เพื่อชำระเงินทันที",
    icon: "lucide:wallet",
  },
  {
    id: "credit",
    title: "บัตรเครดิต / บัตรเดบิต",
    desc: "Visa , Mastercard",
    icon: "lucide:credit-card",
  },
  {
    id: "cod",
    title: "เก็บเงินปลายทาง",
    desc: "ชำระเงินเมื่อได้รับสินค้า",
    icon: "lucide:truck",
  },
];
