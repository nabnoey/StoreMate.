import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import type { AppDispatch, RootState } from "../../redux/store";
import { fetchAllOrders } from "../../redux/moderator/ModeratorReducer";

import { STATUS_LABELS, STATUS_STYLES, type OrderMod } from "../../types/moderator/ordersMod";

const formatDateTime = (isoString: string) => {
  if (!isoString) return { dateStr: "-", timeStr: "-" };
  // try {
    const dateObj = new Date(isoString);
    const dateStr = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear() + 543}`;
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return { dateStr, timeStr: `${hours}.${minutes} น.` };
  // } catch (error) {
  //   return { dateStr: "-", timeStr: "-" };
  // }
};

function Orders() {
  const dispatch = useDispatch<AppDispatch>();
  
  // จัดการเรื่อง Type ตีกันโดยระบุโครงสร้างเป็นแผงข้อมูลประเภท OrderMod
  const { orders = [] } = useSelector(
  (state: RootState) => state.moderator
);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [timeFilter, setTimeFilter] = useState("วันนี้");

  // 1. ⚙️ เพิ่ม State สำหรับระบบ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // กำหนดให้โชว์หน้าละ 5 รายการตามต้องการ

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  

  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);

  // คำนวณจำนวนหน้าทั้งหมดจากจำนวนข้อมูลที่มีจริง
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  // ฟังก์ชันสลับหน้าอย่างปลอดภัย
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // สร้างอาเรย์ตัวเลขหน้าสำหรับการสร้างปุ่ม เช่น [1, 2, 3, 4, 5]
  const maxVisiblePages = 5;

const getVisiblePages = () => {
  const start = Math.max(
    1,
    currentPage - Math.floor(maxVisiblePages / 2)
  );

  const end = Math.min(
    totalPages,
    start + maxVisiblePages - 1
  );

  return Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  );
};

const visiblePages = getVisiblePages();

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-start text-left w-full">
      <HeaderAdmin
        title="จัดการคำสั่งซื้อ"
        subtitle="ตรวจสอบและจัดการรายการคำสั่งซื้อทั้งหมดในระบบ"
      />

      <div className="p-6 w-full text-[#374151] max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          
          {/* Action Bar ด้านบน */}
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <button
                type="button"
                className="bg-black hover:opacity-80 text-white text-xs font-medium py-2 px-4 rounded flex items-center gap-2"
              >
                <span>🖨️</span> ปริ้นใบปะหน้าที่เลือก ( 0 )
              </button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="ค้นหาโดย ชื่อ, เบอร์โทร, "
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-64"
                />
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-400"
                />
              </div>

              <div className="flex rounded border border-gray-200 overflow-hidden text-xs font-medium self-end md:self-auto">
                {["วันนี้", "สัปดาห์นี้", "เดือนนี้"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setTimeFilter(tab)}
                    className={`px-4 py-2 border-r last:border-r-0 transition-colors ${
                      timeFilter === tab ? "bg-gray-100 text-black" : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <h3 className="text-base font-bold text-gray-800 mb-4">คำสั่งซื้อ</h3>

          {/* ตารางแสดงข้อมูล */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                {/* 🎨 ปรับสีตัวอักษรและน้ำหนักหัวตารางให้ดูสะอาดตาตาม Figma */}
                <tr className="border-b border-gray-200 text-[#9CA3AF] text-[13px] font-medium">
                  <th className="flex-1 justify-center text-gray-600 text-base font-normal font-['Anuphan'] leading-6">เลขที่คำสั่งซื้อ</th>
                  <th className="flex-1 justify-center text-gray-600 text-base font-normal font-['Anuphan'] leading-6">ชื่อผู้สั่งซื้อ</th>
                  <th className="flex-1 justify-center text-gray-600 text-base font-normal font-['Anuphan'] leading-6">เบอร์โทร</th>
                  <th className="flex-1 justify-center text-gray-600 text-base font-normal font-['Anuphan'] leading-6">วันที่สั่งซื้อ</th>
                  <th className="flex-1 justify-center text-gray-600 text-base font-normal font-['Anuphan'] leading-6">ยอดรวม</th>
                  <th className="flex-1 justify-center text-gray-600 text-base font-normal font-['Anuphan'] leading-6">สั่งจาก</th>
                  <th className="flex-1 justify-center text-gray-600 text-base font-normal font-['Anuphan'] leading-6">สถานะคำสั่งซื้อ</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {currentItems.length > 0 ? (
                  currentItems.map((order: OrderMod) => {
                    const { dateStr, timeStr } = formatDateTime(order.createdAt);

                    return (
                      <tr key={order.id || order.orderNo} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-2">
  <div className="flex items-center gap-3">
    <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>

    <span className="text-gray-600 font-medium">
      {order.orderNo}
    </span>
  </div>
</td>
                        <td className="py-4 px-2 text-gray-800 font-medium">{order.recipientName}</td>
                        <td className="py-4 px-2 text-gray-500">{order.phone}</td>
                        <td className="py-4 px-2 text-gray-500 text-xs leading-relaxed">
                          {dateStr}<br />
                          <span className="text-gray-400">{timeStr}</span>
                        </td>
                        <td className="py-4 px-2 font-bold text-gray-800">
                          ฿ {(order.total || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-2 text-gray-500">{order.shippingFrom || "website"}</td>
                        <td className="py-4 px-2">
                          <span
                            className={`inline-flex items-center px-3 py-[4px] rounded-full text-[11px] font-medium whitespace-nowrap ${
                              STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"
                              
                            }`}
                          >
                            {STATUS_LABELS[order.status] || order.status}
                          </span>
                        </td>
                        <td className="py-4 text-right text-xs space-x-3 pr-2">
                          {order.is_printed && (
                            <span className="text-[#60A5FA] text-xs font-medium">
  printed
</span>
                          )}
                          <button
                            type="button"
                            className="text-blue-600 hover:underline font-medium"
                            onClick={() => console.log("คลิกจัดการออเดอร์:", order.orderNo)}
                          >
                            จัดการ
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-400 font-medium">
                      ไม่มีรายการคำสั่งซื้อในระบบ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          
          <div className="flex justify-end items-center gap-3 mt-6 pt-4 border-t border-gray-100 text-xs">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className={`border border-gray-300 rounded px-3 py-1.5 font-medium transition-colors ${
                currentPage === 1 ? "text-gray-300 cursor-not-allowed border-gray-200" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              ก่อนหน้า
            </button>
            
            <div className="flex font-normal inline-flex font-['Anuphan'] items-center">
              {visiblePages.length > 0 ? (
                visiblePages.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`w-7 h-7 rounded flex items-center justify-center font-medium transition-colors ${
                      page === currentPage 
                        ? "text-blue-600 font-bold bg-transparent" 
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))
              ) : (
                <button type="button" className="w-7 h-7 text-blue-600 font-bold">1</button>
              )}
            </div>

            <button
              type="button"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => handlePageChange(currentPage + 1)}
              className={`border border-gray-300 rounded px-3 py-1.5 font-medium transition-colors ${
                currentPage === totalPages || totalPages === 0
                  ? "text-gray-300 cursor-not-allowed border-gray-200" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              ต่อไป
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Orders;