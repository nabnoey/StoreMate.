import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Upload } from "lucide-react";
// 🌟 เปลี่ยนจาก Swal เป็น toast
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";
import { updateProfile } from "../../redux/auth/authReducer";
import type { RootState } from "../../redux/store";
import ProfileSidebar from "../../components/user/ProfileSidebar";

// --- Utility Function สำหรับการ Crop รูปภาพ ---
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: any,
): Promise<{ url: string; blob: Blob }> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("No 2d context");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve({ url: URL.createObjectURL(blob), blob });
      },
      "image/jpeg",
      0.9,
    );
  });
}

// --- Sub-Component: Modal ทั่วไป ---
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[450px] p-6 animate-in zoom-in-95 duration-200">
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

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [tempData, setTempData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    image: "",
  });

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUploadStep, setImageUploadStep] = useState<"upload" | "crop">(
    "upload",
  );
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageFileForUpload, setImageFileForUpload] = useState<Blob | null>(
    null,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const openModal = (type: string) => setActiveModal(type);

  const processFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      // 🌟 ใช้ toast แจ้งเตือนไฟล์ใหญ่เกิน
      toast.error("ไฟล์มีขนาดใหญ่เกินไป กรุณาเลือกไฟล์ขนาดไม่เกิน 5 MB");
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setRawImageSrc(reader.result?.toString() || "");
      setImageUploadStep("crop");
    });
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  const onCropComplete = useCallback(
    (_croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );
  const handleSaveCrop = async () => {
    try {
      if (rawImageSrc && croppedAreaPixels) {
        const { url, blob } = await getCroppedImg(
          rawImageSrc,
          croppedAreaPixels,
        );

        setTempData({ ...tempData, image: url });
        setImageFileForUpload(blob);

        setIsImageModalOpen(false);
        setRawImageSrc(null);
        setImageUploadStep("upload");
        setZoom(1);
      }
    } catch (e) {
      console.error(e);
      // 🌟 ใช้ toast แจ้งเตือนข้อผิดพลาด
      toast.error("เกิดข้อผิดพลาดในการตัดรูปภาพ");
    }
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setRawImageSrc(null);
    setImageUploadStep("upload");
    setZoom(1);
  };

  const handleSave = async () => {
    // 🌟 สร้าง Loading Toast และเก็บ id ไว้เพื่ออัปเดตสถานะทีหลัง
    const toastId = toast.loading("กำลังอัปเดตข้อมูล...");

    try {
      const formData = new FormData();
      formData.append(
        "name",
        `${tempData.firstName.trim()} ${tempData.lastName.trim()}`,
      );
      formData.append("email", tempData.email);
      formData.append("phone", tempData.phone);

      if (imageFileForUpload) {
        formData.append("image", imageFileForUpload, "profile.jpg");
      }

      await dispatch(updateProfile(formData) as any);

      // 🌟 อัปเดต Toast เป็นสถานะ Success
      toast.success("บันทึกข้อมูลสำเร็จ", { id: toastId });

      setActiveModal(null);
      setImageFileForUpload(null);
    } catch (error) {
      // 🌟 อัปเดต Toast เป็นสถานะ Error
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", { id: toastId });
    }
  };

  if (!user)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-950 pt-4 sm:pt-12 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row gap-6">
        <ProfileSidebar />

        {/* ... (ส่วนแสดงผล UI ข้างในเหมือนเดิมทุกประการ ไม่มีการเปลี่ยนแปลง) ... */}

        <main className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-5 sm:p-8 relative min-h-[500px]">
          {/* ... เนื้อหาข้างใน main ... */}
          <div className="border-b border-gray-100 pb-4 mb-6 md:mb-8">
            <h1 className="text-lg sm:text-xl font-bold text-black">
              ข้อมูลของฉัน
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              จัดการข้อมูลส่วนตัวคุณเพื่อความปลอดภัยของบัญชีผู้ใช้นี้
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:gap-8">
            <div className="flex flex-col items-center justify-start order-1 md:order-2 md:w-72 md:border-l md:border-gray-100 md:pl-8">
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-50 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm mb-4">
                {tempData.image ? (
                  <img
                    src={tempData.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-18 h-18 sm:w-20 sm:h-20 text-gray-400 stroke-[1]" />
                )}
              </div>
              <button

                data-test="btn-upload-image"
                onClick={handleImageClick}
                className="border border-gray-300 bg-white px-6 py-2 text-md text-black rounded hover:bg-gray-50 transition-colors shadow-sm font-medium mb-3 cursor-pointer"
              >
                เลือกรูป
              </button>
              <div className="text-xs text-gray-400 text-center space-y-1">
                <p>ไฟล์ที่รองรับ: .JPEG, .PNG</p>
                <p>ขนาดไฟล์: สูงสุด 5 MB</p>
              </div>
            </div>

            <hr className="w-full border-gray-200 my-6 order-2 md:hidden" />

            <div className="flex-1 space-y-5 sm:space-y-7 order-3 md:order-1">
              <div className="flex justify-between md:justify-start items-center md:gap-6">
                <label className="text-gray-700 font-medium text-sm md:w-40 md:text-right">
                  ชื่อ - นามสกุล
                </label>
                <div className="flex-1 text-black font-normal text-sm flex items-center justify-end md:justify-start">
                  <span className="mr-3 md:mr-4 truncate">
                    {tempData.firstName} {tempData.lastName}
                  </span>
                  <button

                    data-test="btn-edit-name"
                    onClick={() => openModal("name")}
                    className="text-blue-500 transition-colors text-sm font-medium hover:underline cursor-pointer"
                  >
                    เปลี่ยน
                  </button>
                </div>
              </div>
              <div className="flex justify-between md:justify-start items-center md:gap-6">
                <label className="text-gray-700 font-medium text-sm md:w-40 md:text-right">
                  อีเมล
                </label>
                <div className="flex-1 text-black font-normal text-sm flex items-center justify-end md:justify-start">
                  <span className="mr-3 md:mr-4 truncate">
                    {tempData.email.replace(/(.{3})(.*)(@.*)/, "$1******$3")}
                  </span>
                  <button

                    data-test="btn-edit-email"
                    onClick={() => openModal("email")}
                    className="text-blue-500 transition-colors text-sm font-medium hover:underline cursor-pointer"
                  >
                    เปลี่ยน
                  </button>
                </div>
              </div>
              <div className="flex justify-between md:justify-start items-center md:gap-6">
                <label className="text-gray-700 font-medium text-sm md:w-40 md:text-right">
                  หมายเลขโทรศัพท์
                </label>
                <div className="flex-1 text-black font-normal text-sm flex items-center justify-end md:justify-start">
                  <span className="mr-3 md:mr-4 truncate">
                    {tempData.phone
                      ? tempData.phone.replace(/^(.*)(.{2})$/, "********$2")
                      : "-"}
                  </span>
                  <button

                    data-test="btn-edit-phone"
                    onClick={() => openModal("phone")}
                    className="text-blue-500 transition-colors text-sm font-medium hover:underline cursor-pointer"
                  >
                    เปลี่ยน
                  </button>
                </div>
              </div>
              <div className="flex justify-between md:justify-start items-center md:gap-6">
                <label className="text-gray-700 font-medium text-sm md:w-40 md:text-right">
                  วันที่สมัคร
                </label>
                <div className="flex-1 text-black font-normal text-sm flex items-center justify-end md:justify-start">
                  <span className="md:mr-4 truncate">
                    {user.joinDate || "-"}
                  </span>
                </div>
              </div>
              <div className="flex md:items-center mt-8 pt-4">
                <div className="hidden md:block md:w-40 md:mr-6"></div>
                <div className="w-full flex justify-center md:justify-start">
                  <button

                    data-test="btn-save-profile"
                    onClick={handleSave}
                    className="w-full md:w-auto md:min-w-[150px] bg-green-500 hover:bg-green-600 transition-colors text-white px-8 py-3 md:py-2.5 rounded text-sm md:text-base shadow-sm font-medium cursor-pointer"
                  >
                    บันทึกข้อมูล
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* --- Modals (เหมือนเดิม) --- */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[550px] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {imageUploadStep === "upload"
                  ? "อัปโหลดรูปโปรไฟล์"
                  : "ปรับแต่งรูปโปรไฟล์"}
              </h3>
            </div>
            <div className="p-6">
              {imageUploadStep === "upload" ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-12 cursor-pointer transition-colors ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-50"}`}
                >
                  <Upload
                    className={`w-10 h-10 mb-3 ${isDragging ? "text-blue-500" : "text-gray-400"}`}
                  />
                  <p className="text-gray-700 font-medium">
                    คลิกเพื่ออัปโหลดหรือลากวาง
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    PNG, JPG, GIF up to 5 MB
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept=".jpg, .jpeg, .png, .gif"
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="relative w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden">
                    {rawImageSrc && (
                      <Cropper
                        image={rawImageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                      />
                    )}
                  </div>
                  <div className="w-full max-w-xs mt-6 flex items-center gap-4">
                    <span className="text-xs text-gray-500 font-medium">0</span>
                    <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4285F4]"
                    />
                    <span className="text-xs text-gray-500 font-medium">
                      100
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={closeImageModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-white transition"
              >
                ยกเลิก
              </button>
              {imageUploadStep === "crop" && (
                <button
                  onClick={handleSaveCrop}
                  className="px-6 py-2 bg-[#00BFA5] text-white rounded-lg text-sm font-medium hover:bg-[#009E88] transition"
                >
                  บันทึก
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Text Edit Modals */}
      <EditModal
        isOpen={activeModal === "name"}
        title="เปลี่ยน ชื่อ - นามสกุล"
        onClose={() => setActiveModal(null)}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 font-medium mb-1.5 block">
              ชื่อ
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 px-3 py-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm"
              value={tempData.firstName}
              onChange={(e) =>
                setTempData({ ...tempData, firstName: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium mb-1.5 block">
              นามสกุล
            </label>
            <input
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
        onClose={() => setActiveModal(null)}
        onSave={handleSave}
      >
        <div>
          <label className="text-sm text-black font-medium mb-1.5 block">
            อีเมล
          </label>
          <input
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
        onClose={() => setActiveModal(null)}
        onSave={handleSave}
      >
        <div>
          <label className="text-sm text-gray-600 font-medium mb-1.5 block">
            เบอร์โทรศัพท์ (10 หลัก)
          </label>
          <input
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
