import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { User, Upload } from "lucide-react";
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";
import { getProfile, updateProfile } from "../../redux/auth/authReducer";
import type { RootState } from "../../redux/store";
import ProfileSidebar from "../../components/user/ProfileSidebar";
import Loading from "../../components/loading/Loading";
import { Icon } from "@iconify/react";

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
        <div
          data-test="edit-modal-actions"
          className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8"
        >
          <button
            data-test="edit-modal-cancel-button"
            onClick={onClose}
            className="cursor-pointer w-full sm:w-auto border border-gray-300 text-gray-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            data-test="edit-modal-save-button"
            onClick={onSave}
            className="cursor-pointer w-full sm:w-auto bg-green-500 text-white px-8 py-2.5 rounded-lg shadow-md text-sm font-medium hover:bg-green-600 transition-colors"
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
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    if (user) {
      // แยกชื่อและนามสกุลด้วยช่องว่าง (ถ้าไม่มีจะเซ็ตเป็นค่าว่าง)
      const nameParts = (user.name || "").trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      // กรณีคนมีชื่อกลางหรือนามสกุลยาวๆ จะเอาเฉพาะคำแรกเป็นชื่อ และที่เหลือเป็นนามสกุล
      const lastName = nameParts.slice(1).join(" ") || "";

      setTempData({
        firstName: firstName,
        lastName: lastName,
        email: user.email || "",
        phone: user.phone || "",
        image: user.image_url || user.image || "",
      });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    dispatch(getProfile() as any);
  }, [dispatch]);

  const openModal = (type: string) => setActiveModal(type);

  const processFile = (file: File) => {
    //แจ้งเตือนขนาดรูปภาพ
    if (file.size > 5 * 1024 * 1024) {
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
    const toastId = toast.loading("กำลังอัปเดตข้อมูล...");

    try {
      const fullName =
        `${tempData.firstName.trim()} ${tempData.lastName.trim()}`.trim();
      let uploadedImageUrl = tempData.image;
      // if (imageFileForUpload) {
      //     uploadedImageUrl = await uploadImageToServer(imageFileForUpload); // ยิง API อัปโหลด
      // }

      // ✨ 1. ปั้นข้อมูลเป็น Object (JSON) ธรรมดา
      const payload = {
        name: fullName,
        email: tempData.email,
        phone: tempData.phone,
        image_url: uploadedImageUrl,
      };

      await dispatch(updateProfile(payload) as any).unwrap();
      await dispatch(getProfile() as any).unwrap();

      toast.success("บันทึกข้อมูลสำเร็จ", { id: toastId });
      setActiveModal(null);
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", { id: toastId });
    }
  };

  const handleCloseModal = () => {
    if (user) {
      const nameParts = (user.name || "").trim().split(/\s+/);
      setTempData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
        image: user.image_url || user.image || "",
      });
    }
    setActiveModal(null);
  };

  if (loading) return <Loading />;
  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        ไม่พบผู้ใช้งาน
      </div>
    );

  return (
    <div className="min-h-screen bg-white font-anuphan text-gray-950 pt-4 sm:pt-12 pb-20">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* 1. Nav อยู่ด้านบนสุด */}
        <nav className="flex flex-wrap items-center text-sm md:text-md text-black mb-4 md:mb-8 font-medium">
          <Link data-test="click-home" to="/" className="transition-colors">
            หน้าหลัก
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1 text-black"
          />
          <span className="text-black">แก้ไขโปรไฟล์</span>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1 text-black"
          />
          <Link to="/profile" className="transition-colors">
            โปรไฟล์
          </Link>
        </nav>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <ProfileSidebar />

          <main className="flex-1 bg-white rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.05)] border border-gray-200 p-6 sm:p-10 relative min-h-[500px]">
            {/* ส่วนหัวข้อ */}
            <div className="mb-7 md:mb-10">
              <h1 className="text-lg sm:text-xl font-bold text-black">
                ข้อมูลของฉัน
              </h1>
              <p className="text-md font-medium text-black mt-1">
                จัดการข้อมูลส่วนตัวคุณเพื่อความปลอดภัยของบัญชีผู้ใช้นี้
              </p>
              <div className="w-48 sm:w-56 border-b border-black mt-4"></div>
            </div>

            <div className="flex flex-col md:flex-row md:justify-between items-stretch">
              <div className="flex-1 space-y-6 order-2 md:order-1 mt-10 md:mt-10 md:pr-26 lg:pr-16">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <label className="text-black font-normal text-medium sm:w-36 shrink-0 text-center">
                    ชื่อ - นามสกุล
                  </label>
                  <div className="flex-1 text-black font-normal text-md flex items-center gap-4">
                    <span className="truncate">
                      {tempData.firstName} {tempData.lastName}
                    </span>
                    <button
                      data-test="btn-change-name"
                      onClick={() => openModal("name")}
                      className="cursor-pointer text-blue-500 text-md font-normal hover:underline whitespace-nowrap"
                    >
                      เปลี่ยน
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <label className="text-black font-normal text-md sm:w-36 shrink-0 text-center">
                    อีเมล
                  </label>
                  <div className="flex-1 text-black font-normal text-md flex items-center gap-4">
                    <span className="truncate">
                      {tempData.email.replace(/(.{3})(.*)(@.*)/, "$1******$3")}
                    </span>
                    <button
                      data-test="btn-change-email"
                      onClick={() => openModal("email")}
                      className="cursor-pointer text-blue-500 text-md font-normal hover:underline whitespace-nowrap"
                    >
                      เปลี่ยน
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <label className="text-black font-normal text-md sm:w-36 shrink-0 text-center">
                    หมายเลขโทรศัพท์
                  </label>
                  <div className="flex-1 text-black font-normal text-md flex items-center gap-4">
                    <span className="truncate">
                      {tempData.phone
                        ? tempData.phone.replace(/^(.*)(.{2})$/, "********$2")
                        : "-"}
                    </span>
                    <button
                      data-test="btn-change-phone"
                      onClick={() => openModal("phone")}
                      className="cursor-pointer text-blue-500 text-md font-normal hover:underline whitespace-nowrap"
                    >
                      เปลี่ยน
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <label className="text-black font-normal text-md sm:w-36 shrink-0 text-center">
                    วันที่สมัคร
                  </label>
                  <div className="flex-1 text-black font-normal text-md flex items-center gap-4">
                    <span className="truncate">
                      {user.createdAt && user.createdAt !== "null"
                        ? user.createdAt
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden md:block w-px bg-gray-200 order-2 self-stretch mx-4 lg:mx-8"></div>
              <hr className="w-full border-gray-200 my-8 order-2 md:hidden" />
              <div className="flex flex-col items-center justify-start order-1 md:order-3 w-full md:w-56 lg:w-64 shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-50 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm mb-5">
                  {tempData.image ? (
                    <img
                      src={tempData.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 stroke-[1]" />
                  )}
                </div>
                <button
                  data-test="btn-change-profile-picture"
                  onClick={() => setIsImageModalOpen(true)}
                  className="cursor-pointer border border-gray-300 bg-white px-6 py-2 text-md text-black rounded hover:bg-gray-50 transition-colors shadow-sm font-medium mb-4"
                >
                  เลือกรูป
                </button>
                <div className="text-md font-medium text-black text-center space-y-1.5 leading-relaxed">
                  <p>ไฟล์ที่รองรับ: .JPEG, .PNG</p>
                  <p>ขนาดไฟล์: สูงสุด 5 MB</p>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* --- Modals --- */}
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
                    data-test="image-upload-area"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-12 cursor-pointer transition-colors ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-50"}`}
                  >
                    <Upload
                      data-test="upload-icon"
                      className={`w-10 h-10 mb-3 ${isDragging ? "text-blue-500" : "text-gray-400"}`}
                    />
                    <p className="text-gray-700 font-medium">
                      คลิกเพื่ออัปโหลดหรือลากวาง
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      PNG, JPG, GIF up to 5 MB
                    </p>
                    <input
                      data-test="file-input"
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept=".jpg, .jpeg, .png, .gif"
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div
                      data-test="cropped-image-container"
                      className="relative w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden"
                    >
                      {rawImageSrc && (
                        <Cropper
                          data-test="cropper-component"
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
                      <span className="text-xs text-gray-500 font-medium">
                        0
                      </span>
                      <input
                        data-tses="zoom-slider"
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
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
                  data-test="btn-cancel-crop"
                  onClick={closeImageModal}
                  className="cursor-pointer px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-white transition"
                >
                  ยกเลิก
                </button>
                {imageUploadStep === "crop" && (
                  <button
                    data-test="btn-save-crop"
                    onClick={handleSaveCrop}
                    className="cursor-pointer px-6 py-2 bg-[#00BFA5] text-white rounded-lg text-sm font-medium hover:bg-[#009E88] transition"
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
          onClose={handleCloseModal}
          onSave={handleSave}
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="firstName"
                className="text-sm text-gray-600 font-medium mb-1.5 block"
              >
                ชื่อ
              </label>
              <input
                id="input-first-name"
                data-test="input-first-name"
                type="text"
                className="w-full border border-gray-300 px-3 py-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm"
                value={tempData.firstName}
                onChange={(e) =>
                  setTempData({ ...tempData, firstName: e.target.value })
                }
              />
              <label
                htmlFor="lastName"
                className="text-sm text-gray-600 font-medium mb-1.5 block"
              >
                นามสกุล
              </label>
              <input
                id="input-last-name"
                data-test="input-last-name"
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
          onClose={handleCloseModal}
          onSave={handleSave}
        >
          <div>
            <label
              htmlFor="email"
              className="text-sm text-black font-medium mb-1.5 block"
            >
              อีเมล
            </label>
            <input
              id="input-email"
              data-test="input-email"
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
          onClose={handleCloseModal}
          onSave={handleSave}
        >
          <div>
            <label
              htmlFor="phone"
              className="text-sm text-gray-600 font-medium mb-1.5 block"
            >
              เบอร์โทรศัพท์ (10 หลัก)
            </label>
            <input
              id="input-phone"
              data-test="input-phone"
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
    </div>
  );
};

export default ProfilePage;
