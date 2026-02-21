import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

const PaymentShoping = () => {
  // State สำหรับเก็บข้อมูลการเลือก
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(3);
  
  // ข้อมูลจำลอง (Mock Data)
  const unitPrice = 100;

  // ฟังก์ชันคำนวณราคารวม
  const totalPrice = unitPrice * quantity;

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
            {/* ข้อมูลที่อยู่ */}
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
            
            {/* ปุ่มเปลี่ยนที่อยู่ */}
            <button 
              id="btn-change-address" 
              className="text-blue-500 border border-blue-500 hover:bg-[#FFFFFF] px-5 py-1.5 rounded text-sm transition-colors whitespace-nowrap w-full lg:w-auto text-center mt-2 lg:mt-0"
            >
              เปลี่ยน
            </button>
          </div>
        </div>

        {/* --- Section 2: รายการสินค้า --- */}
        <div className="mb-8 border-b border-gray-100 pb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
            
            {/* รูปภาพและชื่อสินค้า */}
            <div className="flex items-start gap-4 flex-1 w-full">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                <img 
                  id="product-img-PROD001" 
                  src="https://www.nanagarden.com/picture/product/400/338965.jpg" 
                  alt="น้ำมะม่วงหาวมะนาวโห่" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 id="product-name-PROD001" className="text-sm font-medium text-[#2C2221] line-clamp-2 leading-snug lg:pr-10">
                น้ำมะม่วงหาวมะนาวโห่ สูตรไม่มีน้ำตาล 50 ขวด (สั่งไม่เกิน 1 ออเดอร์) สกัดจากผลที่แก่จัด วิตามินซี เสริมภูมิคุ้มกันร่างกาย
              </h3>
            </div>

            {/* ราคา, จำนวน, ราคารวม (Responsive) */}
            <div className="flex items-center justify-between w-full lg:w-auto gap-4 sm:gap-10 mt-2 lg:mt-0 pl-24 lg:pl-0">
              {/* ราคาต่อชิ้น */}
              <span id="product-unit-price-PROD001" className="text-sm text-black whitespace-nowrap">
                {unitPrice} ฿
              </span>

              {/* ปรับจำนวน */}
              <div className="flex items-center border border-gray-200 rounded bg-white h-9">
                <button 
                  id="btn-decrease-PROD001" 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                  className="px-3 h-full text-black hover:bg-gray-50 disabled:opacity-30"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span id="product-quantity-PROD001" className="w-8 text-center text-sm font-medium">
                  {quantity}
                </span>
                <button 
                  id="btn-increase-PROD001" 
                  onClick={() => setQuantity(q => q + 1)} 
                  className="px-3 h-full text-black hover:bg-gray-50"
                >
                  +
                </button>
              </div>

              {/* ราคารวมของสินค้านี้ */}
              <span id="product-total-price-PROD001" className="text-blue-500 font-normal text-base w-16 text-right whitespace-nowrap">
                {totalPrice} ฿
              </span>
            </div>

          </div>
        </div>

        {/* --- Section 3: ช่องทางการชำระเงิน --- */}
        <div className="mb-4">
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
                onClick={() => setPaymentMethod(method.label)}
                className={`px-5 py-2 sm:py-2.5 border rounded text-sm transition-colors ${
                  paymentMethod === method.label
                    ? 'border-[#4a90e2] text-[#4a90e2] bg-[#ebf4fc] font-medium'
                    : 'border-gray-400 text-black hover:border-[#4a90e2] hover:text-[#4a90e2] bg-white'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default PaymentShoping;