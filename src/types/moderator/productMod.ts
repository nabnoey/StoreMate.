export interface ProductMod {
    id: number;
    productName: string;
  categoryId: number;
    price: number;
    status: "ACTIVE" | "CHECKED_OUT";
    description: string;
    stockQuantity: number;

}