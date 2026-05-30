import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import type { AppDispatch, RootState } from "../../redux/store";
import { fetchAllOrders } from "../../redux/moderator/ModeratorReducer";
import { STATUS_LABELS, STATUS_STYLES, type OrderMod } from "../../types/moderator/ordersMod";
import { InvoicePrint } from "../../components/admin/InvoicePrint";

const formatDateTime = (isoString: string) => {
  if (!isoString) return { dateStr: "-", timeStr: "-" };
  const dateObj = new Date(isoString);
  const dateStr = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear() + 543}`;
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  return { dateStr, timeStr: `${hours}.${minutes} น.` };
};

function Orders() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [timeFilter, setTimeFilter] = useState("วันนี้");
  const printRef = useRef<HTMLDivElement>(null);
  const [printData, setPrintData] = useState<OrderMod[]>([]);
  const [isPrinting, setIsPrinting] = useState(false);

  const initialPage = Number(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);

  const rawOrders = useSelector((state: RootState) => state.moderator.orders);
  const orders = Array.isArray(rawOrders) ? rawOrders : [];
  const totalPages = useSelector((state: RootState) => state.moderator.totalPages)

  const PAGE_SIZE = 10; 


useEffect(() => {
  
    dispatch(fetchAllOrders({ page: currentPage - 1, size: PAGE_SIZE }));
    setSearchParams({ page: String(currentPage), size: String(PAGE_SIZE) });
  }, [dispatch, currentPage, setSearchParams]);

 const currentItems = Array.isArray(orders) ? orders.slice(0, PAGE_SIZE) : []

  useEffect(() => {
    if (isPrinting && printData.length > 0) {
      const timer = setTimeout(() => {
        window.print();
        setIsPrinting(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isPrinting, printData]);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSelectOrder = (orderNo: string) => {
    const key = String(orderNo);
    setSelectedOrders((prev) =>
      prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key]
    );
  };

  const handleEnterPrintMode = () => {
    setSelectedOrders([]);
    setIsPrintMode(true);
  };


  const handleCancelPrintMode = () => {
    setSelectedOrders([]);
    setIsPrintMode(false);
  };

 
  const handleConfirmPrint = () => {
    const selectedData = orders.filter((o) =>
      selectedOrders.includes(String(o.orderNo))
    );
    if (selectedData.length === 0) return;
    setPrintData(selectedData);
    setIsPrinting(true);
  };

const maxVisiblePages = 5; // แสดงปุ่มตัวเลขทีละ 5 ปุ่ม
  
  const getVisiblePages = () => {
    // พยายามให้หน้าที่เลือกอยู่ตรงกลาง
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = start + maxVisiblePages - 1;

    // ถ้าหน้าขวาสุด (end) เกินจำนวนหน้าทั้งหมด ให้ปรับลดลงมา
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-start text-left w-full">
      <div className="w-full flex flex-col items-start print:hidden">
        <HeaderAdmin
          title="จัดการคำสั่งซื้อ"
          subtitle="ตรวจสอบและจัดการรายการคำสั่งซื้อทั้งหมดในระบบ"
        />

        <div className="p-6 w-full text-[#374151] max-w-7xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-3">
                {!isPrintMode ? (
                  /* ─── โหมดปกติ: แสดงแค่ปุ่มปริ้นใบปะหน้า ─── */
                  <button
                    type="button"
                    onClick={handleEnterPrintMode}
                    className="h-[40px] px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <span>🖨️</span>
                    ปริ้นใบปะหน้า
                  </button>
                ) : (
                  /* ─── โหมดเลือกปริ้น: แสดงจำนวน + ยืนยัน + ยกเลิก ─── */
                  <>
                    <div className="h-[40px] px-4 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                      <span>🖨️</span>
                      ปริ้นใบปะหน้าที่เลือก ({selectedOrders.length})
                    </div>
                    <button
                      type="button"
                      onClick={handleConfirmPrint}
                      disabled={selectedOrders.length === 0}
                      className="h-[40px] w-[100px] bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                      ยืนยัน
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelPrintMode}
                      className="h-[40px] w-[100px] rounded-lg border border-black text-gray-700 text-sm font-semibold font-['Anuphan'] hover:bg-gray-50 transition-colors"
                    >
                      ยกเลิก
                    </button>
                  </>
                )}
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
                        timeFilter === tab
                          ? "bg-gray-100 text-black"
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <h3 className="text-base font-bold text-gray-800 mb-4">คำสั่งซื้อ</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[#9CA3AF] text-[13px] font-medium">
                    <th className="py-3 text-gray-600 text-base font-normal font-['Anuphan']">เลขที่คำสั่งซื้อ</th>
                    <th className="py-3 text-gray-600 text-base font-normal font-['Anuphan']">ชื่อผู้สั่งซื้อ</th>
                    <th className="py-3 text-gray-600 text-base font-normal font-['Anuphan']">เบอร์โทร</th>
                    <th className="py-3 text-gray-600 text-base font-normal font-['Anuphan']">วันที่สั่งซื้อ</th>
                    <th className="py-3 text-gray-600 text-base font-normal font-['Anuphan']">ยอดรวม</th>
                    <th className="py-3 text-gray-600 text-base font-normal font-['Anuphan']">สั่งจาก</th>
                    <th className="py-3 text-gray-600 text-base font-normal font-['Anuphan']">สถานะคำสั่งซื้อ</th>
                    <th className="py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {currentItems.length > 0 ? (
                    currentItems.map((order: OrderMod) => {
                      const { dateStr, timeStr } = formatDateTime(order.createdAt || "");
                      const isSelected = selectedOrders.includes(String(order.orderNo));

                      return (
                       <tr
  key={order.id || order.orderNo}
  onClick={() => {
    if (!isPrintMode) {
      navigate(`/moderator/orders/${order.orderNo}`);
    }
  }}
  className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${
    isPrintMode && isSelected ? "bg-blue-50" : ""
  }`}
