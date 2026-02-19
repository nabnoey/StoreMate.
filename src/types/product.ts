
export type Product = {
id: number
  productName: string
  imageUrl: string | null
  categoryName: string
  price: number
  summary: string
  status: string
   stockQuantity: number
}

export interface CategoryGroup {
  categoryName: string;
  products: Product[];
}