import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import type { AppDispatch, RootState } from "../../redux/store";
import {
  fetchUserNotify,
  markAsReadInStore,
} from "../../redux/notification/notificationReducer";
import { Icon } from "@iconify/react";
import ProfileSidebar from "../../components/user/ProfileSidebar";

const NotificationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [activeFilter, setActiveFilter] = useState("all");

  const rawNotifications = useSelector(
    (state: RootState) => state.notification.items,
  );
  const isLoading = useSelector(
    (state: RootState) => state.notification.isLoading,
  );

  useEffect(() => {
    dispatch(fetchUserNotify());
  }, [dispatch]);

  // ประมวลผลคัดแยกหมวดหมู่แจ้งเตือน
  const notifications = useMemo(() => {
    return rawNotifications.map((item) => {
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
        ...item,
        type: simulatedType,
        isRead: item.isRead,
      };
    });
  }, [rawNotifications]);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return notifications;
    return notifications.filter((item) => item.type === activeFilter);
  }, [notifications, activeFilter]);

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

  // คลิกอ่านทีละรายการ
  const handleNotificationClick = (notiId: number, isRead: boolean = false) => {
    if (isRead) return;
    dispatch(markAsReadInStore(notiId));
    toast.success("อ่านการแจ้งเตือนแล้ว");
  };

  return (
    <div className="min-h-screen bg-white font-anuphan text-gray-950 pt-10 sm:pt-20 pb-20">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="hidden md:flex items-center text-sm text-black mb-4 font-medium">
          <Link
            data-test="click-home"
            to="/"
            className="transition-colors cursor-pointer"
          >
            หน้าหลัก
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1 text-black"
          />
          <span className="text-black">โปรไฟล์</span>
        </nav>

        <div className="md:hidden bg-white pt-2 pb-4">
          <div className="flex items-center gap-3">
            <button
              className="mt-[2px] text-black p-0 flex-shrink-0 -ml-2"
              onClick={() => navigate("/")}
            >
              <Icon icon="material-symbols:arrow-back" className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-[16px] leading-[28px] font-bold text-black">
                การแจ้งเตือน
              </h1>
              <p className="text-black text-[14px] font-anuphan font-normal leading-[24px] break-words mt-[2px]">
                ดูการแจ้งเตือนทั้งหมดของคุณ
              </p>
            </div>
          </div>
          <div className="w-[calc(95%+16px)] border-t border-black mt-3 pt-1" />
        </div>

        <div className="flex flex-col-reverse md:flex-row gap-6 items-start">
          <ProfileSidebar />

          <main className="flex flex-col w-full lg:min-w-[800px] min-h-[427px] bg-[#F9FAFB] md:bg-white rounded-[4px] shadow-[0_0_10px_rgba(0,0,0,0.05)] border-b md:border border-gray-200 px-4 md:px-6 py-3 md:py-6 gap-[9px] relative">
            <div className="hidden sm:block w-full mb-6 md:mb-8">
              <h1 className="text-[20px] font-bold text-black">การแจ้งเตือน</h1>
              <p className="text-[14px] mt-1 text-black">
                ดูการแจ้งเตือนทั้งหมดของคุณ
              </p>
              <div className="w-full border-t border-black mt-5" />
            </div>

            <div className="flex flex-col md:flex-row gap-8 w-full">
              {/* Filter Column */}
              <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none md:w-48 flex-shrink-0">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm whitespace-nowrap md:w-full cursor-pointer ${
                      activeFilter === filter.id
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
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

              <div className="flex-1 flex flex-col gap-3 w-full">
                {isLoading ? (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    กำลังโหลดข้อมูลการแจ้งเตือน...
                  </div>
                ) : filteredNotifications.length > 0 ? (
                  filteredNotifications.map((item) => (
                    <button
                      key={item.id}
                      onClick={() =>
                        handleNotificationClick(item.id, item.isRead ?? false)
                      }
                      className={`p-4 rounded-lg flex justify-between gap-4 transition-all border ${
                        !item.isRead
                          ? "bg-blue-50/50 border-blue-100 shadow-sm"
                          : "bg-white border-gray-100 hover:bg-gray-50/80"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {!item.isRead && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                          )}
                          <h3
                            className={`text-sm md:text-base ${
                              !item.isRead
                                ? "font-bold text-gray-900"
                                : "font-medium text-gray-600"
                            }`}
                          >
                            {item.title}
                          </h3>
                        </div>
                        <p
                          className={`text-sm mt-1 ${!item.isRead ? "text-gray-700" : "text-gray-500"}`}
                        >
                          {item.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleString("th-TH")
                            : "-"}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    ไม่มีการแจ้งเตือนในหมวดหมู่นี้
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
