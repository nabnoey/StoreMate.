import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import type { RootState } from '../redux/store';
import CartItem from '../components/CartItem';
import type { Product } from '../types/product';

interface CartItemType extends Product {
  quantity: number;
}

function CartPage() {
  const navigate = useNavigate(); 
  
  const cartItems = useSelector((state: RootState) => state.carts || []);

  const subtotal = cartItems.reduce(
    (sum: number, item: CartItemType) => sum + item.price * item.quantity,
    0
  );
  
  const shipping = subtotal > 0 ? 50.00 : 0.00; 
  const total = subtotal + shipping;

  return (
    <div id="cart-page-container" className="container mx-auto p-4 lg:p-8 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Cart Items Section */}
        <div className="lg:w-2/3">
          <h1 id="cart-title" className="text-3xl font-bold mb-6 text-[#0A157A]">Shopping Cart</h1>
          
          {cartItems.length > 0 ? (
            <div id="cart-items-container" className="card bg-base-100 shadow-sm border border-gray-100">
              <div id="cart-items-list" className="card-body p-0 divide-y divide-gray-100">
                {cartItems.map((item: CartItemType) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          ) : (
            <div id="cart-empty-state" className="text-center p-16 card bg-base-100 shadow-sm border border-dashed border-gray-300">
              <div className="flex flex-col items-center gap-4">
                 {/* ใส่ Icon ตะกร้าเปล่าๆ ตรงนี้ได้ถ้าต้องการ */}
                <h2 id="msg-cart-empty" className="text-2xl font-semibold text-gray-500">ไม่มีสินค้าในตะกร้า</h2>
                <p className="text-gray-400">เลือกสินค้าที่คุณถูกใจเพิ่มลงในตะกร้าเลย!</p>
                <button 
                  id="btn-back-to-home"
                  className="btn btn-outline btn-primary mt-4"
                  onClick={() => navigate("/")}
                >
                  กลับไปเลือกสินค้า
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Section */}
        <div className="lg:w-1/3">
          <div id="order-summary-card" className="card bg-white shadow-lg sticky top-28 border border-gray-100">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4 text-black">Order Summary</h2>
              <div className="space-y-3 text-base text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span id="summary-subtotal">฿{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span id="summary-shipping">฿{shipping.toFixed(2)}</span>
                </div>
                <div className="divider my-2"></div>
                <div className="flex justify-between font-bold text-xl text-[#0A157A]">
                  <span>Total</span>
                  <span id="summary-total">฿{total.toFixed(2)}</span>
                </div>
              </div>
              <div className="card-actions mt-8">
                <button 
                  id="btn-checkout"
                  className="btn bg-[#0A157A] hover:bg-[#08105B] text-white w-full border-none shadow-md" 
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CartPage;