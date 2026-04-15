
import { useState,useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { AppDispatch,RootState } from "../../redux/store";
import ProfileSidebar from "../../components/user/ProfileSidebar";
import { Icon } from "@iconify/react";
import StatusOrderTabs from "../../components/user/StatusOrderTabs";
import type { CartItem } from "../../types/cartItem";
import { useLocation } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { fetchOrders } from "../../redux/orders/orderReduer";

const HistoryPage = () => {
  const location = useLocation();
  const selectedItems: CartItem[] = location.state?.items || [];
  // สร้าง State สำหรับเก็บว่ากำลังเลือก Tab ไหนอยู่ (ตั้งค่าเริ่มต้นเป็น "ที่ต้องได้รับ")
  const [currentTab, setCurrentTab] = useState("ที่ต้องได้รับ");
  
  const orders = useSelector((state: RootState) => state.orders.orders);
  const dispatch = useDispatch<AppDispatch>()
  const [searchParams] = useSearchParams();
const status = searchParams.get("status") || "ALL";

  useEffect(() => {
    dispatch(fetchOrders(status as any))

  },[dispatch,status])

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-white font-anuphan text-gray-950 pt-10 sm:pt-20 pb-20">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Nav (Breadcrumbs) */}
        <nav className="flex flex-wrap items-center text-sm md:text-md text-black mb-4 md:mb-6 font-medium">
          <Link
            data-test="click-home"
            to="/"
            className="hover:text-blue-500 transition-colors"
          >
            หน้าหลัก
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1 text-black"
          />
          <Link to="/profile" className="hover:text-blue-500 transition-colors">
            การซื้อของฉัน
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1 text-black"
          />
          <span className="text-black">สถานะคำสั่งซื้อ</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <main className="flex-1 w-full min-h-[500px]">
            {/* เรียกใช้ Component Tabs */}
            <StatusOrderTabs
              activeTab={currentTab}
              onTabChange={(tabName) => setCurrentTab(tabName)}
            />

            {/* ส่วนนี้สามารถเพิ่ม Logic เพื่อกรองสินค้าตาม currentTab ได้เลยในอนาคต */}

            {/* Order Item */}
            <div className="bg-white">
              {/* Order Header */}
              <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-sm text-gray-600 mb-1">เลขที่คำสั่งซื้อ</p>
                  <p className="font-medium text-black">ORD-2024-001</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">วันที่สั่งซื้อ</p>
                  <p className="font-medium text-black">15 มีนาคม 2567</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">สถานะ</p>
                  <p className="font-medium text-[#5B95F9]">
                    {currentTab}
                  </p>{" "}
                </div>
              </div>

              <div className="flex flex-col gap-2 py-6 border-b border-gray-100 items-start w-full">
                {orders.map((order) => (
  <div key={order.id}>
    {/* Order Header */}
    <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-100">
      <div>
        <p className="text-sm text-gray-600 mb-1">เลขที่คำสั่งซื้อ</p>
        <p className="font-medium text-black">{order.orderNo}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">สถานะ</p>
        <p className="font-medium text-blue-500">{order.status}</p>
      </div>
    </div>

    {/* Order Items */}
    <div className="flex flex-col gap-2 py-4 border-b border-gray-100">
      {order.orderItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-6 py-3 border-b border-[#D1D5DB] last:border-0 w-full"
        >
          <img
            src={item.imageUrl || ""}
            alt=""
            className="w-16 h-16 object-contain rounded-md"
          />
          <div className="flex-1 font-bold text-sm line-clamp-1">
            {item.productName}
          </div>
          <div className="w-24 text-center text-sm">
            ฿ {item.price.toLocaleString()}
          </div>
          <div className="w-12 text-center text-sm">
            x {item.quantity}
          </div>
          <div className="w-24 text-right text-blue-500 font-medium text-sm">
            ฿ {(item.price * item.quantity).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  </div>
))}
              </div>

              {/* Payment Detail Section */}
              <div className="pt-8 w-full">
                <h2 className="font-bold text-xl mb-4 text-black">
                  การชำระเงิน
                </h2>
                <div className="flex justify-between items-center py-4 bg-[#F9F9F9] px-4 rounded-t-sm mb-[2px]">
                  <span className="text-black font-medium">
                    วิธีการชำระเงิน
                  </span>
                  <span className="text-gray-700">บัตรเครดิต/เดบิต</span>
                </div>
                <div className="flex justify-between items-center py-4 bg-[#F9F9F9] px-4 rounded-b-sm">
                  <span className="text-black font-bold text-lg">
                    ยอดรวมสุทธิ
                  </span>
                  <span className="font-bold text-[#5B95F9] text-xl">
                    ฿ {subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
