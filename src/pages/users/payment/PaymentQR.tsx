import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useStripe, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector, useDispatch } from "react-redux";

import { UserService } from "../../../services/users.service";
import { OrdersService } from "../../../services/orders.service";

import {
  setPaymentStatus,
  resetPaymentStatus,
} from "../../../redux/payment/paymentReducer";
import type { RootState } from "../../../redux/store";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
import usePaymentSocket from "../../../hooks/usePaymentSocket";

const PaymentQRInner = () => {
  const stripe = useStripe();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();

  const clientSecret = location.state?.clientSecret;
  const totalPrice = location.state?.totalPrice || 0;

  const [showQR] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  const [qrImage, setQrImage] = useState<string | null>(null);
  const [refId, setRefId] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(true);
  const hasRequestedQR = useRef(false);

  usePaymentSocket();

  const paymentStatus = useSelector((state: RootState) => state.payment.status);

  useEffect(() => {
    const savedOrderNo = localStorage.getItem("orderNo");
    if (!savedOrderNo) return;

    const checkStatusOnRefresh = async () => {
      try {
        const data = await OrdersService.getOrdersStatus(savedOrderNo);

        if (
          data.status === "COMPLETED" ||
          data.paymentStatus === "PAYMENT_SUCCESS"
        ) {
          toast.success("ชำระเงินสำเร็จ");

          dispatch(
            setPaymentStatus({
              status: "PAYMENT_SUCCESS",
              orderId: savedOrderNo,
            }),
          );
        } else if (
          data.status === "CANCELLED" ||
          data.paymentStatus === "FAILED"
        ) {
          dispatch(
            setPaymentStatus({
              status: "PAYMENT_FAILS",
              orderId: savedOrderNo,
            }),
          );
        }
      } catch (error) {
        console.error("ไม่สามารถดึงสถานะล่าสุดของคำสั่งซื้อได้", error);
      }
    };

    checkStatusOnRefresh();
  }, [dispatch]);

  // ดักจับสถานะจาก Redux เพื่อจัดการเปลี่ยนหน้าและลบ localStorage
  useEffect(() => {
    if (paymentStatus === "PAYMENT_SUCCESS") {
      // ลบ orderNo ทิ้งเมื่อจ่ายสำเร็จ
      localStorage.removeItem("orderNo");
      dispatch(resetPaymentStatus());
      navigate("/history-shop", { replace: true });
    } else if (paymentStatus === "PAYMENT_FAILS") {
      dispatch(resetPaymentStatus());
    }
  }, [paymentStatus, navigate, dispatch]);

  useEffect(() => {
    if (!stripe || !clientSecret || hasRequestedQR.current) return;

    const generateQR = async () => {
      hasRequestedQR.current = true;
      setIsGenerating(true);

      try {
        const userProfile = await UserService.getProfile();
        const userEmail = userProfile?.email || "guest@yourstore.com";
        const userName = userProfile?.name || "Guest";

        const { error, paymentIntent } = await stripe.confirmPromptPayPayment(
          clientSecret,
          {
            payment_method: {
              billing_details: {
                email: userEmail,
                name: userName,
              },
            },
          },
          { handleActions: false },
        );

        if (error) {
          toast.error(error.message || "เกิดข้อผิดพลาดในการสร้าง QR Code");
        } else {
          if (paymentIntent?.id) {
            // ดึง 6 ตัวอักษรสุดท้ายจาก pi_... มาทำเป็นตัวพิมพ์ใหญ่
            const shortRef = paymentIntent.id.slice(-6).toUpperCase();
            setRefId(shortRef);
          }

          const nextAction: any = paymentIntent?.next_action;
          const qrData =
            nextAction?.promptpay_display_qr_code?.image_url_svg ||
            nextAction?.promptpay_display_qr_code?.image_url_png;
          if (qrData) {
            setQrImage(qrData);
          } else {
            toast.error("ไม่พบข้อมูล QR Code จากระบบ");
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("ไม่สามารถเชื่อมต่อระบบชำระเงินได้");
      } finally {
        setIsGenerating(false);
      }
    };

    generateQR();
  }, [stripe, clientSecret]);

  useEffect(() => {
    if (!clientSecret || !totalPrice) {
      toast.error("ข้อมูลการชำระเงินไม่ครบถ้วน");
      navigate("/shopping-cart");
      return;
    }

    if (showQR) {
      if (timeLeft <= 0) {
        navigate(`/payment/cancel`);
        return;
      }
      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [timeLeft, navigate, id, totalPrice, showQR, clientSecret]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // --- แยกส่วนการแสดงผล QR Code ออกมาจาก Nested Ternary ---
  let qrContent;
  if (isGenerating) {
    qrContent = (
      <div className="flex flex-col items-center text-gray-500">
        <Icon icon="eos-icons:loading" className="w-8 h-8 mb-2" />
        <span className="text-xs">กำลังสร้าง QR...</span>
      </div>
    );
  } else if (qrImage) {
    qrContent = (
      <img
        src={qrImage}
        alt="PromptPay QR Code"
        className="w-full h-full object-contain"
      />
    );
  } else {
    qrContent = (
      <span className="text-xs text-red-500 text-center">
        โหลด QR ไม่สำเร็จ
        <br />
        โปรดลองใหม่อีกครั้ง
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] lg:bg-white pb-[90px] lg:pb-0 font-anuphan text-gray-800 flex flex-col items-center">
      {/* --- DESKTOP BREADCRUMB --- */}
      <div className="w-full max-w-[1136px] hidden lg:block ">
        <nav className="flex items-start mt-10 text-md text-black mb-4 font-medium py-1">
          <Link to="/" className="cursor-pointer transition-colors">
            หน้าหลัก
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1"
          />
          <Link
            to="/shopping-cart"
            className="cursor-pointer transition-colors"
          >
            รถเข็น
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1"
          />
          <Link to="/payment" className="cursor-pointer transition-colors">
            สรุปคำสั่งซื้อ
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1"
          />
          <span className="text-black">ชำระเงินด้วย QR Code</span>
        </nav>
      </div>

      {/* --- MOBILE HEADER --- */}
      <div className="lg:hidden w-full flex items-center bg-white p-4 shadow-sm sticky top-0 z-30 mb-2">
        <Icon
          icon="lucide:arrow-left"
          className="w-6 h-6 mr-3 text-black cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <span className="text-lg font-bold text-black">
          ชำระเงินผ่าน QR Code
        </span>
      </div>

      <div className="w-full lg:max-w-[700px] mx-auto bg-white lg:border border-gray-200 lg:rounded-xl lg:shadow-sm p-4 sm:p-10 lg:mt-6 lg:mb-10">
        {/* Title (Desktop Only) */}
        <button
          className="hidden lg:flex items-center gap-2 mb-6 cursor-pointer w-full border-b border-gray-200 pb-6 hover:text-[#4285F4] transition-colors"
          onClick={() => navigate(-1)}
        >
          <Icon icon="lucide:arrow-left" className="w-6 h-6" />
          <span className="font-bold text-xl text-black">
            ข้อมูลการชำระเงิน
          </span>
        </button>

        {/* ส่วนแสดงราคาและเวลา */}
        <div className="flex flex-col items-center mb-6 gap-3 lg:pb-6 border-b border-gray-100 lg:border-none pb-4">
          <div className="flex justify-between w-full max-w-[400px] items-center  px-4 ">
            <span className="text-black font-bold text-[15px] sm:text-base">
              ยอดชำระเงินทั้งหมด
            </span>
            <span className="text-black font-bold text-lg sm:text-xl">
              ฿ {totalPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between w-full max-w-[400px] items-center px-4">
            <span className="text-black font-medium text-[15px] sm:text-base">
              กรุณาชำระภายใน
            </span>
            <span className="text-black font-bold text-lg sm:text-xl animate-pulse">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* QR Code Slip (Responsive) */}
          <div className="flex justify-center mb-8 px-2 sm:px-0">
            <div className="w-full max-w-[380px] border border-gray-200 rounded-xl overflow-hidden shadow-md">
              <div className="bg-[#113566] h-[50px] sm:h-[60px] w-full flex justify-center items-center">
                <span className="text-white font-bold tracking-widest text-sm">
                  PROMPTPAY
                </span>
              </div>
              <div className="p-6 flex flex-col items-center bg-white">
                <div className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] bg-white flex items-center justify-center border-2 border-[#113566] mb-5 p-2 rounded-xl shadow-sm relative">
                  {/* แสดงผลตัวแปร qrContent ที่เราดึงออกมาจาก Ternary */}
                  {qrContent}
                </div>
                <span className="text-blue-500 font-bold text-xl mb-3">
                  ฿ {totalPrice.toLocaleString()}
                </span>
                <span className="text-[13px] sm:text-md font-bold text-black mb-1">
                  บริษัท สโตร์เมท จำกัด
                </span>
                <span className="text-[11px] px-5 sm:text-md font-medium text-gray-500 mb-2">
                  STOREMATE CO.,LTD.
                </span>
                <div className="px-2 py-0.5 rounded-md w-full text-center">
                  <span className="text-[11px] sm:text-md text-[#94A3B8] font-bold">
                    รหัสอ้างอิง: {refId || "กำลังโหลด..."}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ข้อแนะนำในการโอน */}
          <div className="max-w-[500px] mx-auto mb-8 bg-white px-2 sm:px-5 font-anuphan">
            <h4 className="font-bold text-gray-900 mb-5 text-base sm:text-lg border-b border-gray-100 pb-3">
              ขั้นตอนการชำระเงิน
            </h4>

            <div className="flex flex-col gap-5">
              {[
                { text: 'คลิกปุ่ม "บันทึก QR" หรือแคปหน้าจอ' },
                { text: "เปิดแอปพลิเคชันธนาคารในอุปกรณ์ของท่าน" },
                {
                  text: "คำสั่งซื้อจะได้รับการยืนยันทันทีหลังจากชำระเงินสำเร็จ หรือภายใน 24 ชั่วโมง ในกรณีที่มีธุรกรรมจำนวนมาก",
                },
                {
                  text: 'เลือกไปที่ปุ่ม "สแกน" หรือ "QR Code" และกดที่ "รูปภาพ" เลือกรูปภาพที่ท่านแคปไว้และทำการชำระเงิน โดยกรุณาเช็คชื่อบัญชีผู้รับคือ "บริษัท สโตร์เมท จำกัด"',
                  boldWords: ['"บริษัท สโตร์เมท จำกัด"'],
                },
                {
                  text: "QR สามารถสแกนได้ 1 ครั้งต่อ 1 การชำระเงินเท่านั้น หากต้องการสแกนใหม่ โปรดรีเฟรช QR อีกครั้ง",
                },
              ].map((item, index) => {
                const icons = [
                  "ph:number-circle-one-fill",
                  "ph:number-circle-two-fill",
                  "ph:number-circle-three-fill",
                  "ph:number-circle-four-fill",
                  "ph:number-circle-five-fill",
                ];
                return (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <Icon
                        icon={icons[index]}
                        className="w-7 h-7 sm:w-8 sm:h-8 text-black opacity-80"
                      />
                    </div>
                    <p className="text-gray-700 text-[13.5px] sm:text-[15px] leading-relaxed">
                      {item.boldWords ? (
                        <>
                          {item.text.split(item.boldWords[0])[0]}
                          <strong className="text-black font-bold">
                            {item.boldWords[0]}
                          </strong>
                        </>
                      ) : (
                        item.text
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ปุ่มยืนยัน
          <div className="flex justify-center mt-4 lg:mt-8 px-4 lg:px-0">
            <button
              data-test="confirm-paid-btn"
              onClick={handleConfirmPaid}
              className="cursor-pointer w-full max-w-[400px] bg-black text-white font-bold py-3.5 sm:py-4 rounded-xl hover:bg-[#3367d6] transition-all active:scale-[0.98] shadow-md text-sm sm:text-base"
            >
              ยืนยัน
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

const PaymentQR = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentQRInner />
    </Elements>
  );
};

export default PaymentQR;
