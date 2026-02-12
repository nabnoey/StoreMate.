import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import CartItem from './CartItem';
import type { Product } from '../types/product';

function MyProductCart() {
  
  const cartItems = useSelector((state: RootState) => state.carts);

  const subtotal = cartItems.reduce(
    (sum: number, item: Product & { quantity: number }) =>
      sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 50.00 : 0.00; 
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items Section */}
        <div className="lg:w-2/3">
          <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
          {cartItems.length > 0 ? (
            <div className="card bg-base-100 shadow-lg border">
              <div className="card-body p-0 divide-y">
                {cartItems.map((item: Product & { quantity: number }) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center p-10 card bg-base-200">
              <h2 className="text-xl font-semibold">ไม่มีสินค้าในตะกร้า</h2>
              <p className="mt-2">ไปยังหน้าหลักเพื่อเลือกสินค้าของคุณ</p>
            </div>
          )}
        </div>

        {/* Order Summary Section */}
        <div className="lg:w-1/3">
          <div className="card bg-base-200 shadow-lg sticky top-24">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Order Summary</h2>
              <div className="space-y-2 text-base">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>฿{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>฿{shipping.toFixed(2)}</span>
                </div>
                <div className="divider my-2"></div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>฿{total.toFixed(2)}</span>
                </div>
              </div>
              <div className="card-actions mt-6">
                <button className="btn btn-primary w-full" disabled={cartItems.length === 0}>
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

export default MyProductCart;