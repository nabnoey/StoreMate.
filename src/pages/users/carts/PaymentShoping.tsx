import { useState } from 'react';
import { ShoppingCart, CreditCard, QrCode, Truck } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../../redux/store'; 
import { increaseQuantity, decreaseQuantity } from '../../../redux/carts/CartReducer';
import type { CartItem } from '../../../types/cartItem';

const PaymentShoping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state: RootState) => state.carts.items as CartItem[] || []);
  const addresses = useSelector((state: RootState) => state.address.address || []);
  const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];

  const [paymentMethod, setPaymentMethod] = useState<string>('qr');

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 14.00 : 0.00;
  const totalPrice = subtotal + shipping;

  const handleConfirmOrder = () => {
    if (cartItems.length === 0) return alert("ไม่มีสินค้าในตะกร้า");
    if (!defaultAddress) return alert("กรุณาเพิ่มที่อยู่ในการจัดส่ง");
    if (!paymentMethod) return alert("กรุณาเลือกช่องทางการชำระเงิน");
    alert(`สั่งซื้อสำเร็จ! ยอดรวม ${totalPrice.toLocaleString()} บาท`);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-4 sm:py-8 px-2 sm:px-4 font-sans text-gray-800">
      <div className="max-w-[1000px] mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        <div className="p-4 sm:p-6 md:p-10">
          <div className="flex items-center gap-3 mb-6 sm:mb-10 border-b border-gray-50 pb-4 sm:pb-6">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">สรุปคำสั่งซื้อ</h1>
          </div>
          <div className="mb-8 sm:mb-10">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">ที่อยู่ในการจัดส่ง</h2>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 py-4 border-b border-gray-100">
              <div className="text-sm text-gray-600 leading-relaxed">
                {defaultAddress ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-gray-900">{defaultAddress.fullName}</span>
                        <span className="text-gray-300 hidden sm:inline">|</span>
                        <span className="text-gray-500">{defaultAddress.phone}</span>
                        {defaultAddress.isDefault && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-500 border border-blue-200 rounded text-[10px] font-bold uppercase">ค่าเริ่มต้น</span>
                        )}
                    </div>
                    <p className="text-gray-600">
                        {defaultAddress.addressLine} ต.{defaultAddress.subDistrict} อ.{defaultAddress.district} จ.{defaultAddress.province} {defaultAddress.zipcode}
                    </p>
                  </div>
                ) : (
                  <span className="text-red-500 font-medium">ยังไม่มีข้อมูลที่อยู่</span>
                )}
              </div>
              <button 
                onClick={() => navigate('/profile/address')} 
                className="text-blue-500 hover:text-blue-600 text-sm font-bold transition-colors whitespace-nowrap"
              >
                เปลี่ยนที่อยู่
              </button>
            </div>
          </div>

          <div className="mb-8 sm:mb-12">
            <div className="space-y-6 sm:space-y-8">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 border-b border-gray-50 md:border-0 pb-6 md:pb-0">
                  <div className="flex items-center gap-4 w-full md:flex-1">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg border border-gray-100 p-1.5 flex-shrink-0 shadow-sm flex items-center justify-center">
                      <img src={item.imageUrl || ""} alt={item.productName} className="max-w-full max-h-full object-contain" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 md:line-clamp-3">
                      {item.productName}
                    </h3>
                  </div>
                  
                  <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-10">
                    <div className="hidden lg:block text-sm font-medium text-gray-400 w-16 text-center">
                      {item.price.toLocaleString()} ฿
                    </div>

                    <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden h-8 flex-shrink-0">
                      <button 
                        onClick={() => dispatch(decreaseQuantity(item.productId))}
                        className="px-3 hover:bg-gray-50 text-gray-500 border-r border-gray-300 h-full transition-colors"
                      >-</button>
                      <span className="px-3 text-xs font-bold min-w-[30px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => dispatch(increaseQuantity(item.productId))}
                        className="px-3 hover:bg-gray-50 text-gray-500 border-l border-gray-300 h-full transition-colors"
                      >+</button>
                    </div>

                    <div className="text-[#4a89f3] font-bold text-sm sm:text-base w-24 text-right">
                      {(item.price * item.quantity).toLocaleString()} ฿
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12">
            
            <div className="order-2 lg:order-1 space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">เลือกช่องทางการชำระเงิน</h2>
              
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'qr', title: 'พร้อมเพย์ (PromptPay)', desc: 'สแกน QR Code เพื่อชำระเงิน', icon: <QrCode size={18}/> },
                  { id: 'credit', title: 'บัตรเครดิต / บัตรเดบิต', desc: 'Visa, Mastercard', icon: <CreditCard size={18}/> },
                  { id: 'cod', title: 'เก็บเงินปลายทาง', desc: 'ชำระเงินเมื่อได้รับสินค้า', icon: <Truck size={18}/> }
                ].map((method) => (
                  <div 
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-xl cursor-pointer transition-all ${
                      paymentMethod === method.id ? 'border-blue-500 bg-blue-50/40 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center flex-shrink-0 ${
                      paymentMethod === method.id ? 'border-blue-500' : 'border-gray-300'
                    }`}>
                      {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-xs sm:text-sm text-gray-900">{method.title}</p>
                      <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{method.desc}</p>
                    </div>
                    <div className={paymentMethod === method.id ? 'text-blue-500' : 'text-gray-300'}>
                      {method.icon}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 flex flex-col items-center lg:items-end">
               <div className="w-full max-w-[400px] lg:max-w-[320px] bg-gray-50/50 sm:bg-transparent p-4 sm:p-0 rounded-xl">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center text-gray-500">
                      <span>รวมการสั่งซื้อ</span>
                      <span className="font-bold text-gray-800">฿{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500">
                      <span>การจัดส่ง</span>
                      <span className="font-bold text-gray-800">฿{shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                      <span className="font-bold text-gray-900 text-base">ยอดชำระทั้งหมด</span>
                      <span className="font-black text-[#4a89f3] text-xl sm:text-2xl">฿{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleConfirmOrder}
                    className="w-full bg-[#4a89f3] hover:bg-blue-600 active:scale-[0.98] text-white py-3 sm:py-4 rounded-lg font-bold transition-all shadow-md mt-6 text-sm sm:text-base"
                  >
                    ยืนยันการสั่งซื้อ
                  </button>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentShoping;