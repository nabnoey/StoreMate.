import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  fetchRefunds,
  fetchRefundDetail,
  approveRefund,
  rejectRefund,
  clearSelectedRefund,
} from "../../redux/moderator/refundReducer";

type ModalType = "VIEW" | "APPROVE" | "REJECT" | null;

const RefundModeratorPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  // จัดการ Pagination จาก URL เหมือนระบบหลักของคุณ
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = 6;

  // ดึงข้อมูลจาก Redux Store รูปแบบเดียวกับ HistoryPage
  const {
    refunds,
    total,
    pendingCount,
    selectedRefund,
    isLoading,
    isSubmitting,
    // error,
  } = useSelector((state: RootState) => state.refunds);
  const { token } = useSelector((state: RootState) => state.auth);

  // ควบคุม State การเปิดปิดหน้าต่าง Popup (Local State แบบเดียวกับหน้าเขียนรีวิว)
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [targetRefundNo, setTargetRefundNo] = useState<string | null>(null);
  const [alertError, setAlertError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchRefunds({ page: currentPage - 1, size: pageSize }));
  }, [dispatch, currentPage, token]);

  // ฟังก์ชันจัดฟอร์แมตวันที่แบบไทย
  const formatThaiDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  // เปิดใช้งาน Popup แต่ละตัว
  const handleOpenModal = async (type: ModalType, refundNo: string) => {
    setTargetRefundNo(refundNo);
    setAlertError(null);
    setActiveModal(type);
    dispatch(fetchRefundDetail(refundNo));
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setTargetRefundNo(null);
    setAlertError(null);
    dispatch(clearSelectedRefund());
  };

  // กดส่งการยืนยัน อนุมัติ / ปฏิเสธ ผ่าน API Thunk
  const handleConfirmAction = async () => {
    if (!targetRefundNo || !activeModal) return;

    try {
      setAlertError(null);
      if (activeModal === "APPROVE") {
        await dispatch(approveRefund(targetRefundNo)).unwrap();
      } else if (activeModal === "REJECT") {
        await dispatch(rejectRefund(targetRefundNo)).unwrap();
      }
      handleCloseModal();
      dispatch(fetchRefunds({ page: currentPage - 1, size: pageSize }));
    } catch (err: any) {
      setAlertError(err || "เกิดข้อผิดพลาดในการส่งข้อมูลระบบ");
    }
  };

  const totalPages = useMemo(() => Math.ceil(total / pageSize), [total]);

  return (
    <div className="min-h-screen bg-white font-anuphan text-gray-950 pt-6 sm:pt-20 pb-20 w-full overflow-x-hidden">
      <div className="max-w-[1200px] mx-auto px-4 w-full">
        {/* Navigation สำหรับ Desktop */}
        <nav className="hidden md:flex flex-wrap items-center text-sm text-black mb-6 font-medium">
          <Link to="/" className="transition-colors cursor-pointer">
            หน้าหลัก
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1 text-black"
          />
          <span className="text-black cursor-pointer font-bold">
            จัดการคำขอคืนเงิน (Moderator)
          </span>
        </nav>

        {/* Header สำหรับ Mobile */}
        <div className="md:hidden bg-white pt-2 pb-4">
          <div className="flex items-center gap-3">
            <button
              className="text-black p-0 flex-shrink-0"
              onClick={() => navigate("/")}
            >
              <Icon icon="material-symbols:arrow-back" className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-[18px] font-bold text-black">
                จัดการคำขอคืนเงิน
              </h1>
            </div>
          </div>
        </div>

        {/* ส่วนแสดงสถิติด้านบนของตาราง */}
        <div className="flex flex-wrap gap-2 mb-4 items-center text-xs sm:text-sm">
          <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg font-medium">
            คำขอทั้งหมด: {total}
          </span>
          <span className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg font-medium border border-amber-200">
            รอดำเนินการ: {pendingCount}
          </span>
        </div>

        {/* ตารางแสดงผลสไตล์เดียวกับระบบหลัก */}
        <main className="w-full min-h-[500px]">
          <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 text-xs sm:text-sm font-bold uppercase">
                  <th className="px-4 py-4">หมายเลขคำขอ</th>
                  <th className="px-4 py-4">ชื่อลูกค้า</th>
                  <th className="px-4 py-4">หมายเลขคำสั่งซื้อ</th>
                  <th className="px-4 py-4">จำนวนเงินคืน</th>
                  <th className="px-4 py-4">วันที่ยื่นคำขอ</th>
                  <th className="px-4 py-4">สถานะ</th>
                  <th className="px-4 py-4 text-center w-36">การพิจารณา</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 text-gray-900">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-20 text-gray-500 font-medium"
                    >
                      กำลังดึงข้อมูลรายการคำขอ...
                    </td>
                  </tr>
                ) : refunds.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-20 text-gray-400">
                      ไม่มีรายการข้อมูลคำขอคืนเงินในระบบ
                    </td>
                  </tr>
                ) : (
                  refunds.map((row) => (
                    <tr
                      key={row.refundNo}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-4 py-4.5 font-bold">{row.refundNo}</td>
                      <td className="px-4 py-4.5 font-medium">
                        {row.receiverName}
                      </td>
                      <td className="px-4 py-4.5 text-gray-500 font-mono text-xs">
                        {row.orderNo}
                      </td>
                      <td className="px-4 py-4.5 font-bold text-blue-600">
                        ฿ {row.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-4.5 text-gray-500 text-xs">
                        {formatThaiDate(row.requestedAt)}
                      </td>
                      <td className="px-4 py-4.5">
                        {row.status === "APPROVED" ? (
                          <span className="px-2.5 py-1 text-xs font-semibold bg-green-50 text-green-700 rounded-md border border-green-200">
                            อนุมัติสำเร็จ
                          </span>
                        ) : row.status === "REJECTED" ? (
                          <span className="px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-700 rounded-md border border-red-200">
                            ปฏิเสธคำขอ
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                            รอดำเนินการ
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4.5">
                        <div className="flex items-center justify-center gap-3">
                          {/* ไอคอน 1: ดูรายละเอียด */}
                          <button
                            onClick={() =>
                              handleOpenModal("VIEW", row.refundNo)
                            }
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Icon
                              icon="material-symbols:visibility-outline-rounded"
                              className="w-5 h-5"
                            />
                          </button>

                          {row.status === "PENDING" && (
                            <>
                              {/* ไอคอน 2: อนุมัติ */}
                              <button
                                onClick={() =>
                                  handleOpenModal("APPROVE", row.refundNo)
                                }
                                className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Icon
                                  icon="material-symbols:check-circle-outline-rounded"
                                  className="w-5 h-5"
                                />
                              </button>
                              {/* ไอคอน 3: ปฏิเสธ */}
                              <button
                                onClick={() =>
                                  handleOpenModal("REJECT", row.refundNo)
                                }
                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Icon
                                  icon="material-symbols:cancel-outline-rounded"
                                  className="w-5 h-5"
                                />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center mt-5 gap-1.5 text-xs">
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setSearchParams({ page: String(currentPage - 1) })
                }
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold disabled:opacity-40 transition-colors"
              >
                ก่อนหน้า
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchParams({ page: String(idx + 1) })}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    currentPage === idx + 1
                      ? "text-blue-600 bg-blue-50 border border-blue-200"
                      : "text-gray-700 border border-transparent hover:bg-gray-50"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setSearchParams({ page: String(currentPage + 1) })
                }
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold disabled:opacity-40 transition-colors"
              >
                ถัดไป
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* RESPONSIVE MULTI-POPUP WINDOW OVERLAY (สไตล์เดียวกับรีวิวฟอร์ม) */}
      {/* ======================================================== */}
      {activeModal && (
        <div className="fixed inset-0 bg-white md:bg-black/50 z-50 flex items-start md:items-center justify-center overflow-y-auto">
          <div className="w-full min-h-screen md:min-h-0 bg-white p-4 md:p-6 md:max-w-xl md:w-full md:rounded-2xl md:shadow-2xl relative flex flex-col pb-24 md:pb-6 animate-fadeIn">
            {/* Header ของหน้าต่าง Popup */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-5">
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-black p-1 cursor-pointer"
              >
                <Icon icon="material-symbols:arrow-back" className="w-6 h-6" />
              </button>
              <h2 className="text-[18px] md:text-[20px] font-bold text-gray-950">
                {activeModal === "VIEW" && "รายละเอียดคำขอคืนเงิน"}
                {activeModal === "APPROVE" && "พิจารณาอนุมัติคำขอ"}
                {activeModal === "REJECT" && "ปฏิเสธการพิจารณาคำขอ"}
              </h2>
            </div>

            {/* ส่วนแสดง Error ด้านในกล่อง */}
            {alertError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                <Icon
                  icon="material-symbols:error-outline-rounded"
                  className="w-5 h-5 flex-shrink-0"
                />
                <span>{alertError}</span>
              </div>
            )}

            {/* เช็คสถานะ Loading ข้อมูลตัวเดี่ยว */}
            {!selectedRefund ? (
              <div className="py-12 text-center text-gray-400 font-medium">
                กำลังโหลดรายละเอียดจากเซิร์ฟเวอร์...
              </div>
            ) : (
              <>
                {/* -------------------------------------------------- */}
                {/* POPUP UI 1: ดูรายละเอียดทั้งหมด (ธีมข้อมูลสีน้ำเงิน-เทา) */}
                {/* -------------------------------------------------- */}
                {activeModal === "VIEW" && (
                  <div className="flex flex-col gap-4">
                    <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100 grid grid-cols-2 gap-y-3.5 gap-x-4 text-sm">
                      <div className="col-span-2 flex items-center gap-2 border-b pb-2 mb-1 border-gray-200/60">
                        <Icon
                          icon="material-symbols:payments-outline-rounded"
                          className="text-blue-600 w-5 h-5"
                        />
                        <span className="font-bold text-black text-sm">
                          ข้อมูลธุรกรรมการคืนเงิน
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-medium mb-0.5">
                          หมายเลขคำขอ
                        </p>
                        <p className="font-bold text-gray-900">
                          {selectedRefund.refundNo}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-medium mb-0.5">
                          หมายเลขสั่งซื้อหลัก
                        </p>
                        <p className="font-semibold text-gray-900 font-mono text-xs">
                          {selectedRefund.orderNo}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-medium mb-0.5">
                          ชื่อบัญชีผู้รับเงิน
                        </p>
                        <p className="font-semibold text-gray-900">
                          {selectedRefund.receiverName}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-medium mb-0.5">
                          วันที่ยื่นเรื่องเข้ามา
                        </p>
                        <p className="font-semibold text-gray-900">
                          {formatThaiDate(selectedRefund.requestedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-100 flex justify-between items-center">
                      <span className="font-bold text-gray-900 text-sm">
                        ยอดเงินสุทธิที่ต้องการเคลมคืน
                      </span>
                      <span className="font-bold text-blue-600 text-xl">
                        ฿ {selectedRefund.total.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 px-1">
                      <label className="text-sm font-bold text-gray-900">
                        เหตุผลชี้แจงจากฝั่งผู้ซื้อ
                      </label>
                      <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 min-h-[80px] leading-relaxed shadow-inner">
                        {selectedRefund.reason || "ไม่ระบุข้อมูลเหตุผล"}
                      </div>
                    </div>

                    {/* ปุ่มปิดท้ายแถวสำหรับหน้าจอคอม */}
                    <div className="fixed bottom-0 left-0 right-0 md:relative bg-white p-4 md:p-0 border-t border-gray-100 md:border-none flex justify-end w-full mt-4">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="w-full md:w-auto md:px-8 py-3 md:py-2.5 text-sm font-bold border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer text-center"
                      >
                        ปิดหน้าต่างข้อมูล
                      </button>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------- */}
                {/* POPUP UI 2: กดยืนยันอนุมัติจ่ายคืน (ธีมสำเร็จสีเขียว) */}
                {/* -------------------------------------------------- */}
                {activeModal === "APPROVE" && (
                  <div className="flex flex-col items-center text-center py-2">
                    <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4 border border-green-100 shadow-sm">
                      <Icon
                        icon="material-symbols:check-circle-rounded"
                        className="w-10 h-10"
                      />
                    </div>
                    <h3 className="text-[18px] font-bold text-gray-950 mb-2">
                      ยืนยันการอนุมัติคำขอคืนเงิน
                    </h3>
                    <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-6">
                      ระบบจะทำการยินยอมคืนเงินจำนวน{" "}
                      <span className="font-bold text-green-600">
                        ฿ {selectedRefund.total.toLocaleString()}
                      </span>{" "}
                      ให้แก่คุณ{" "}
                      <span className="font-bold text-gray-900">
                        {selectedRefund.receiverName}
                      </span>{" "}
                      การดำเนินการนี้จะเปลี่ยนสถานะออเดอร์ทันที
                    </p>

                    {/* กล่องชุดปุ่มล่างสุด */}
                    <div className="fixed bottom-0 left-0 right-0 md:relative bg-white p-4 md:p-0 border-t border-gray-100 md:border-none flex flex-row gap-3 w-full mt-2">
                      <button
                        type="button"
                        onClick={handleConfirmAction}
                        disabled={isSubmitting}
                        className={`w-1/2 md:w-auto md:flex-1 py-3 md:py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                          isSubmitting ? "bg-gray-400 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSubmitting
                          ? "กำลังบันทึก..."
                          : "ยืนยันอนุมัติสั่งคืนเงิน"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="w-1/2 md:w-auto md:px-8 py-3 md:py-2.5 text-sm font-bold border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer text-center"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------- */}
                {/* POPUP UI 3: กดปฏิเสธคำขอเคลม (ธีมแจ้งเตือนสีแดง) */}
                {/* -------------------------------------------------- */}
                {activeModal === "REJECT" && (
                  <div className="flex flex-col items-center text-center py-2">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-100 shadow-sm">
                      <Icon
                        icon="material-symbols:warning-amber-rounded"
                        className="w-10 h-10"
                      />
                    </div>
                    <h3 className="text-[18px] font-bold text-gray-950 mb-2">
                      ปฏิเสธคำขอคืนเงินรายการนี้
                    </h3>
                    <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-6">
                      คุณกำลังพิจารณา{" "}
                      <span className="font-bold text-red-600">
                        "ไม่อนุมัติ"
                      </span>{" "}
                      รายการส่งคืนเงินหมายเลข{" "}
                      <span className="font-bold text-gray-900">
                        {selectedRefund.refundNo}
                      </span>{" "}
                      กรุณาตรวจสอบให้แน่ใจก่อนกดยืนยันปุ่มด้านล่าง
                    </p>

                    {/* กล่องชุดปุ่มล่างสุด */}
                    <div className="fixed bottom-0 left-0 right-0 md:relative bg-white p-4 md:p-0 border-t border-gray-100 md:border-none flex flex-row gap-3 w-full mt-2">
                      <button
                        type="button"
                        onClick={handleConfirmAction}
                        disabled={isSubmitting}
                        className={`w-1/2 md:w-auto md:flex-1 py-3 md:py-2.5 text-sm font-bold text-white bg-black hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                          isSubmitting ? "bg-gray-400 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSubmitting ? "กำลังบันทึก..." : "ยืนยันปฏิเสธคำขอ"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="w-1/2 md:w-auto md:px-8 py-3 md:py-2.5 text-sm font-bold border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer text-center"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundModeratorPage;
