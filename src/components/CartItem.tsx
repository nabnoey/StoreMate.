import { useDispatch, useSelector } from "react-redux";
import type { Product } from '../types/product';
import type { AppDispatch, RootState } from "../redux/store";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../redux/carts/CartReducer";
import {
  removeQuantity,
  returnQuantity,
} from "../redux/products/ProductReducer";

type Props = {
  item: Product & { quantity: number }; 
};

function CartItem({ item }: Props) {
  const dispatch = useDispatch<AppDispatch>();   

const productInStock = useSelector((state: RootState) =>
  state.products.find(p => p.id === item.id)
);
  const stock = productInStock?.quantity ?? 0;

  const handleIncrease = () => {
    if (stock > 0) {
      dispatch(increaseQuantity(item.id)); // เพิ่มจำนวนในตะกร้า
      dispatch(removeQuantity(item.id));   // ลดจำนวนในสต็อก
    }
  };

  const handleDecrease = () => {
    dispatch(decreaseQuantity(item.id)); // ลดจำนวนในตะกร้า
    dispatch(returnQuantity({ id: item.id, quantity: 1 })); // คืนจำนวนเข้าสต็อก
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.id)); // ลบสินค้าออกจากตะกร้า
    // คืนจำนวนสินค้าทั้งหมดที่อยู่ในตะกร้าของชิ้นนี้กลับเข้าสต็อก
    dispatch(returnQuantity({ id: item.id, quantity: item.quantity })); 
  };

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0">
      <div className="flex items-center gap-4 w-1/2">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-contain rounded"
        />
        <div>
          <h3 className="font-semibold line-clamp-2">{item.name}</h3>
          <p className="text-sm text-gray-500">฿{item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-lg">
          <button onClick={handleDecrease} className="btn btn-ghost btn-sm" disabled={item.quantity <= 1}>-</button> 
          <span className="px-4 font-medium">{item.quantity}</span>
          <button onClick={handleIncrease} className="btn btn-ghost btn-sm" disabled={stock <= 0}>+</button> 
        </div>
        <p className="font-semibold w-24 text-right">
          ฿{(item.price * item.quantity).toFixed(2)}
        </p>
        <button onClick={handleRemove} className="btn btn-circle btn-ghost btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
}

export default CartItem;