import type {Product} from "../product"

export interface ProductMod {
    id: number;
    productNo: string;
    productName: string;
    category: number | string;
    price: number;
    status: Product["status"]
    description: string;
    stockQuantity: number;

}