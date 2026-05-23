import React from "react";
import type { OrderMod } from "../../types/moderator/ordersMod";

interface InvoicePrintProps {
  data: OrderMod[];
}

export const InvoicePrint = React.forwardRef<HTMLDivElement, InvoicePrintProps>(
  ({ data }, ref) => {
    if (!data || data.length === 0) return null;

    return (
      <div ref={ref} className="p-8 bg-white text-black text-sm">
        {data.map((order, index) => (
          <div
            key={order.orderNo}
            className={`w-[210mm] min-h-[148mm] border border-gray-300 p-6 mx-auto my-4 rounded-md flex flex-col justify-between ${
              index !== data.length - 1 ? "page-break" : ""
            }`}
            style={{ pageBreakAfter: "always" }} // คำสั่งบังคับให้ตัดหน้ากระดาษเมื่อพิมพ์หลายใบ
          >
            {/* ส่วนหัวใบปะหน้า */}
            <div className="flex justify-between items-start border-b-2 border-black pb-4">
              <div>
                <h1 className="text-2xl font-bold tracking-wide">ใบปะหน้าพัสดุ</h1>
                <p className="text-xs text-gray-500 mt-1">เลขที่คำสั่งซื้อ: #{order.orderNo}</p>
              </div>
              <div className="text-right">
                <span className="bg-black text-white px-3 py-1 font-bold text-xs uppercase rounded">
                  {order.shippingFrom || "Standard Delivery"}
                </span>
              </div>
            </div>

            {/* ส่วนข้อมูลผู้รับ - ผู้ส่ง */}
            <div className="grid grid-cols-2 gap-6 my-6 flex-1">
              <div className="border border-dashed border-gray-400 p-4 rounded bg-gray-50/50">
                <h3 className="font-bold text-xs text-gray-500 uppercase mb-1">ผู้ส่ง (Sender)</h3>
                <p className="font-medium text-gray-800">Your Shop Name</p>
                <p className="text-xs text-gray-600 mt-1">123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กทม. 10110</p>
                <p className="text-xs text-gray-600">โทร: 02-123-4567</p>
              </div>

              <div className="border border-black p-4 rounded bg-white shadow-sm">
                <h3 className="font-bold text-xs text-blue-600 uppercase mb-1">ผู้รับ (Receiver)</h3>
                <p className="text-base font-bold text-gray-900">{order.recipientName}</p>
                <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                  {/* สมมติว่าใน Type มี address ครบถ้วน */}
                  {order.phone}
                </p>
              </div>
            </div>

            {/* ส่วนท้ายและยอดรวม */}
            <div className="border-t border-gray-300 pt-4 flex justify-between items-center text-xs">
              <p className="text-gray-500">กรุณาตรวจสอบพัสดุก่อนเซ็นรับสินค้า</p>
              <div className="text-right">
                <p className="text-gray-600">ยอดชำระทั้งหมด</p>
                <p className="text-lg font-bold text-black">
                  ฿{order.total?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

InvoicePrint.displayName = "InvoicePrint";