import { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import type { AppDispatch, RootState } from "../../redux/store";
import {
  fetchUserNotify,
  markAsReadInStore,
  clearUnreadBadge,
  type ClientNotification,
} from "../../redux/notification/notificationReducer";
import { Icon } from "@iconify/react";
import ProfileSidebar from "../../components/user/ProfileSidebar";

const NotificationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [activeFilter, setActiveFilter] = useState("all");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth?.isAuthenticated ?? true,
  );
  const rawNotifications = useSelector(
    (state: RootState) => state.notification.items,
  );
  const isLoading = useSelector(
    (state: RootState) => state.notification.isLoading,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserNotify());
      dispatch(clearUnreadBadge());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = useMemo(() => {
    const processed = rawNotifications.map((item) => {
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
      };
    });

    return processed.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
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

  const activeFilterData =
    filters.find((f) => f.id === activeFilter) || filters[0];

  const handleNotificationClick = (item: ClientNotification) => {
    if (!item.isRead) {
      dispatch(markAsReadInStore(item.id));
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-anuphan text-gray-900 pt-6 sm:pt-10 pb-20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <nav className="hidden md:flex items-center text-sm text-gray-600 mb-6 font-medium">
          <Link
            to="/"
            className="hover:text-black transition-colors cursor-pointer"
          >
            หน้าหลัก
          </Link>
          <Link
            to="/proflie"
            className="hover:text-black transition-colors cursor-pointer"
          >
            โปรไฟล์
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1"
          />
          <span className="text-black">การแจ้งเตือน</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="hidden lg:block w-[280px] flex-shrink-0">
            <ProfileSidebar />
          </div>

          <main className="flex-1 w-full bg-white md:rounded-lg md:shadow-sm md:border border-gray-200 px-4 py-4 md:px-8 md:py-8 min-h-[500px]">
            <div className="md:hidden flex items-start gap-3 pb-3 border-b border-gray-300 mb-4">
              <button
                className="mt-1 text-black p-0 flex-shrink-0"
                onClick={() => navigate(-1)}
              >
                <Icon icon="material-symbols:arrow-back" className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-[18px] leading-[28px] font-bold text-black">
                  การแจ้งเตือน
                </h1>
                <p className="text-gray-600 text-[14px] font-normal mt-1">
                  ดูการแจ้งเตือนทั้งหมดของคุณ
                </p>
              </div>
            </div>

            <div className="hidden md:block w-full mb-6">
              <h1 className="text-[22px] font-bold text-black">การแจ้งเตือน</h1>
              <p className="text-[15px] mt-1 text-gray-600">
                ดูการแจ้งเตือนทั้งหมดของคุณ
              </p>
              <div className="w-full border-t border-gray-300 mt-5" />
            </div>

            <div className="flex flex-col md:flex-row gap-6 lg:gap-10 w-full">
              <div className="hidden md:flex flex-col gap-1 w-[200px] flex-shrink-0">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-md transition-colors text-[15px] cursor-pointer w-full text-start ${
                      activeFilter === filter.id
                        ? "bg-[#F3F4F6] text-blue-600 font-bold"
                        : "text-gray-700 hover:bg-gray-50 font-medium"
                    }`}
                  >
                    <span>{filter.label}</span>
                    {filter.count > 0 && (
                      <span className="bg-[#EF4444] text-white text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center">
                        {filter.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div
                className="md:hidden relative w-full mb-2"
                ref={filterMenuRef}
              >
                <button
                  onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                  className="w-full flex items-center justify-between bg-[#F9FAFB] border border-gray-200 px-4 py-3 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-bold text-[15px]">
                      {activeFilterData.label}
                    </span>
                    {activeFilterData.count > 0 && (
                      <span className="bg-[#EF4444] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {activeFilterData.count}
                      </span>
                    )}
                  </div>
                  <Icon
                    icon="ic:baseline-menu"
                    className="w-6 h-6 text-gray-600"
                  />
                </button>

                {isMobileFilterOpen && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 shadow-lg rounded-md z-10 overflow-hidden">
                    {filters.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => {
                          setActiveFilter(filter.id);
                          setIsMobileFilterOpen(false);
                        }}
                        className={`flex items-center justify-between w-full px-4 py-3 text-start border-b last:border-b-0 ${
                          activeFilter === filter.id
                            ? "bg-blue-50/50 text-blue-600 font-bold"
                            : "text-gray-700"
                        }`}
                      >
                        <span>{filter.label}</span>
                        {filter.count > 0 && (
                          <span className="bg-[#EF4444] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                            {filter.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
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
                      onClick={() => handleNotificationClick(item)}
                      className={`w-full text-start p-4 rounded-lg flex flex-col gap-1 border transition-all ${
                        !item.isRead
                          ? "bg-[#EBF2FE] border-blue-100"
                          : "bg-white border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      <h3
                        className={`text-[15px] md:text-[16px] ${!item.isRead ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={`text-[14px] mt-0.5 leading-relaxed ${!item.isRead ? "text-gray-700" : "text-gray-500"}`}
                      >
                        {item.message}
                      </p>
                      <p className="text-[13px] text-gray-500 mt-1.5">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString("th-TH")
                          : "-"}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500 text-[15px] bg-gray-50 rounded-lg border border-gray-100">
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
