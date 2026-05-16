import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails } from "../../../redux/orders/orderReducer";
import Loading from "../../../components/loading/Loading";
import {
  FiClock,
  FiClipboard,
  FiTruck,
  FiCheckCircle,
  FiUser,
  FiPhone,
  FiMapPin,
  FiPackage,
  FiArrowLeft,
} from "react-icons/fi";
import { FaHistory } from "react-icons/fa";

import { Users } from "lucide-react";
import type { RootState, AppDispatch } from "../../../redux/store";
import type { OrderAddress } from "../../../types/orders";
import { getOrderLabel } from "../../../utils/order";

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
    <div className="flex flex-col items-center gap-2">
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
          src={image}
          alt={name}
          className="w-14 h-14 bg-gray-100 rounded-md object-cover"
        />
        <div>
          <p className="font-bold text-gray-800 text-sm">{name}</p>
          <p className="text-xs text-gray-500 mt-1">จำนวน: {quantity}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-800">฿ {price.toLocaleString()}</p>
        <p className="text-[10px] text-gray-400 font-medium">UNIT PRICE</p>
      </div>
    </div>
  );
}

function OrderDetails() {
  const { orderNo } = useParams<{ orderNo: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(true);

  const { orders } = useSelector((state: RootState) => state.orders);
  const authUser = useSelector((state: RootState) => state.auth.user);
  const order = orders.find((o) => o.orderNo === orderNo);

  useEffect(() => {
    if (orderNo) {
      dispatch(fetchOrderDetails(orderNo)).finally(() => {
        setIsLoading(false);
      });
    }
  }, [orderNo, dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">ไม่พบข้อมูลคำสั่งซื้อ</p>
          <button
            onClick={() => navigate("/orders")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            กลับไปที่คำสั่งซื้อ
          </button>
        </div>
      </div>
    );
  }

  const orderAddress = order.orderAddress?.[0]; 

  const recipientName = order.orderRecipient?.recipientName 

  const recipientPhone = order.orderRecipient?.phone || "ไม่ระบุเบอร์โทรศัพท์";

  const fallbackAddress: OrderAddress = {
    id: 0,
    streetAddress: authUser?.address ?? "ไม่ระบุที่อยู่สำหรับการจัดส่ง",
    subdistrict: "",
    district: "",
    province: "",
    zipcode: "",
  };


  const deliveryAddress = orderAddress?.streetAddress ? orderAddress : fallbackAddress;
  

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("th-TH")
    : new Date().toLocaleDateString("th-TH");


    

  const steps = [
    { icon: <FiClock />, label: "รอชำระเงิน", status: "PENDING" },
    { icon: <FiClipboard />, label: "กำลังเตรียมสินค้า", status: "PROCESSING" },
    { icon: <FiTruck />, label: "จัดส่งแล้ว", status: "RECEIVE" },
    { icon: <FiCheckCircle />, label: "สำเร็จแล้ว", status: "COMPLETED" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.status === order.status);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-start text-left w-full mt-0 lg:mt-10">
      <div className="bg-white border-b border-gray-200 w-full p-6">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="hover:opacity-70 transition-opacity text-gray-700"
            type="button"
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <div className="flex w-full items-center">
            <h1 className="text-xl font-bold text-gray-900">
              รายละเอียดคำสั่งซื้อ
            </h1>
            <p className="text-sm text-gray-500 ml-auto">
              คำสั่งซื้อ: {order.orderNo} | {order.status}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 w-full text-gray-700 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6 ">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm relative ">
              <div className="absolute top-[3rem] left-12 right-12 h-0.5 bg-[#3B82F6] z-0"></div>

              <div className="flex justify-between  items-center relative z-10 ">
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

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                <FiPackage className="text-lg" /> รายการสินค้า (
                {order.orderItems.length})
              </h3>

              {order.orderItems.map((item) => (
                <OrderItemRow
                  key={item.id}
                  image={item.imageUrl}
                  name={item.productName}
                  quantity={item.quantity}
                  price={item.price}
                />
              ))}

              <div className="flex justify-between items-end pt-2">
                <span className="text-sm font-bold text-gray-600">
                  ราคาสุทธิรวมภาษี
                </span>
                <div className="text-right">
                  <p className="text-xl font-black text-gray-900">
                    ฿ {order.total.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold">THB</p>
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
                    สถานะปัจจุบัน:{" "}
                    {getOrderLabel(
                      order.status,
                      order.checkoutType || "DESTINATION",
                    )}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    วันที่สั่งซื้อ: {orderDate}
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
                          {deliveryAddress.subdistrict}
                          {deliveryAddress.district}
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

export default OrderDetails;
