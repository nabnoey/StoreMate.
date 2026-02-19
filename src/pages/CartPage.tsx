
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import type { RootState } from '../redux/store';
import CartItem from '../components/user/CartItem';
import { FaCartShopping } from "react-icons/fa6";
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
    <div className="w-[1116px] shadow-lg mt-10 mx-auto p-6 bg-white rounded-lg">
    <div id="cart-page-container" className="container mx-auto p-4 lg:p-8 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Cart Items Section */}
        <div className="lg:w-2/3">
      <div className="flex flex-row items-center gap-3">
  <FaCartShopping className="text-4xl text-gray-400" />
  <h1 className="text-3xl font-bold text-black">ตะกร้าสินค้า</h1>
</div>
          {cartItems.length > 0 ? (
            <div id="cart-items-container" className="card bg-white  shadow-sm border border-gray-100 mt-10">
              <div id="cart-items-list" className="card-body p-0 divide-y divide-gray-100 text-black ">
                {cartItems.map((item: CartItemType) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          ) : (
            <div id="cart-empty-state" className="text-center p-16 card bg-white shadow-sm border border-dashed border-gray-300 mt-10">
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
              <h2 className="card-title text-xl mb-4 text-black">สรุปคำสั่งซื้อ</h2>
              <div className="space-y-3 text-base text-gray-600">
                <div className="flex justify-between">
                  <span>ราคารวม</span>
                  <span id="summary-subtotal">฿{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าขนส่ง</span>
                  <span id="summary-shipping">฿{shipping.toFixed(2)}</span>
                </div>
                <div className="divider my-2"></div>
                <div className="flex justify-between font-bold text-xl text-[#0A157A]">
                  <span>รวม</span>
                  <span id="summary-total">฿{total.toFixed(2)}</span>
                </div>
              </div>
              <div className="card-actions mt-8">
                <button 
                  id="btn-checkout"
                  className="btn bg-[#0A157A] hover:bg-[#08105B] text-white w-full border-none shadow-md" 
                  disabled={cartItems.length === 0}
                >
                 ดำเนินการชำระเงิน
                </button>

                <button 
                  id="btn-checkout"
                  className="btn bg-white hover:bg-[#08105B] text-black w-full border border-gray-300 shadow-md" 
                  disabled={cartItems.length === 0}
                >
                 เลือกซื้อต่อ
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    </div>
  );
}

export default CartPage;