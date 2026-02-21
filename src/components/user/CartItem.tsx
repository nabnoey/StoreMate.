import { useDispatch, useSelector } from "react-redux";
import type { Product } from '../../types/product';
import type { AppDispatch, RootState } from "../../redux/store";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../../redux/carts/CartReducer";
import {
  removeQuantity
} from "../../redux/products/productReducer";
import { GiTrashCan } from "react-icons/gi";

type Props = {
  item: Product & { stockQuantity: number }; 
};

function CartItem({ item }: Props) {
  const dispatch = useDispatch<AppDispatch>();   

  const productInStock = useSelector((state: RootState) =>
    state.products.items.find(p => p.id === item.id)
  );
  
  // ใช้ Optional chaining และ Nullish coalescing เพื่อความปลอดภัย
  const stock = productInStock?.stockQuantity ?? 0;

  const handleIncrease = () => {
    // เช็ค stock ก่อนเพิ่ม
    if (stock > 0) {
      dispatch(increaseQuantity(item.id)); // เพิ่มจำนวนในตะกร้า
      dispatch(removeQuantity(item.id));   // ลดจำนวนในสต็อก (ถ้าต้องการ logic นี้)
    }
  };

  const handleDecrease = () => {
    if (item.stockQuantity > 1) {
        dispatch(decreaseQuantity(item.id)); // ลดจำนวนในตะกร้า
        // dispatch(returnQuantity({ id: item.id, quantity: 1 })); // คืนจำนวนเข้าสต็อก
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.id)); // ลบสินค้าออกจากตะกร้า
    // dispatch(returnQuantity({ id: item.id, quantity: item.quantity })); 
  };

  return (
    <div 
      id={`cart-row-${item.id}`} 
      className="flex items-center justify-between p-4 border-b last:border-b-0"
    >
      <div className="flex items-center gap-4 w-1/2">
        <img
          id={`cart-img-${item.id}`}
          src={item.imageUrl}
          alt={item.productName}
          className="w-20 h-20 object-contain rounded"
        />
        <div>
          <h3 
            id={`cart-title-${item.id}`} 
            className="font-semibold line-clamp-2"
          >
            {item.productName}
          </h3>
           {/* STATUS */}
  {stock > 0 ? (
    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs inline-block mt-1">
      พร้อมจำหน่าย
    </span>
  ) : (
    <span className="bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs inline-block mt-1">
      ไม่พร้อมจำหน่าย
    </span>
  )}
          <p 
            id={`cart-price-${item.id}`} 
            className="text-sm text-gray-500 mr-auto "
          >
            ฿{item.price.toFixed(2)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Quantity Controls */}
        <div className="flex items-center border rounded-lg">
          <button 
            id={`btn-decrease-${item.id}`}
            onClick={handleDecrease} 
            className="btn btn-ghost btn-sm" 
            disabled={item.stockQuantity <= 1}
          >
            -
          </button> 
          
          <span 
            id={`cart-qty-${item.id}`} 
            className="px-4 font-medium"
          >
            {item.stockQuantity}
          </span>
          
          <button 
            id={`btn-increase-${item.id}`}
            onClick={handleIncrease} 
            className="btn btn-ghost btn-sm" 
            disabled={stock <= 0}
          >
            +
          </button> 

         
        </div>

        {/* Total Price per Item */}
        <p 
          id={`cart-item-total-${item.id}`}
          className="font-semibold w-24 "
        >
          ฿{(item.price * item.stockQuantity).toFixed(2)}
        </p>
        <div>
         </div>


        {/* Remove Button */}
        <button 
          id={`btn-remove-${item.id}`}
          onClick={handleRemove} 
          className="btn btn-circle btn-ghost btn-sm text-red-500 hover:bg-red-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          
        </button>
        <GiTrashCan size={22} className="" />
      </div>
    </div>
  );
}

export default CartItem;