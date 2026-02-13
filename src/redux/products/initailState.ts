
import type { Product } from "../../types/product";
import promotion from "../../assets/promotion.jpg";
import soap from "../../assets/soap.jpg";
import drink from "../../assets/drink.jpg";
import soap1 from "../../assets/soap1.jpg"


export const initialState: Product[] = [
  {
    id: 1,
    title: "แชมพูสูตรฟื้นฟู",
    price: 150,
    quantity: 2,
   description:"ลดผมร่วง กระตุ้นการเกิดใหม่ ผมดกดำ เงางาม",
    image: promotion,
    category: "Food"
  },
    {
    id: 2,
    title: "ครีมนวดผมสมุนไพร",
    price: 180,
    quantity: 2,
   description:"บำรุงล้ำลึก ให้ผมนุ่มลื่น ไม่พันกัน",
    image: soap,
    category: "Food"
  },
    {
    id: 3,
    title: "แพ็คู่ดูแลผม",
    price: 340,
    quantity: 2,
   description:"แชมพู + ครีมนวด ราคาพิเศษ คุ้มกว่า",
    image: drink,
    category: "Food"
  },
    {
    id: 4,
    title: "แฮร์โทนิค",
    price: 250,
    quantity: 2,
   description:"เซรั่มบำรุงรากผมเข้มข้น ลดผมร่วง",
    image: soap1,
    category: "Food"
  }
]