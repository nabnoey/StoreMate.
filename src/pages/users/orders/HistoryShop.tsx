import { useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../redux/store";
import ProfileSidebar from "../../../components/user/ProfileSidebar";
import { Icon } from "@iconify/react";
import StatusOrderTabs from "../../../components/user/StatusOrderTabs";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../../redux/orders/orderReducer";
import type { OrderStatus } from "../../../types/orders";
import { statusConfig, getOrderLabel } from "../../../utils/order";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawStatus = searchParams.get("status") as OrderStatus | null;
  const status = rawStatus && statusConfig[rawStatus] ? rawStatus : "ALL";

  const { orders, error } = useSelector((state: RootState) => state.orders);

  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
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
    if (!token) return;
    const fetchStatus = status === "ALL" ? undefined : status;
    dispatch(fetchOrders(fetchStatus as any));
  }, [dispatch, status, token]);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders
      .filter((order) => (status === "ALL" ? true : order.status === status))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [orders, status]);

  const handleTabChange = (nextStatus: string) => {
    if (nextStatus !== status) {
      setSearchParams({ status: nextStatus });
    }
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
            <StatusOrderTabs activeTab={status} onTabChange={handleTabChange} />

            <div className="flex flex-col gap-2 py-6 w-full bg-white ">
              {error ? (
                <div className="flex flex-col items-center justify-center py-16 sm:py-28">
                  <p className="text-[20px] sm:text-[24px] font-medium text-red-500 mb-4 sm:mb-6">
                    ไม่พบข้อมูลคำสั่งซื้อ
                  </p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 sm:py-28">
                  <Icon
                    icon="mdi-light:cart"
                    className="w-50 h-50 sm:w-70 sm:h-70 text-black mb-6"
                  />

                  <p className="text-[36px] sm:text-[20px] lg:text-[36px] font-medium text-black mb-4 sm:mb-6">
                    ยังไม่มีรายการคำสั่งซื้อ
                  </p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const color = statusConfig[order.status].color;
                  const label = getOrderLabel(order.status, order.checkoutType);

                  const orderTotal =
                    order.totalPrice ||
                    order.total ||
                    order.orderItems.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0,
                    );
                  const firstProductId = order.orderItems?.[0]?.id;
                  return (
                    <div
                      key={order.id}
                      className="mb-8 w-full cursor-pointer hover:shadow-md transition-shadow rounded-lg p-4 bg-white border border-gray-100"
                      onClick={() => {
                        const orderNo = order.orderNo || `ORD-${order.id}`;
                        navigate(`/orders/${orderNo}`);
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pb-4 border-b border-gray-100">
                        <div>
                          <p className="flex-1 text-sm text-black mb-1 text-[14px]">
                            เลขที่คำสั่งซื้อ
                          </p>
                          <p className="flex-1  font-medium text-black text-[16px] ">
                            {/* ถ้ามี orderNo ก็ใช้ มั่ฉะนั้นก็ generate เอง */}
                            {order.orderNo || `ORD-${order.id}`}
                          </p>
                        </div>
                        <div>
                          <p className="flex-1 text-sm text-black mb-1 text-[14px]">
                            วันที่สั่งซื้อ
                          </p>
                          <p className="flex-1  font-medium text-black text-[16px]">
                            {formatOrderDate(order.createdAt)}
                          </p>
                        </div>
                        <div>
                          <p className="flex-1  text-sm text-black mb-1 text-[14px]">
                            สถานะ
                          </p>
                          <p className={`font-medium ${color} text-[16px]`}>
                            {label}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 py-4 border-b border-gray-100 w-full">
                        {order.orderItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-row items-start gap-3 sm:gap-6 py-3 border-b border-[#D1D5DB] last:border-0 w-full"
                          >
                            <img
                              src={item.imageUrl || ""}
                              alt=""
                              className="w-20 h-20 sm:w-35 sm:h-35 object-contain rounded-md flex-shrink-0"
                            />

                            <div className="flex flex-col flex-1 gap-1 not-last:text-left">
                              <div className="font-bold text-[20px] font-anuphan text-black line-clamp-3">
                                {item.productName}
                              </div>
                              <div className="text-black text-[16px]">
                                ราคาต่อหน่วย ฿ {item.price.toLocaleString()}
                              </div>
                              <div className="text-black text-[16px]">
                                จำนวน x {item.quantity}
                              </div>
                            </div>

                            <div className="flex h-full self-center text-right text-[#5B95F9] font-bold text-[20px] sm:text-lg flex-shrink-0">
                              ฿ {(item.price * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 rounded-xl  bg-white p-4">
                        <div className="grid gap-2 w-full">
                          <div className="flex justify-between items-center rounded-lg bg-[#F9FAFB] px-4 py-4">
                            <span className="text-black font-bold text-[20px]">
                              ยอดรวมสุทธิ
                            </span>
                            <span className="font-bold text-[#5B95F9] text-[20px]">
                              ฿ {orderTotal.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {order.status === "COMPLETED" ? (
                          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-start sm:justify-end">
                            <button
                              type="button"
                              data-test="btn-add-orders"
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
                              data-test="btn-review-orders"
                              onClick={() =>
                                firstProductId &&
                                navigate(`/product/${firstProductId}`)
                              }
                              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                            >
                              เขียนรีวิว
                            </button>
                          </div>
                        ) : order.status === "CANCELLED" ? (
                          <div className="mt-4 flex flex-col items-start w-full">
                            <p className="text-black text-[16px]">
                              <span className="font-medium">เหตุผล :</span>{" "}
                              {order.cancelReason || "ไม่ได้ระบุเหตุผล"}
                            </p>
                          </div>
                        ) : order.status !== "RECEIVE" ? (
                          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-start sm:justify-end">
                            <button
                              data-test="btn-cancel-orders"
                              type="button"
                              onClick={() =>
                                navigate(`/cancel-orders/${order.orderNo}`)
                              }
                              className="cursor-pointer rounded-md  bg-blue-500 px-4 py-2 text-[16px] font-medium text-white transition"
                            >
                              ยกเลิกคำสั่งซื้อ
                            </button>
                          </div>
                        ) : null}
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
