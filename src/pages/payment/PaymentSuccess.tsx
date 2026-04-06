import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ดึงรหัสออเดอร์จาก URL (?id=ORD...)
  const orderId = searchParams.get("id") || "";
  const [orderDate, setOrderDate] = useState("");

  useEffect(() => {
    // ลอจิกการแยกและแปลงวันที่จากรหัส ORD
    if (orderId && orderId.startsWith("ORD")) {
      const timeString = orderId.replace("ORD", "");
      const timestamp = parseInt(timeString, 10);

      if (!isNaN(timestamp)) {
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
    // พื้นหลังสีฟ้าอ่อนสุดๆ สบายตา
    <div className="min-h-screen bg-white font-anuphan flex flex-col items-center justify-center p-4 sm:p-6 pb-24 lg:pb-0 mb-10">
      {/* กล่องการ์ดหลัก (เด้งขึ้นมาแบบมี Animation) */}
      <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500 mt-10">
        {/* ส่วนหัว (Header) สีฟ้า */}
        <div className="bg-[#007AFF] p-8 flex flex-col items-center justify-center text-white">
          <Icon
            icon="clarity:success-standard-solid"
            className="w-24 h-24 mb-4 text-white drop-shadow-md"
          />
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            ชำระเงินสำเร็จ!
          </h1>
          <p className="text-blue-100 text-sm sm:text-base text-center max-w-[300px]">
            ขอบคุณที่ใช้บริการ
            คำสั่งซื้อของคุณได้รับการยืนยันและกำลังดำเนินการจัดส่ง
          </p>
        </div>

        {/* ส่วนรายละเอียดคำสั่งซื้อ */}
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
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                ชำระเงินแล้ว
              </span>
            </div>
          </div>

          {/* ปุ่ม Action (Responsive: มือถือเรียงลง ลากจอใหญ่เรียงข้าง) */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/orders")}
              className="flex-1 bg-[#007AFF] hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-95 shadow-md hover:shadow-lg"
            >
              ดูคำสั่งซื้อ
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-white border-2 border-[#007AFF] text-[#007AFF] hover:bg-[#F0F7FF] font-bold py-3 px-4 rounded-xl transition-all active:scale-95"
            >
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
