import type { Review } from "./review";

export type Product = {
  id: number;
  productName: string;
  imageUrl: string;
  price: number;
  categoryName: string;
  sammary: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  createAt: string;
  stockQuantity: number;
};

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
  description: string;
  quantity: number;
  price: number;
  RatingScore: number;
  productImages: ProductImage[];
  reviews: Review[];
}
