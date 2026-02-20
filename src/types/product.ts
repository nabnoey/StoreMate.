export type Product = {
id: number
  productName: string
  imageUrl: string | null
  categoryId: number
  categoryName: string
  price: number
  summary: string
  status: string
   stockQuantity: number
}

export interface CategoryGroup {
  categoryId: number;
  categoryName: string;
  products: Product[];
}

export interface Reviewer {
  id: number;
  name: string;
  imageUrl: string;
}

export interface Review {
  id: number;
  reviewer: Reviewer;
  reviewScore: number;
  message: string;
  createdAt: string;
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

