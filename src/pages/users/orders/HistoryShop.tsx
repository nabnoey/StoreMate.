import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../redux/store";
import ProfileSidebar from "../../../components/user/ProfileSidebar";
import { Icon } from "@iconify/react";
import StatusOrderTabs from "../../../components/user/StatusOrderTabs";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  fetchOrderDetails,
} from "../../../redux/orders/orderReducer";
import type { OrderStatus } from "../../../types/orders";
import { statusConfig, getOrderLabel } from "../../../utils/order";
import type { CreateReviewPayload } from "../../../types/review";
import { submitProductReview } from "../../../redux/reviews/reviewsReducer";
import { toast } from "react-hot-toast";

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
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [reviewScore, setReviewScore] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isFetchingDetail, setIsFetchingDetail] = useState<boolean>(false);

  const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);
  const [orderForReview, setOrderForReview] = useState<any>(null);
  const [localSelectedItemId, setLocalSelectedItemId] = useState<number | null>(
    null,
  );
  const { isLoading: isReviewSubmitting } = useSelector(
    (state: RootState) => state.reviews ?? { isLoading: false },
  );

  const [expandedOrders, setExpandedOrders] = useState<
    Record<string | number, boolean>
  >({});

  const toggleOrderExpand = (
    orderId: string | number,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

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

        // 4. สถานะอื่นๆ (PENDING, PROCESSING, RECEIVED, COMPLETED)
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

  const handleReviewSubmit = async () => {
    if (!selectedItem?.productId) return;

    if (reviewScore === 0) {
      toast.error("กรุณากรอกคะแนนความพึงพอใจ");
      return;
    }

    const payload: CreateReviewPayload = {
      reviewScore: reviewScore,
      message: message,
    };

    const loadingToast = toast.loading("กำลังส่งรีวิวของคุณ");

    try {
      setErrorMessage(null);
      await dispatch(
        submitProductReview({ orderItemId: selectedItem.productId, payload }),
      ).unwrap();

      toast.dismiss(loadingToast);
      toast.success("ขอบคุณสำหรับรีวิว");

      setIsReviewModalOpen(false);

      setReviewScore(0);
      setMessage("");
      setSelectedItem(null);

      dispatch(fetchOrders(status as any));
    } catch (err) {
      console.error("Review error:", err);
      toast.error("ไม่สามารถส่งรีวิวได้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  const handleConfirmProductSelection = async () => {
    if (!orderForReview || !localSelectedItemId) return;

    const selectedItemFromList = orderForReview.orderItems?.find(
      (item: any) => item.id === localSelectedItemId,
    );

    if (!selectedItemFromList) return;

    try {
      setIsFetchingDetail(true);
      setErrorMessage(null);
      setIsSelectModalOpen(false);

      const orderNo = orderForReview.orderNo || `ORD-${orderForReview.id}`;

      const orderDetailData = await dispatch(
        fetchOrderDetails(orderNo),
      ).unwrap();

      const matchedItemDetail = orderDetailData?.orderItems?.find(
        (detailItem: any) =>
          detailItem.productId === selectedItemFromList.id ||
          detailItem.id === selectedItemFromList.id ||
          detailItem.productName === selectedItemFromList.productName,
      );

      const actualProductId =
        matchedItemDetail?.productId ||
        matchedItemDetail?.id ||
        selectedItemFromList.id;
      const actualOrderItemId =
        matchedItemDetail?.id || selectedItemFromList.id;

      if (actualProductId) {
        setSelectedItem({
          ...selectedItemFromList,
          productId: actualProductId,
          orderItemId: actualOrderItemId,
        });
        setIsReviewModalOpen(true);
      } else {
        toast.error("ไม่พบข้อมูลรหัสคำสั่งซื้อสำหรับรายการนี้");
      }
    } catch (error) {
      console.error("Fetch order details error in select modal:", error);
      toast.error("ไม่สามารถดึงข้อมูลสินค้าได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsFetchingDetail(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-anuphan text-gray-950 pt-6 sm:pt-20 pb-20 w-full overflow-x-hidden">
      <div className="max-w-[1200px] mx-auto px-4 w-full">
        <nav className="hidden md:flex flex-wrap items-center text-sm md:text-md text-black mb-4 md:mb-6 font-medium">
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

        <div className="md:hidden bg-white pt-2 pb-4">
          <div className="flex items-center gap-3">
            <button
              className="mt-[2px] text-black p-0 flex-shrink-0"
              onClick={() => navigate("/")}
            >
              <Icon icon="material-symbols:arrow-back" className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-[18px] font-bold text-black">
                การซื้อของฉัน
              </h1>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="hidden md:block w-full md:w-64 flex-shrink-0">
            <ProfileSidebar />
          </div>

          <main className="flex-1 w-full min-h-[500px]">
            <StatusOrderTabs activeTab={status} onTabChange={handleTabChange} />

            <div className="flex flex-col gap-4 py-4 w-full bg-white">
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
                      className="w-full cursor-pointer hover:shadow-md transition-shadow rounded-xl p-4 bg-white border border-gray-200/80 shadow-sm"
                      onClick={() => {
                        const orderNo = order.orderNo || `ORD-${order.id}`;
                        navigate(`/orders/${orderNo}`);
                      }}
                    >
                      <div className="grid grid-cols-3 sm:flex sm:justify-between gap-2 pb-4 border-b border-gray-100">
                        <div>
                          <p className="text-[11px] sm:text-sm text-gray-500 mb-1">
                            เลขที่คำสั่งซื้อ
                          </p>
                          <p className="font-semibold text-black text-[13px] sm:text-[16px] break-all leading-tight">
                            {order.orderNo || `ORD-${order.id}`}
                          </p>
                        </div>
                        <div className="px-1">
                          <p className="text-[11px] sm:text-sm text-gray-500 mb-1">
                            วันที่สั่งซื้อ
                          </p>
                          <p className="font-medium text-black text-[13px] sm:text-[16px] leading-tight">
                            {formatOrderDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right sm:text-left">
                          <p className="text-[11px] sm:text-sm text-gray-500 mb-1">
                            สถานะ
                          </p>
                          <p
                            className={`font-semibold ${color} text-[13px] sm:text-[16px] leading-tight`}
                          >
                            {label}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 py-3 border-b border-gray-100 w-full">
                        {order.orderItems?.map((item, index) => {
                          const isExpanded = expandedOrders[order.id];
                          const shouldHideOnMobile = index > 0 && !isExpanded;

                          return (
                            <div
                              key={item.id}
                              onClick={(e) => e.stopPropagation()}
                              className={`items-center gap-3 sm:gap-6 py-3 border-b border-gray-100 last:border-0 w-full ${
                                shouldHideOnMobile ? "hidden md:flex" : "flex"
                              }`}
                            >
                              <img
                                src={item.imageUrl || ""}
                                alt=""
                                className="w-16 h-16 sm:w-28 sm:h-28 object-contain rounded-lg flex-shrink-0 bg-gray-50 border border-gray-100"
                              />

                              <div className="flex flex-col flex-1 gap-0.5 min-w-0">
                                <div className="font-bold text-[14px] sm:text-[16px] text-black line-clamp-2 leading-snug">
                                  {item.productName}
                                </div>
                                <div className="text-black text-[12px] sm:text-[14px]">
                                  ราคาต่อหน่วย ฿ {item.price.toLocaleString()}
                                </div>
                                <div className="text-black text-[12px] sm:text-[14px]">
                                  จำนวน x {item.quantity}
                                </div>
                              </div>

                              <div className="text-right text-[#3B82F6] font-bold text-[15px] sm:text-lg flex-shrink-0 self-center pl-2">
                                ฿{" "}
                                {(item.price * item.quantity).toLocaleString()}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {order.orderItems && order.orderItems.length > 1 && (
                        <div className="md:hidden w-full pt-2">
                          <button
                            type="button"
                            onClick={(e) => toggleOrderExpand(order.id, e)}
                            className="w-full h-[44px] bg-[#F9FAFB] hover:bg-gray-100 active:bg-gray-200 transition-colors rounded-xl flex items-center justify-center gap-2 text-black font-medium text-[14px] border border-gray-100 shadow-sm cursor-pointer"
                          >
                            <span>
                              {expandedOrders[order.id]
                                ? "ซ่อนรายการสินค้า"
                                : `มีอีก ${order.orderItems.length - 1} รายการ`}
                            </span>
                            <Icon
                              icon="material-symbols:keyboard-arrow-down-rounded"
                              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                                expandedOrders[order.id] ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>
                      )}

                      <div className="mt-3">
                        <div className="flex justify-center md:justify-between items-center gap-4 rounded-lg bg-[#F9FAFB] px-4 py-3">
                          <div className="flex items-center gap-3 md:w-full md:justify-between">
                            <span className="text-black font-bold text-[15px] sm:text-[18px]">
                              ยอดรวมสุทธิ
                            </span>
                            <span className="font-bold text-[#3B82F6] text-[16px] sm:text-[20px]">
                              ฿ {orderTotal.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {order.status === "COMPLETED" ? (
                          <div className="mt-3 grid grid-cols-2 gap-3 sm:flex sm:justify-end sm:items-center w-full">
                            <button
                              type="button"
                              data-test="btn-add-orders"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (firstProductId)
                                  navigate(`/product/${firstProductId}`);
                              }}
                              className="w-full sm:w-[170px] h-[44px] rounded-lg bg-[#3B82F6] text-[#FCFCFC] font-medium text-[14px] sm:text-[16px] flex justify-center items-center transition hover:bg-blue-600 cursor-pointer shadow-sm"
                            >
                              ซื้ออีกครั้ง
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOrderForReview(order);
                                setLocalSelectedItemId(
                                  order.orderItems?.[0]?.id || null,
                                );
                                setIsSelectModalOpen(true);
                              }}
                              className="w-full sm:w-[170px] h-[44px] rounded-lg bg-[#1E40AF] text-white font-medium text-[14px] sm:text-[16px] flex justify-center items-center transition hover:bg-[#152e7c] cursor-pointer shadow-sm"
                            >
                              เขียนรีวิว
                            </button>
                          </div>
                        ) : order.status === "CANCELLED" ? (
                          <div className="mt-3 flex flex-col items-start w-full px-1">
                            <p className="text-gray-600 text-[14px] sm:text-[16px]">
                              <span className="font-medium text-black">
                                เหตุผล :
                              </span>{" "}
                              {order.cancelReason || "ไม่ได้ระบุเหตุผล"}
                            </p>
                          </div>
                        ) : order.status === "PENDING" &&
                          order.checkoutType === "PROMPTPAY" ? (
                          <div className="mt-3 grid grid-cols-2 gap-3 sm:flex sm:justify-end sm:items-center w-full">
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
                              className="w-full h-[44px] sm:w-[170px] rounded-lg bg-[#1E40AF] text-white font-medium text-[14px] sm:text-[16px] flex justify-center items-center transition hover:bg-[#152e7c] cursor-pointer"
                            >
                              ชำระเงิน
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
                              className="w-full h-[44px] sm:w-[170px] rounded-lg bg-[#3B82F6] text-white font-medium text-[14px] sm:text-[16px] flex justify-center items-center transition hover:bg-blue-600 cursor-pointer"
                            >
                              ยกเลิกคำสั่งซื้อ
                            </button>
                          </div>
                        ) : order.status === "PENDING" ||
                          order.status !== "RECEIVED" ? (
                          <div className="mt-3 grid grid-cols-2 gap-3 sm:flex sm:justify-end sm:items-center w-full">
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
                              className="col-start-2 sm:col-start-auto w-full h-[44px] sm:w-[170px] rounded-lg bg-[#3B82F6] text-white font-medium text-[14px] sm:text-[16px] flex justify-center items-center transition hover:bg-blue-600 cursor-pointer"
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

      {/* --- POPUP: เลือกรีวิว (Responsive for Mobile, Tablet, Desktop) --- */}
      {isSelectModalOpen && orderForReview && (
        <div className="fixed inset-0 z-50 flex flex-col md:bg-black/50 md:items-center md:justify-center md:p-4">
          {/* พื้นหลัง Modal บน mobile จะเป็นสีขาวเต็มหน้าจอ (ไม่ใช้ md:pattern) | Tablet/Desktop จะเป็นกล่องขนาด 700px */}
          <div className="w-full h-full md:h-auto md:min-h-0 md:max-h-[85vh] md:max-w-[700px] bg-white md:rounded-xl md:shadow-2xl overflow-hidden flex flex-col">
            {/* 🟢 Mobile Header (Arrow + title + separator) - ซ่อนบน Desktop/Tablet */}
            <div className="md:hidden flex items-center gap-4 p-5 border-b border-gray-100 bg-white flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsSelectModalOpen(false)}
                className="text-black p-1 cursor-pointer"
              >
                <Icon icon="material-symbols:arrow-back" className="w-6 h-6" />
              </button>
              <h2 className="text-[18px] md:text-[22px] font-bold text-gray-950">
                เลือกรีวิว
              </h2>
            </div>

            {/* 🟢 Desktop/Tablet Header (Simple title) - ซ่อนบน Mobile */}
            <div className="hidden md:block p-5 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-[20px] font-bold text-gray-900">
                เลือกรีวิว
              </h3>
            </div>

            {/* รายการสินค้าในออเดอร์ให้กดเลือก (ปรับ padding และ gap) */}
            <div className="p-4 md:p-5 overflow-y-auto flex flex-col gap-3 flex-1 bg-gray-50/30">
              {orderForReview.orderItems?.map((item: any) => {
                const isSelected = localSelectedItemId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setLocalSelectedItemId(item.id)}
                    className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md"
                        : "border-gray-200 hover:border-gray-300 shadow-sm"
                    }`}
                  >
                    {/* รูปภาพสินค้า (ปรับขนาด responsive) */}
                    <img
                      src={item.imageUrl || ""}
                      alt={item.productName}
                      className="w-14 h-14 md:w-20 md:h-20 object-contain rounded-lg border border-gray-100 flex-shrink-0 bg-white"
                    />

                    {/* รายละเอียดสินค้า */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[14px] md:text-[15px] text-gray-950 line-clamp-2 leading-snug">
                        {item.productName}
                      </p>
                      <div className="flex gap-4 mt-2 text-[12px] md:text-[13px] text-gray-500">
                        <p>ราคา ฿{item.price?.toLocaleString()}</p>
                        <p>จำนวน x{item.quantity}</p>
                      </div>
                    </div>

                    {/* วงกลมติ๊กเลือก */}
                    <div className="flex-shrink-0 pr-1 md:pr-2">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 🟢 Footer (Responsive: สแต็คแนวตั้งบน mobile / แนวนอนขวาบน desktop) */}
            <div className="p-4 md:p-5 border-t border-gray-100 flex flex-col gap-3 bg-white md:flex-row-reverse md:justify-start md:gap-3 flex-shrink-0">
              {/* 🟢 ใช้ md:flex-row-reverse และ HTML order: ["เลือก", "ยกเลิก"] 
               เพื่อให้ mobile แสดง "เลือก" บน "ยกเลิก" และ desktop แสดง [ยกเลิก | เลือก] */}

              {/* ปุ่ม เลือก (w-full on mobile, taller size) */}
              <button
                type="button"
                onClick={handleConfirmProductSelection}
                disabled={isFetchingDetail} // ป้องกันกดเบิ้ลระหว่างรอโหลด API
                className={`w-full md:w-auto px-6 py-3 md:py-2.5 rounded-lg bg-black text-white font-medium text-[14px] hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 cursor-pointer ${isFetchingDetail ? "bg-gray-400 cursor-not-allowed" : ""}`}
              >
                {isFetchingDetail ? "กำลังโหลด..." : "เลือก"}
              </button>

              {/* ปุ่ม ยกเลิก (w-full on mobile) */}
              <button
                type="button"
                onClick={() => {
                  setIsSelectModalOpen(false);
                  setOrderForReview(null);
                }}
                className="w-full md:w-auto px-6 py-3 md:py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white font-medium text-[14px] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- RESPONSIVE REVIEW WINDOW OVERLAY (ปรับปรุงตาม image_cdba86.png) --- */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-white md:bg-black/50 z-50 flex items-start md:items-center justify-center overflow-y-auto">
          <div className="w-full min-h-screen md:min-h-0 bg-white p-4 md:p-6 md:max-w-xl md:w-full md:rounded-2xl md:shadow-2xl relative flex flex-col pb-24 md:pb-6">
            {/* Header หน้าต่างรีวิว */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="text-black p-1 cursor-pointer"
              >
                <Icon icon="material-symbols:arrow-back" className="w-6 h-6" />
              </button>
              <h2 className="text-[18px] md:text-[22px] font-bold text-gray-950">
                เขียนรีวิว
              </h2>
            </div>

            {/* กล่องแสดงรายละเอียดสินค้าด้านบนรีวิว */}
            {filteredOrders.map((order) => {
              const matchedItem = order.orderItems?.find(
                (item) => item.id === selectedItem?.id,
              );
              if (!matchedItem) return null;
              return (
                <div
                  key={matchedItem.id}
                  className="flex gap-4 p-3 bg-white rounded-xl mb-4 border border-gray-100 shadow-sm"
                >
                  <img
                    src={matchedItem.imageUrl || ""}
                    alt=""
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg border border-gray-100 flex-shrink-0"
                  />
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <p className="font-bold text-[14px] sm:text-[15px] text-gray-950 line-clamp-1 leading-snug">
                      {matchedItem.productName}
                    </p>
                    <p className="text-[12px] sm:text-[13px] text-gray-500 mt-0.5">
                      ราคาต่อหน่วย ฿ {matchedItem.price.toLocaleString()}
                    </p>
                    <p className="text-[12px] sm:text-[13px] text-gray-500">
                      จำนวน x {matchedItem.quantity}
                    </p>
                  </div>
                  <div className="text-right font-bold text-[#3B82F6] text-[14px] sm:text-[16px] self-center pl-2">
                    ฿{" "}
                    {(
                      matchedItem.price * matchedItem.quantity
                    ).toLocaleString()}
                  </div>
                </div>
              );
            })}

            {/* แจ้งเตือนกรณีเกิด Error */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                <Icon
                  icon="material-symbols:error-outline-rounded"
                  className="w-5 h-5 flex-shrink-0"
                />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ฟอร์มกรอกรีวิว (ครอบด้วยกล่องพื้นหลังจางๆ บน Mobile ตามเทมเพลต Figma) */}
            <div className="bg-gray-50/60 md:bg-transparent p-4 md:p-0 rounded-xl border border-gray-100 md:border-none flex flex-col gap-4">
              <div>
                <p className="text-[14px] md:text-[15px] font-medium text-gray-900 mb-2">
                  คะแนนความพึงพอใจ
                </p>
                <div className="flex gap-1">
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
                        className={`w-9 h-9 transition-colors ${
                          star <= reviewScore
                            ? "text-amber-400"
                            : "text-gray-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] md:text-[15px] font-medium text-gray-900 hidden md:block">
                  รายละเอียด
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="รายละเอียด"
                  className="w-full border border-gray-200 rounded-xl p-3 text-[14px] sm:text-[15px] text-gray-950 outline-none focus:border-blue-500 transition-colors resize-none bg-white shadow-inner"
                />
              </div>
            </div>

            {/* ปุ่มบันทึก/ยกเลิก ด้านล่างสุด (Sticky-Bottom บน Mobile / Normal ท้ายกล่องบน Desktop) */}
            <div className="fixed bottom-0 left-0 right-0 md:relative bg-white p-4 md:p-0 border-t border-gray-100 md:border-none flex flex-row gap-3 w-full z-10 mt-auto">
              <button
                type="button"
                onClick={handleReviewSubmit}
                disabled={isReviewSubmitting}
                className={`w-1/2 md:w-auto md:px-10 py-3 md:py-2.5 text-[15px] font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  isReviewSubmitting ? "bg-gray-400 cursor-not-allowed" : ""
                }`}
              >
                {isReviewSubmitting ? "กำลังส่ง..." : "ส่ง"}
              </button>

              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="w-1/2 md:w-auto md:px-10 py-3 md:py-2.5 text-[15px] font-semibold border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer text-center"
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
