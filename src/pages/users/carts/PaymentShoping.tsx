import  { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../../redux/store'; 
import { increaseQuantity, decreaseQuantity } from '../../../redux/carts/CartReducer';

const PaymentShoping = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  // 1. ดึงข้อมูลตะกร้าจาก CartItem
  const cartItems = useSelector((state: RootState) => state.carts || []);

  // 2. State สำหรับช่องทางการชำระเงิน
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  // 3. คำนวณยอดเงินรวม
  // const subtotal = cartItems.reduce(
  //   (sum, item) => sum + (item.price * item.stockQuantity),
  //   0
  // );
  // const shipping = subtotal > 0 ? 50.00 : 0.00; // ค่าจัดส่ง
  // const totalPrice = subtotal + shipping; // ยอดรวมสุทธิ

  // const handleConfirmOrder = () => {
  //   if (!paymentMethod) {
  //     alert("กรุณาเลือกช่องทางการชำระเงิน");
  //     return;
  //   }
  //   // ตรงนี้เอาไว้เรียก API สั่งซื้อสินค้า
  //   alert(`สั่งซื้อสำเร็จ! ยอดรวม ${totalPrice} บาท ชำระผ่าน ${paymentMethod}`);
  // };

  return (
    <div id="checkout-summary-page" className="min-h-screen bg-white py-6 sm:py-10 px-3 sm:px-6 font-sans text-gray-800">
      <div className="max-w-[1100px] mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-5 sm:p-10">
        
        {/* --- Header --- */}
        <div className="flex items-center gap-3 mb-8 sm:mb-10">
          <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8 text-[#111827]" />
          <h3 id="page-title" className="text-xl sm:text-3xl font-bold">สรุปคำสั่งซื้อ</h3>
        </div>

        {/* --- Section 1: ที่อยู่ในการจัดส่ง --- */}
        <div className="mb-8 border-b border-gray-100 pb-8">
          <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-5 text-black">ที่อยู่ในการจัดส่ง</h2>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 text-sm text-black">
              <span id="address-name" className="font-semibold text-base text-black">
                บุญรักษา วินานนท์
              </span>
              <span id="address-detail" className="text-[#7E7E7E]">
                116/1 ม.1 ต.ห้วยขวาง อ.กำแพงแสน จ.นครปฐม 73140
              </span>
              <span id="address-badge-default" className="text-blue-500 border border-blue-500 px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap">
                ค่าเริ่มต้น
              </span>
            </div>
            
            <button 
              id="btn-change-address" 
              className="text-blue-500 border border-blue-500 hover:bg-blue-50 px-5 py-1.5 rounded text-sm transition-colors whitespace-nowrap w-full lg:w-auto text-center mt-2 lg:mt-0"
            >
              เปลี่ยน
            </button>
          </div>
        </div>

        {/* --- Section 2: รายการสินค้า (วนลูปจาก Redux) --- */}
        <div className="mb-8 border-b border-gray-100 pb-8">
          <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-5 text-black">รายการสินค้า</h2>
          
          {cartItems.length > 0 ? (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                  
                  {/* รูปภาพและชื่อสินค้า */}
                  <div className="flex items-start gap-4 flex-1 w-full">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                      <img 
                        src={item.imageUrl || "https://scontent.fbkk12-1.fna.fbcdn.net/v/t39.30808-6/631033255_1486282403500023_4710477623864277946_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=13d280&_nc_ohc=LVsLjxBcDngQ7kNvwFmpYeP&_nc_oc=AdmHGAm1Ibg5tetmmBOuVUnoW_F2a1qp7KhZsXxMvcnSR7A5c33a3gZ1xUjWiQ_TpjoNQHOLqHy16moZpzcR1Kzo&_nc_zt=23&_nc_ht=scontent.fbkk12-1.fna&_nc_gid=byhROHe1c6lbVBOBQwjGhw&oh=00_AfvmSssPV69WDuHi2p-gcgpsU1WcdQhqEid0bw71o-2qmQ&oe=699E715D"}
                        alt={item.productName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[#2C2221] line-clamp-2 leading-snug lg:pr-10 mb-1">
                        {item.productName}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-1">{item.summary}</p>
                    </div>
                  </div>

                  {/* ราคา, จำนวน, ราคารวม */}
                  <div className="flex items-center justify-between w-full lg:w-auto gap-4 sm:gap-10 mt-2 lg:mt-0 pl-24 lg:pl-0">
                    <span className="text-sm text-black whitespace-nowrap">
                      {item.price} ฿
                    </span>

                    {/* ปรับจำนวน */}
                    <div className="flex items-center border border-gray-200 rounded bg-white h-9">
                      <button 
                        onClick={() => dispatch(decreaseQuantity(item.id))} 
                        className="px-3 h-full text-black hover:bg-gray-50 disabled:opacity-30 flex items-center justify-center"
                        disabled={item.stockQuantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-medium flex items-center justify-center h-full">
                        {item.stockQuantity}
                      </span>
                      <button 
                        onClick={() => dispatch(increaseQuantity(item.id))} 
                        className="px-3 h-full text-black hover:bg-gray-50 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-blue-500 font-normal text-base w-16 text-right whitespace-nowrap">
                      {item.price * item.stockQuantity} ฿
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">ไม่มีสินค้าในคำสั่งซื้อ</div>
          )}
        </div>

        {/* --- Section 3: ช่องทางการชำระเงิน --- */}
        <div className="mb-10 pb-8 border-b border-gray-100">
          <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-5 text-[#000000]">ช่องทางการชำระเงิน</h2>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {[
              { id: 'cod', label: 'เก็บเงินปลายทาง' },
              { id: 'qr', label: 'QR พร้อมเพย์' },
              { id: 'credit', label: 'บัตรเครดิต' }
            ].map((method) => (
              <button
                key={method.id}
                id={`btn-payment-${method.id}`}
                onClick={() => setPaymentMethod(method.id)}
                className={`px-5 py-2 sm:py-2.5 border rounded text-sm transition-colors ${
                  paymentMethod === method.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50 font-medium'
                    : 'border-gray-300 text-gray-700 hover:border-blue-400 bg-white'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* --- Section 4: สรุปยอดรวม & ยืนยันการสั่งซื้อ --- */}
        {/* <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 bg-gray-50 p-6 rounded-lg">
          <div className="w-full md:w-auto space-y-2 text-sm text-gray-600">
            <div className="flex justify-between md:justify-start md:gap-8">
              <span>ยอดรวมสินค้า:</span>
              <span className="font-medium text-black">{subtotal.toFixed(2)} ฿</span>
            </div>
            <div className="flex justify-between md:justify-start md:gap-8">
              <span>ค่าจัดส่ง:</span>
              <span className="font-medium text-black">{shipping.toFixed(2)} ฿</span>
            </div>
            <div className="flex justify-between md:justify-start md:gap-8 text-base text-black mt-2 pt-2 border-t border-gray-200">
              <span className="font-bold">ยอดชำระเงินทั้งหมด:</span>
              <span className="font-bold text-blue-600 text-xl">{totalPrice.toFixed(2)} ฿</span>
            </div>
          </div> */}

          {/* <div className="w-full md:w-auto flex gap-3">
            <button 
              onClick={() => navigate('/cart')} 
              className="w-full md:w-auto px-6 py-3 border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              กลับไปตะกร้า
            </button>
            <button 
              onClick={handleConfirmOrder}
              disabled={cartItems.length === 0}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded font-medium transition-colors shadow-sm"
            >
              สั่งซื้อสินค้า
            </button>
          </div> */}
        {/* </div> */}

      </div>
    </div>
  );
};

export default PaymentShoping;