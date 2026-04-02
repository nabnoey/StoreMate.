import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useStripe } from "@stripe/react-stripe-js";

const PaymentQR = () => {
  const stripe = useStripe();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const clientSecret = location.state?.clientSecret;
  const totalPrice = location.state?.totalPrice || 0;

  const [showQR] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  const [qrImage, setQrImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const hasRequestedQR = useRef(false);

  useEffect(() => {
    if (!stripe || !clientSecret || hasRequestedQR.current) return;

    const generateQR = async () => {
      hasRequestedQR.current = true;
      setIsGenerating(true);

      try {
        const { error, paymentIntent } =
          await stripe.confirmPromptPayPayment(clientSecret);

        if (error) {
          toast.error(error.message || "เกิดข้อผิดพลาดในการสร้าง QR Code");
        } else {
          const nextAction: any = paymentIntent?.next_action;
          const qrData = nextAction?.promptpay_display_qr_code?.image_data;
          if (qrData) {
            setQrImage(qrData);
          } else {
            toast.error("ไม่พบข้อมูล QR Code จากระบบ");
          }
        }
      } catch (err) {
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
        navigate(`/payment/cancel?id=${id}&reason=timeout`);
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

  const handleConfirmPaid = () => {
    toast.success("ส่งข้อมูลยืนยันการชำระเงินเรียบร้อย");
    navigate(`/payment/success?id=${id}`, { state: { clientSecret } });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] lg:bg-white pb-[90px] lg:pb-0 font-anuphan text-gray-800 flex flex-col items-center">
      <div className="w-full max-w-[1136px] hidden lg:block ">
        <nav className="flex items-center mt-10 text-md text-black mb-4 font-medium py-1">
          <Link to="/" className="hover:text-[#4285F4] transition-colors">
            หน้าหลัก
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1"
          />
          <Link
            to="/shopping-cart"
            className="hover:text-[#4285F4] transition-colors"
          >
            รถเข็น
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1"
          />
          <Link
            to="/payment"
            className="hover:text-[#4285F4] transition-colors"
          >
            สรุปคำสั่งซื้อ
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1"
          />
          <span className="text-black font-bold">ชำระเงินผ่าน QR Code</span>
        </nav>
      </div>

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
        {/* เติมเวลานับถอยหลังและราคา */}
        <div className="flex flex-col items-center mb-6 gap-3 lg:pb-6 border-b border-gray-100 lg:border-none pb-4">
          <div className="flex justify-between w-full max-w-[400px] items-center px-4">
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
          <div className="flex justify-center mb-8 px-2 sm:px-0">
            <div className="w-full max-w-[380px] border border-gray-200 rounded-xl overflow-hidden shadow-md">
              <div className="bg-[#113566] h-[50px] sm:h-[60px] w-full flex justify-center items-center">
                <span className="text-white font-bold tracking-widest text-sm">
                  PROMPTPAY
                </span>
              </div>
              <div className="p-6 flex flex-col items-center bg-white">
                <div className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] bg-white flex items-center justify-center border-2 border-[#113566] mb-5 p-2 rounded-xl shadow-sm relative">
                  {isGenerating ? (
                    <div className="flex flex-col items-center text-gray-500">
                      <Icon icon="eos-icons:loading" className="w-8 h-8 mb-2" />
                      <span className="text-xs">กำลังสร้าง QR...</span>
                    </div>
                  ) : qrImage ? (
                    <img
                      src={`data:image/png;base64,${qrImage}`}
                      alt="PromptPay QR Code"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-red-500 text-center">
                      โหลด QR ไม่สำเร็จ
                      <br />
                      โปรดลองใหม่อีกครั้ง
                    </span>
                  )}
                </div>

                <span className="text-blue-500 font-bold text-xl mb-3">
                  ฿ {totalPrice.toLocaleString()}
                </span>
                <span className="text-[13px] sm:text-sm font-bold text-black mb-1">
                  บริษัท สโตร์เมท จำกัด
                </span>
                <span className="text-[11px] sm:text-xs font-medium text-gray-500 mb-3">
                  STOREMATE CO.,LTD.
                </span>
                <div className="bg-gray-100 px-3 py-1.5 rounded-md w-full text-center">
                  <span className="text-[11px] sm:text-xs text-gray-600 font-bold font-mono">
                    Ref: {id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* เติมข้อกำหนดนะจ้ะ */}
          <div className="flex justify-center mt-4 lg:mt-8 px-4 lg:px-0">
            <button
              data-test="confirm-paid-btn"
              onClick={handleConfirmPaid}
              disabled={isGenerating || !qrImage}
              className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full max-w-[400px] bg-black text-white font-bold py-3.5 sm:py-4 rounded-xl hover:bg-[#3367d6] transition-all active:scale-[0.98] shadow-md text-sm sm:text-base"
            >
              ยืนยัน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentQR;
