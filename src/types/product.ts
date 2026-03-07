import type {Review} from "./review"

export type Product = {
id: number
  productName: string
  imageUrl: string | null
  categoryId: number
  quantity:number,
  price: number
  summary: string
  status: string
   stockQuantity: number
}

export interface CategoryGroup {
  categoryName: string;
  products: Product[];
}


export interface ProductImage {
  id: number;
  imageName: string;
  imageUrl: string;
}

export interface ProductDetail {
  id: number;
  productName: string;
  description: string; // รายละเอียดสินค้า (ที่อยู่ในกรอบสีเทาในรูป)
  quantity: number;
  price: number;       // เพิ่มจาก DTO ล่าสุด
  ratingScore: number;
  productImages: ProductImage[];
  reviews: Review[];
}



