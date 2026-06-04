import React, { useState } from "react";
import { Icon } from "@iconify/react";

// --- กำหนด Interface สำหรับ TypeScript ---
interface NotificationItem {
  id: number;
  subject: string;
  message: string;
  recipients: string;
  date: string;
}

interface NotificationFormData {
  subject: string;
  message: string;
  recipients: string;
}

const Notification: React.FC = () => {
  // --- States พร้อมระบุ Type ---
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      subject: "ร้านขอปิดปรับปรุง",
      message: "ปรับปรุงเว็บไซต์ตั้งแต่วันที่ 1 - 3 มีนาคม 2569",
      recipients: "พนักงาน",
      date: "28/2/2569",
    },
    {
      id: 2,
      subject: "โปรโมชั่นใหม่",
      message: "ลดราคาพิเศษ 20% เมื่อซื้อสินค้าครบ 1,000 บาท",
      recipients: "ทั้งหมด",
      date: "28/2/2569",
    },
    {
      id: 3,
      subject: "คำขอคืนเงิน ORD-2024-001",
      message: "เหตุผลในการขอคืนเงิน: ไม่ต้องการสินค้านี้แล้ว",
      recipients: "พนักงาน",
      date: "28/2/2569",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState<NotificationFormData>({
    subject: "",
    message: "",
    recipients: "ทั้งหมด",
  });

  // --- ฟังก์ชันสำหรับกรองข้อมูล ---
  const filteredNotifications: NotificationItem[] = notifications.filter(
    (item) => item.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // --- ฟังก์ชันลบการแจ้งเตือน (รับ Parameter เป็น Number) ---
  const handleDelete = (id: number): void => {
    if (window.confirm("คุณต้องการลบการแจ้งเตือนนี้ใช่หรือไม่?")) {
      setNotifications(notifications.filter((n) => n.id !== id));
      alert("ลบการแจ้งเตือนเรียบร้อยแล้ว");
    }
  };

  // --- ฟังก์ชันการส่งฟอร์ม (ระบุ Type Event ของ Form) ---
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const newNoti: NotificationItem = {
      id: Date.now(),
      ...formData,
      date: new Date().toLocaleDateString("th-TH"),
    };

    setNotifications([newNoti, ...notifications]);
    alert("ส่งการแจ้งเตือนสำเร็จ");
    setIsModalOpen(false);
    setFormData({ subject: "", message: "", recipients: "ทั้งหมด" });
  };

  // --- ฟังก์ชันยกเลิก ---
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

  // --- ฟังก์ชันอัปเดตฟอร์ม (รับ Type Event ของ Input/Textarea/Select) ---
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
      {/* Main Content */}
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
                />{" "}
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
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((noti) => (
                      <tr
                        key={noti.id}
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        <td className="py-4 pl-2">
                          <p className="text-sm font-semibold text-gray-800">
                            {noti.subject}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {noti.message}
                          </p>
                        </td>
                        <td className="py-4 text-center">
                          <span
                            className={`text-[10px] px-3 py-1 rounded-full font-medium ${
                              noti.recipients === "พนักงาน"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {noti.recipients}
                          </span>
                        </td>
                        <td className="py-4 text-center text-sm text-gray-500">
                          {noti.date}
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
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                  placeholder="ระบุหัวข้อ..."
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  รายละเอียด
                </label>
                <textarea
                  name="message"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all h-28 resize-none"
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

export default Notification;
