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
  const totalItemsCount = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 0 && subtotal < 1000 ? 50.00 : 0.00; 
  const totalPrice = subtotal + shipping;

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
    setSelectedItems(prev => prev.filter(id => id !== productId));
    toast.success("ลบออกจากตะกร้าแล้ว");
  };

  const handleIncrease = (productId: number, currentQty: number, stock: number) => {
    if (currentQty < stock) {
      dispatch(increaseQuantity(productId));
    } else {
      toast.error("สินค้าในสต็อกไม่พอ");
    }
  };

  const handleDecrease = (productId: number, currentQty: number) => {
    if (currentQty > 1) {
      dispatch(decreaseQuantity(productId));
    }
  };

  if (groupedProducts.length === 0 && cartItems.length > 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium font-sans">กำลังเตรียมข้อมูลตะกร้า...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden p-8 sm:p-12">
          
          <div className="flex items-center gap-4 mb-8">
            <CartIcon className="w-8 h-8 text-black" />
            <h1 className="text-3xl font-bold text-gray-800">ตะกร้าสินค้า</h1>
          </div>
 <hr className="my-12 border-gray-300" />
          {enrichedCartItems.length > 0 ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="font-bold text-gray-700">สินค้าในตะกร้า</span>
                <button 
                  onClick={() => handleRemoveItem} 
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  ลบออกทั้งหมด
                </button>
              </div>

              {enrichedCartItems.map((item) => (
                <div key={item.productId} className="flex flex-col md:flex-row items-center gap-6 py-4 border-b border-gray-50 last:border-0">
                  <div className="flex items-center">
                    <input
                    data-test="checkbox-radio"
                      type="radio"
                      checked={selectedItems.includes(item.productId)}
                      onChange={() => toggleSelect(item.productId)}
                      className="w-5 h-5 rounded-full accent-blue-500 cursor-pointer border-gray-300"
                    />
                  </div>

                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-100 p-1 flex-shrink-0">
                    <img src={item.product.imageUrl} alt="" className="w-full h-full object-contain" />
                  </div>

            <div className="flex-1 min-w-0 px-2">
              <h3 className="text-sm font-medium text-gray-800 leading-snug mb-2">
                  {item.product.productName}
              </h3>
  
                <span className={`text-[10px] px-2 py-1 rounded-md font-bold ${
                  Number(item.product.stockQuantity) > 0 || item.quantity > 0
                  ? 'bg-green-50 text-green-500' 
                  : 'bg-red-50 text-red-500'
                  }`}>
                  {Number(item.product.stockQuantity) > 0 || item.quantity > 0 
                  ? 'พร้อมจำหน่าย' 
                  : 'ไม่พร้อมจำหน่าย'}
                </span>
            </div>

                  <div className="text-sm font-medium text-gray-600 w-20 text-center">
                    {item.product.price} ฿
                  </div>

                  <div className="flex items-center border border-gray-200 rounded-md h-9 bg-white overflow-hidden">
                    <button 
                    data-test="decrease-product"
                      onClick={() => dispatch(decreaseQuantity(item.productId))}
                      className="px-2 hover:bg-gray-50 text-gray-400"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button 
                    data-test="increase-product"
                      onClick={() => dispatch(increaseQuantity(item.productId))}
                      className="px-2 hover:bg-gray-50 text-gray-400"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="text-blue-500 font-bold w-24 text-center">
                    {(item.product.price * item.quantity).toLocaleString()} ฿
                  </div>

                  <button 
                  data-test="btn-remove-item"
                    onClick={() => handleRemoveItem(item.productId)}
                    className="text-gray-400 hover:text-red-500 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row justify-between items
              -center pt-8 border-t border-gray-100 gap-6">
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

                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-4 text-gray-700 font-medium">
                    <span className="text-sm">รวม ( {selectedItems.length} ) สินค้า</span>
                    <span className="text-blue-500 font-bold text-lg">{subtotal.toLocaleString()} ฿</span>
                  </div>
                  <button 
                  data-test="btn-payment"
                    disabled={selectedItems.length === 0}
                    onClick={() => navigate("/payment", { state: { items: selectedCartItems, total: subtotal } })}
                    className="bg-[#4a89f3] text-white px-10 py-2.5 rounded-lg font-bold hover:bg-blue-600 disabled:bg-gray-200 transition-all shadow-sm"
                  >
                    สั่งซื้อสินค้า
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 sm:py-28">
                <CartIcon className="w-40 h-24 sm:w-60 sm:h-60  text-black mb-6" fill="currentColor" />
                <p className="text-base sm:text-lg font-medium text-black mb-6">ไม่มีสินค้าในตะกร้า</p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded font-medium flex items-center gap-2 transition-colors text-sm shadow-sm"
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