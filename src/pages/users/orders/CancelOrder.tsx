import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
// import toast, { Toaster } from "react-hot-toast";

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
  // const { orderNo } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  // const [description, setDescription] = useState("");

  // const handleSubmit = async () => {
  //   // 1. ดักไว้เผื่อผู้ใช้ยังไม่ได้เลือกเหตุผล
  //   if (!selectedReason) {
  //     toast.error("กรุณาระบุเหตุผลในการทำรายการ");
  //     return;
  //   }

  //   const payload = {
  //     orderNo: orderNo,
  //     reason: selectedReason,
  //     description: description,
  //   };

  //   try {
  //     console.log("กำลังส่งข้อมูล...", payload);

  //     // สมมติว่าตรงนี้คือโค้ดเรียก API
  //     // await api.post('/cancel-order', payload);

  //     toast.success("ส่งคำขอยกเลิกคำสั่งซื้อสำเร็จ");

  //     setTimeout(() => {
  //       navigate(-1);
  //     }, 1500);
  //   } catch (error) {
  //     toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
  //   }
  // };

  return (
    <div className="min-h-screen bg-white font-anuphan text-gray-950 pt-10 sm:pt-20 pb-20">
      <div className="max-w-[1200px] mx-auto px-4">
        <nav className="flex flex-wrap items-center text-sm md:text-md text-black mb-4 md:mb-4 font-medium">
          <Link to="/" className="transition-colors cursor-pointer">
            หน้าหลัก
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1 text-black"
          />
          <Link to="/orders" className="text-black">
            การซื้อของฉัน
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1 text-black"
          />
          <Link to="/orders" className="transition-colors">
            สถานะคำสั่งซื้อ
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1 text-black"
          />
          <span className="transition-colors">ขอคืนเงิน/ยกเลิกสินค้า</span>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-8 md:p-12">
          {/* <div className="w-full max-w-[700px] mx-auto bg-white lg:rounded-xl lg:shadow-sm lg:border border-gray-200 overflow-hidden p-4 sm:p-6 lg:p-10 lg:mb-10 lg:mt-6"> */}
          <div className="flex items-start gap-4 mb-8 border-b border-[#D1D5DB] pb-4">
            <button type="button" onClick={() => navigate(-1)}>
              <Icon
                icon="lucide:arrow-left"
                className="w-6 h-6 mt-1 cursor-pointer text-black hover:text-[#4285F4] transition-colors"
              />
            </button>
            <div>
              <h1 className="text-[20px] font-bold text-[#0F172A]">
                ยกเลิกคำสั่งซื้อ
              </h1>
              <p className="text-sm text-[#64748B]">
                ระบุรายละเอียดเพื่อแจ้งความประสงค์
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-[#FFEB55] rounded-lg p-4 flex items-start gap-3">
              <Icon
                icon="lucide:info"
                className="w-5 h-5 text-black mt-0.5 flex-shink-0"
              />
              <div>
                <h3 className="text-[15px] font-semibold text-yellow-900 mb-1">
                  เงื่อนไขการทำรายการ
                </h3>
                <p className="text-[14px] text-[#B45309] leading-relaxed">
                  การยกเลิกสินค้าสามารถทำได้เฉพาะรายการที่สถานะเป็น
                  "รอดำเนินการ" เท่านั้น <br className="hidden sm:block" />
                  สำหรับการคืนสินค้าสาารถทำได้ภายใน 7 วันหลังจากได้รับสินค้า
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[16px] text-[#94A3B8] font-medium pt-4">
              เหตุผลในการขอทำรายการ
            </label>
            <div className="relative md:w-1/2">
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center bg-[#F3F4F6] hover:bg-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 transition-colors cursor-pointer"
              >
                <span
                  className={selectedReason ? "text-gray-900" : "text-gray-700"}
                >
                  {selectedReason
                    ? reasonOptions.find((opt) => opt.value === selectedReason)
                        ?.label
                    : "ระบุเหตุผล"}
                </span>
                <Icon
                  icon="lucide:chevron-down"
                  className={`w-5 h-5 text-black transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </div>

              {isOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto py-1">
                  {reasonOptions.map((option) => (
                    <li
                      key={option.value}
                      onClick={() => {
                        setSelectedReason(option.value);
                        setIsOpen(false);
                      }}
                      className={`px-4 py-3 text-sm cursor-pointer transition-colors ${
                        selectedReason === option.value
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

          <div className="flex flex-col gap-2">
            <label className="text-[16px] text-[#94A3B8] font-medium pt-4">
              รายละเอียดเพิ่มเติม
            </label>
            <textarea
              rows={4}
              placeholder="รายละเอียดเพิ่มเติม"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-black  outline-none transition-colors resize-y"
            ></textarea>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              className="w-full sm:w-auto min-w-[200px] bg-[#4285F4] hover:bg-blue-600 text-white font-semibold rounded-lg px-8 py-3 text-sm transition-colors shadow-sm"
            >
              ยืนยันการส่งคำขอ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderPage;
