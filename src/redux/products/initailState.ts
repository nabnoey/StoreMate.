import type { Product } from '../../types/product';

export const initialState: Product[] =[
  {
    id: 1,
    name: "Macbook Pro M3",
    product_type_id: 1,
    price: 68900,
    status_id: 1,
    description: "โน้ตบุ๊คแรงสำหรับ dev และ designer",
    image: "https://picsum.photos/400/300?random=1",
    quantity: 3
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    product_type_id: 2,
    price: 45900,
    status_id: 1,
    description: "สมาร์ทโฟนกล้องเทพ ชิปแรง",
    image: "https://picsum.photos/400/300?random=2",
    quantity: 3
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    product_type_id: 3,
    price: 3500,
    status_id: 1,
    description: "คีย์บอร์ด mechanical สำหรับ programmer",
    image: "https://picsum.photos/400/300?random=3",
    quantity: 3
  },
  {
    id: 4,
    name: "Gaming Mouse",
    product_type_id: 3,
    price: 1200,
    status_id: 1,
    description: "เมาส์เกมมิ่ง DPI สูง",
    image: "https://picsum.photos/400/300?random=4",
    quantity: 3
  }
]