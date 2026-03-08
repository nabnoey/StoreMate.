import { useDispatch, useSelector } from "react-redux";
import type { CartItem} from '../../types/cartItem'; 
import type { AppDispatch, RootState } from "../../redux/store";
import { removeQuantity } from "../../redux/products/productReducer";
import { increaseQuantity, decreaseQuantity, removeFromCart } from "../../redux/carts/CartReducer"; 
import { GiTrashCan } from "react-icons/gi";

type Props = {
  item: CartItem; 
};

function CartItem({ item }: Props) {
  const dispatch = useDispatch<AppDispatch>();   

  const productInfo = useSelector((state: RootState) =>
    state.products.items.find(p => p.id === item.productId)
  );
  
  const stock = productInfo?.stockQuantity ?? 0;

  if (!productInfo) {
      return null; 
  }

  const handleIncrease = () => {
    if (stock > 0) {
      dispatch(increaseQuantity(item.productId)); 
      dispatch(removeQuantity(item.productId));   
    }
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
        dispatch(decreaseQuantity(item.productId)); 
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.productId)); 
  };

  return (
    <div 
      data-test="cart-item" 
      className="flex items-center justify-between p-4 border-b last:border-b-0"
    >
      <div className="flex items-center gap-4 w-1/2">
        <img
          data-test="img-cart"
          src={productInfo.imageUrl || "https://scontent.fbkk12-1.fna.fbcdn.net/v/t39.30808-6/631033255_1486282403500023_4710477623864277946_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=13d280&_nc_ohc=LVsLjxBcDngQ7kNvwFmpYeP&_nc_oc=AdmHGAm1Ibg5tetmmBOuVUnoW_F2a1qp7KhZsXxMvcnSR7A5c33a3gZ1xUjWiQ_TpjoNQHOLqHy16moZpzcR1Kzo&_nc_zt=23&_nc_ht=scontent.fbkk12-1.fna&_nc_gid=byhROHe1c6lbVBOBQwjGhw&oh=00_AfvmSssPV69WDuHi2p-gcgpsU1WcdQhqEid0bw71o-2qmQ&oe=699E715D"}
          alt={productInfo.productName}
          className="w-20 h-20 object-contain rounded"
        />
        <div>
          <h3 className="font-semibold line-clamp-2">s
            {productInfo.productName}
          </h3>
          
          {stock > 0 ? (
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs inline-block mt-1">
              พร้อมจำหน่าย
            </span>
          ) : (
            <span className="bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs inline-block mt-1">
              ไม่พร้อมจำหน่าย
            </span>
          )}
          
          <p className="text-sm text-gray-500 mr-auto ">
            ฿{productInfo.price.toFixed(2)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
<<<<<<< HEAD
        <div className="flex items-center border rounded-lg">
=======
        {/* Quantity Controls */}
        <div className="flex items-center border rounded-lg text-black">
>>>>>>> feature/redux
          <button 
            data-test="btn-decrease-item"
            onClick={handleDecrease} 
            className="btn btn-ghost btn-sm" 
            disabled={item.quantity <= 1} 
          >
            -
          </button> 
          
          <span className="px-4 font-medium">
            {item.quantity}  
          </span>
          
          <button 
            data-test="btn-increase-item"
            id={`${item.productId}`}
            onClick={handleIncrease} 
            className="btn btn-ghost btn-sm" 
            disabled={stock <= 0}
          >
            +
          </button> 
        </div>

        
        <p className="font-semibold w-24 ">
          ฿{(productInfo.price * item.quantity).toFixed(2)}
        </p>

        <button 
          data-test="btn-remove-item"
          onClick={handleRemove} 
          className="btn btn-circle btn-ghost btn-sm text-red-500 hover:bg-red-50"
        >
          <GiTrashCan size={22} className="" />
        </button>
      </div>
    </div>
  );
}

export default CartItem;