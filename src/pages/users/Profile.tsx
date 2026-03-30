import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User } from "lucide-react";
import Swal from "sweetalert2";
import { updateProfile } from "../../redux/auth/authReducer";
import type { RootState } from "../../redux/store";
import ProfileSidebar from "../../components/user/ProfileSidebar";

// --- Sub-Component: Modal (ปรับตาม UI ที่ต้องการ) ---
interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}

const EditModal = ({
  isOpen,
  title,
  onClose,
  onSave,
  children,
}: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[450px] p-6 ">
        <h3 className="text-xl font-bold text-gray-800 mb-6">{title}</h3>
        <div className="space-y-4">{children}</div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="w-full sm:w-auto border border-gray-300 text-gray-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={onSave}
            className="w-full sm:w-auto bg-green-500 text-white px-8 py-2.5 rounded-lg shadow-md text-sm font-medium hover:bg-green-600 transition-colors"
          >
            ยืนยันการแก้ไข
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [tempData, setTempData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    image: "",
  });

  // Sync ข้อมูลจาก Redux ลง Local State
  useEffect(() => {
    if (user) {
      const nameParts = (user.name || "").trim().split(/\s+/);
      setTempData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
        image: user.image || "",
      });
    }
  }, [user]);

  // คืนค่าข้อมูลกรณีปิด Modal โดยไม่บันทึก
  const openModal = (type: string) => {
    setActiveModal(type);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ตรวจสอบขนาดไฟล์ (ไม่เกิน 1MB ตาม UI)
      if (file.size > 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "ไฟล์มีขนาดใหญ่เกินไป",
          text: "กรุณาเลือกไฟล์ขนาดไม่เกิน 1 MB",
        });
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setTempData({ ...tempData, image: imageUrl });
    }
  };

  const handleSave = async () => {
    Swal.fire({
      title: "กำลังอัปเดต...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const updatedData = {
        ...tempData,
        name: `${tempData.firstName.trim()} ${tempData.lastName.trim()}`,
      };

      await dispatch(updateProfile(updatedData) as any);

      Swal.fire({
        icon: "success",
        title: "บันทึกสำเร็จ",
        timer: 1500,
        showConfirmButton: false,
      });
      setActiveModal(null);
    } catch (error) {
      console.error("Order processing failed:", error);

      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
        text: "กรุณาลองใหม่อีกครั้งในภายหลัง",
      });
    }
  };

  if (!user)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div
      id="page-profile"
      className="min-h-screen bg-white font-sans text-gray-950 pt-4 sm:pt-12 pb-20"
    >
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row gap-6">
        <ProfileSidebar />

        {/* === RIGHT CONTENT === */}
        <main className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-5 sm:p-8 relative min-h-[500px]">
          <div className="border-b border-gray-100 pb-4 mb-6 md:mb-8">
            <h1
              id="title-profile-page"
              className="text-lg sm:text-xl font-bold text-black"
            >
              ข้อมูลของฉัน
            </h1>
            <p id="desc-profile-page" className="text-sm text-black mt-1">
              จัดการข้อมูลส่วนตัวคุณเพื่อความปลอดภัยของบัญชีผู้ใช้นี้
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:gap-8">
            {/* --- Right Image Section --- */}
            <div className="flex flex-col items-center justify-start order-1 md:order-2 md:w-72 md:border-l md:border-gray-100 md:pl-8">
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-50 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm mb-4">
                {tempData.image ? (
                  <img
                    id="img-profile-main"
                    src={tempData.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User
                    id="icon-profile-placeholder"
                    className="w-18 h-18 sm:w-20 sm:h-20 text-black stroke-[0.5]"
                  />
                )}
              </div>

              <input
                data-test="input-file-image"
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept=".jpg, .jpeg, .png"
                className="hidden"
              />

              <button
                data-test="btn-upload-image"
                onClick={handleImageClick}
                className="border border-gray-300 bg-white px-6 py-2 text-md text-black rounded hover:bg-gray-50 transition-colors shadow-sm font-medium mb-3"
              >
                เลือกรูป
              </button>

              <div
                id="desc-upload-limits"
                className="text-md text-black text-center space-y-1"
              >
                <p>ขนาดไฟล์: สูงสุด 1 MB</p>
                <p>ไฟล์ที่รองรับ: .JPEG, .PNG</p>
              </div>
            </div>

            {/* เส้นคั่น (แสดงเฉพาะบนมือถือ) */}
            <hr className="w-full border-gray-300 my-6 order-2 md:hidden" />

            {/* --- Left Form Section --- */}
            <div className="flex-1 space-y-5 sm:space-y-7 order-3 md:order-1">
              {/* Row: Name */}
              <div className="flex justify-between md:justify-start items-center md:gap-6">
                <label
                  htmlFor="first-last-name"
                  className="text-black font-medium text-sm md:w-40 md:text-right"
                >
                  ชื่อ - นามสกุล
                </label>
                <div className="flex-1 text-black font-normal text-sm flex items-center justify-end md:justify-start">
                  <span id="display-fullname" className="mr-3 md:mr-4 truncate">
                    {tempData.firstName} {tempData.lastName}
                  </span>
                  <button
                    id="btn-edit-name"
                    onClick={() => openModal("name")}
                    className="text-blue-500 transition-colors text-sm font-medium hover:underline"
                  >
                    เปลี่ยน
                  </button>
                </div>
              </div>

              {/* Row: Email */}
              <div className="flex justify-between md:justify-start items-center md:gap-6">
                <label
                  htmlFor="email-input"
                  className="text-black font-medium text-sm md:w-40 md:text-right"
                >
                  อีเมล
                </label>
                <div className="flex-1 text-black font-normal text-sm flex items-center justify-end md:justify-start">
                  <span id="display-email" className="mr-3 md:mr-4 truncate">
                    {tempData.email.replace(/(.{3})(.*)(@.*)/, "$1******$3")}
                  </span>
                  <button
                    id="btn-edit-email"
                    onClick={() => openModal("email")}
                    className="text-blue-500 transition-colors text-sm font-medium hover:underline"
                  >
                    เปลี่ยน
                  </button>
                </div>
              </div>

              {/* Row: Phone */}
              <div className="flex justify-between md:justify-start items-center md:gap-6">
                <label
                  htmlFor="phone-input"
                  className="text-black font-medium text-sm md:w-40 md:text-right"
                >
                  หมายเลขโทรศัพท์
                </label>
                <div className="flex-1 text-black font-normal text-sm flex items-center justify-end md:justify-start">
                  <span id="display-phone" className="mr-3 md:mr-4 truncate">
                    {tempData.phone
                      ? tempData.phone.replace(/^(.*)(.{2})$/, "********$2")
                      : "-"}
                  </span>
                  <button
                    id="btn-edit-phone"
                    onClick={() => openModal("phone")}
                    className="text-blue-500 transition-colors text-sm font-medium hover:underline"
                  >
                    เปลี่ยน
                  </button>
                </div>
              </div>

              {/* Row: Date */}
              <div className="flex justify-between md:justify-start items-center md:gap-6">
                <label
                  htmlFor="date"
                  className="text-black font-medium text-sm md:w-40 md:text-right"
                >
                  วันที่สมัคร
                </label>
                <div className="flex-1 text-black font-normal text-sm flex items-center justify-end md:justify-start">
                  <span id="display-joindate" className="md:mr-4 truncate">
                    {user.joinDate || "-"}
                  </span>
                </div>
              </div>

              {/* Main Save Button */}
              <div className="flex md:items-center mt-8 pt-4">
                <div className="hidden md:block md:w-40 md:mr-6"></div>
                <div className="w-full flex justify-center md:justify-start">
                  <button
                    id="btn-main-save"
                    onClick={handleSave}
                    className="w-full md:w-auto md:min-w-[150px] bg-green-500 hover:bg-green-600 transition-colors text-white px-8 py-3 md:py-2.5 rounded text-sm md:text-base shadow-sm font-medium"
                  >
                    บันทึกข้อมูล
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* --- Modals --- */}
      <EditModal
        isOpen={activeModal === "name"}
        title="เปลี่ยน ชื่อ - นามสกุล"
        onClose={() => {
          setActiveModal(null);
          // Reset values back to original from Redux if cancelled
          const nameParts = (user.name || "").trim().split(/\s+/);
          setTempData({
            ...tempData,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
          });
        }}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="input-firstname"
              className="text-sm text-gray-600 font-medium mb-1.5 block"
            >
              ชื่อ
            </label>
            <input
              id="input-firstname"
              type="text"
              className="w-full border border-gray-300 px-3 py-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm"
              value={tempData.firstName}
              onChange={(e) =>
                setTempData({ ...tempData, firstName: e.target.value })
              }
            />
          </div>
          <div>
            <label
              htmlFor="input-lastname"
              className="text-sm text-gray-600 font-medium mb-1.5 block"
            >
              นามสกุล
            </label>
            <input
              id="input-lastname"
              type="text"
              className="w-full border border-gray-300 px-3 py-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm"
              value={tempData.lastName}
              onChange={(e) =>
                setTempData({ ...tempData, lastName: e.target.value })
              }
            />
          </div>
        </div>
      </EditModal>

      <EditModal
        isOpen={activeModal === "email"}
        title="เปลี่ยนอีเมล"
        onClose={() => {
          setActiveModal(null);
          setTempData({ ...tempData, email: user.email || "" });
        }}
        onSave={handleSave}
      >
        <div>
          <label
            htmlFor="input-email"
            className="text-sm text-black font-medium mb-1.5 block"
          >
            อีเมล
          </label>
          <input
            id="input-email"
            type="email"
            className="w-full border border-gray-300 px-3 py-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm"
            value={tempData.email}
            onChange={(e) =>
              setTempData({ ...tempData, email: e.target.value })
            }
          />
        </div>
      </EditModal>

      <EditModal
        isOpen={activeModal === "phone"}
        title="เปลี่ยนเบอร์โทร"
        onClose={() => {
          setActiveModal(null);
          setTempData({ ...tempData, phone: user.phone || "" });
        }}
        onSave={handleSave}
      >
        <div>
          <label
            htmlFor="input-phone"
            className="text-sm text-gray-600 font-medium mb-1.5 block"
          >
            เบอร์โทรศัพท์ (10 หลัก)
          </label>
          <input
            id="input-phone"
            type="text"
            maxLength={10}
            className="w-full border border-gray-300 px-3 py-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm"
            value={tempData.phone}
            onChange={(e) =>
              setTempData({
                ...tempData,
                phone: e.target.value.replaceAll(/\D/g, ""),
              })
            }
          />
        </div>
      </EditModal>
    </div>
  );
};

export default ProfilePage;
