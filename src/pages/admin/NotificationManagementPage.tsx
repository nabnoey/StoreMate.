import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  fetchOwnerNotify,
  createNotify,
  deleteNotify,
} from "../../redux/notification/notificationReducer";
import type { Notification } from "../../types/notification";

interface NotificationFormData {
  subject: string;
  message: string;
  recipients: string;
}

const NotificationManagementPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const notifications = useSelector(
    (state: RootState) => state.notification.items,
  ) as Notification[];

  const isLoading = useSelector(
    (state: RootState) => state.notification.isLoading,
  );

  const totalPages = useSelector(
    (state: RootState) => state.notification.totalPages,
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = searchParams.get("page");
  // const keywordParam = searchParams.get("keyword") || "";

  const [page, setPage] = useState(pageParam !== null ? Number(pageParam) : 0);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState<NotificationFormData>({
    subject: "",
    message: "",
    recipients: "ทั้งหมด",
  });

  const userRoles =
    useSelector((state: RootState) => state.auth.user?.roles) || [];

  const isOwner = userRoles.includes("ADMIN") || userRoles.includes("OWNER");
  const isModifier = userRoles.includes("MODERATOR");

  useEffect(() => {
    if (isOwner || isModifier) {
      dispatch(
        fetchOwnerNotify({
          keyword: debouncedSearch,
          page,
          size: 10,
        }),
      );

      const params: Record<string, string> = {
        page: String(page),
        size: "10",
      };

      if (debouncedSearch) {
        params.keyword = debouncedSearch;
      }

      setSearchParams(params);
    }
  }, [dispatch, page, debouncedSearch, isOwner, isModifier, setSearchParams]);

  const getRecipientConfig = (sendTo: string) => {
    if (sendTo?.includes("MODERATOR")) {
      return {
        label: "พนักงาน",
        className: "bg-blue-50 text-blue-600 border border-blue-100",
      };
    }
    if (sendTo?.includes("CUSTOMER")) {
      return {
        label: "ผู้ใช้งาน",
        className: "bg-green-50 text-green-600 border border-green-100",
      };
    }
    return {
      label: "ทั้งหมด",
      className: "bg-gray-100 text-gray-600",
    };
  };

  const handleDelete = (id: number): void => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 items-center p-2">
          <span className="text-gray-800 font-medium text-base">
            คุณต้องการลบการแจ้งเตือนนี้ใช่หรือไม่?
          </span>

          <div className="flex gap-3 mt-2">
            <button
              data-test={`btn-confirm-delete-${id}`}
              type="button"
              onClick={async () => {
                try {
                  toast.dismiss(t.id);
                  await dispatch(deleteNotify(id)).unwrap();
                  toast.success("ลบการแจ้งเตือนเรียบร้อยแล้ว", {
                    duration: 1500,
                  });
                  // refreshNotificationList();
                } catch (error) {
                  toast.error("เกิดข้อผิดพลาด ไม่สามารถลบข้อมูลได้", {
                    duration: 1500,
                  });
                }
              }}
              className="cursor-pointer px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              ยืนยันการลบ
            </button>

            <button
              data-test={`btn-cancel-delete-${id}`}
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors border border-gray-200"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        id: `delete-notification-${id}`,
      },
    );
  };

  const TOPIC_MAP = {
    ทั้งหมด: "ALL",
    ผู้ใช้งาน: "CUSTOMER",
    พนักงาน: "MODERATOR",
  } as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { subject, message, recipients } = formData;

    if (!subject.trim() || !message.trim()) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน", { duration: 1500 });
      return;
    }

    try {
      const mappedSendTo =
        TOPIC_MAP[recipients as keyof typeof TOPIC_MAP] || "ALL";

      await dispatch(
        createNotify({
          title: subject,
          message: message,
          sendTo: mappedSendTo,
        }),
      ).unwrap();

      toast.success("ส่งการแจ้งเตือนสำเร็จ", { duration: 1500 });

      setFormData({ subject: "", message: "", recipients: "ทั้งหมด" });
      setIsModalOpen(false);

      // refreshNotificationList();
    } catch (error: any) {
      toast.error(error?.message || "เกิดข้อผิดพลาดในการส่งแจ้งเตือน", {
        duration: 1500,
      });
    }
  };

  const handleCancel = (): void => {
    if (formData.subject.trim() || formData.message.trim()) {
      if (window.confirm("คุณต้องการละทิ้งการแจ้งเตือนนี้หรือไม่?")) {
        setIsModalOpen(false);
        setFormData({ subject: "", message: "", recipients: "ทั้งหมด" });
      }
    } else {
      setIsModalOpen(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setPage(0);
    setDebouncedSearch(searchTerm);
  };

  if (!isOwner && !isModifier) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 font-prompt p-4 text-center">
        <Icon
          icon="lucide:shield-alert"
          width="64"
          height="64"
          className="text-red-500 mb-4"
        />
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          คุณไม่มีสิทธิ์เข้าถึง
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          เฉพาะผู้บริหารและพนักงานที่ได้รับอนุญาตเท่านั้น
        </p>
        <button
          data-test="btn-back-to-store"
          onClick={() => (window.location.href = "/store")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm transition-all"
        >
          กลับหน้าหลัก (Store Page)
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-prompt">
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-800">จัดการแจ้งเตือน</h1>
          <p className="text-sm text-gray-500">
            การแจ้งเตือนไปยังผู้ใช้งาน และลบการแจ้งเตือนที่ไม่ต้องการ
          </p>
        </header>

        <div className="p-8 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-80">
                <Icon
                  icon="lucide:search"
                  width="18"
                  height="18"
                  className="absolute left-3 top-2.5 text-gray-400"
                />
                <input
                  data-test="input-search-notification"
                  type="text"
                  placeholder="ค้นหาหัวข้อการแจ้งเตือน"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>

              {isOwner && (
                <button
                  data-test="btn-open-create-modal"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium flex items-center transition-all shadow-md shadow-blue-100"
                >
                  <Icon
                    icon="lucide:plus"
                    width="18"
                    height="18"
                    className="mr-2"
                  />
                  สร้างการแจ้งเตือน
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm font-semibold text-gray-500 border-b border-gray-100">
                    <th className="pb-4 font-medium pl-2">หัวข้อ (Subject)</th>
                    <th className="pb-4 font-medium text-center">
                      ผู้รับ (Recipients)
                    </th>
                    <th className="pb-4 font-medium text-center">
                      วันที่ส่ง (Sent Date)
                    </th>

                    {isOwner && <th className="pb-4 font-medium"></th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={isOwner ? 4 : 3}
                        className="py-20 text-center text-gray-400 text-sm"
                      >
                        กำลังโหลดข้อมูลระบบ...
                      </td>
                    </tr>
                  ) : notifications && notifications.length > 0 ? (
                    notifications.map((noti) => {
                      const recipient = getRecipientConfig(noti.sendTo);
                      return (
                        <tr
                          key={noti.id}
                          className="hover:bg-gray-50 transition-colors group"
                        >
                          <td className="py-4 pl-2">
                            <p className="text-sm font-semibold text-gray-800">
                              {noti.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {noti.message}
                            </p>
                          </td>
                          <td className="py-4 text-center">
                            <span
                              className={`text-[10px] px-3 py-1 rounded-full font-medium ${recipient.className}`}
                            >
                              {recipient.label}
                            </span>
                          </td>
                          <td className="py-4 text-center text-sm text-gray-500">
                            {noti.createdAt
                              ? new Date(noti.createdAt).toLocaleDateString(
                                  "th-TH",
                                )
                              : "-"}
                          </td>

                          {isOwner && (
                            <td className="py-4 text-right">
                              <button
                                data-test={`btn-open-delete-${noti.id}`}
                                onClick={() => handleDelete(noti.id)}
                                className="text-gray-300 hover:text-red-500 p-2 transition-colors"
                                title="ลบการแจ้งเตือน"
                              >
                                <Icon
                                  icon="lucide:trash-2"
                                  width="16"
                                  height="16"
                                />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={isOwner ? 4 : 3}
                        className="py-20 text-center text-gray-400 text-sm"
                      >
                        {searchTerm
                          ? "ไม่พบหัวข้อการแจ้งเตือน"
                          : "ไม่พบรายการแจ้งเตือนในระบบ"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 text-sm font-medium">
                  <span className="text-gray-500">
                    แสดงหน้า {page + 1} จาก {totalPages} หน้า
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      data-test="btn-prev-page"
                      type="button"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                      disabled={page === 0}
                      className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all text-gray-600"
                    >
                      <Icon icon="lucide:chevron-left" width="18" height="18" />
                    </button>
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs">
                      {page + 1}
                    </span>
                    <button
                      data-test="btn-next-page"
                      type="button"
                      onClick={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages - 1))
                      }
                      disabled={page >= totalPages - 1}
                      className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all text-gray-600"
                    >
                      <Icon
                        icon="lucide:chevron-right"
                        width="18"
                        height="18"
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 py-8 px-6 text-center">
              <h2 className="text-white text-3xl font-bold tracking-tight">
                การแจ้งเตือน
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  หัวข้อ (Subject)
                </label>
                <input
                  data-test="input-subject"
                  type="text"
                  name="subject"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-sm transition-all text-gray-800"
                  placeholder="ระบุหัวข้อ..."
                  value={formData.subject}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  รายละเอียด (Message)
                </label>
                <textarea
                  data-test="input-message"
                  name="message"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-sm transition-all h-28 resize-none text-gray-800"
                  placeholder="ข้อความที่ต้องการแจ้ง..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <select
                  data-test="select-recipients"
                  name="recipients"
                  className="bg-gray-100 border-none text-gray-600 text-xs rounded-xl px-4 py-2.5 outline-none cursor-pointer"
                  value={formData.recipients}
                  onChange={handleChange}
                >
                  <option value="ทั้งหมด">ทั้งหมด</option>
                  <option value="พนักงาน">พนักงาน</option>
                  <option value="ผู้ใช้งาน">ผู้ใช้งาน</option>
                </select>

                <div className="flex space-x-3">
                  <button
                    data-test="btn-cancel-create"
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2.5 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    data-test="btn-submit-create"
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-full text-xs font-bold transition-all shadow-lg shadow-blue-200"
                  >
                    ส่งการแจ้งเตือน
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationManagementPage;
