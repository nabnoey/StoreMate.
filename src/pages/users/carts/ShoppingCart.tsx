import React, { useState } from 'react';
import { ShoppingCart as CartIcon, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Types ---
interface CartItem {
  id: string;
  name: string;
  description: string;
  status: 'in_stock' | 'out_of_stock';
  price: number;
  quantity: number;
  imageUrl: string;
  selected: boolean;
}

// --- Mock Data ---
// (สมมติว่าถ้าอยากเทสหน้าตะกร้าว่าง ให้แก้ initialCart เป็น [] นะครับ)
const initialCart: CartItem[] = [
  {
    id: 'PROD-001',
    name: 'น้ำมะม่วงหาวมะนาวโห่ สูตรไม่มีน้ำตาล 50 ขวด (สั่งไม่เกิน 1 ออเดอร์) สกัดจากผลที่แก่จัด วิตามินซี เสริมภูมิคุ้มกันร่างกาย',
    description: 'สมุนไพร มะม่วงหาวมะนาวโห่ ตรา พัดทอง',
    status: 'in_stock',
    price: 100,
    quantity: 3,
    imageUrl: 'https://www.nanagarden.com/picture/product/400/338965.jpg',
    selected: true,
  },
  {
    id: 'PROD-002',
    name: 'สบู่สมุนไพร มะม่วงหาว มะนาวโห่ ลดฝ้า กระ สิวอักเสบ ลดกลิ่นกายได้ดีมาก ผลัดเซลล์ผิว',
    description: 'สมุนไพร มะม่วงหาวมะนาวโห่ ตรา พัดทอง',
    status: 'out_of_stock',
    price: 50,
    quantity: 6,
    imageUrl: 'https://th-test-11.slatic.net/p/1b58f4c5ccbdd6dc3c7a7c2731c0c787.jpg',
    selected: false,
  },
];

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);
  const navigate = useNavigate();

  // --- Handlers ---
  const toggleSelect = (id: string) => {
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const toggleSelectAll = () => {
    const isAllSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
    setCartItems(prev => prev.map(item => ({ ...item, selected: !isAllSelected })));
  };

  const changeQuantity = (id: string, delta: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const removeAllSelected = () => {
    setCartItems(prev => prev.filter(item => !item.selected));
  };

  // --- Computations ---
  const isAllSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
  const selectedItems = cartItems.filter(item => item.selected);
  const totalItemsCount = selectedItems.length;
  const totalPrice = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

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

          {/* Cart Items List หรือ หน้าว่าง (Empty State) */}
          <div id="cart-items-list" className="space-y-0">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div 
                  key={item.id} 
                  id={`cart-item-${item.id}`}
                  className={`flex flex-col md:flex-row items-start md:items-center py-5 border-b border-white last:border-b-0 gap-4 md:gap-6 relative ${item.status === 'out_of_stock' ? 'opacity-70' : ''}`}
                >
                  
                  {/* --- ส่วนที่ 1: Checkbox + รูป + ข้อมูลสินค้า (ชิดซ้าย) --- */}
                  <div className="flex items-start gap-3 sm:gap-4 w-full md:w-auto md:flex-1 pr-8 md:pr-0">
                    <input
                      type="checkbox"
                      id={`checkbox-${item.id}`}
                      checked={item.selected}
                      onChange={() => toggleSelect(item.id)}
                      className="w-5 h-5 mt-1 md:mt-0 accent-blue-500 cursor-pointer rounded border-gray-300 flex-shrink-0"
                    />
                    
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                      <img id={`img-${item.id}`} src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex flex-col flex-1">
                      <h3 id={`name-${item.id}`} className="text-sm font-medium line-clamp-2 leading-snug mb-1 text-[#2C2221]">{item.name}</h3>
                      <p id={`desc-${item.id}`} className="text-xs text-[#4B5563] mb-2 line-clamp-1">{item.description}</p>
                      <div>
                        <span id={`status-${item.id}`} className={`inline-block text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-medium ${item.status === 'in_stock' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#F6CEC9] text-red-500'}`}>
                          {item.status === 'in_stock' ? 'พร้อมจำหน่าย' : 'ไม่มีจำหน่าย'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ปุ่มลบ (สำหรับมือถือ จะลอยอยู่มุมขวาบนของแต่ละ Card) */}
                  <button 
                    id={`btn-delete-mobile-${item.id}`}
                    onClick={() => removeItem(item.id)}
                    className="md:hidden absolute top-5 right-0 text-black p-1"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  {/* --- ส่วนที่ 2: ราคา + จำนวน + ราคารวม + ปุ่มลบ Desktop (ชิดขวา) --- */}
                  <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-3 sm:gap-6 pl-8 sm:pl-10 md:pl-0 mt-2 md:mt-0">
                    
                    {/* Unit Price */}
                    <div id={`unit-price-${item.id}`} className="text-sm md:w-20 text-left md:text-center text-gray-700 font-medium whitespace-nowrap">
                      {item.price} ฿
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center border border-gray-200 rounded bg-white h-8 sm:h-9">
                      <button 
                        id={`btn-decrease-${item.id}`}
                        onClick={() => changeQuantity(item.id, -1)}
                        className="px-2 h-full hover:bg-gray-50 text-gray-600 disabled:opacity-30 transition-colors flex items-center justify-center"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <span id={`quantity-${item.id}`} className="w-8 sm:w-10 text-center text-xs sm:text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button 
                        id={`btn-increase-${item.id}`}
                        onClick={() => changeQuantity(item.id, 1)}
                        className="px-2 h-full hover:bg-gray-50 text-gray-600 transition-colors flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>

                    {/* Total Item Price */}
                    <div id={`total-item-price-${item.id}`} className="text-sm md:w-20 text-right md:text-center font-normal text-blue-500 whitespace-nowrap">
                      {item.price * item.quantity} ฿
                    </div>

                    {/* Delete Button (Desktop) */}
                    <button 
                      id={`btn-delete-desktop-${item.id}`}
                      onClick={() => removeItem(item.id)}
                      className="hidden md:block text-black p-2 transition-colors ml-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                  </div>

                </div>
              ))
            ) : (
              /* --- หน้าว่าง (Empty State) --- */
              <div id="empty-cart-message" className="flex flex-col items-center justify-center py-20 sm:py-28">
                <CartIcon className="w-20 h-20 sm:w-24 sm:h-24 text-black mb-6" fill="currentColor" />
                <p className="text-base sm:text-lg font-medium text-black mb-6">ไม่มีสินค้าในตะกร้า</p>
                <button
                  id="btn-go-shopping"
                  onClick={() => navigate('/')}
                  className="bg-blue-500 hover:bg-blue-500 text-white px-6 py-2.5 rounded font-medium flex items-center gap-2 transition-colors text-sm shadow-sm"
                >
                  เลือกซื้อสินค้า <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Footer Summary (แสดงเฉพาะเมื่อมีสินค้า) */}
          {cartItems.length > 0 && (
            <div id="cart-footer" className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
              
              {/* Select All */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-start pl-1 md:pl-0">
                <input
                  type="checkbox"
                  id="checkbox-select-all"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 accent-blue-500 cursor-pointer rounded border-gray-300"
                />
                <span className="text-sm font-medium text-black">เลือกทั้งหมด</span>
              </div>

              {/* Total Price & Checkout */}
              <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-4 w-full md:w-auto border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                <div className="text-sm text-black flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4">
                  <span id="summary-total-items">รวม ({totalItemsCount}) สินค้า</span>
                  <span id="grand-total-price" className="text-blue-500 text-xl font-normal">{totalPrice} ฿</span>
                </div>
                
                <button 
                  id="btn-checkout"
                  disabled={totalItemsCount === 0}
                  className="w-full sm:w-auto bg-blue-500  disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 sm:py-2.5 rounded text-sm font-medium transition-colors shadow-sm"
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