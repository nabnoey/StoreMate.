import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import ProfileSidebar from "../../components/user/ProfileSidebar"; // อย่าลืม import ProfileSidebar ของคุณ

// --- Mock Data ---
interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  isRead: boolean;
  image?: string;
  category: "order" | "refund" | "shop";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "คำสั่งซื้อของคุณถูกจัดส่งแล้ว",
    description:
      "คำสั่งซื้อ ORD-2024-001 กำลังอยู่ระหว่างการจัดส่ง คาดว่าจะถึงมือคุณภายใน 2-3 วัน",
    date: "30/5/2569 10:30",
    isRead: false,
    image: "https://via.placeholder.com/48", // เปลี่ยนเป็นรูปจริงของคุณ
    category: "order",
  },
  {
    id: "2",
    title: "อนุมัติคำขอคืนเงินแล้ว",
    description: "คำขอคืนเงิน ORD-2024-001 ได้รับการอนุมัติแล้ว",
    date: "15/4/2569 15:45",
    isRead: false,
    category: "refund",
  },
  {
    id: "3",
    title: "ร้านขอปิดปรับปรุง",
    description: "ปรับปรุงเว็บไซต์ตั้งแต่วันที่ 1 - 3 เมษายน 2569",
    date: "25/3/2569 15:45",
    isRead: false,
    category: "shop",
  },
  {
    id: "4",
    title: "ร้านขอปิดปรับปรุง",
    description: "ปรับปรุงเว็บไซต์ตั้งแต่วันที่ 1 - 3 มีนาคม 2569",
    date: "20/2/2569 15:00",
    isRead: true,
    category: "shop",
  },
];

const NotificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // เพิ่ม State นี้

  const filters = [
    { id: "all", label: "ทั้งหมด", count: 3 },
    { id: "order", label: "คำสั่งซื้อ", count: 1 },
    { id: "refund", label: "คำขอคืนเงิน", count: 1 },
    { id: "shop", label: "ร้านค้า", count: 1 },
  ];

  // กรองข้อมูลตาม Filter ที่เลือก
  const filteredNotifications = mockNotifications.filter(
    (notif) => activeFilter === "all" || notif.category === activeFilter,
  );

  return (
    <div className="min-h-screen bg-white font-anuphan text-gray-950 pt-10 sm:pt-20 pb-20">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* 1. Nav อยู่ด้านบนสุด (Desktop) */}
        <div className="hidden md:block">
          <nav className="flex flex-wrap items-center text-sm md:text-md text-black mb-4 md:mb-4 font-medium">
            <Link
              data-test="click-home"
              to="/"
              className="transition-colors cursor-pointer hover:text-gray-600"
            >
              หน้าหลัก
            </Link>
            <Icon
              icon="material-symbols:chevron-right-rounded"
              className="w-5 h-5 mx-1 text-black"
            />
            <Link
              to="/profile"
              data-test="click-profile"
              className="transition-colors cursor-pointer hover:text-gray-600"
            >
              โปรไฟล์
            </Link>
            <Icon
              icon="material-symbols:chevron-right-rounded"
              className="w-5 h-5 mx-1 text-black"
            />
            <span className="text-black">การแจ้งเตือน</span>
          </nav>
        </div>

        {/* 2. Header (Mobile) */}
        <div className="md:hidden bg-white pt-2 pb-4">
          <div className="flex items-center gap-3">
            <button
              className="mt-[2px] text-black p-0 flex-shrink-0 -ml-2 cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <Icon icon="material-symbols:arrow-back" className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-[16px] leading-[28px] font-bold text-black">
                การแจ้งเตือน
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                ดูการแจ้งเตือนทั้งหมดของคุณ
              </p>
            </div>
          </div>
          <div className="w-[calc(95%+16px)] border-t border-black mt-3 pt-1" />
        </div>

        {/* 3. Main Layout */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Sidebar (Desktop) */}
          <div className="hidden md:block w-[250px] shrink-0">
            <ProfileSidebar />
          </div>

          {/* Main Content Area */}
          <main className="flex flex-col flex-1 w-full bg-white md:rounded-lg shadow-none md:shadow-sm border-none md:border-gray-100 min-h-[calc(100vh-80px)] md:min-h-[500px] relative">
            {/* Title (Desktop) */}
            <div className="hidden md:block p-5 border-b border-gray-100">
              <h1 className="text-[20px] font-bold">การแจ้งเตือน</h1>
              <p className="text-sm text-gray-500 mt-1">
                ดูการแจ้งเตือนทั้งหมดของคุณ
              </p>
            </div>

            <div className="flex flex-col md:flex-row flex-1 w-full p-4 sm:p-5 gap-6">
              {/* Filter Tabs (Mobile: แนวนอนเลื่อนได้, Desktop: แนวตั้ง) */}
              <div className="w-full md:w-48 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center justify-between px-3 md:px-4 py-2 rounded-md transition-colors text-sm whitespace-nowrap shrink-0 cursor-pointer ${
                      activeFilter === filter.id
                        ? "bg-gray-100 text-black font-semibold"
                        : "text-gray-600 hover:bg-gray-50 font-medium"
                    }`}
                  >
                    <span>{filter.label}</span>
                    {filter.count > 0 && (
                      <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full min-w-[20px] text-center ml-2">
                        {filter.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Notifications List */}
              <div className="flex-1 flex flex-col gap-3">
                {filteredNotifications.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-400">
                    <Icon
                      icon="mdi:bell-off-outline"
                      className="w-16 h-16 mb-4 text-gray-300"
                    />
                    <p className="text-lg">ไม่มีการแจ้งเตือน</p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-lg flex justify-between gap-4 transition-colors cursor-pointer hover:opacity-90 ${
                        !notif.isRead
                          ? "bg-[#EEF2FF]" // สีพื้นหลังสำหรับข้อความที่ยังไม่ได้อ่าน
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className="flex-1">
                        <h3
                          className={`text-sm sm:text-base ${
                            !notif.isRead
                              ? "font-bold text-black"
                              : "font-medium text-gray-700"
                          }`}
                        >
                          {notif.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {notif.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {notif.date}
                        </p>
                      </div>

                      {/* รูปภาพประกอบ (ถ้ามี) เช่น รูปสินค้า */}
                      {notif.image && (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 rounded-md overflow-hidden bg-gray-200 border border-gray-300">
                          <img
                            src={notif.image}
                            alt="thumbnail"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))
                )}
                <div className="border-b border-gray-200 mt-2"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
