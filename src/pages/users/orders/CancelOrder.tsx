import { useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import toast, { Toaster } from "react-hot-toast";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../redux/store";
import { getOrderLabel } from "../../../utils/order";
import { PaymentService } from "../../../services/payment.service";

const reasonOptions = [
  { value: "change_payment_method", label: "เปลี่ยนวิธีการชำระเงิน" },
  { value: "return_refund", label: "คืนสินค้า/คืนเงิน" },
  {
    value: "change_shipping_address",
    label: "ต้องการเปลี่ยนที่อยู่ในการจัดส่ง",
  },
  { value: "edit_order_details", label: "ต้องการแก้ไขรายละเอียดคำสั่งซื้อ" },
  {
    value: "complex_payment_process",
    label: "ขั้นตอนการชำระเงินซับซ้อนเกินไป",
  },
  { value: "found_cheaper", label: "เจอสินค้าเดียวกันที่ถูกกว่า" },
  { value: "no_longer_want", label: "ไม่ต้องการซื้อสินค้านี้แล้ว" },
];

const CancelOrderPage = () => {
  const { orderNo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const orderStatus = location.state?.status || "PENDING";
  const paymentMethod = location.state?.paymentMethod || "PROMPTPAY";

  const currentLabel = getOrderLabel(orderStatus, paymentMethod);

  const isPendingPayment = currentLabel === "รอการชำระเงิน";

  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast.error("กรุณาระบุเหตุผลในการทำรายการ");
      return;
    }

    if (!orderNo) {
      toast.error("ไม่พบหมายเลขคำสั่งซื้อ");
      return;
    }

    const payload = {
      orderNo: orderNo,
      reason: selectedReason,
      description: description,
    };

    setIsSubmitting(true);
    try {
      await PaymentService.sendRefund(payload);

      if (isPendingPayment) {
        toast.success("ยกเลิกคำสั่งซื้อสำเร็จ");
      } else {
        toast.success(
          "ส่งคำขอยกเลิกคำสั่งซื้อสำเร็จ กรุณารอการอนุมัติจากแอดมิน",
        );
      }

      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-anuphan text-gray-950 pt-4 md:pt-20 pb-4 md:pb-20">
      <Toaster position="top-center" reverseOrder={false} />

      {/* --- DESKTOP & TABLET BREADCRUMB --- */}
      <div className="max-w-[1200px] mx-auto px-4 w-full hidden md:block">
        <nav className="flex flex-wrap items-center text-sm md:text-md text-black mb-4 font-medium">
          <Link
            to="/"
            className="transition-colors cursor-pointer hover:text-blue-500"
          >
            หน้าหลัก
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1 text-black"
          />
          <Link to="/orders" className="text-black hover:text-blue-500">
            การซื้อของฉัน
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1 text-black"
          />
          <Link to="/orders" className="transition-colors hover:text-blue-500">
            สถานะคำสั่งซื้อ
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1 text-black"
          />
          <span className="transition-colors">ขอคืนเงิน/ยกเลิกสินค้า</span>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto w-full flex flex-col flex-1">
        <div className="flex flex-col flex-1 md:bg-white md:rounded-xl md:shadow-md md:border border-gray-100 md:p-8 lg:p-12">
          {/* --- HEADER --- */}
          <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-8 px-4 md:px-0 md:border-b border-[#D1D5DB] pb-4 pt-2 md:pt-0">
            <button type="button" onClick={() => navigate(-1)}>
              <Icon
                icon="lucide:arrow-left"
                className="w-6 h-6 mt-1 cursor-pointer text-black hover:text-[#4285F4] transition-colors"
              />
            </button>
            <div>
              <h1 className="text-[18px] md:text-[20px] font-bold text-[#0F172A]">
                ยกเลิกคำสั่งซื้อ
              </h1>
              <p className="text-[13px] md:text-sm text-[#64748B]">
                ระบุรายละเอียดเพื่อแจ้งความประสงค์
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg md:rounded-none shadow-sm md:shadow-none border border-gray-200 md:border-none p-4 md:p-0 mx-4 md:mx-0 flex flex-col gap-5 md:gap-6">
            {/* Warning Box (ปรับข้อความให้ตรงตามสถานะจริงไดนามิก) */}
            <div
              className={`rounded-lg p-4 flex items-start gap-3 ${isPendingPayment ? "bg-[#FFEB55]" : "bg-[#FFEB55]"}`}
            >
              <Icon
                icon="lucide:info"
                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isPendingPayment ? "text-black" : "text-black"}`}
              />
              <div>
                <h3
                  className={`text-[14px] md:text-[15px] font-semibold mb-1 ${isPendingPayment ? "text-yellow-900" : "text-yellow-900"}`}
                >
                  เงื่อนไขการทำรายการ
                </h3>
                <p
                  className={`text-[13px] md:text-[14px] leading-relaxed ${isPendingPayment ? "text-[#B45309]" : "text-[#B45309]"}`}
                >
                  {isPendingPayment ? (
                    <>
                      การยกเลิกสินค้าสามารถทำได้เฉพาะรายการที่สถานะเป็น
                      "รอดำเนินการ" เท่านั้น <br className="hidden sm:block" />
                      สำหรับการคืนสินค้าสาารถทำได้ภายใน 7 วันหลังจากได้รับสินค้า
                    </>
                  ) : (
                    <>
                      การยกเลิกสินค้าสามารถทำได้เฉพาะรายการที่สถานะเป็น
                      "รอดำเนินการ" เท่านั้น <br className="hidden sm:block" />
                      สำหรับการคืนสินค้าสาารถทำได้ภายใน 7 วันหลังจากได้รับสินค้า
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Reason Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] md:text-[16px] text-[#94A3B8] font-medium md:pt-4">
                เหตุผลในการขอทำรายการ
              </label>
              <div className="relative w-full md:w-1/2">
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full flex justify-between items-center bg-[#F3F4F6] hover:bg-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 transition-colors cursor-pointer"
                >
                  <span
                    className={
                      selectedReason ? "text-gray-900" : "text-gray-700"
                    }
                  >
                    {selectedReason
                      ? reasonOptions.find(
                          (opt) => opt.label === selectedReason,
                        )?.label
                      : "ระบุเหตุผล"}
                  </span>
                  <Icon
                    icon="lucide:chevron-down"
                    className={`w-5 h-5 text-black transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {isOpen && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto py-1">
                    {reasonOptions.map((option) => (
                      <li
                        key={option.label}
                        onClick={() => {
                          setSelectedReason(option.label);
                          setIsOpen(false);
                        }}
                        className={`px-4 py-3 text-sm cursor-pointer transition-colors ${
                          selectedReason === option.label
                            ? "bg-gray-50 text-blue-600 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Details Textarea */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] md:text-[16px] text-[#94A3B8] font-medium md:pt-4">
                รายละเอียดเพิ่มเติม
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="รายละเอียดเพิ่มเติม"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-black outline-none focus:border-[#4285F4] transition-colors resize-y"
              ></textarea>
            </div>
          </div>

          {/* --- SUBMIT BUTTON --- */}
          <div className="mt-auto md:mt-8 pt-6 md:pt-0 px-4 md:px-0 flex justify-center pb-2 md:pb-0">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`cursor-pointer w-full md:w-auto min-w-[200px] text-white font-semibold rounded-lg px-8 py-3.5 md:py-3 text-[15px] md:text-sm transition-colors shadow-sm active:scale-[0.98] flex items-center justify-center gap-2
                ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-[#4285F4] hover:bg-blue-600"}`}
            >
              {isSubmitting ? (
                <>
                  <Icon
                    icon="lucide:loader-2"
                    className="w-5 h-5 animate-spin"
                  />
                  กำลังดำเนินการ...
                </>
              ) : (
                "ยืนยันการส่งคำขอ"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderPage;
