import {describe,it,expect} from 'vitest';
import cartReducer, {
  addToCartThunk,
} from '../redux/carts/CartReducer';
import type { CartState } from "../redux/carts/CartReducer";



const initialState: CartState= {
  items: [],
  selectedItems: [],
  status: "idle",
  error: null,
};

describe ('Cart', () => {
it('should add item to cart', () => {
    const product = {
        cartItemId: 1,
  productId: 1,
  productName: 'สบู่มะม่วงหาวมะนาวโห่',
  imageUrl: null,
  price: 50,
  quantity: 1,
  subTotal: 50,
  stockQuantity: 100,
  status: 'ACTIVE' as const,

    }

    const action = {
  type: addToCartThunk.fulfilled.type,
  payload: product,
  meta: {
    arg: {
      productId: 1,
      quantity: 1,
    },
  },
};

    const state = cartReducer (initialState, action);
    expect(state.items.length).toBe(1);
    expect(state.items[0].productName).toBe('สบู่มะม่วงหาวมะนาวโห่');
    expect(state.items[0].price).toBe(50);
    expect(state.items[0].quantity).toBe(1);
    
});

})