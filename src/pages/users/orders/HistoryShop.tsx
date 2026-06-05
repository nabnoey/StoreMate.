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
import {
  submitProductReview,
  updateProductReview,
  deleteProductReview,
} from "../../../redux/reviews/reviewsReducer";
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
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // const [isFetchingDetail, setIsFetchingDetail] = useState<boolean>(false);

  const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);
  const [orderForReview, setOrderForReview] = useState<any>(null);
  const [localSelectedItemId, setLocalSelectedItemId] = useState<number | null>(
    null,
  );

  const [isViewReviewModalOpen, setIsViewReviewModalOpen] =
    useState<boolean>(false);
  const [isEditReviewModalOpen, setIsEditReviewModalOpen] =
    useState<boolean>(false);
  const [activeReviewData, setActiveReviewData] = useState<any>(null);

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
        if (status === "REFUNDED") {
          return order.status === "REFUNDED";
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

  const launchReviewModalForItem = async (order: any, itemFromList: any) => {
    try {
      // setIsFetchingDetail(true);
      // setErrorMessage(null);
      setIsSelectModalOpen(false); // ปิด popup เลือกสินค้า (ถ้ามีเปิดอยู่)

      const orderNo = order.orderNo || `ORD-${order.id}`;
      const orderDetailData = await dispatch(
        fetchOrderDetails(orderNo),
      ).unwrap();

      const matchedItemDetail = orderDetailData?.orderItems?.find(
        (detailItem: any) =>
          detailItem.productId === itemFromList.id ||
          detailItem.id === itemFromList.id ||
          detailItem.productName === itemFromList.productName,
      );

      const actualProductId =
        matchedItemDetail?.productId ||
        matchedItemDetail?.id ||
        itemFromList.id;
      const actualOrderItemId = matchedItemDetail?.id || itemFromList.id;

      if (actualProductId) {
        setSelectedItem({
          ...itemFromList,
          productId: actualProductId,
          orderItemId: actualOrderItemId,
        });
        setIsReviewModalOpen(true);
      } else {
        toast.error("ไม่พบข้อมูลรหัสคำสั่งซื้อสำหรับรายการนี้");
      }
    } catch (error) {
      console.error("Fetch order details error:", error);
      toast.error("ไม่สามารถดึงข้อมูลสินค้าได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      // setIsFetchingDetail(false);
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

    try {
      // setErrorMessage(null);
      await dispatch(
        submitProductReview({ orderItemId: selectedItem.orderItemId, payload }),
      ).unwrap();

      toast.dismiss();
      toast.success("ขอบคุณสำหรับรีวิว");

      setIsReviewModalOpen(false);

      setReviewScore(0);
      setMessage("");
      setSelectedItem(null);

      dispatch(fetchOrders(status as any));
    } catch (err) {
      console.error("Review error:", err);
      toast.dismiss();
      toast.error("ไม่สามารถส่งรีวิวได้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  const handleOpenViewReview = (order: any, item: any) => {
    setOrderForReview(order);
    setSelectedItem(item);

    setActiveReviewData({
      id: item.review?.id,
      reviewerName: item.review?.reviewer?.name || "ผู้ใช้งานระบบ",
      reviewerImage: item.review?.reviewer?.imageUrl || "",
      createdAt: formatOrderDate(item.review?.createdAt || order.createdAt),
      reviewScore: item.review?.reviewScore || 5,
      message: item.review?.message || "",
      productName: item.productName,
      imageUrl: item.imageUrl,
    });

    setIsViewReviewModalOpen(true);
  };

  const handleSwitchToEditReview = () => {
    if (!activeReviewData) return;
    setReviewScore(activeReviewData.reviewScore);
    setMessage(activeReviewData.message);

    setIsViewReviewModalOpen(false);
    setIsEditReviewModalOpen(true);
  };

  const handleEditReviewSubmit = async () => {
    if (!activeReviewData?.id) return;

    if (reviewScore === 0) {
      toast.error("กรุณากรอกคะแนนความพึงพอใจ");
      return;
    }

    const payload: CreateReviewPayload = {
      reviewScore: reviewScore,
      message: message,
    };

    try {
      await dispatch(
        updateProductReview({ id: activeReviewData.id, payload }),
      ).unwrap();

      toast.dismiss();
      toast.success("ขอบคุณสำหรับรีวิว");

      setIsEditReviewModalOpen(false);
      setReviewScore(0);
      setMessage("");

      dispatch(fetchOrders(status as any));
    } catch (err) {
      console.error("Edit review error:", err);
      toast.dismiss();
      toast.error("ไม่สามารถแก้ไขรีวิวได้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  const handleDeleteReview = async () => {
    if (!activeReviewData?.id) return;

    if (confirm("คุณต้องการลบรีวิวนี้ใช่หรือไม่?")) {
      try {
        await dispatch(
          deleteProductReview({ id: activeReviewData.id }),
        ).unwrap();

        toast.dismiss();
        toast.success("คุณลบรีวิวเรียบร้อยแล้ว");

        setIsViewReviewModalOpen(false);
        dispatch(fetchOrders(status as any));
      } catch (err) {
        console.error("Delete review error:", err);
        toast.dismiss();
        toast.error("ไม่สามารถลบรีวิวได้ กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  const handleConfirmProductSelection = async () => {
    if (!orderForReview || !localSelectedItemId) return;

    const selectedItemFromList = orderForReview.orderItems?.find(
      (item: any) => item.id === localSelectedItemId,
    );

    if (!selectedItemFromList) return;
    await launchReviewModalForItem(orderForReview, selectedItemFromList);
  };

  return (
    <div className="min-h-screen bg-white font-anuphan text-gray-950 pt-6 sm:pt-20 pb-20 w-full overflow-x-hidden">
      <div className="max-w-[1200px] mx-auto px-4 w-full">
        <nav className="hidden lg:flex flex-wrap items-center text-sm md:text-md text-black mb-4 md:mb-6 font-medium">
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

        <div className="lg:hidden bg-white pt-2 pb-4">
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

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="hidden lg:block w-full lg:w-64 flex-shrink-0">
            {" "}
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

                  console.log("Check Order Items Data:", order.orderItems);
                  const firstProductId = order?.orderItems?.[0]?.id;
                  // เปลี่ยนให้ตรงกับคีย์ที่มาจากหลังบ้านจริง ๆ
                  const unreviewedItems =
                    order.orderItems?.filter(
                      (i: any) => !i.is_reviewed && !i.review,
                    ) || [];
                  const reviewedItems =
                    order.orderItems?.filter(
                      (i: any) => i.isReviewed || i.review,
                    ) || [];

                  const hasUnreviewed = unreviewedItems.length > 0;
                  const hasReviewed = reviewedItems.length > 0;

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

                            {/* 🟢 ปุ่ม "ดูรีวิว": แสดงเมื่อมีสินค้าภายในออเดอร์นี้ถูกรีวิวไปแล้วอย่างน้อย 1 ชิ้น */}
                            {hasReviewed && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // เปิดดูรีวิวชิ้นแรกที่รีวิวไปแล้ว
                                  handleOpenViewReview(order, reviewedItems[0]);
                                }}
                                className="w-full sm:w-[170px] h-[44px] rounded-lg bg-[#1E40AF]/10 text-[#1E40AF] font-semibold text-[14px] sm:text-[16px] flex justify-center items-center transition hover:bg-[#1E40AF]/20 cursor-pointer shadow-sm border border-blue-200"
                              >
                                ดูรีวิว
                              </button>
                            )}

                            {/* 🟢 ปุ่ม "เขียนรีวิว": แสดงเมื่อมีสินค้าที่ยังตกค้างหรือยังไม่ได้ถูกรีวิว */}
                            {hasUnreviewed && (
                              <button
                                type="button"
                                onClick={async (e) => {
                                  e.stopPropagation();

                                  // เช็คเงื่อนไขเด็ด: ถ้าสินค้าที่ยังไม่ได้รีวิวเหลืออยู่แค่ชิ้นเดียว ให้เปิดฟอร์มเขียนรีวิวเลยทันที!
                                  if (unreviewedItems.length === 1) {
                                    await launchReviewModalForItem(
                                      order,
                                      unreviewedItems[0],
                                    );
                                  } else {
                                    // ถ้ายังเหลือมากกว่า 1 ชิ้น ค่อยเปิด popup เพื่อเลือกชิ้นงาน
                                    setOrderForReview(order);
                                    setLocalSelectedItemId(
                                      unreviewedItems[0]?.id || null,
                                    );
                                    setIsSelectModalOpen(true);
                                  }
                                }}
                                className="w-full sm:w-[170px] h-[44px] rounded-lg bg-[#1E40AF] text-white font-medium text-[14px] sm:text-[16px] flex justify-center items-center transition hover:bg-[#152e7c] cursor-pointer shadow-sm"
                              >
                                เขียนรีวิว
                              </button>
                            )}
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

      {isSelectModalOpen && orderForReview && (
        <div className="fixed inset-0 z-50 flex flex-col md:bg-black/50 md:items-center md:justify-center md:p-4 backdrop-blur-xs">
          <div className="w-full h-full md:h-auto md:min-h-0 md:max-h-[85vh] md:max-w-[700px] bg-white md:rounded-xl md:shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center gap-4 p-5 border-b border-gray-100 bg-white">
              <h2 className="text-[18px] font-bold text-gray-950">
                เลือกรีวิวสินค้า
              </h2>
            </div>
            <div className="p-4 overflow-y-auto flex flex-col gap-3 flex-1 bg-gray-50/30">
              {/* ดึงมาเฉพาะชิ้นงานออเดอร์ที่ยังไม่เคยรีวิวแสดงผลใน Popup */}
              {orderForReview.orderItems
                ?.filter((item: any) => !item.isReviewed && !item.review)
                ?.map((item: any) => {
                  const isSelected = localSelectedItemId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setLocalSelectedItemId(item.id)}
                      className={`flex items-center gap-4 p-4 bg-white rounded-xl border transition-all cursor-pointer ${isSelected ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-200"}`}
                    >
                      <img
                        src={item.imageUrl || ""}
                        alt=""
                        className="w-16 h-16 object-contain rounded-lg border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[14px] text-gray-950 line-clamp-2">
                          {item.productName}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row-reverse gap-3">
              <button
                type="button"
                onClick={handleConfirmProductSelection}
                className="px-6 py-2.5 bg-black text-white rounded-lg font-medium text-[14px]"
              >
                เลือก
              </button>
              <button
                type="button"
                onClick={() => setIsSelectModalOpen(false)}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-[14px]"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 POPUP 2: ฟอร์มเขียนรีวิวสินค้าใหม่ */}
      {isReviewModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-white md:bg-black/50 z-50 flex items-start md:items-center justify-center overflow-y-auto backdrop-blur-xs">
          <div className="w-full min-h-screen md:min-h-0 bg-white p-4 md:p-6 md:max-w-xl md:w-full md:rounded-2xl md:shadow-2xl relative flex flex-col">
            <div className="flex items-center gap-3 border-b pb-4 mb-4">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="text-black p-1"
              >
                <Icon icon="material-symbols:arrow-back" className="w-6 h-6" />
              </button>
              <h2 className="text-[18px] font-bold text-gray-950">
                เขียนรีวิว
              </h2>
            </div>
            <div className="flex gap-4 p-3 bg-gray-50 rounded-xl mb-4 border border-gray-100">
              <img
                src={selectedItem.imageUrl || ""}
                alt=""
                className="w-16 h-16 object-contain rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[14px] text-gray-950 line-clamp-1">
                  {selectedItem.productName}
                </p>
                <p className="text-[12px] text-gray-500">
                  จำนวน x {selectedItem.quantity}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[14px] font-medium text-gray-900 mb-2">
                  คะแนนความพึงพอใจ
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewScore(star)}
                      className="focus:outline-none cursor-pointer"
                    >
                      <Icon
                        icon="material-symbols:star-rounded"
                        className={`w-9 h-9 ${star <= reviewScore ? "text-amber-400" : "text-gray-200"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-gray-900">
                  รายละเอียด
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="รายละเอียดความพึงพอใจของคุณ"
                  className="w-full border border-gray-200 rounded-xl p-3 text-[14px] outline-none focus:border-blue-500 bg-white resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleReviewSubmit}
                className="flex-1 py-3 bg-black text-white font-semibold rounded-lg text-[15px]"
              >
                ส่งรีวิว
              </button>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg text-[15px]"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 POPUP 3: ดูรีวิวสินค้า (มีปุ่ม แก้ไข และ ลบรีวิว) */}
      {isViewReviewModalOpen && activeReviewData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-[650px] bg-white rounded-2xl shadow-2xl p-6 relative flex flex-col gap-4">
            <h2 className="text-[20px] font-bold text-gray-950 border-b pb-3">
              รีวิว
            </h2>
            <div className="flex gap-4 items-start border border-gray-100 p-4 rounded-xl bg-gray-50/40">
              <img
                src={activeReviewData.imageUrl || ""}
                alt=""
                className="w-20 h-20 object-contain rounded-lg border bg-white flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-bold text-[15px] text-gray-900 line-clamp-2 leading-snug">
                    {activeReviewData.productName}
                  </h3>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={handleDeleteReview}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-[13px] font-medium transition cursor-pointer"
                    >
                      ลบ
                    </button>
                    <button
                      type="button"
                      onClick={handleSwitchToEditReview}
                      className="px-3 py-1 bg-[#1E40AF] hover:bg-blue-800 text-white rounded-md text-[13px] font-medium transition cursor-pointer"
                    >
                      แก้ไข
                    </button>
                  </div>
                </div>
                <div className="mt-3 space-y-0.5 text-sm text-gray-600">
                  <p className="font-semibold text-gray-900">
                    {activeReviewData.reviewerName}
                  </p>
                  <p className="text-[12px] text-gray-400">
                    {activeReviewData.createdAt}
                  </p>
                  <div className="flex gap-0.5 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icon
                        key={star}
                        icon="material-symbols:star-rounded"
                        className={`w-5 h-5 ${star <= activeReviewData.reviewScore ? "text-amber-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 bg-white p-3 border border-gray-100 rounded-lg mt-2 text-[14px]">
                    {activeReviewData.message || "ไม่มีรายละเอียดความคิดเห็น"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsViewReviewModalOpen(false)}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white font-medium text-[14px] hover:bg-gray-50 transition cursor-pointer"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 POPUP 4: ฟอร์มแก้ไขรีวิวสินค้า */}
      {isEditReviewModalOpen && activeReviewData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-[650px] bg-white rounded-2xl shadow-2xl p-6 relative flex flex-col gap-4">
            <h2 className="text-[20px] font-bold text-gray-950 border-b pb-3">
              แก้ไขรีวิว
            </h2>
            <div className="flex gap-4 items-center">
              <img
                src={activeReviewData.imageUrl || ""}
                alt=""
                className="w-16 h-16 object-contain rounded-lg border bg-white flex-shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-bold text-[15px] text-gray-900 line-clamp-1">
                  {activeReviewData.productName}
                </h3>
                <p className="text-[13px] text-gray-500 font-medium mt-0.5">
                  {activeReviewData.reviewerName}
                </p>
                <p className="text-[11px] text-gray-400">
                  {activeReviewData.createdAt}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-100 flex flex-col gap-4">
              <div>
                <p className="text-[14px] font-medium text-gray-900 mb-1">
                  คะแนนความพึงพอใจ
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewScore(star)}
                      className="transition-transform active:scale-90 focus:outline-none cursor-pointer"
                    >
                      <Icon
                        icon="material-symbols:star-rounded"
                        className={`w-9 h-9 transition-colors ${star <= reviewScore ? "text-amber-400" : "text-gray-200"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-gray-900">
                  รายละเอียด
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="รายละเอียดความพึงพอใจสำหรับการแก้ไขครั้งนี้..."
                  className="w-full border border-gray-200 rounded-xl p-3 text-[14px] text-gray-950 outline-none focus:border-blue-500 transition-colors bg-white resize-none shadow-inner"
                />
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleEditReviewSubmit}
                  className="px-6 py-2 text-[14px] font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition cursor-pointer"
                >
                  ส่ง
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditReviewModalOpen(false)}
                  className="px-6 py-2 text-[14px] font-semibold border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition cursor-pointer"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
