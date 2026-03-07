import type { Product } from "./product";

export type CartItem = {
productId: Product['id'],
quantity: number
}