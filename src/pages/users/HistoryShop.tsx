import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/store";
import ProfileSidebar from "../../components/user/ProfileSidebar";
import { Icon } from "@iconify/react";
import StatusOrderTabs from "../../components/user/StatusOrderTabs";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../redux/orders/orderReduer";
import type { OrderStatus } from "../../types/orders";
const tabToStatusMap: Record<string, OrderStatus> = {
  ทั้งหมด: "ALL",
  คำสั่งซื้อสำเร็จ: "COMPLETED",
  ที่ต้องชำระ: "PENDING",
  ที่ต้องจัดส่ง: "PROCESSING",
  ที่ต้องได้รับ: "RECEIVE",
  ยกเลิก: "CANCELLED",
  "คืนเงิน/คืนสินค้า": "REFUND",
};

const statusToTabMap: Record<OrderStatus, string> = {
  ALL: "ทั้งหมด",
  COMPLETED: "คำสั่งซื้อสำเร็จ",
  PENDING: "ที่ต้องชำระ",
  PROCESSING: "ที่ต้องจัดส่ง",
  RECEIVE: "ที่ต้องได้รับ",
  CANCELLED: "ยกเลิก",
  REFUND: "คืนเงิน/คืนสินค้า",
};

const HistoryPage = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const rawStatus = searchParams.get("status");
  const status =
    rawStatus && statusToTabMap[rawStatus as OrderStatus]
      ? (rawStatus as OrderStatus)
      : "ALL";
  const currentTab = statusToTabMap[status] || "ทั้งหมด";
  const orders = useSelector((state: RootState) => state.orders.orders);
  const dispatch = useDispatch<AppDispatch>();

  const formatOrderDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  useEffect(() => {
    dispatch(fetchOrders(status as any));
  }, [dispatch, status]);

  const filteredOrders = orders.filter((order) => {
    const requestedStatus = tabToStatusMap[currentTab] || "ALL";
    if (requestedStatus === "ALL") return true;
    return order.status === requestedStatus;
  });

  const handleTabChange = (tabName: string) => {
    const nextStatus = tabToStatusMap[tabName] || "ALL";
    setSearchParams({ status: nextStatus });
  };

  return (
    <div className="min-h-screen bg-white font-anuphan text-gray-950 pt-10 sm:pt-20 pb-20">
      <div className="max-w-[1200px] mx-auto px-4">
        <nav className="flex flex-wrap items-center text-sm md:text-md text-black mb-4 md:mb-6 font-medium">
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
          <Link to="/profile" className="transition-colors cursor-pointer">
            การซื้อของฉัน
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1 text-black"
          />
          <span className="text-black">สถานะคำสั่งซื้อ</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-64 flex-shrink-0">
            <ProfileSidebar />
          </div>

          <main className="flex-1 w-full min-h-[500px]">
            <StatusOrderTabs
              activeTab={currentTab}
              onTabChange={handleTabChange}
            />

            <div className="flex flex-col gap-2 py-6 items-center w-full bg-white ">
              {filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 sm:py-28">
                  <Icon
                    icon="mdi-light:cart"
                    className="w-50 h-50 sm:w-70 sm:h-70 text-black mb-6"
                  />

                  <p className="text-[36px] sm:text-[20px] lg:text-[36px] font-medium text-black mb-4 sm:mb-6">
                    ไม่มีรายการคำสั่งซื้อ
                  </p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const orderTotal =
                    order.totalPrice ||
                    order.total ||
                    order.orderItems.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0,
                    );
                  const firstProductId = order.orderItems?.[0]?.id;
                  return (
                    <div key={order.id} className="mb-8">
                      {/* <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-100"> */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-4 border-b border-gray-100">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            เลขที่คำสั่งซื้อ
                          </p>
                          <p className="font-medium text-black">
                            {order.orderNo}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            วันที่สั่งซื้อ
                          </p>
                          <p className="font-medium text-black">
                            {formatOrderDate(order.paidAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">สถานะ</p>
                          <p className="font-medium text-blue-500">
                            {statusToTabMap[order.status]}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 py-4 border-b border-gray-100">
                        {order.orderItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-3 border-b border-[#D1D5DB] last:border-0 w-full"
                          >
                            <img
                              src={item.imageUrl || ""}
                              alt=""
                              className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-md"
                            />
                            <div className="flex-1 font-bold text-sm line-clamp-1">
                              {item.productName}
                            </div>
                            <div className="sm:w-24 text-left sm:text-center text-sm">
                              ฿ {item.price.toLocaleString()}
                            </div>
                            <div className="sm:w-24 text-left sm:text-center text-sm">
                              x {item.quantity}
                            </div>
                            <div className="sm:w-24 text-left sm:text-right text-blue-500 font-medium text-smหห">
                              ฿ {(item.price * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 rounded-xl border border-gray-200 bg-[#FBFBFB] p-4">
                        <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                          <div className="flex justify-between items-center rounded-lg bg-white px-4 py-4">
                            <span className="text-black font-medium">
                              วิธีการชำระเงิน
                            </span>
                            <span className="text-gray-700">
                              บัตรเครดิต/เดบิต
                            </span>
                          </div>
                          <div className="flex justify-between items-center rounded-lg bg-white px-4 py-4">
                            <span className="text-black font-bold text-lg">
                              ยอดรวมสุทธิ
                            </span>
                            <span className="font-bold text-[#5B95F9] text-xl">
                              ฿ {orderTotal.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {status === "COMPLETED" && (
                          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-start sm:justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                firstProductId &&
                                navigate(`/product/${firstProductId}`)
                              }
                              className="rounded-md border border-blue-500 bg-white px-4 py-2 text-sm font-medium text-blue-500 transition hover:bg-blue-50"
                            >
                              ซื้ออีกครั้ง
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                firstProductId &&
                                navigate(`/product/${firstProductId}`)
                              }
                              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                            >
                              เขียนรีวิว
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
