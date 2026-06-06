export interface ProductMod {
    id: number;
    productName: string;
    category: number | string;
    price: number;
    status: "ACTIVE" | "CHECKED_OUT";
    description: string;
    stockQuantity: number;

}