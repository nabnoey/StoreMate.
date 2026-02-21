import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../redux/store';
import { 
  removeFromCart, 
  increaseQuantity, 
  decreaseQuantity 
} from '../../../redux/carts/CartReducer';
import { ShoppingCart as CartIcon, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // 1. ดึงข้อมูลตะกร้าจาก Redux
  const cartItems = useSelector((state: RootState) => state.carts || []);

  // 2. State สำหรับเก็บ ID ของสินค้าที่ถูกเลือก (Checkbox)
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // --- Logic สำหรับ Checkbox ---
  const isAllSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

  const toggleSelect = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
  };

  const removeAllSelected = () => {
    selectedItems.forEach(id => dispatch(removeFromCart(id)));
    setSelectedItems([]); // ล้างค่าที่เลือกไว้หลังจากลบเสร็จ
  };

  // --- Logic สำหรับ คำนวณยอดรวม (เฉพาะชิ้นที่ Checkbox) ---
  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
  
  const totalItemsCount = selectedCartItems.reduce((sum, item) => sum + item.stockQuantity, 0);
  
  const subtotal = selectedCartItems.reduce(
    (sum, item) => sum + (item.price * item.stockQuantity),
    0
  );
  const shipping = subtotal > 0 ? 50.00 : 0.00; 
  const totalPrice = subtotal + shipping;

  return (
    <div id="shopping-cart-page" className="min-h-screen bg-white pt-4 sm:pt-8 pb-20 font-sans text-gray-800">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-6">
        
        <div id="cart-container" className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-8">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <CartIcon className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
            <h1 className="text-xl sm:text-2xl font-bold">ตะกร้าสินค้า</h1>
          </div>

          {/* Subheader & Actions */}
          <div className="flex justify-between items-end border-b border-gray-200 pb-3 sm:pb-4 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-black">สินค้าในตะกร้า</h2>
            {cartItems.length > 0 && (
              <button 
                id="btn-remove-selected"
                onClick={removeAllSelected}
                disabled={selectedItems.length === 0}
                className="text-xs sm:text-sm text-black hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ลบออกทั้งหมด
              </button>
            )}
          </div>

          {/* Cart Items List */}
          <div id="cart-items-list" className="space-y-0">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex flex-col md:flex-row items-start md:items-center py-5 border-b border-gray-100 last:border-b-0 gap-4 md:gap-6 relative ${item.status === 'out_of_stock' ? 'opacity-70' : ''}`}
                >
                  
                  {/* --- ส่วนที่ 1: Checkbox + รูป + ข้อมูลสินค้า --- */}
                  <div className="flex items-start gap-3 sm:gap-4 w-full md:w-auto md:flex-1 pr-8 md:pr-0">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="w-5 h-5 mt-1 md:mt-0 accent-blue-500 cursor-pointer rounded border-gray-300 flex-shrink-0"
                    />
                    
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                      <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex flex-col flex-1">
                      <h3 className="text-sm font-medium line-clamp-2 leading-snug mb-1 text-[#2C2221]">
                        {item.productName}
                      </h3>
                      <p className="text-xs text-[#4B5563] mb-2 line-clamp-1">{item.summary}</p>
                      <div>
                        <span className={`inline-block text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-medium ${item.status === 'in_stock' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#F6CEC9] text-red-500'}`}>
                          {item.status === 'in_stock' ? 'พร้อมจำหน่าย' : 'ไม่มีจำหน่าย'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ปุ่มลบ (สำหรับมือถือ) */}
                  <button 
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="md:hidden absolute top-5 right-0 text-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  {/* --- ส่วนที่ 2: ราคา + จำนวน + ราคารวม + ปุ่มลบ Desktop --- */}
                  <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-3 sm:gap-6 pl-8 sm:pl-10 md:pl-0 mt-2 md:mt-0">
                    
                    <div className="text-sm md:w-20 text-left md:text-center text-gray-700 font-medium whitespace-nowrap">
                      {item.price} ฿
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center border border-gray-200 rounded bg-white h-8 sm:h-9">
                      <button 
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                        disabled={item.stockQuantity <= 1}
                        className="px-2 h-full hover:bg-gray-50 text-gray-600 disabled:opacity-30 transition-colors flex items-center justify-center"
                      >
                        <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-medium">
                        {item.stockQuantity}
                      </span>
                      <button 
                        onClick={() => dispatch(increaseQuantity(item.id))}
                        className="px-2 h-full hover:bg-gray-50 text-gray-600 transition-colors flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>

                    <div className="text-sm md:w-20 text-right md:text-center font-normal text-blue-500 whitespace-nowrap">
                      {item.price * item.stockQuantity} ฿
                    </div>

                    {/* Delete Button (Desktop) */}
                    <button 
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="hidden md:block text-gray-400 hover:text-red-500 p-2 transition-colors ml-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                  </div>

                </div>
              ))
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20 sm:py-28">
                <CartIcon className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300 mb-6" fill="currentColor" />
                <p className="text-base sm:text-lg font-medium text-gray-500 mb-6">ไม่มีสินค้าในตะกร้า</p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded font-medium flex items-center gap-2 transition-colors text-sm shadow-sm"
                >
                  เลือกซื้อสินค้า <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Footer Summary (แสดงเฉพาะเมื่อมีสินค้า) */}
          {cartItems.length > 0 && (
            <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
              
              <div className="flex items-center gap-3 w-full md:w-auto justify-start pl-1 md:pl-0">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 accent-blue-500 cursor-pointer rounded border-gray-300"
                />
                <span className="text-sm font-medium text-black">เลือกทั้งหมด</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-4 w-full md:w-auto border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                <div className="text-sm text-black flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4">
                  <span>รวม ({totalItemsCount}) สินค้า</span>
                  <span className="text-blue-500 text-xl font-normal">{totalPrice.toFixed(2)} ฿</span>
                </div>
                
                <button 
                  disabled={selectedItems.length === 0}
                  className="w-full sm:w-auto bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 text-white px-8 py-3 sm:py-2.5 rounded text-sm font-medium transition-colors shadow-sm"
                  onClick={() => navigate("/payment")}
                >
                  สั่งซื้อสินค้า
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;