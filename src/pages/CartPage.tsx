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
    <div
      id="cart-page-container"
      data-testid="page-cart"
      className="container mx-auto p-4 lg:p-8 min-h-screen bg-gray-50" // เพิ่ม bg-gray-50 เพื่อความสวยงาม
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <h1
          id="cart-page-title"
          data-testid="txt-page-title"
          className="text-2xl lg:text-3xl font-bold mb-6 text-[#0A157A] flex items-center gap-2"
        >
          Shopping Cart
          <span className="text-sm font-normal text-gray-500 mt-1">
            ({cartItems.length} items)
          </span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 relative">
          
          {/* --- Left Column: Cart Items List --- */}
          <div className="w-full lg:w-2/3">
            {cartItems.length > 0 ? (
              <div
                id="cart-items-wrapper"
                data-testid="section-cart-items"
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Header ของ Table (ซ่อนในมือถือ แสดงใน Desktop) */}
                <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-gray-100 text-gray-600 font-medium text-sm">
                  <div className="col-span-6">Product Details</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                <div className="divide-y divide-gray-100 p-4 sm:p-0">
                  {cartItems.map((item: CartItemType, index: number) => (
                    // ห่อ CartItem เพื่อใส่ test id แยกแต่ละ row
                    <div 
                      key={item.id} 
                      data-testid={`cart-item-row-${index}`}
                      id={`cart-item-${item.id}`}
                    >
                      <CartItem item={item} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Empty State
              <div
                id="cart-empty-state"
                data-testid="section-cart-empty"
                className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl shadow-sm border border-dashed border-gray-300 text-center"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                </div>
                <h2 
                  data-testid="txt-empty-title"
                  className="text-2xl font-semibold text-gray-800 mb-2"
                >
                  ไม่มีสินค้าในตะกร้า
                </h2>
                <p className="text-gray-500 mb-6 max-w-sm">
                  ดูเหมือนว่าคุณยังไม่ได้เลือกสินค้า เลือกสินค้าที่คุณถูกใจเพิ่มลงในตะกร้าเลย!
                </p>
                <button
                  id="btn-back-to-home"
                  data-testid="btn-continue-shopping"
                  className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8"
                  onClick={() => navigate("/")}
                >
                  กลับไปเลือกสินค้า
                </button>
              </div>
            )}
          </div>

          {/* --- Right Column: Order Summary --- */}
          <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
            <div
              id="order-summary-card"
              data-testid="section-order-summary"
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-24"
            >
              <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">
                Order Summary
              </h2>
              
              <div className="space-y-4 text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span 
                    id="summary-subtotal"
                    data-testid="val-subtotal"
                    className="font-medium text-black"
                  >
                    ฿{subtotal.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Shipping Estimate</span>
                  <span 
                    id="summary-shipping"
                    data-testid="val-shipping"
                    className="font-medium text-black"
                  >
                    ฿{shipping.toFixed(2)}
                  </span>
                </div>
                
                {/* เส้นกั้น */}
                <div className="border-t border-gray-200 my-2 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Order Total</span>
                    <span 
                      id="summary-total"
                      data-testid="val-total"
                      className="text-2xl font-bold text-[#0A157A]"
                    >
                      ฿{total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 text-right mt-1">Inclusive of all taxes</p>
                </div>
              </div>

              <div className="mt-8">
                <button
                  id="btn-checkout"
                  data-testid="btn-checkout"
                  className="btn w-full bg-[#0A157A] hover:bg-[#08105B] text-white border-none shadow-md py-3 h-auto text-lg rounded-lg disabled:bg-gray-300 disabled:text-gray-500"
                  disabled={cartItems.length === 0}
                  onClick={() => {/* ใส่ function checkout ตรงนี้ */}}
                >
                  Proceed to Checkout
                </button>
                
                <div className="mt-4 text-center">
                  <button 
                    onClick={() => navigate("/")}
                    className="text-sm text-gray-500 hover:text-[#0A157A] hover:underline"
                  >
                    or Continue Shopping
                  </button>
                </div>
              </div>

              {/* Security Badge (Optional for trust) */}
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Secure Checkout
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CartPage;