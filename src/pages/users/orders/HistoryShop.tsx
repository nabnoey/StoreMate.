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
  fetchProductReviews,
  submitProductReview,
  updateProductReview,
  deleteProductReview,
} from "../../../redux/reviews/reviewsReducer";
import { toast } from "react-hot-toast";

import { PaymentService } from "../../../services/payment.service";
import type { Order } from "../../../types/orders";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawStatus = searchParams.get("status") as OrderStatus | null;
  const status = rawStatus && statusConfig[rawStatus] ? rawStatus : "ALL";

  const { orders, error } = useSelector((state: RootState) => state.orders);
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    console.log("ORDERS FROM REDUX", orders);
  }, [orders]);

  // เพิ่มรีวิว
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [reviewScore, setReviewScore] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);
  const [orderForReview, setOrderForReview] = useState<any>(null);
  const [localSelectedItemId, setLocalSelectedItemId] = useState<number | null>(
    null,
  );
  const [selectModalMode, setSelectModalMode] = useState<"WRITE" | "VIEW">(
    "WRITE",
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
        if (status === "ALL") return true;
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

  const handleBuyAgain = (order: any) => {
    const firstItem = order.orderItems?.[0];

    if (!firstItem) {
      toast.error("ไม่พบข้อมูลสินค้าในคำสั่งซื้อนี้");
      return;
    }

    const checkoutData = {
      isBuyNow: true,
      items: [
        {
          productId: firstItem.productId || firstItem.id,
          cartItemId: null,
          quantity: firstItem.quantity || 1,
          price: firstItem.price,
          totalPrice: firstItem.price * (firstItem.quantity || 1),
          productName: firstItem.productName || firstItem.product?.productName,
          imageUrl:
            firstItem.imageUrl ||
            firstItem.product?.productImages?.[0]?.imageUrl,
          product: {
            id: firstItem.productId || firstItem.id,
            productName:
              firstItem.productName || firstItem.product?.productName,
            price: firstItem.price,
            imageUrl:
              firstItem.imageUrl ||
              firstItem.product?.productImages?.[0]?.imageUrl,
          },
        },
      ],
      total: firstItem.price * (firstItem.quantity || 1),
    };

    navigate("/payment", { state: checkoutData });
  };

  const launchReviewModalForItem = async (order: any, itemFromList: any) => {
    try {
      setIsSelectModalOpen(false);

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

  // ฟังก์ชันแยกย่อยสำหรับดึงรีวิว
  const fetchAndShowReview = async (order: any, itemFromList: any) => {
    try {
      const orderItemId = itemFromList.id;
      const reviewData = await dispatch(
        fetchProductReviews(orderItemId),
      ).unwrap();

      // console.log("ตรวจสอบข้อมูล reviews ที่ดึงมาได้จริง:", reviewData);

      if (reviewData && reviewData.id) {
        setOrderForReview(order);
        setSelectedItem(itemFromList);

        setActiveReviewData({
          id: reviewData.id,
          reviewerName: reviewData.reviewer?.name || "ผู้ใช้งานระบบ",
          reviewerImage: reviewData.reviewer?.imageUrl || "",
          createdAt: formatOrderDate(reviewData.createdAt || order.createdAt),
          reviewScore: reviewData.reviewScore,
          message: reviewData.message,
          productName: itemFromList.productName,
          imageUrl: itemFromList.imageUrl,
        });

        setIsViewReviewModalOpen(true);
      } else {
        toast.error("ไม่พบข้อมูลรีวิวสำหรับสินค้านี้");
      }
    } catch (error) {
      console.error("Error fetching review by orderItemId:", error);
      toast.error("เกิดข้อผิดพลาดในการดึงข้อมูลรีวิว");
    }
  };

  const handleOpenViewReview = async (order: any, itemFromList?: any) => {
    if (itemFromList) {
      await fetchAndShowReview(order, itemFromList);
      return;
    }

    const reviewedItems =
      order.orderItems?.filter((item: any) => item.is_review) || [];

    if (reviewedItems.length === 0) {
      toast.error("คำสั่งซื้อนี้ยังไม่มีรายการสินค้าที่ถูกรีวิว");
      return;
    }

    if (reviewedItems.length === 1) {
      // สินค้าที่รีวิวชิ้นเดียว -> ให้เปิดดูรีวิวได้เลย
      await fetchAndShowReview(order, reviewedItems[0]);
    } else {
      // มีสินค้าที่รีวิวมากกว่า 1 ชิ้น -> ให้เลือกรายการสินค้าก่อน
      setOrderForReview(order);
      setSelectModalMode("VIEW");
      setIsSelectModalOpen(true);
    }
  };

  // ฟังก์ชันกดยืนยันเลือกสินค้า
  const handleConfirmProductSelection = async () => {
    if (!orderForReview || !localSelectedItemId) return;

    const selectedItemFromList = orderForReview.orderItems?.find(
      (item: any) => item.id === localSelectedItemId,
    );

    if (!selectedItemFromList) return;

    setIsSelectModalOpen(false);

    // ตรวจว่าจะ "ดูรีวิว" หรือ "เขียนรีวิว"
    if (selectModalMode === "VIEW") {
      await fetchAndShowReview(orderForReview, selectedItemFromList);
    } else {
      await launchReviewModalForItem(orderForReview, selectedItemFromList);
    }

    setLocalSelectedItemId(null);
  };

  // ลบรีวิว
  const handleDeleteReview = async () => {
    if (!activeReviewData?.id) return;

    try {
      await dispatch(deleteProductReview({ id: activeReviewData.id })).unwrap();

      toast.dismiss();
      toast.success("คุณลบรีวิวเรียบร้อยแล้ว");

      setIsViewReviewModalOpen(false);

      dispatch(fetchOrders(status as any));
    } catch (err) {
      console.error("Delete review error:", err);
      toast.dismiss();
      toast.error("ไม่สามารถลบรีวิวได้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  // ชำระเงินอีกครั้ง กรณ๊ของ qr-code ที่ผู้ใช้งานกดตกลง หรือ ไม่ได้ชำระเงินภายใน 15 นาที
  const handleRetryPayment = async (
    e: React.MouseEvent,
    order: Order,
    orderTotal: number,
  ) => {
    e.stopPropagation();

    try {
      const response = await PaymentService.retryPayment({
        orderNo: order.orderNo,
      });

      navigate("/payment-qr", {
        state: {
          orderNo: order.orderNo,
          totalPrice: orderTotal,
          clientSecret: response.clientSecret,
        },
      });
    } catch (error) {
      toast.error("ไม่สามารถสร้างรายการชำระเงินได้");
    }
  };

  return (
    <div className="min-h-screen bg-white font-anuphan text-gray-950 pt-6 sm:pt-20 pb-20 w-full  overflow-x-hidden break-all">
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

                  const reviewedItems =
                    order.orderItems?.filter((item: any) => item.is_review) ||
                    [];
                  const unreviewedItems =
                    order.orderItems?.filter((item: any) => !item.is_review) ||
                    [];

                  const hasReviewed = reviewedItems.length > 0;
                  const hasUnreviewed = unreviewedItems.length > 0;
                  const isExpanded = !!expandedOrders[order.id];

                  const visibleItems =
                    window.innerWidth >= 768
                      ? order.orderItems || []
                      : isExpanded
                        ? order.orderItems || []
                        : (order.orderItems || []).slice(0, 1);
                  return (
                    <div
                      key={order.id}
                      data-test={`order-card-${order.id}`}
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
                        {visibleItems.map((item: any, idx: number) => (
                          <div key={item.id || idx} className="flex gap-3 py-1">
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
                              ฿ {(item.price * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        ))}
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
                          <div className="mt-3 flex flex-wrap gap-3 sm:justify-end sm:items-center w-full">
                            <button
                              type="button"
                              data-test="btn-retry-orders"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBuyAgain(order);
                              }}
                              className="cursor-pointer flex-1 sm:flex-initial sm:w-[170px] h-[44px] rounded-lg bg-[#3B82F6] text-[#FCFCFC] font-medium text-[14px] sm:text-[16px] flex justify-center items-center transition hover:bg-blue-600 cursor-pointer shadow-sm"
                            >
                              ซื้ออีกครั้ง
                            </button>

                            {hasUnreviewed && (
                              <button
                                data-test="btn-add-review"
                                type="button"
                                onClick={async (e) => {
                                  e.stopPropagation();

                                  if (unreviewedItems.length === 1) {
                                    await launchReviewModalForItem(
                                      order,
                                      unreviewedItems[0],
                                    );
                                  } else {
                                    setOrderForReview(order);
                                    setSelectModalMode("WRITE");
                                    setLocalSelectedItemId(
                                      unreviewedItems[0]?.id || null,
                                    );
                                    setIsSelectModalOpen(true);
                                  }
                                }}
                                className="cursor-pointer flex-1 sm:flex-initial sm:w-[170px] h-[44px] rounded-lg bg-[#1E40AF] text-white font-medium text-[14px] sm:text-[16px] flex justify-center items-center transition hover:bg-[#152e7c] cursor-pointer shadow-sm"
                              >
                                เขียนรีวิว
                              </button>
                            )}

                            {hasReviewed && (
                              <button
                                data-test="btn-see-review"
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (reviewedItems.length === 1) {
                                    handleOpenViewReview(
                                      order,
                                      reviewedItems[0],
                                    );
                                  } else {
                                    setOrderForReview(order);
                                    setSelectModalMode("VIEW");
                                    setLocalSelectedItemId(
                                      reviewedItems[0]?.id || null,
                                    );
                                    setIsSelectModalOpen(true);
                                  }
                                }}
                                className="cursor-pointer flex-1 sm:flex-initial sm:w-[170px] h-[44px] rounded-lg bg-[#1E40AF] text-white font-medium text-[14px] sm:text-[16px] flex justify-center items-center transition hover:bg-[#152e7c] cursor-pointer shadow-sm"
                              >
                                ดูรีวิว
                              </button>
                            )}
                          </div>
                        ) : order.status === "CANCELLED" ||
                          order.status === "REFUNDED" ? (
                          <div className="mt-3 flex flex-col items-start w-full px-1">
                            <p className="text-gray-600 text-[14px] sm:text-[16px]">
                              <span className="font-medium text-black">
                                เหตุผล :
                              </span>
                              {order.reason || "ไม่ได้ระบุเหตุผล"}
                            </p>
                          </div>
                        ) : order.status === "PENDING" ||
                          order.status === "PROCESSING" ? (
                          <div className="mt-3 grid grid-cols-2 gap-3 sm:flex sm:justify-end sm:items-center w-full">
                            {order.status === "PENDING" && (
                              <button
                                type="button"
                                data-test="btn-retry-payment"
                                onClick={(e) =>
                                  handleRetryPayment(e, order, orderTotal)
                                }
                                className="cursor-pointer w-full h-[44px] sm:w-[170px] rounded-lg bg-[#1E40AF] text-white font-medium"
                              >
                                ชำระเงิน
                              </button>
                            )}
                            <button
                              data-test="btn-cancel-order"
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
                              className="cursor-pointer w-full h-[44px] sm:w-[170px] rounded-lg bg-[#3B82F6] text-white font-medium"
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
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs transition-all animate-fade-in">
          <div className="w-full max-h-[90vh] max-w-[95%] sm:max-w-[550px] md:max-w-[650px] bg-white rounded-xl shadow-xl overflow-hidden flex flex-col border border-gray-100">
            <div className="flex items-center p-4 md:p-5 border-b border-gray-100 bg-white flex-shrink-0">
              <h2 className="text-[18px] md:text-[20px] font-bold text-gray-900">
                {selectModalMode === "VIEW"
                  ? "เลือกรีวิว"
                  : "เลือกสินค้าเพื่อเขียนรีวิว"}
              </h2>
            </div>

            <div className="p-0 overflow-y-auto flex flex-col flex-1 bg-white divide-y divide-gray-100">
              {orderForReview.orderItems
                ?.filter((item: any) => {
                  return selectModalMode === "VIEW"
                    ? item.is_review
                    : !item.is_review;
                })
                ?.map((item: any) => {
                  const isSelected = localSelectedItemId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setLocalSelectedItemId(item.id)}
                      className={`flex items-start gap-4 p-4 md:p-5 transition-all cursor-pointer relative ${
                        isSelected
                          ? "bg-blue-50/30"
                          : "bg-white hover:bg-gray-50/50"
                      }`}
                    >
                      <img
                        src={item.imageUrl || ""}
                        alt=""
                        className={`w-20 h-20 md:w-24 md:h-24 object-contain rounded-lg border flex-shrink-0 transition-all ${
                          isSelected
                            ? "border-blue-400 shadow-xs"
                            : "border-gray-200"
                        }`}
                      />

                      <div className="flex-1 min-w-0 pt-1">
                        <p
                          className={`font-semibold text-[14px] md:text-[15px] leading-snug line-clamp-3 transition-colors ${
                            isSelected ? "text-blue-600" : "text-gray-900"
                          }`}
                        >
                          {item.productName}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                      )}
                    </div>
                  );
                })}
            </div>

            <div className="p-4 md:p-5 border-t border-gray-100 flex justify-end items-center gap-3 flex-shrink-0 bg-white">
              <button
                data-test="btn-open-model-review"
                type="button"
                onClick={handleConfirmProductSelection}
                className="cursor-pointer px-5 py-2 bg-[#1E40AF] text-white rounded-lg font-medium text-[14px] transition cursor-pointer shadow-xs min-w-[80px] text-center"
              >
                เลือก
              </button>
              <button
                data-test="btn-cancel-model-review"
                type="button"
                onClick={() => setIsSelectModalOpen(false)}
                className="cursor-pointer px-5 py-2 border border-gray-200 text-gray-600 rounded-lg font-medium text-[14px] transition cursor-pointer min-w-[80px] text-center"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {isReviewModalOpen && selectedItem && (
        <div
          data-test="modal-write-review"
          className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh] p-4 backdrop-blur-sm"
        >
          <div className="w-full max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col sm:max-w-xl overflow-hidden relative">
            <div className="flex items-center gap-3 px-4 py-4 sm:px-6 border-b border-gray-100 flex-shrink-0 bg-white">
              <button
                type="button"
                data-test="btn-close-write-review-mobile"
                onClick={() => setIsReviewModalOpen(false)}
                className="sm:hidden text-gray-700 p-1 -ml-1 hover:bg-gray-100 rounded-full transition"
              >
                <Icon icon="material-symbols:arrow-back" className="w-6 h-6" />
              </button>
              <h2 className="text-[18px] sm:text-[20px] font-bold text-gray-900">
                <span className="hidden sm:inline">รีวิว</span>
                <span className="sm:hidden">เขียนรีวิว</span>
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-5 sm:gap-6 bg-white">
              <div className="flex items-start gap-4">
                <img
                  src={selectedItem.imageUrl || ""}
                  alt=""
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg border border-gray-100"
                />
                <div className="flex flex-col">
                  <p className="font-semibold text-[14px] sm:text-[15px] text-gray-900 leading-snug">
                    {selectedItem.productName}
                  </p>
                  <p className="text-[13px] text-gray-500 mt-1">
                    จำนวน x {selectedItem.quantity}
                  </p>
                </div>
              </div>

              <hr className="hidden sm:block border-gray-100" />

              <div className="bg-gray-50 sm:bg-transparent p-4 sm:p-0 rounded-xl sm:rounded-none flex flex-col gap-5 border border-gray-100 sm:border-none">
                <h3 className="font-bold text-[15px] sm:hidden text-gray-900 -mb-2">
                  รีวิว
                </h3>
                <div>
                  <p className="text-[14px] font-medium text-gray-800 mb-2">
                    คะแนนความพึงพอใจ
                  </p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        data-test={`btn-star-write-${star}`}
                        onClick={() => setReviewScore(star)}
                        className="focus:outline-none cursor-pointer transform active:scale-90 transition-transform"
                      >
                        <Icon
                          icon="material-symbols:star-rounded"
                          className={`w-10 h-10 transition-colors ${
                            star <= reviewScore
                              ? "text-[#facc15]"
                              : "text-gray-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[14px] font-medium text-gray-800 mb-2">
                    รายละเอียด
                  </p>
                  <textarea
                    rows={4}
                    value={message}
                    data-test="input-write-review-message"
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-3 text-[14px] outline-none focus:border-[#2A4494] bg-white resize-none shadow-sm transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 sm:px-6 sm:py-4 border-t border-gray-100 flex gap-3 sm:justify-end bg-white flex-shrink-0">
              <button
                type="button"
                data-test="btn-submit-write-review"
                onClick={handleReviewSubmit}
                className="cursor-pointer flex-1 sm:flex-none px-8 py-2.5 bg-[#2A4494] hover:bg-blue-800 text-white font-medium rounded-lg text-[15px] transition"
              >
                ส่ง
              </button>
              <button
                type="button"
                data-test="btn-cancel-write-review"
                onClick={() => setIsReviewModalOpen(false)}
                className="cursor-pointer flex-1 sm:flex-none px-8 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-[15px] transition bg-white"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewReviewModalOpen && activeReviewData && (
        <div
          data-test="modal-view-review"
          className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh] p-4 backdrop-blur-sm"
        >
          <div className="w-full max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col sm:max-w-xl overflow-hidden relative">
            <div className="flex items-center gap-3 px-4 py-4 sm:px-6 border-b border-gray-100 flex-shrink-0 bg-white">
              <button
                type="button"
                data-test="btn-close-view-review-mobile"
                onClick={() => setIsViewReviewModalOpen(false)}
                className="sm:hidden text-gray-700 p-1 -ml-1 hover:bg-gray-100 rounded-full transition"
              >
                <Icon icon="material-symbols:arrow-back" className="w-6 h-6" />
              </button>
              <h2 className="text-[18px] sm:text-[20px] font-bold text-gray-900">
                รีวิว
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col bg-white">
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={activeReviewData.imageUrl || ""}
                  alt=""
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg border border-gray-100"
                />
                <div className="flex-1 flex justify-between items-start">
                  <h3 className="font-semibold text-[14px] sm:text-[15px] text-gray-900 leading-snug pr-2">
                    {activeReviewData.productName}
                  </h3>
                  <div className="hidden sm:flex gap-2 flex-shrink-0">
                    <button
                      type="button"
                      data-test="btn-delete-review-desktop"
                      onClick={handleDeleteReview}
                      className="cursor-pointer px-4 py-1.5 border border-red-500 text-red-500 rounded-md text-[13px] font-medium hover:bg-red-50 transition"
                    >
                      ลบ
                    </button>
                    <button
                      type="button"
                      data-test="btn-edit-review-desktop"
                      onClick={handleSwitchToEditReview}
                      className="cursor-pointer px-4 py-1.5 border border-[#2A4494] text-[#2A4494] rounded-md text-[13px] font-medium hover:bg-blue-50 transition"
                    >
                      แก้ไข
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-[14px] sm:text-[15px] text-gray-900">
                      {activeReviewData.reviewerName}
                    </p>
                    <p className="text-[12px] sm:text-[13px] text-gray-500 mt-0.5">
                      {activeReviewData.createdAt}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icon
                        key={star}
                        icon="material-symbols:star-rounded"
                        className={`w-5 h-5 ${
                          star <= activeReviewData.reviewScore
                            ? "text-[#facc15]"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p
                  data-test="text-view-review-message"
                  className="text-gray-800 text-[14px] leading-relaxed break-words bg-white sm:bg-transparent"
                >
                  {activeReviewData.message || "ไม่มีรายละเอียดความคิดเห็น"}
                </p>
              </div>
            </div>

            <div className="p-4 sm:px-6 sm:py-4 border-t border-gray-100 flex gap-3 justify-end bg-white flex-shrink-0">
              <div className="flex gap-3 w-full sm:hidden">
                <button
                  type="button"
                  data-test="btn-edit-review-mobile"
                  onClick={handleSwitchToEditReview}
                  className="cursor-pointer flex-1 py-2.5 border border-[#2A4494] text-[#2A4494] font-medium rounded-lg text-[15px] hover:bg-blue-50 transition"
                >
                  แก้ไข
                </button>
                <button
                  type="button"
                  data-test="btn-delete-review-mobile"
                  onClick={handleDeleteReview}
                  className="cursor-pointer flex-1 py-2.5 border border-red-500 text-red-500 font-medium rounded-lg text-[15px] hover:bg-red-50 transition"
                >
                  ลบ
                </button>
              </div>
              <button
                type="button"
                data-test="btn-close-view-review-desktop"
                onClick={() => setIsViewReviewModalOpen(false)}
                className="cursor-pointer hidden sm:block px-8 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-[15px] transition"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditReviewModalOpen && activeReviewData && (
        <div
          data-test="modal-edit-review"
          className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh] p-4 backdrop-blur-sm"
        >
          <div className="w-full max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col sm:max-w-xl overflow-hidden relative">
            <div className="flex items-center gap-3 px-4 py-4 sm:px-6 border-b border-gray-100 flex-shrink-0 bg-white">
              <button
                type="button"
                data-test="btn-close-edit-review-mobile"
                onClick={() => setIsEditReviewModalOpen(false)}
                className="sm:hidden text-gray-700 p-1 -ml-1 hover:bg-gray-100 rounded-full transition"
              >
                <Icon icon="material-symbols:arrow-back" className="w-6 h-6" />
              </button>
              <h2 className="text-[18px] sm:text-[20px] font-bold text-gray-900">
                แก้ไขรีวิว
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6 bg-white">
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={activeReviewData.imageUrl || ""}
                    alt=""
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg border border-gray-100"
                  />
                  <h3 className="font-semibold text-[14px] sm:text-[15px] text-gray-900 leading-snug">
                    {activeReviewData.productName}
                  </h3>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900 text-[14px] sm:text-[15px]">
                        {activeReviewData.reviewerName}
                      </p>
                      <p className="text-[12px] sm:text-[13px] text-gray-500 mt-0.5">
                        {activeReviewData.createdAt}
                      </p>
                    </div>
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Icon
                          key={star}
                          icon="material-symbols:star-rounded"
                          className={`w-5 h-5 ${
                            star <= activeReviewData.reviewScore
                              ? "text-[#facc15]"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-800 text-[14px] leading-relaxed break-words">
                    {activeReviewData.message || "ไม่มีรายละเอียดความคิดเห็น"}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 sm:p-5 rounded-xl flex flex-col gap-5 border border-gray-100">
                <div>
                  <p className="text-[14px] font-medium text-gray-800 mb-2">
                    คะแนนความพึงพอใจ
                  </p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        data-test={`btn-star-edit-${star}`}
                        onClick={() => setReviewScore(star)}
                        className="focus:outline-none cursor-pointer transform active:scale-90 transition-transform"
                      >
                        <Icon
                          icon="material-symbols:star-rounded"
                          className={`w-10 h-10 transition-colors ${
                            star <= reviewScore
                              ? "text-[#facc15]"
                              : "text-gray-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[14px] font-medium text-gray-800 mb-2">
                    รายละเอียด
                  </p>
                  <textarea
                    rows={4}
                    value={message}
                    data-test="input-edit-review-message"
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-3 text-[14px] outline-none focus:border-[#2A4494] bg-white resize-none shadow-sm transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 sm:px-6 sm:py-4 border-t border-gray-100 flex gap-3 sm:justify-end bg-white flex-shrink-0">
              <button
                type="button"
                data-test="btn-submit-edit-review"
                onClick={handleEditReviewSubmit}
                className="cursor-pointer flex-1 sm:flex-none px-8 py-2.5 bg-[#2A4494] hover:bg-blue-800 text-white font-medium rounded-lg text-[15px] transition"
              >
                ส่ง
              </button>
              <button
                type="button"
                data-test="btn-cancel-edit-review"
                onClick={() => setIsEditReviewModalOpen(false)}
                className="cursor-pointer flex-1 sm:flex-none px-8 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-[15px] transition bg-white"
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
