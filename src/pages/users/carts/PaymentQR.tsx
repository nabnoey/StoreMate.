import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
// รูป QR Code บริษัทของคุณ
import paymentQR from "../../../assets/qr-promtpay.png";

const PaymentQR = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ดึง id จาก URL (เช่น /payment-qr/ORD-12345)
  const location = useLocation();

  // รับค่าที่ส่งมาจากหน้าก่อนหน้า
  const clientSecret = location.state?.clientSecret;
  const totalPrice = location.state?.totalPrice || 0;

  // State ควบคุมว่าจะโชว์ QR หรือยัง
  const [showQR, setShowQR] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ตั้งเวลา 15 นาที
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    // 1. ตรวจสอบข้อมูลเบื้องต้น ถ้าไม่มี clientSecret หรือราคา ให้กลับไปหน้าตะกร้า
    if (!clientSecret || !totalPrice) {
      toast.error("ข้อมูลการชำระเงินไม่ครบถ้วน");
      navigate("/shopping-cart");
      return;
    }

    // 2. ถ้ายอมให้โชว์ QR แล้ว ให้เริ่มนับเวลาถอยหลัง
    if (showQR) {
      if (timeLeft <= 0) {
        // หมดเวลา
        // navigate(`/payment/cancel?id=${id}&reason=timeout`);
        // navigate(`/payment/cancel`, { state: { reason: "timeout" } });
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

  const handleConfirmPaid = () => {
    // นำทางไปหน้า Success พร้อมส่ง id ไปด้วย
    toast.success("ส่งข้อมูลยืนยันการชำระเงินเรียบร้อย");
    // navigate(`/payment/success?id=${id}`);
    // navigate(`/payment/success?id=${id}`, { state: { clientSecret } });
    navigate(`/payment/success`);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] lg:bg-white py-8 px-4 font-anuphan flex justify-center text-gray-800">
      <div className="w-full max-w-[800px]">
        {/* Header ย้อนกลับ */}

        {/* กล่องเนื้อหาหลัก */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-10">
          <div
            className="flex items-center gap-2 mb-6 cursor-pointer w-full border-b border-gray-200 pb-6"
            onClick={() => navigate(-1)}
          >
            <Icon icon="lucide:arrow-left" className="w-5 h-5" />
            <span className="font-bold text-xl">ข้อมูลการชำระเงิน</span>
          </div>
          {/* ส่วนแสดงราคาและรหัสคำสั่งซื้อ (แสดงเสมอ) */}
          <div className="flex flex-col items-center mb-6 gap-2pb-6">
            <div className="flex justify-between w-full max-w-[400px]">
              <span className="text-gray-600 font-medium">
                ยอดชำระเงินทั้งหมด
              </span>
              <span className="text-blue-600 font-bold">
                ฿ {totalPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between w-full max-w-[400px]">
              <span className="text-gray-600 font-medium">กรุณาชำระภายใน</span>
              <span className="text-blue-600 font-bold ">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-center mb-8">
              <div className="w-[484px] h-[469px] border border-gray-200 rounded-lg overflow-hidden shadow-md">
                <div className="bg-[#003D6B] h-[60px] w-[484px]"></div>
                <div className="p-6 flex flex-col items-center bg-white">
                  <div className="w-[200px] h-[200px] bg-gray-50 flex items-center justify-center border border-gray-200 mb-4 p-2">
                    <img
                      src={paymentQR}
                      alt="QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-blue-500 font-bold text-md mb-5 mt-10">
                    ฿ {totalPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-black mb-1">
                    บริษัท สโตร์เมท จำกัด
                  </span>
                  <span className="text-[10px] font-medium text-[#94A3B8] mb-1">
                    STOREMATE CO.,LTD.
                  </span>
                  <span className="text-[10px] text-[#94A3B8] font-bold">
                    รหัสอ้างอิง: {id}
                  </span>
                </div>
              </div>
            </div>

            {/* ข้อแนะนำในการโอน */}
            <div className="max-w-[600px] mx-auto mb-8 bg-white p-2 sm:p-5 rounded-xl font-anuphan">
              <h4 className="font-bold text-black mb-6 text-xl">
                กรุณาทำตามขั้นตอนที่แนะนำ
              </h4>

              <div className="flex flex-col gap-6">
                {/* ข้อ 1 */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <Icon
                      icon="ph:number-circle-one-fill"
                      className="w-8 h-8 text-gray-300"
                    />
                  </div>
                  <p className="text-gray-700 text-[15px] pt-1">
                    คลิกปุ่ม "บันทึก QR" หรือแคปหน้าจอ
                  </p>
                </div>

                {/* ข้อ 2 */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <Icon
                      icon="ph:number-circle-two-fill"
                      className="w-8 h-8 text-gray-300"
                    />
                  </div>
                  <p className="text-gray-700 text-[15px] pt-1">
                    เปิดแอปพลิเคชันธนาคารในอุปกรณ์ของท่าน
                  </p>
                </div>

                {/* ข้อ 3 */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <Icon
                      icon="ph:number-circle-three-fill"
                      className="w-8 h-8 text-gray-300"
                    />
                  </div>
                  <p className="text-gray-700 text-[15px] pt-1 leading-relaxed">
                    คำสั่งซื้อจะได้รับการยืนยันทันทีหลังจากชำระเงินสำเร็จ
                    หรือภายใน 24 ชั่วโมง ในกรณีที่มีธุรกรรมจำนวนมาก
                  </p>
                </div>

                {/* ข้อ 4 */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <Icon
                      icon="ph:number-circle-four-fill"
                      className="w-8 h-8 text-gray-300"
                    />
                  </div>
                  <p className="text-gray-700 text-[15px] pt-1 leading-relaxed">
                    เลือกไปที่ปุ่ม "สแกน" หรือ "QR Code" และกดที่ "รูปภาพ"
                    เลือกรูปภาพที่ท่านแคปไว้และทำการชำระเงิน
                    โดยกรุณาเช็คชื่อบัญชีผู้รับคือ{" "}
                    <span className="font-bold text-black">
                      "บริษัท สโตร์เมท จำกัด"
                    </span>
                  </p>
                </div>

                {/* ข้อ 5 */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <Icon
                      icon="ph:number-circle-five-fill"
                      className="w-8 h-8 text-gray-300"
                    />
                  </div>
                  <p className="text-gray-700 text-[15px] pt-1">
                    QR สามารถสแกนได้ 1 ครั้งต่อ 1 การชำระเงินเท่านั้น
                    หากต้องการสแกนใหม่ โปรดรีเฟรช QR อีกครั้ง
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={handleConfirmPaid}
                className="cursor-pointer w-full max-w-[400px] bg-black text-white font-bold py-4 rounded-md hover:bg-gray-800 transition-all active:scale-[0.98]"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentQR;
