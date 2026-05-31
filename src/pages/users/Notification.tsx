import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import type { AppDispatch, RootState } from "../../redux/store";
import { fetchOwnerNotify } from "../../redux/notification/notificationReducer";
import type {
  Notification,
  NotificationResponse,
} from "../../types/notification";

const NotificationPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeFilter, setActiveFilter] = useState("all");
  const rawNotifications = useSelector(
    (state: RootState) => state.notification.items,
  ) as Notification[];

  const isLoading = useSelector(
    (state: RootState) => state.notification.isLoading,
  );

  const [readIds, setReadIds] = useState<number[]>(() => {
    return JSON.parse(localStorage.getItem("readNotifications") || "[]");
  });

  useEffect(() => {
    dispatch(fetchOwnerNotify());
  }, [dispatch]);

  const notifications: NotificationResponse[] = rawNotifications.map((item) => {
    let simulatedType = "shop";
    const titleText = item.title || "";
    if (
      titleText.includes("คำสั่งซื้อ") ||
      titleText.toLowerCase().includes("order")
    ) {
      simulatedType = "orders";
    } else if (
      titleText.includes("คืนเงิน") ||
      titleText.toLowerCase().includes("refund")
    ) {
      simulatedType = "refunds";
    }

    return {
      id: item.id,
      title: item.title,
      message: item.message,
      createdAt: item.createdAt,
      type: simulatedType,
      isRead: readIds.includes(item.id), // เช็กจาก LocalStorage state
    };
  });

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === "all") return true;
    return item.type === activeFilter;
  });

  const getCount = (type: string) => {
    if (type === "all") return notifications.filter((n) => !n.isRead).length;
    return notifications.filter((n) => n.type === type && !n.isRead).length;
  };

  const filters = [
    { id: "all", label: "ทั้งหมด", count: getCount("all") },
    { id: "orders", label: "คำสั่งซื้อ", count: getCount("orders") },
    { id: "refunds", label: "คำขอคืนเงิน", count: getCount("refunds") },
    { id: "shop", label: "ร้านค้า", count: getCount("shop") },
  ];

  // กดอ่าน (บันทึกลง LocalStorage แก้ขัดชั่วคราว)
  const handleNotificationClick = (notiId: number, isRead: boolean) => {
    if (isRead) return;

    try {
      const currentReadItems = JSON.parse(
        localStorage.getItem("readNotifications") || "[]",
      );
      if (!currentReadItems.includes(notiId)) {
        const updatedReadItems = [...currentReadItems, notiId];
        localStorage.setItem(
          "readNotifications",
          JSON.stringify(updatedReadItems),
        );
        setReadIds(updatedReadItems); // อัปเดต state เพื่อให้ UI Re-render เปลี่ยนเป็นตัวบางทันที
        toast.success("บันทึกการอ่านแล้ว");
      }
    } catch (error) {
      console.error("Failed to update local read status", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link to="/" className="cursor-pointer hover:text-gray-700">
            หน้าหลัก
          </Link>
          <span>&gt;</span>
          <Link to="/profile" className="cursor-pointer hover:text-gray-700">
            โปรไฟล์
          </Link>
          <span>&gt;</span>
          <span className="text-gray-800">การแจ้งเตือน</span>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-gray-100 rounded-lg p-4 flex items-center gap-4 mb-4 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-300">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="font-medium text-gray-700">บุญรักษา วิมานแท้</div>
            </div>

            <div className="flex flex-col gap-3 pl-2">
              <Link
                to="/profile"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                โปรไฟล์ของฉัน
              </Link>
              <Link
                to="/history-shop"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                การซื้อของฉัน
              </Link>
              <Link to="/notification" className="text-blue-500 font-medium">
                การแจ้งเตือน
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h1 className="text-xl font-bold text-gray-800">การแจ้งเตือน</h1>
              <p className="text-sm text-gray-500 mt-1">
                ดูการแจ้งเตือนทั้งหมดของคุณ
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Filter Column */}
              <div className="w-full md:w-48 flex-shrink-0 flex flex-col gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm ${
                      activeFilter === filter.id
                        ? "bg-gray-100 text-blue-500 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{filter.label}</span>
                    {filter.count > 0 && (
                      <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {filter.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Notifications List Column */}
              <div className="flex-1 flex flex-col gap-3">
                {isLoading ? (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    กำลังโหลดข้อมูลการแจ้งเตือน...
                  </div>
                ) : filteredNotifications.length > 0 ? (
                  filteredNotifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() =>
                        handleNotificationClick(item.id, item.isRead)
                      }
                      className={`p-4 rounded-lg flex justify-between gap-4 transition-colors cursor-pointer ${
                        !item.isRead
                          ? "bg-blue-50/70 border border-blue-100"
                          : "bg-white border border-transparent hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex-1">
                        <h3
                          className={`text-sm md:text-base ${!item.isRead ? "font-bold text-gray-800" : "font-medium text-gray-700"}`}
                        >
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleString("th-TH")
                            : "-"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    ไม่มีการแจ้งเตือนในหมวดหมู่นี้
                  </div>
                )}
                <div className="border-b border-gray-200 mt-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
