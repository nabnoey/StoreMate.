import { useState, useEffect, useMemo } from "react";
import ProfileSidebar from "../../components/user/ProfileSidebar";
import type { Order } from "../../types/orders";
import type { Product } from "../../types/product";




const TABS = [
  "ทั้งหมด",
  "รอการชำระเงิน",
  "ที่ต้องจัดส่ง",
  "ที่ต้องได้รับ",
  "คำสั่งซื้อสำเร็จ",
  "การคืนเงิน",
  "คืนสินค้า",
  "ยกเลิกแล้ว",
];

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    shopName: "ร้านพัดทอง",
    statusDelivery: "พัสดุถูกจัดส่งแล้ว",
    statusPayment: "สำเร็จแล้ว",
    totalPrice: 180,
    items: [
      { productId: "PROD-001", quantity: 1 },
      { productId: "PROD-002", quantity: 1 },
    ],
  },
];

const HistoryShop = () => {
  const [activeTab, setActiveTab] = useState<string>("ทั้งหมด");
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [isLoading, setIsLoading] = useState<boolean>(false);

 const fetchMockProduct = async (productId: string): Promise<Product> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    id: Number(productId), // ✅ แปลงเป็น number
    productName: "น้ำมะม่วงหาวมะนาวโห่ สูตรไม่มีน้ำตาล 50 ขวด สกัดจากผลที่แก่จัด วิตามินซี เสริมภูมิคุ้มกันร่างกาย",
    imageUrl: "https://www.nanagarden.com/picture/product/400/338965.jpg",
    price: 90,
    categoryName: "",
    sammary: "",
    description: "",
    status: "",
    createAt: "",
    stockQuantity: 0,
  };
};

  const updateOrderDetails = async (order: Order): Promise<Order> => {
    const updatedItems = await Promise.all(
      order.items.map(async (item) => {
        if (item.productDetail) return item;
        const details = await fetchMockProduct(item.productId);
        return { ...item, productDetail: details };
      }),
    );
    return { ...order, items: updatedItems };
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const results = await Promise.all(orders.map(updateOrderDetails));
        setOrders(results);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeTab === "ทั้งหมด") return orders;
    return orders.filter(
      (order) =>
        order.statusPayment.includes(activeTab) ||
        order.statusDelivery.includes(activeTab),
    );
  }, [activeTab, orders]);

  const renderOrderList = () => {
    if (isLoading) {
      return (
        <div className="text-center py-20 text-gray-500 bg-white border border-gray-200 shadow-sm rounded-sm">
          <div className="animate-pulse">
            กำลังโหลดข้อมูลประวัติการสั่งซื้อ...
          </div>
        </div>
      );
    }

    if (filteredOrders.length === 0) {
      return (
        <div className="text-center py-20 text-gray-400 bg-white border border-gray-200 shadow-sm rounded-sm">
          ไม่มีประวัติการสั่งซื้อในหมวด "{activeTab}"
        </div>
      );
    }

    return filteredOrders.map((order) => (
      <div
        key={order.id}
        className="bg-white shadow-sm border border-gray-200 p-4 sm:p-6 mb-4"
      >
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center pb-3 border-b border-gray-100 gap-2">
          <span className="font-semibold text-black text-base">
            {order.shopName}
          </span>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-green-600 font-medium">
              {order.statusDelivery}
            </span>
            <div className="w-[1px] h-3 bg-gray-300 mx-1 hidden md:block"></div>
            <span className="text-blue-600 font-medium">
              {order.statusPayment}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          {order.items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 py-5 border-b border-gray-100 last:border-b-0"
            >
              {/* Product Image */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-50 border border-gray-100 rounded overflow-hidden">
                {item.productDetail?.imageUrl && (
                  <img
                    src={item.productDetail.imageUrl}
                    alt={item.productDetail.productName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <h3 className="text-sm text-gray-800 line-clamp-2 leading-snug">
                  {item.productDetail?.productName || "กำลังโหลด..."}
                </h3>
                <div className="flex flex-col items-end w-full">
                  <span className="text-gray-500 text-xs sm:text-sm">
                    x {item.quantity}
                  </span>
                  <span className="text-[#E53725] font-bold text-base sm:text-lg">
                    {item.productDetail?.price.toLocaleString()}฿
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 pt-4 flex flex-col items-end gap-4 border-t border-gray-50">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">รวมการสั่งซื้อ:</span>
            <span className="text-xl font-bold text-[#E53725]">
              {order.totalPrice.toLocaleString()}฿
            </span>
          </div>
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-2.5 rounded text-sm font-medium transition-colors shadow-sm"
          >
            ซื้ออีกครั้ง
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div
      id="page-history-shop"
      className="min-h-screen bg-gray-50 font-sans text-gray-950 pt-4 sm:pt-10 pb-20"
    >
      <div className="max-w-[1200px] mx-auto px-3 sm:px-4 flex flex-col md:flex-row gap-6">
        <ProfileSidebar />

        <main className="flex-1 w-full min-w-0">
          <nav className="bg-white shadow-sm border border-gray-200 mb-4 overflow-x-auto no-scrollbar">
            <div className="flex w-max min-w-full">
              {TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors flex-1 text-center border-b-2 
                      ${
                        isActive
                          ? "border-blue-500 text-blue-500"
                          : "border-transparent text-gray-600 hover:text-blue-500"
                      }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="space-y-4">{renderOrderList()}</div>
        </main>
      </div>
    </div>
  );
};

export default HistoryShop;
