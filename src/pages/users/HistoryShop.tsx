// src/pages/Profile/HistoryShop.tsx
import React, { useState, useEffect } from 'react';
import ProfileSidebar from '../../components/user/ProfileSidebar';

// --- Types ---
interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface OrderItem {
  productId: string;
  quantity: number;
  productDetail?: Product;
}

interface Order {
  id: string;
  shopName: string;
  statusDelivery: string;
  statusPayment: string;
  items: OrderItem[];
  totalPrice: number;
}

const TABS = [
  'ทั้งหมด', 'รอการชำระเงิน', 'ที่ต้องจัดส่ง', 'ที่ต้องได้รับ', 
  'คำสั่งซื้อสำเร็จ', 'การคืนเงิน', 'คืนสินค้า', 'ยกเลิกแล้ว'
];

// Mock Data อิงตามรูปภาพ (มีสินค้า 2 ชิ้น)
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    shopName: 'ร้านพัดทอง',
    statusDelivery: 'พัสดุถูกจัดส่งแล้ว',
    statusPayment: 'สำเร็จแล้ว',
    totalPrice: 180,
    items: [
      { productId: 'PROD-001', quantity: 1 },
      { productId: 'PROD-001', quantity: 1 }
    ]
  }
];

const HistoryShop = () => {
  const [activeTab, setActiveTab] = useState<string>('ทั้งหมด');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // จำลองดึงข้อมูลสินค้า
  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        const updatedOrders = await Promise.all(
          orders.map(async (order) => {
            const updatedItems = await Promise.all(
              order.items.map(async (item) => {
                if (!item.productDetail) {
                  // สมมติดึงจาก getProductById
                  const mockProductData: Product = {
                    id: item.productId,
                    name: 'น้ำมะม่วงหาวมะนาวโห่ สูตรไม่มีน้ำตาล 50 ขวด (สั่งไม่เกิน 1 ออเดอร์) สกัดจากผลที่แก่จัด วิตามินซี เสริมภูมิคุ้มกันร่างกาย',
                    image: 'https://www.nanagarden.com/picture/product/400/338965.jpg', // แทนด้วยรูปจริง
                    price: 90,
                  };
                  return { ...item, productDetail: mockProductData };
                }
                return item;
              })
            );
            return { ...order, items: updatedItems };
          })
        );
        setOrders(updatedOrders);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductDetails();
  }, []);

  return (
    <div id="page-history-shop" className="min-h-screen bg-gray-50 font-sans text-gray-950 pt-4 sm:pt-10 pb-20">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-4 flex flex-col md:flex-row gap-6">
        
          <ProfileSidebar />

        {/* === RIGHT CONTENT === */}
        <main className="flex-1 w-full min-w-0">
        

          {/* --- Tabs Navigation (เลื่อนซ้ายขวาได้) --- */}
          <div className="bg-white shadow-sm border border-gray-200 mb-4 overflow-x-auto no-scrollbar">
            <div className="flex w-max min-w-full">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors flex-1 text-center border-b-2 
                    ${activeTab === tab 
                      ? 'border-blue-500 text-blue-500' 
                      : 'border-transparent text-black hover:text-blue-500'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* --- Order List --- */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-10 text-black">กำลังโหลดข้อมูล...</div>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className="bg-white shadow-sm border border-gray-200 p-4 sm:p-6">
                  
                  {/* Card Header : Shop & Status */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center pb-3 border-b border-gray-100 gap-2 md:gap-0">
                    <span className="font-semibold text-black text-base">{order.shopName}</span>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-green-500">{order.statusDelivery}</span>
                      <span className="text-blue-500">{order.statusPayment}</span>
                    </div>
                  </div>

                  {/* Card Body : Product Detail Loop */}
                  <div className="flex flex-col">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 py-4 border-b border-gray-100 last:border-b-0">
                        {/* รูปสินค้า */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-50 border border-gray-100 rounded overflow-hidden">
                          {item.productDetail?.image && (
                            <img 
                              src={item.productDetail.image} 
                              alt="Product" 
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        
                        {/* รายละเอียดสินค้า */}
                        <div className="flex-1 flex flex-col">
                          <h3 className="text-sm text-gray-800 line-clamp-2 leading-snug pr-2">
                            {item.productDetail?.name || 'กำลังโหลด...'}
                          </h3>
                          
                          {/* จำนวนและราคา (ชิดขวาล่าง) */}
                          <div className="mt-auto flex flex-col items-end w-full">
                            <span className="text-black text-xs sm:text-sm mb-1">
                              x {item.quantity}
                            </span>
                            <span className="text-[#E53725] font-bold text-base sm:text-lg">
                              {item.productDetail?.price}฿
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer : Total & Action */}
                  <div className="mt-2 pt-4 flex flex-col items-end gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-black">รวมการสั่งซื้อ</span>
                      <span className="text-xl sm:text-xl font-bold text-[#E53725]">
                        {order.totalPrice}฿
                      </span>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-500 text-white px-8 py-2.5 rounded text-sm font-medium transition-colors shadow-sm">
                      ซื้ออีกครั้ง
                    </button>
                  </div>

                </div>
              ))
            ) : (
              <div className="text-center py-10 text-black bg-white border border-gray-200 shadow-sm">
                ไม่มีประวัติการสั่งซื้อ
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default HistoryShop;