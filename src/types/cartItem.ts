import type { Product } from "./product";

export type CartItem = Product & {
  productId: number; 
  quantity: number; 
};