import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
// 1. เปลี่ยนการ Import: ใช้ useLottie (ที่เป็น Named Export) แทน default
import { useLottie } from "lottie-react";

import loadingAnimation from "../assets/Shop.json";

const Loading = () => {
  const isLoading = useSelector(
    (state: RootState) => state.loading.isLoading
  );

  // 2. กำหนด Option ของ Animation
  const options = {
    animationData: loadingAnimation,
    loop: true,
    autoplay: true, // เล่นอัตโนมัติ
  };

  // 3. เรียกใช้ Hook เพื่อสร้าง View
  // วิธีนี้แก้ปัญหา "Element type is invalid" ได้แน่นอน เพราะเราดึง View ออกมาโดยตรง
  const { View } = useLottie(options);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
      {/* ปรับขนาด div ตามต้องการ (เช่น w-60) */}
      <div className="w-60">
        {/* 4. Render ตัวแปร View แทน Component <Lottie /> */}
        {View}
      </div>
    </div>
  );
};

export default Loading;