>
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-3">
                              {/* วงกลมติ๊ก: โชว์เฉพาะตอนอยู่ในโหมดปริ้น */}
                              {isPrintMode && (
                                <button
                                  type="button"
                                  onClick={() => handleSelectOrder(String(order.orderNo))}
                                  className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
                                    isSelected
                                      ? "bg-blue-700 border-blue-700"
                                      : "border-gray-300 bg-white"
                                  }`}
                                >
                                  {isSelected && (
                                    <span className="text-white text-[10px]">✓</span>
                                  )}
                                </button>
                              )}
                              <span className="text-gray-600 font-medium">{order.orderNo}</span>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-gray-800 font-medium">{order.orderRecipient?.recipientName}</td>
                          <td className="py-4 px-2 text-gray-500">{order.orderRecipient?.phone}</td>
                          <td className="py-4 px-2 text-gray-500 text-xs leading-relaxed">
                            {dateStr}<br />
                            <span className="text-gray-400">{timeStr}</span>
                          </td>
                          <td className="py-4 px-2 font-bold text-gray-800">
                            ฿ {(order.total || 0).toLocaleString(undefined, {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-4 px-2 text-gray-500">{order.shippingFrom || "website"}</td>
                          <td className="py-4 px-2">
                            <span className={`inline-flex items-center px-3 py-[4px] rounded-full text-[11px] font-medium whitespace-nowrap ${
                              STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"
                            }`}>
                              {STATUS_LABELS[order.status] || order.status}
                            </span>
                          </td>
                          <td className="py-4 text-right text-xs space-x-3 pr-2">
                            {order.is_printed && (
                              <span className="text-[#60A5FA] text-xs font-medium">printed</span>
                            )}
                            {isPrintMode ? (
                              <button
                                type="button"
                                onClick={() => handleSelectOrder(String(order.orderNo))}
                                className="text-blue-600 hover:underline font-medium"
                              >
                                {isSelected ? "ยกเลิก" : "เลือก"}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => navigate(`/moderator/orders/${order.orderNo}`)}
                                className="text-blue-600 hover:underline font-medium"
                              >
                                จัดการ
                              </button>
                            )}
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

            {/* Pagination Controls */}
            <div className="flex justify-end items-center gap-4 mt-6 pt-4 border-t border-gray-100 text-sm">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className={`border border-gray-300 rounded-md px-4 py-1.5 font-medium transition-colors ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed border-gray-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                ก่อนหน้า
              </button>

              <div className="flex font-normal font-['Anuphan'] items-center gap-1">
                {visiblePages.length > 0 ? (
                  visiblePages.map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded-md flex items-center justify-center font-medium transition-colors ${
                        page === currentPage
                          ? "text-blue-500 font-bold bg-transparent"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))
                ) : (
                  <button type="button" className="w-8 h-8 text-blue-500 font-bold">1</button>
                )}
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => handlePageChange(currentPage + 1)}
                className={`border border-gray-300 rounded-md px-4 py-1.5 font-medium transition-colors ${
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

      {/* ส่วนที่ใช้สำหรับ Print */}
      <div className="hidden print:block w-full absolute top-0 left-0 bg-white">
        <InvoicePrint ref={printRef} data={printData} />
      </div>
    </div>
  );
}

export default Orders;