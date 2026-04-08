import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ดึงข้อมูลจาก URL
  const orderId = searchParams.get("id") || "";
  const reason = searchParams.get("reason") || "";
  const [orderDate, setOrderDate] = useState("");

  // ฟังก์ชันแปลเหตุผลการยกเลิกเป็นภาษาไทย
  const getReasonText = (reasonCode: string) => {
    switch (reasonCode) {
      case "timeout":
        return "หมดเวลาทำรายการชำระเงิน";
      case "user_cancelled":
        return "ผู้ใช้งานยกเลิกการทำรายการ";
      default:
        return "ไม่สามารถดำเนินการชำระเงินได้";
    }
  };

  useEffect(() => {
    // ลอจิกการแยกวันที่จากรหัส ORD (ใช้ตัวเดียวกันกับหน้า Success)
    if (orderId?.startsWith("ORD")) {
      const timeString = orderId.replace("ORD", "");
      const timestamp = Number.parseInt(timeString, 10);

      if (!Number.isNaN(timestamp)) {
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        setOrderDate(`${formattedDate} น.`);
      }
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-white font-anuphan flex flex-col items-center justify-center p-4 sm:p-6 pb-24 lg:pb-0  mb-10">
      <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500 mt-10">
        <div className="bg-[#FEF2F2] p-8 flex flex-col items-center justify-center text-[#DC2626] border-b border-[#FEE2E2]">
          <Icon
            icon="solar:close-circle-bold"
            className="w-24 h-24 mb-4 text-[#EF4444] drop-shadow-sm"
          />
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
            การชำระเงินไม่สำเร็จ
          </h1>
          <p className="text-[#991B1B] text-sm sm:text-base text-center max-w-[320px]">
            {getReasonText(reason)} <br />
            กรุณาตรวจสอบข้อมูลและทำรายการใหม่อีกครั้ง
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
            รายละเอียดคำสั่งซื้อ
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-sm sm:text-base">
              <span className="text-gray-500">หมายเลขคำสั่งซื้อ</span>
              <span className="font-bold text-gray-800">{orderId || "-"}</span>
            </div>

            <div className="flex justify-between items-center text-sm sm:text-base">
              <span className="text-gray-500">วันที่ทำรายการ</span>
              <span className="font-semibold text-gray-800">
                {orderDate || "-"}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm sm:text-base">
              <span className="text-gray-500">สถานะ</span>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                ยกเลิกรายการ
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/shopping-cart")}
              className="flex-1 bg-[#007AFF] hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-95 shadow-md hover:shadow-lg flex justify-center items-center gap-2"
            >
              <Icon icon="lucide:refresh-cw" className="w-5 h-5" />
              ลองชำระเงินอีกครั้ง
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-bold py-3 px-4 rounded-xl transition-all active:scale-95"
            >
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
