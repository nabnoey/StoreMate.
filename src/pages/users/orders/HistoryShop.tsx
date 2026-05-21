import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../redux/store";
import ProfileSidebar from "../../../components/user/ProfileSidebar";
import { Icon } from "@iconify/react";
import StatusOrderTabs from "../../../components/user/StatusOrderTabs";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../../redux/orders/orderReducer";
import type { OrderStatus } from "../../../types/orders";
import { statusConfig, getOrderLabel } from "../../../utils/order";
import type { CreateReviewPayload } from "../../../types/review";
import { submitProductReview } from "../../../redux/reviews/reviewsReducer";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawStatus = searchParams.get("status") as OrderStatus | null;
  const status = rawStatus && statusConfig[rawStatus] ? rawStatus : "ALL";

  const { orders, error } = useSelector((state: RootState) => state.orders);

  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);

  // เพิ่มรีวิว
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [reviewScore, setReviewScore] = useState<number>(0); // ตรงตาม Pick<Review, 'reviewScore'>
  const [message, setMessage] = useState<string>(""); // ตรงตาม Pick<Review, 'message'>
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { isLoading: isReviewSubmitting } = useSelector(
    (state: RootState) => state.reviews ?? { isLoading: false },
  );

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
    dispatch(fetchOrders(status as any));
  }, [dispatch, status, token]);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders
      .filter((order) => {
        // 1. ถ้าอยู่แท็บ "ทั้งหมด" ให้โชว์ออเดอร์ทุกสถานะ
        if (status === "ALL") return true;

        // 2. 🟢 ถ้าอยู่แท็บ "ยกเลิก" ให้โชว์เฉพาะออเดอร์ที่ยกเลิกแล้วจริงๆ เท่านั้น
        if (status === "CANCELLED") {
          return order.status === "CANCELLED";
        }

        // 3. 🟢 ถ้าอยู่แท็บ "คืนเงิน/คืนสินค้า" ให้โชว์เฉพาะออเดอร์ที่ถูกเคลมเงินคืน
        if (status === "REFUND") {
          return order.status === "REFUND";
        }

        // 4. สถานะอื่นๆ (PENDING, PROCESSING, RECEIVE, COMPLETED)
        return order.status === status;
      })
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

  // เพิ่มรีวิว คือรับจาก productId
  const handleOpenReviewModal = (productId: number) => {
    setSelectedProductId(productId);
    setReviewScore(0);
    setMessage("");
    setErrorMessage(null);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async () => {
    if (!selectedProductId) return;

    if (reviewScore === 0) {
      setErrorMessage("กรุณากรอกคะแนนความพึงพอใจ");
      return;
    }

    const payload: CreateReviewPayload = {
      reviewScore: reviewScore,
      message: message,
    };

    try {
      setErrorMessage(null);
      await dispatch(
        submitProductReview({ id: selectedProductId, payload }),
      ).unwrap();
      setIsReviewModalOpen(false);
      dispatch(fetchOrders(status as any));
    } catch (err) {
      console.error("Review error:", err);
      setErrorMessage("ไม่สามารถส่งรีวิวได้ กรุณาลองใหม่อีกครั้ง");
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
          <span className="text-black cursor-pointer">การซื้อของฉัน</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-64 flex-shrink-0">
            <ProfileSidebar />
          </div>

          <main className="flex-1 w-full min-h-[500px]">
            <StatusOrderTabs activeTab={status} onTabChange={handleTabChange} />

            <div className="flex flex-col gap-2 py-6 w-full bg-white">
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
                  <p className="text-[20px] lg:text-[36px] font-medium text-black mb-4 sm:mb-6">
                    ยังไม่มีรายการคำสั่งซื้อ
                  </p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const color =
                    statusConfig[order?.status]?.color || "text-black";
                  const label = getOrderLabel(
                    order?.status,
                    order?.checkoutType,
                  );

                  const orderTotal =
                    order?.totalPrice ||
                    order?.total ||
                    (order?.orderItems || []).reduce(
                      (sum, item) =>
                        sum + (item?.price || 0) * (item?.quantity || 0),
                      0,
                    );

                  const firstProductId = order?.orderItems?.[0]?.id;

                  return (
                    <div
                      key={order.id}
                      className="mb-8 w-full cursor-pointer hover:shadow-md transition-shadow rounded-lg p-4 bg-white border border-gray-100"
                      onClick={() => {
                        const orderNo = order.orderNo || `ORD-${order.id}`;
                        navigate(`/orders/${orderNo}`);
                      }}
                    >
                      {/* ส่วนหัวรายละเอียดคำสั่งซื้อ */}
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pb-4 border-b border-gray-100">
                        <div>
                          <p className="text-sm text-black mb-1 text-[14px]">
                            เลขที่คำสั่งซื้อ
                          </p>
                          <p className="font-medium text-black text-[16px]">
                            {order.orderNo || `ORD-${order.id}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-black mb-1 text-[14px]">
                            วันที่สั่งซื้อ
                          </p>
                          <p className="font-medium text-black text-[16px]">
                            {formatOrderDate(order.createdAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-black mb-1 text-[14px]">
                            สถานะ
                          </p>
                          <p className={`font-medium ${color} text-[16px]`}>
                            {label}
                          </p>
                        </div>
                      </div>

                      {/* รายการสินค้า */}
                      <div className="flex flex-col gap-2 py-4 border-b border-gray-100 w-full">
                        {order.orderItems?.map((item) => (
                          <div
                            key={item.id}
                            onClick={(e) => e.stopPropagation()}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 border-b border-[#D1D5DB] last:border-0 w-full"
                          >
                            <div className="flex flex-row items-start gap-3 sm:gap-6 flex-1 w-full">
                              <img
                                src={item.imageUrl || ""}
                                alt=""
                                className="w-20 h-20 sm:w-28 sm:h-28 object-contain rounded-md flex-shrink-0 bg-gray-50"
                              />

                              <div className="flex flex-col flex-1 gap-1">
                                <div className="font-bold text-[16px] text-black line-clamp-2">
                                  {item.productName}
                                </div>
                                <div className="text-gray-500 text-[14px]">
                                  ราคาต่อหน่วย ฿ {item.price.toLocaleString()}
                                </div>
                                <div className="text-gray-500 text-[14px]">
                                  จำนวน x {item.quantity}
                                </div>
                              </div>

                              <div className="text-right text-[#5B95F9] font-bold text-[18px] sm:text-lg flex-shrink-0 self-start sm:self-center">
                                ฿{" "}
                                {(item.price * item.quantity).toLocaleString()}
                              </div>
                            </div>
                            {/* ย้ายปุ่มเขียนรีวิวออกไปไว้ข้างล่างแล้ว */}
                          </div>
                        ))}
                      </div>

                      {/* ยอดรวมสุทธิและปุ่มแอคชันท้ายคำสั่งซื้อ */}
                      <div className="mt-4 rounded-xl bg-white p-2">
                        <div className="flex justify-between items-center rounded-lg bg-[#F9FAFB] px-4 py-4">
                          <span className="text-black font-bold text-[20px]">
                            ยอดรวมสุทธิ
                          </span>
                          <span className="font-bold text-[#5B95F9] text-[20px]">
                            ฿ {orderTotal.toLocaleString()}
                          </span>
                        </div>

                        {order.status === "COMPLETED" ? (
                          <div className="mt-4 flex gap-3 justify-end items-center">
                            {/* ปุ่มซื้ออีกครั้ง แบบเติมสีฟ้า */}
                            <button
                              type="button"
                              data-test="btn-add-orders"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (firstProductId)
                                  navigate(`/product/${firstProductId}`);
                              }}
                              className="rounded-md bg-blue-500 px-6 py-2 text-[14px] font-medium text-white transition hover:bg-blue-600 cursor-pointer shadow-sm"
                            >
                              ซื้ออีกครั้ง
                            </button>
                            {/* ปุ่มเขียนรีวิว แบบเติมสีน้ำเงินเข้ม */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (firstProductId)
                                  handleOpenReviewModal(firstProductId);
                              }}
                              className="rounded-md bg-[#2B3A8B] px-6 py-2 text-[14px] font-medium text-white transition hover:bg-[#1E2969] cursor-pointer shadow-sm"
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
                        ) : order.status === "PENDING" &&
                          order.checkoutType === "PROMPTPAY" ? (
                          <div className="mt-4 flex gap-3 justify-end items-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate("/payment-qr", {
                                  state: {
                                    orderNo: order.orderNo || `ORD-${order.id}`,
                                    totalPrice: orderTotal,
                                  },
                                });
                              }}
                              className="cursor-pointer rounded-md bg-blue-500 px-6 py-2 text-[14px] font-medium text-white transition hover:bg-blue-600"
                            >
                              ชำระเงินอีกครั้ง
                            </button>
                            <button
                              data-test="btn-cancel-orders"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/cancel-orders/${order.orderNo || `ORD-${order.id}`}`,
                                  {
                                    state: {
                                      status: order.status,
                                      paymentMethod: order.checkoutType,
                                    },
                                  },
                                );
                              }}
                              className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-[14px] font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                              ยกเลิกคำสั่งซื้อ / ขอเงินคืน
                            </button>
                          </div>
                        ) : order.status === "PENDING" ? (
                          <div className="mt-4 flex gap-3 justify-end items-center">
                            <button
                              data-test="btn-cancel-orders"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/cancel-orders/${order.orderNo || `ORD-${order.id}`}`,
                                  {
                                    state: {
                                      status: order.status,
                                      paymentMethod: order.checkoutType,
                                    },
                                  },
                                );
                              }}
                              className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-[14px] font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                              ยกเลิกคำสั่งซื้อ / ขอเงินคืน
                            </button>
                          </div>
                        ) : order.status !== "RECEIVE" ? (
                          <div className="mt-4 flex gap-3 justify-end">
                            <button
                              data-test="btn-cancel-orders"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/cancel-orders/${order.orderNo || `ORD-${order.id}`}`,
                                  {
                                    state: {
                                      status: order.status,
                                      paymentMethod: order.checkoutType,
                                    },
                                  },
                                );
                              }}
                              className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-[14px] font-medium text-gray-700 transition hover:bg-gray-50"
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

      {/* --- RESPONSIVE REVIEW WINDOW OVERLAY (Modal) --- */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-white md:bg-black/50 z-50 flex items-start md:items-center justify-center overflow-y-auto font-anuphan">
          <div className="w-full min-h-screen bg-white p-4 md:p-6 md:min-h-auto md:max-w-lg md:w-full md:rounded-2xl md:shadow-xl md:my-8 relative flex flex-col justify-between md:justify-start">
            <div>
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 md:border-none md:pb-0 mb-4">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="md:hidden text-gray-950 p-1 cursor-pointer"
                >
                  <Icon
                    icon="material-symbols:arrow-back-ios-new-rounded"
                    className="w-5 h-5"
                  />
                </button>
                <h2 className="text-[20px] md:text-[22px] font-bold text-gray-950">
                  เขียนรีวิว
                </h2>
              </div>

              {/* รายละเอียดสินค้าเฉพาะบน Mobile */}
              {filteredOrders.map((order) => {
                const matchedItem = order.orderItems?.find(
                  (item) => item.id === selectedProductId,
                );
                if (!matchedItem) return null;
                return (
                  <div
                    key={matchedItem.id}
                    className="md:hidden flex gap-4 p-3 bg-gray-50/50 rounded-xl mb-5 border border-gray-100"
                  >
                    <img
                      src={matchedItem.imageUrl || ""}
                      alt=""
                      className="w-20 h-20 object-contain rounded-lg bg-white flex-shrink-0"
                    />
                    <div className="flex flex-col gap-0.5 justify-center">
                      <p className="font-bold text-[14px] text-gray-950 line-clamp-2 leading-snug">
                        {matchedItem.productName}
                      </p>
                      <p className="text-[13px] text-gray-500">
                        ราคาต่อหน่วย ฿ {matchedItem.price.toLocaleString()}
                      </p>
                      <p className="text-[13px] text-gray-500">
                        จำนวน x {matchedItem.quantity}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Error Message Box */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                  <Icon
                    icon="material-symbols:error-outline-rounded"
                    className="w-5 h-5 flex-shrink-0"
                  />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* คะแนนความพึงพอใจ */}
              <div className="mb-5 bg-white md:bg-transparent rounded-xl">
                <p className="text-[14px] md:text-[15px] font-medium text-gray-900 mb-3">
                  คะแนนความพึงพอใจ
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        setReviewScore(star);
                        setErrorMessage(null);
                      }}
                      className="transition-transform active:scale-90 focus:outline-none cursor-pointer"
                    >
                      <Icon
                        icon="material-symbols:star-rounded"
                        className={`w-10 h-10 md:w-9 md:h-9 transition-colors ${
                          star <= reviewScore
                            ? "text-amber-400"
                            : "text-gray-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* รายละเอียดรีวิว */}
              <div className="flex flex-col gap-2 mb-6">
                <label className="text-[14px] md:text-[15px] font-medium text-gray-900 hidden md:block">
                  รายละเอียด
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="รายละเอียด"
                  className="w-full border border-gray-200 rounded-xl p-4 text-[15px] text-gray-950 outline-none focus:border-blue-500 transition-colors resize-none bg-gray-50/30"
                />
              </div>
            </div>

            {/* ปุ่มกดดำเนินการในหน้า Popup รีวิว */}
            <div className="flex flex-row justify-end gap-3 pt-4 border-t border-gray-100 md:border-none bg-white w-full">
              {/* ปุ่มส่ง (สีดำ) */}
              <button
                type="button"
                onClick={handleReviewSubmit}
                disabled={isReviewSubmitting}
                className={`w-1/2 md:w-auto px-8 py-3 md:py-2 text-[15px] md:text-sm font-semibold text-white bg-black rounded-full md:rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  isReviewSubmitting ? "bg-gray-400 cursor-not-allowed" : ""
                }`}
              >
                {isReviewSubmitting ? "กำลังส่ง..." : "ส่ง"}
              </button>

              {/* ปุ่มยกเลิก (สีขาว) */}
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="w-1/2 md:w-auto px-8 py-3 md:py-2 text-[15px] md:text-sm font-semibold border-2 border-gray-950 md:border-gray-300 rounded-full md:rounded-lg text-gray-950 md:text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer text-center"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
