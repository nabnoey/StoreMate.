export type CartItem = {
  cartItemId: number;
  productId: number;
  productName: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
  subTotal: number;
  stockQuantity: number;
  productStatus: string;
};

export type CartItemRequestDTO = Pick<CartItem, "productId" | "quantity">;
export type UpdateCartItemDTO = Pick<CartItem, "productId">;
