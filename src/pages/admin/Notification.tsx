import React, { useState, useEffect } from "react";
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

const AdminNotificationPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const notifications = useSelector(
    (state: RootState) => state.notification.items,
  ) as Notification[];

  const isLoading = useSelector(
    (state: RootState) => state.notification.isLoading,
  );

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState<NotificationFormData>({
    subject: "",
    message: "",
    recipients: "ทั้งหมด",
  });

  useEffect(() => {
    dispatch(fetchOwnerNotify());
  }, [dispatch]);

  const filteredNotifications = notifications.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getRecipientLabel = (sendTo: string) => {
    if (sendTo.includes("moderator")) return "พนักงาน";
    if (sendTo.includes("customer")) return "ผู้ใช้งาน";
    return "ทั้งหมด";
  };

  const getRecipientBadgeClass = (sendTo: string) => {
    if (sendTo.includes("moderator"))
      return "bg-blue-50 text-blue-600 border border-blue-100";
    if (sendTo.includes("customer"))
      return "bg-green-50 text-green-600 border border-green-100";
    return "bg-gray-100 text-gray-600";
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm("คุณต้องการลบการแจ้งเตือนนี้ใช่หรือไม่?")) {
      try {
        await dispatch(deleteNotify(id)).unwrap();
        toast.success("ลบการแจ้งเตือนเรียบร้อยแล้ว");
      } catch (error) {
        toast.error("เกิดข้อผิดพลาด ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    let targetTopic = "/topic/all";
    if (formData.recipients === "ผู้ใช้งาน") targetTopic = "/topic/customer";
    if (formData.recipients === "พนักงาน") targetTopic = "/topic/moderator";

    try {
      await dispatch(
        createNotify({
          title: formData.subject,
          message: formData.message,
          sendTo: targetTopic,
        }),
      ).unwrap();

      toast.success("ส่งการแจ้งเตือนสำเร็จ");
      setIsModalOpen(false);
      setFormData({ subject: "", message: "", recipients: "ทั้งหมด" });
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด ไม่สามารถส่งการแจ้งเตือนได้");
    }
  };

  const handleCancel = (): void => {
    if (formData.subject || formData.message) {
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
            {/* Search & Action Bar */}
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-80">
                <Icon
                  icon="lucide:search"
                  width="18"
                  height="18"
                  className="absolute left-3 top-2.5 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="ค้นหาหัวข้อการแจ้งเตือน"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                />
              </div>
              <button
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
            </div>

            {/* Table */}
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
                    <th className="pb-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-20 text-center text-gray-400 text-sm"
                      >
                        กำลังโหลดข้อมูลระบบ...
                      </td>
                    </tr>
                  ) : filteredNotifications.length > 0 ? (
                    filteredNotifications.map((noti) => (
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
                          {/* 💡 ปรับคลาสสีตรงนี้เพื่อแยกรสชาติสีของกลุ่มผู้รับปลายทาง */}
                          <span
                            className={`text-[10px] px-3 py-1 rounded-full font-medium ${getRecipientBadgeClass(noti.sendTo)}`}
                          >
                            {getRecipientLabel(noti.sendTo)}
                          </span>
                        </td>
                        <td className="py-4 text-center text-sm text-gray-500">
                          {noti.createdAt
                            ? new Date(noti.createdAt).toLocaleDateString(
                                "th-TH",
                              )
                            : "-"}
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleDelete(noti.id)}
                            className="text-gray-300 hover:text-red-500 p-2 transition-colors"
                          >
                            <Icon
                              icon="lucide:trash-2"
                              width="16"
                              height="16"
                            />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
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
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
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
                  หัวข้อการแจ้งเตือน
                </label>
                <input
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
                  รายละเอียด
                </label>
                <textarea
                  name="message"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-sm transition-all h-28 resize-none text-gray-800"
                  placeholder="ข้อความที่ต้องการแจ้ง..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <select
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
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2.5 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
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

export default AdminNotificationPage;
