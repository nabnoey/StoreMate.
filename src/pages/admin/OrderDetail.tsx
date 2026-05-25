import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getoOrderByOrderNo, shippingOrder } from "../../redux/moderator/ModeratorReducer";
import {
  FiClock,
  FiClipboard,
  FiTruck,
  FiCheckCircle,
  FiUser,
  FiPhone,
  FiMapPin,
  FiArrowLeft,
} from "react-icons/fi";
import { FaHistory } from "react-icons/fa";
import { Users } from "lucide-react";
import type { RootState, AppDispatch } from "../../redux/store";
import { STATUS_LABELS, type OrderItem } from "../../types/moderator/ordersMod";
// import type {orderMod} from "../../types/moderator/ordersMod";

function StatusStep({
  icon: Icon,
  label,
  isCompleted,
  isCurrent,
}: {
  icon: React.ReactNode;
  label: string;
  isCompleted: boolean;
  isCurrent: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2 relative z-10">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
          isCurrent
            ? "bg-white border-2 border-black text-black shadow-sm"
            : isCompleted
            ? "bg-white border-2 border-gray-800 text-black shadow-sm"
            : "bg-white border-2 border-gray-300 text-gray-400"
        }`}
      >
        {Icon}
      </div>
      <span
        className={`text-xs font-medium text-center ${
          isCurrent
            ? "font-bold text-gray-800"
            : isCompleted
            ? "font-medium text-gray-600"
            : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function OrderItemRow({
  image,
  name,
  quantity,
  price,
}: {
  image: string;
  name: string;
  quantity: number;
  price: number;
}) {
  return (
    <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
      <div className="flex items-center gap-4">
        <img
          src={image || "https://via.placeholder.com/150"}
          alt={name}
          className="w-14 h-14 bg-gray-100 rounded-md object-cover"
        />
        <div>
          <p className="font-bold text-gray-800 text-sm">{name}</p>
          <p className="text-xs text-gray-500 mt-1">จำนวน: {quantity}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-800">฿ {price?.toLocaleString()}</p>
        <p className="text-[10px] text-gray-400 font-medium">UNIT PRICE</p>
      </div>
    </div>
  );
}

function OrderDetail() {
  const { orderNo } = useParams<{ orderNo: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { orderToPrint, loading } = useSelector((state: RootState) => state.moderator);
  const order = orderToPrint && orderToPrint.length > 0 ? orderToPrint[0] : null;

const [selectedStatus, setSelectedStatus] = useState(
  order?.status || ""
);

  useEffect(() => {
    if (orderNo) {
      dispatch(getoOrderByOrderNo(Number(orderNo)));
    }
  }, [orderNo, dispatch]);

;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">ไม่พบข้อมูลคำสั่งซื้อ</p>
          <button
            onClick={() => navigate("/moderator/ordersMod")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            กลับไปที่จัดการคำสั่งซื้อ
          </button>
        </div>
      </div>
    );
  }

  const handleUpdateStatus = () => {
    if (orderNo) {
      dispatch(shippingOrder(Number(orderNo))).then(() => {
        dispatch(getoOrderByOrderNo(Number(orderNo))); // refresh after update
      });
    }
  };

  const recipientName = order.recipientName || order.orderRecipient?.recipientName || "ไม่ระบุชื่อ";
  const recipientPhone = order.phone || order.orderRecipient?.phone || "ไม่ระบุเบอร์โทรศัพท์";
  
  const orderAddress = order.orderAddress?.[0] || {};
  const deliveryAddress = {
    streetAddress: orderAddress.streetAddress || "ไม่ระบุที่อยู่สำหรับการจัดส่ง",
    subdistrict: orderAddress.subdistrict || "",
    district: orderAddress.district || "",
    province: orderAddress.province || "",
    zipcode: orderAddress.zipcode || "",
  };

  // const orderDate = order.createdAt
  //   ? new Date(order.createdAt).toLocaleDateString("th-TH")
  //   : new Date().toLocaleDateString("th-TH");
  const orderTime = order.createdAt
    ? new Date(order.createdAt).toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' }) + " น."
    : "";

  const steps = [
    { icon: <FiClock />, label: "รอดำเนินการ", status: "PENDING" },
    { icon: <FiClipboard />, label: "กำลังเตรียมสินค้า", status: "PROCESSING" },
    { icon: <FiTruck />, label: "จัดส่งแล้ว", status: "RECEIVE" },
    { icon: <FiCheckCircle />, label: "สำเร็จแล้ว", status: "COMPLETED" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.status === order.status);

  // fallback items in case API doesn't return orderItems in moderator endpoint
  const items = order.orderItems || [
    {
      id: 1,
      imageUrl: "https://via.placeholder.com/150",
      productName: "น้ำมะม่วงหาวมะนาวโห่ สกัดเข้มข้น ไม่มีน้ำตาล",
      quantity: 1,
      price: order.total || 35,
    }
  ];

  const checkoutTypeLabel = order.checkoutType === "PROMPTPAY" 
    ? "พร้อมเพย์ (PromptPay)" 
    : order.checkoutType === "DESTINATION"
    ? "เก็บเงินปลายทาง (COD)"
    : order.checkoutType === "CARD"
    ? "บัตรเครดิต / เดบิต"
    : order.checkoutType || "ไม่ระบุ";

  const progressWidth = currentStepIndex > 0 ? `${(currentStepIndex / (steps.length - 1)) * 100}%` : "0%";

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-start text-left w-full mt-0 lg:mt-10">
      <div className="bg-white border-b border-gray-200 w-full p-6">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/moderator/ordersMod")}
            className="hover:opacity-70 transition-opacity text-gray-700"
            type="button"
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <div className="flex w-full items-center">
            <h1 className="text-xl font-bold text-gray-900">
              รายละเอียดคำสั่งซื้อ
            </h1>
          </div>
        </div>
      </div>

      <div className="p-6 w-full text-gray-700 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6 ">
            {/* Timeline & Status */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm relative">
              <p className="text-sm text-gray-500 font-medium mb-6">
                {order.orderNo}
              </p>

              <div className="relative mb-10 mt-4">
                <div className="absolute top-[1.25rem] left-12 right-12 h-0.5 bg-gray-200 z-0"></div>
                <div 
                  className="absolute top-[1.25rem] left-12 h-0.5 bg-gray-800 z-0 transition-all duration-500"
                  style={{ width: progressWidth }}
                ></div>

                <div className="flex justify-between items-center relative z-10">
                  {steps.map((step, index) => (
                    <StatusStep
                      key={step.status}
                      icon={step.icon}
                      label={step.label}
                      isCompleted={index < currentStepIndex}
                      isCurrent={index === currentStepIndex}
                    />
                  ))}
                </div>
              </div>
                  

              <div className="mt-8 border-t border-gray-100 pt-6">
                <h3 className="font-bold text-gray-800 mb-4">เปลี่ยนสถานะคำสั่งซื้อ</h3>
                <div className="flex items-end gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-2">เลือกสถานะ:</label>
                    <div className="relative">
                      <select 
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-48 p-2.5 pr-8"
                      >
                        {Object.entries(STATUS_LABELS).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleUpdateStatus}
                    className="bg-[#10B981] hover:bg-emerald-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
                  >
                    บันทึก
                  </button>
                  <button 
                    onClick={() => setSelectedStatus(order.status)}
                    className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                รายการสินค้า ({items.length})
              </h3>

              {items.map((item: OrderItem) => (
                <OrderItemRow
                  key={item.id}
                  image={item.imageUrl || "https://via.placeholder.com/150"}
                  name={item.productName || "ไม่ระบุชื่อสินค้า"}
                  quantity={item.quantity}
                  price={item.price}
                />
              ))}

              <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-[16px] font-medium text-gray-600">ราคารวม</span>
                  <div className="text-right">
                    <p className="text-xl text-blue-500 font-bold">
                      ฿ {order.total?.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold">THB</p>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                  <span className="text-[16px] font-medium text-gray-600">ช่องทางชำระเงิน</span>
                  <div className="text-right">
                    <p className="text-[16px] font-medium text-gray-900">
                      {checkoutTypeLabel}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* History */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-6">
                <FaHistory className="text-lg" /> ประวัติการเปลี่ยนแปลง
              </h3>

              <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
                <div className="relative pl-6">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 bg-green-500 rounded-full ring-4 ring-green-100"></div>
                  <p className="font-bold text-sm text-gray-800">
                    สถานะปัจจุบัน: {STATUS_LABELS[order.status] || order.status}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    อัพเดท วันนี้ , {orderTime} โดย ระบบ
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-6">
              <div className="bg-[#3B82F6] text-white px-5 py-3 flex items-center gap-2">
                <Users className="text-lg" />
                <h3 className="font-bold text-sm">ข้อมูลผู้รับ</h3>
              </div>

              <div className="p-5 flex flex-col gap-5 ">
                <div>
                  <p className="text-xs text-gray-500 font-normal mb-2 block ">
                    ชื่อผู้สั่งซื้อ
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-black">
                      <FiUser />
                    </div>
                    <p className="font-bold text-sm text-gray-900">
                      {recipientName}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 font-normal mb-2 block">
                    เบอร์โทรศัพท์
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-black">
                      <FiPhone />
                    </div>
                    <p className="font-bold text-sm text-gray-900">
                      {recipientPhone}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 font-normal mb-2 block justify-between">
                    ที่อยู่สำหรับการจัดส่ง
                  </p>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-black shrink-0">
                      <FiMapPin />
                    </div>
                    <div className="font-sans text-sm text-black leading-relaxed">
                      {deliveryAddress.streetAddress}
                      {deliveryAddress.subdistrict && (
                        <>
                          <br />
                          {deliveryAddress.subdistrict} {deliveryAddress.district}
                        </>
                      )}
                      {deliveryAddress.province && (
                        <>
                          <br />
                          {deliveryAddress.province} {deliveryAddress.zipcode}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
