import React from "react";
import type { StatusOrderTabsProps } from "../../types/orders";

const StatusOrderTabs: React.FC<StatusOrderTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    "ทั้งหมด",
    "คำสั่งซื้อสำเร็จ",
    "ที่ต้องชำระ",
    "ที่ต้องจัดส่ง",
    "ที่ต้องได้รับ",
    "ยกเลิก",
    "คืนเงิน/คืนสินค้า",
  ];

  return (
    <div className="flex border border-gray-400 rounded-sm overflow-hidden mb-6 text-sm text-center overflow-x-auto">
      {tabs.map((tab, index) => {
        const isActive = tab === activeTab;
        return (
          <div
            key={index}
            onClick={() => onTabChange(tab)}
            className={`flex-1 min-w-[100px] py-3 border-r border-gray-400 last:border-r-0 cursor-pointer transition-colors whitespace-nowrap px-2 ${
              isActive
                ? "bg-[#5B95F9] text-white font-medium"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab}
          </div>
        );
      })}
    </div>
  );
};

export default StatusOrderTabs;
