import type { Product } from "./product";

export type CartItem = {
  productId: Product["id"];
  productName: Product["productName"];
  imageUrl: string | null;
  price: Product["price"];
  quantity: number;
  subTotal: number;
  stockQuantity: Product["stockQuantity"];
  productStatus: Product["status"];
};

export type CartItemRequestDTO = Pick<CartItem, "productId" | "quantity">;
export type UpdateCartItemDTO = Pick<CartItem, "productId">;
