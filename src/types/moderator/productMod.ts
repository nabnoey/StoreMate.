import type {Product} from "../product"

export interface ProductMod {
    id: number;
    productName: string;
    category: number | string;
    price: number;
    status: Product["status"]
    description: string;
    stockQuantity: number;
    // productStatus:string

}