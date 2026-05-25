import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import HeaderAdmin from "../../components/admin/HeaderAdmin";

type ModalType = "VIEW" | "APPROVE" | "REJECT" | null;

const RefundModeratorPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = 6;

  const {
    refunds,
    total,
    pendingCount,
    selectedRefund,
    isLoading,
    isSubmitting,
  } = useSelector((state: RootState) => state.refunds);
  const { token } = useSelector((state: RootState) => state.auth);

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [targetRefundNo, setTargetRefundNo] = useState<string | null>(null);
  const [alertError, setAlertError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchRefunds({ page: currentPage - 1, size: pageSize }));
  }, [dispatch, currentPage, token]);

  const handleOpenModal = async (
    type: ModalType,
    refundNo: string | null,
    orderNo: string,
  ) => {
    const identifier = refundNo || orderNo;
    setTargetRefundNo(identifier);
    setAlertError(null);
    setActiveModal(type);
    dispatch(fetchRefundDetail(identifier));
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setTargetRefundNo(null);
    setAlertError(null);
    dispatch(clearSelectedRefund());
  };

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
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col w-full font-['Anuphan']">
      <HeaderAdmin
        title="จัดการคำขอคืนเงิน"
        subtitle="ตรวจสอบและจัดการรายการการคำขอคืนเงิน"
      />

      <div className="p-6 w-full flex flex-col flex-1">
        <main className="w-full bg-[#FCFCFC] rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-5">
            <div className="px-4 py-2 border border-black/10 text-[#0A0A0A] rounded-lg text-xs font-medium bg-white">
              ทั้งหมด: <span className="font-semibold">{total}</span>
            </div>
            <div className="px-4 py-2 bg-[#FEFCE8] border border-black/10 text-[#0A0A0A] rounded-lg text-xs font-medium">
              รอดำเนินการ: <span className="font-semibold">{pendingCount}</span>
            </div>
          </div>

          {/* ส่วนค้นหาและฟิลเตอร์ */}
          <div className="flex flex-wrap gap-3 items-center mb-5">
            <div className="relative max-w-sm w-full">
              <input
                type="text"
                placeholder="ค้นหาด้วยชื่อ , หมายเลขคำสั่งซื้อ หรือ หมายเลขคำขอ..."
                className="w-full bg-white border border-gray-200 rounded-xl pl-3 pr-10 py-1.5 text-xs text-gray-600 focus:outline-none focus:border-blue-400 transition-colors placeholder:text-gray-300"
              />
            </div>
            <div className="relative">
              <select className="bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-1.5 text-md text-black font-medium focus:outline-none appearance-none cursor-pointer">
                <option>สถานะทั้งหมด</option>
                <option>อนุมัติ</option>
                <option>รอดำเนินการ</option>
                <option>ปฏิเสธ</option>
              </select>
              <Icon
                icon="lucide:chevron-down"
                className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* กล่องครอบตาราง ปรับตาม Figma [padding: 16px, background: white, border-radius: 14px, outline: 0.8px black/10] */}
          <div className="w-full overflow-x-auto bg-white p-4 rounded-[14px] border border-black/10 flex-1">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-gray-100 text-black text-[16px] font-medium bg-[#fafafa]">
                  <th className="px-4 py-3 font-medium">หมายเลขคำขอ</th>
                  <th className="px-4 py-3 font-medium">ชื่อลูกค้า</th>
                  <th className="px-4 py-3 font-medium">หมายเลขคำสั่งซื้อ</th>
                  <th className="px-4 py-3 font-medium">จำนวนเงิน</th>
                  <th className="px-4 py-3 font-medium">เหตุผล</th>
                  <th className="px-4 py-3 font-medium">วันที่ยื่นคำขอ</th>
                  <th className="px-4 py-3 font-medium">สถานะ</th>
                  <th className="px-4 py-3 text-center w-36 font-semibold">
                    การดำเนินการ
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-gray-50 text-gray-600">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-16 text-gray-400 font-medium"
                    >
                      กำลังโหลดข้อมูลระบบ...
                    </td>
                  </tr>
                ) : refunds.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-gray-400">
                      ไม่พบรายการข้อมูลคำขอคืนเงินในระบบ
                    </td>
                  </tr>
                ) : (
                  refunds.map((row) => (
                    <tr
                      key={row.orderNo}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-4 text-black font-normal text-[16px]">
                        {row.refundNo || "ไม่มีข้อมูลหมายเลข"}
                      </td>
                      <td className="px-4 py-4 text-black font-medium text-[16px]">
                        {row.receiverName}
                      </td>
                      <td className="px-4 py-4 text-black text-[16px]">
                        {row.orderNo}
                      </td>
                      <td className="px-4 py-4 text-black font-medium text-[16px]">
                        ฿{row.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-black max-w-[300px] truncate text-[16px]">
                        {row.reason || "-"}
                      </td>
                      <td className="px-4 py-4 text-black text-[16px]">
                        {row.requestedAt}
                      </td>
                      <td className="px-4 py-4">
                        {row.status === "APPROVED" && (
                          <div className="inline-flex w-full p-[10px] bg-[#10b981] rounded-[8px] justify-center items-center gap-[10px] text-white text-[14px] font-normal leading-[24px] break-words">
                            อนุมัติ
                          </div>
                        )}
                        {row.status === "PENDING" && (
                          <div className="inline-flex w-full p-[10px] bg-[#D4AF37] rounded-[8px] justify-center items-center gap-[10px] text-white text-[14px] font-normal leading-[24px] break-words">
                            รอดำเนินการ
                          </div>
                        )}
                        {row.status === "REJECTED" && (
                          <div className="inline-flex w-full p-[10px] bg-[#ef4444] rounded-[8px] justify-center items-center gap-[10px] text-white text-[14px] font-normal leading-[24px] break-words">
                            ปฏิเสธ
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-3 text-gray-400">
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenModal("VIEW", row.refundNo, row.orderNo)
                            }
                            className="text-gray-700 transition-colors cursor-pointer"
                          >
                            <Icon icon="lucide:eye" className="w-4 h-4" />
                          </button>

                          {row.status === "PENDING" && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenModal(
                                    "APPROVE",
                                    row.refundNo,
                                    row.orderNo,
                                  )
                                }
                                className="text-green-500 transition-colors cursor-pointer"
                              >
                                <Icon icon="lucide:check" className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenModal(
                                    "REJECT",
                                    row.refundNo,
                                    row.orderNo,
                                  )
                                }
                                className="text-red-500 transition-colors cursor-pointer"
                              >
                                <Icon icon="lucide:x" className="w-4 h-4" />
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

          {/* ส่วนควบคุมหน้า (Pagination) */}
          <div className="mt-5 flex justify-end items-center gap-1 text-xs">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setSearchParams({ page: String(currentPage - 1) })}
              className="px-3 py-1.5 border border-gray-200 rounded-xl text-black hover:bg-gray-50 font-medium text-[16px] text-black disabled:opacity-40 transition-colors cursor-pointer mr-2"
            >
              ก่อนหน้า
            </button>

            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSearchParams({ page: String(idx + 1) })}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-[16px] font-medium transition-colors cursor-pointer ${
                  currentPage === idx + 1
                    ? "text-blue-600 bg-transparent font-semibold"
                    : "text-black hover:bg-gray-50"
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setSearchParams({ page: String(currentPage + 1) })}
              className="px-3 py-1.5 border border-gray-200 rounded-xl text-black hover:bg-gray-50 font-medium text-[16px] disabled:opacity-40 transition-colors cursor-pointer ml-2"
            >
              ถัดไป
            </button>
          </div>
        </main>
      </div>

      {/* ส่วนของ Modal รายละเอียด */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-[1px] z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 max-w-[420px] w-full rounded-2xl shadow-xl relative flex flex-col border border-gray-100">
            <h2 className="text-base font-bold text-black mb-0.5">
              รายละเอียดคำขอคืนเงิน
            </h2>
            <p className="text-xs text-gray-400 mb-5">
              ข้อมูลรายละเอียดของคำขอคืนเงิน
            </p>

            {alertError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2 font-medium">
                <Icon
                  icon="lucide:alert-circle"
                  className="w-4 h-4 flex-shrink-0"
                />
                <span>{alertError}</span>
              </div>
            )}

            {!selectedRefund ? (
              <div className="py-12 text-center text-gray-400 text-xs font-medium">
                กำลังโหลดรายละเอียดข้อมูล...
              </div>
            ) : (
              <div className="w-full flex flex-col gap-4 text-xs">
                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                  <div>
                    <span className="text-gray-400 block mb-1">
                      หมายเลขคำขอ
                    </span>
                    <span className="font-semibold text-gray-800 text-sm">
                      {selectedRefund.refundNo || "ไม่มีข้อมูลหมายเลข"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">
                      หมายเลขคำสั่งซื้อ
                    </span>
                    <span className="font-semibold text-gray-800 text-sm">
                      {selectedRefund.orderNo}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">ชื่อลูกค้า</span>
                    <span className="font-semibold text-gray-800 text-sm">
                      {selectedRefund.receiverName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">จำนวนเงิน</span>
                    <span className="font-semibold text-gray-800 text-sm">
                      ฿{selectedRefund.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 block mb-1">
                    เหตุผลการคืนเงิน
                  </span>
                  <span className="font-semibold text-gray-800 text-sm block leading-relaxed">
                    {selectedRefund.reason || "ไม่ระบุข้อมูลเหตุผล"}
                  </span>
                </div>

                <div className="flex justify-between items-end mt-1 border-t border-gray-50 pt-3">
                  <div>
                    <span className="text-gray-400 block mb-1">
                      วันที่ยื่นคำขอ
                    </span>
                    <span className="font-semibold text-gray-800 text-sm">
                      {selectedRefund.requestedAt}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 block mb-1.5">
                      สถานะปัจจุบัน
                    </span>
                    <span className="px-2.5 py-0.5 text-[11px] font-medium bg-[#f59e0b] text-white rounded-md inline-block">
                      {selectedRefund.status}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 w-full mt-5 justify-end">
                  {activeModal === "VIEW" && (
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 rounded-xl font-medium cursor-pointer text-xs"
                    >
                      ปิด
                    </button>
                  )}

                  {activeModal === "APPROVE" && (
                    <>
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-4 py-2 border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 rounded-xl font-medium cursor-pointer text-xs"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleConfirmAction}
                        className="px-4 py-2 bg-[#10b981] hover:bg-[#0f9f6e] text-white rounded-xl font-medium cursor-pointer text-xs disabled:opacity-50 transition-colors"
                      >
                        {isSubmitting ? "กำลังบันทึก..." : "ยืนยันการอนุมัติ"}
                      </button>
                    </>
                  )}

                  {activeModal === "REJECT" && (
                    <>
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-4 py-2 border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 rounded-xl font-medium cursor-pointer text-xs"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleConfirmAction}
                        className="px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-xl font-medium cursor-pointer text-xs disabled:opacity-50 transition-colors"
                      >
                        {isSubmitting ? "กำลังบันทึก..." : "ยืนยันการปฏิเสธ"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundModeratorPage;
