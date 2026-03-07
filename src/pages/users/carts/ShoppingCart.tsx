import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../../redux/store';
import { 
  removeFromCart, 
  increaseQuantity, 
  decreaseQuantity 
} from '../../../redux/carts/CartReducer';
import { fetchProducts } from '../../../redux/products/productReducer';

import type { Product } from '../../../types/product';
import { ShoppingCart as CartIcon, Trash2, Minus, Plus, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { items: cartItems } = useSelector((state: RootState) => state.carts); 
  const { groupedProducts } = useSelector((state: RootState) => state.products);
  
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    if (groupedProducts.length === 0) {
      dispatch(fetchProducts()); 
    }
  }, [dispatch, groupedProducts.length]);

  const allFlatProducts = groupedProducts.flatMap(group => group.products);

  const enrichedCartItems = cartItems.map(cartItem => {
    const matchedProduct = allFlatProducts.find(
      (p: Product) => Number(p.id) === Number(cartItem.productId)
    );
    return {
      ...cartItem, 
      product: matchedProduct
    };
  }).filter(item => item.product !== undefined) as (any & { product: Product })[];

  const isAllSelected = enrichedCartItems.length > 0 && selectedItems.length === enrichedCartItems.length;

  const toggleSelect = (productId: number) => {
    setSelectedItems(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(enrichedCartItems.map(item => item.productId));
    }
  };

  const selectedCartItems = enrichedCartItems.filter(item => selectedItems.includes(item.productId));
  // const totalItemsCount = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 0 && subtotal < 1000 ? 50.00 : 0.00; 
  // const totalPrice = subtotal + shipping;

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
    setSelectedItems(prev => prev.filter(id => id !== productId));
    toast.success("ลบออกจากตะกร้าแล้ว");
  };

  const handleRemoveSelected = () => {
    if (selectedItems.length === 0) return;
    selectedItems.forEach(id => dispatch(removeFromCart(id)));
    setSelectedItems([]);
    toast.success("ลบสินค้าที่เลือกออกจากตะกร้าแล้ว");
  };

  // const handleIncrease = (productId: number, currentQty: number, stock: number) => { ... } // เก็บไว้ใช้ถ้าต้องการเช็คสต็อกก่อน

  if (groupedProducts.length === 0 && cartItems.length > 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium font-sans">กำลังเตรียมข้อมูลตะกร้า...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden p-4 sm:p-8 md:p-12">
          
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <CartIcon className="w-7 h-7 sm:w-8 sm:h-8 text-black" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">ตะกร้าสินค้า</h1>
          </div>
          
          <hr className="my-6 sm:my-12 border-gray-300" />
          
          {enrichedCartItems.length > 0 ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="font-bold text-gray-700">สินค้าในตะกร้า</span>
                <button 
                  onClick={handleRemoveSelected} 
                  disabled={selectedItems.length === 0}
                  className="text-xs text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:hover:text-gray-400 transition-colors"
                >
                  ลบรายการที่เลือก
                </button>
              </div>

              {enrichedCartItems.map((item) => (
                <div key={item.productId} className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 py-4 border-b border-gray-50 last:border-0">
                  
                  {/* โซนซ้าย: Checkbox + รูปภาพ + ชื่อสินค้า */}
                  <div className="flex items-start md:items-center gap-3 w-full md:w-auto md:flex-1">
                    <div className="flex items-center pt-2 md:pt-0">
                      <input
                        data-test="checkbox-radio"
                        type="radio" // ควรเปลี่ยนเป็น type="checkbox" เพื่อให้สมเหตุสมผลกับการเลือกหลายรายการ
                        checked={selectedItems.includes(item.productId)}
                        onChange={() => toggleSelect(item.productId)}
                        className="w-5 h-5 rounded-full accent-blue-500 cursor-pointer border-gray-300"
                      />
                    </div>

                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-gray-100 p-1 flex-shrink-0">
                      <img src={item.product.imageUrl} alt="" className="w-full h-full object-contain" />
                    </div>

                    <div className="flex-1 min-w-0 px-2">
                      <h3 className="text-sm font-medium text-gray-800 leading-snug mb-2 line-clamp-2">
                          {item.product.productName}
                      </h3>
          
                      <span className={`text-[10px] px-2 py-1 rounded-md font-bold inline-block ${
                        Number(item.product.stockQuantity) > 0 || item.quantity > 0
                        ? 'bg-green-50 text-green-500' 
                        : 'bg-red-50 text-red-500'
                        }`}>
                        {Number(item.product.stockQuantity) > 0 || item.quantity > 0 
                        ? 'พร้อมจำหน่าย' 
                        : 'ไม่พร้อมจำหน่าย'}
                      </span>
                    </div>

                    {/* ปุ่มลบสำหรับ Mobile (โชว์เฉพาะหน้าจอเล็ก ขวาบน) */}
                    <button 
                      onClick={() => handleRemoveItem(item.productId)}
                      className="md:hidden text-gray-400 hover:text-red-500 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* โซนขวา: ราคา + ปุ่มเพิ่มลด + ราคารวม */}
                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto pl-8 md:pl-0 gap-4">
                    
                    {/* ราคาต่อชิ้น (ซ่อนในมือถือ หรือจัดวางใหม่) */}
                    <div className="hidden md:block text-sm font-medium text-gray-600 w-20 text-center">
                      {item.product.price} ฿
                    </div>

                    <div className="flex items-center border border-gray-200 rounded-md h-9 bg-white overflow-hidden flex-shrink-0">
                      <button 
                      data-test="decrease-product"
                        onClick={() => dispatch(decreaseQuantity(item.productId))}
                        className="px-2 hover:bg-gray-50 text-gray-400 flex items-center justify-center h-full"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button 
                      data-test="increase-product"
                        onClick={() => dispatch(increaseQuantity(item.productId))}
                        className="px-2 hover:bg-gray-50 text-gray-400 flex items-center justify-center h-full"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-blue-500 font-bold w-20 md:w-24 text-right md:text-center">
                      {(item.product.price * item.quantity).toLocaleString()} ฿
                    </div>

                    {/* ปุ่มลบสำหรับ Desktop */}
                    <button 
                    data-test="btn-remove-item"
                      onClick={() => handleRemoveItem(item.productId)}
                      className="hidden md:block text-gray-400 hover:text-red-500 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}

              {/* ส่วนสรุปยอดและสั่งซื้อ */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pt-8 border-t border-gray-100 gap-6">
                
                <div className="flex items-center gap-3">
                  <input 
                  data-test="redio-all-product"
                    type="radio" 
                    checked={isAllSelected} 
                    onChange={toggleSelectAll} 
                    className="w-5 h-5 accent-blue-500 rounded-full cursor-pointer" 
                  />
                  <span className="text-sm text-gray-500 font-medium">เลือกทั้งหมด</span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 w-full lg:w-auto">
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 text-gray-700 font-medium">
                    <span className="text-sm">รวม ( {selectedItems.length} ) สินค้า</span>
                    <span className="text-blue-500 font-bold text-xl sm:text-lg">{subtotal.toLocaleString()} ฿</span>
                  </div>
                  <button 
                  data-test="btn-payment"
                    disabled={selectedItems.length === 0}
                    onClick={() => navigate("/payment", { state: { items: selectedCartItems, total: subtotal } })}
                    className="w-full sm:w-auto bg-[#4a89f3] text-white px-8 py-3 sm:py-2.5 rounded-lg font-bold hover:bg-blue-600 disabled:bg-gray-200 transition-all shadow-sm"
                  >
                    สั่งซื้อสินค้า
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 sm:py-28">
                <CartIcon className="w-32 h-32 sm:w-40 sm:h-40 text-gray-200 mb-6" />
                <p className="text-base sm:text-lg font-medium text-gray-500 mb-6">ไม่มีสินค้าในตะกร้า</p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-[#4a89f3] hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors text-sm shadow-sm"
                >
                  เลือกซื้อสินค้า <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default ShoppingCart;