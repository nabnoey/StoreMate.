import type { Order, OrderItem } from "../../types/orders";

type Props = {
  order: Order;
};

const OrderCard = ({ order }: Props) => {
  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-sm mb-4 overflow-hidden">
      {/* ส่วนบน: ข้อมูลคำสั่งซื้อ */}
      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100">
        <div>
          <p className="text-gray-500 text-sm mb-1">เลขที่คำสั่งซื้อ</p>
          <p className="font-medium text-gray-800">{order.id}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm mb-1">วันที่สั่งซื้อ</p>
          <p className="font-medium text-gray-800">15 มีนาคม 2567</p> {/* หรือใช้ order.date ถ้ามี */}
        </div>
        <div>
          <p className="text-gray-500 text-sm mb-1">สถานะ</p>
          <p className="font-medium text-gray-800">{order.status}</p>
        </div>
      </div>

      {/* ส่วนกลาง: รายการสินค้า */}
      <div className="px-4 sm:px-6">
        {order.orderItems.map((item:OrderItem) => (
          <div key={item.id} className="flex gap-6 py-6 border-b border-gray-100 last:border-b-0">
            <div className="w-24 h-24 flex-shrink-0 border border-gray-100 rounded-md overflow-hidden bg-gray-50">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain p-1" />
              )}
            </div>
            <div className="flex-1 flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  {item.productName || "กำลังโหลด..."}
                </h3>
                <p className="text-gray-600 text-sm font-medium">ราคาต่อหน่วย ฿ {item.price?.toLocaleString()}</p>
                <p className="text-gray-600 text-sm">จำนวน x {item.quantity}</p>
              </div>
              <div className="text-[#3b82f6] font-bold text-xl">
                ฿ {item.subTotal?.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ส่วนล่าง: สรุปการเงินและปุ่ม */}
      <div className="bg-gray-50/50 p-4 sm:p-6 border-t border-gray-100">
        <h4 className="font-bold text-lg mb-4 text-gray-800">การชำระเงิน</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">วิธีการชำระเงิน</span>
            <span className="text-gray-800">บัตรเครดิต / เดบิต</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span className="text-lg font-bold text-gray-900">ยอดรวมสุทธิ</span>
            <span className="text-2xl font-bold text-[#3b82f6]">฿ {order.totalPrice.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="bg-[#4285f4] hover:bg-blue-600 text-white px-8 py-2 rounded-md text-sm font-medium transition-all">ซื้ออีกครั้ง</button>
          <button className="bg-[#1a3a8a] hover:bg-blue-900 text-white px-8 py-2 rounded-md text-sm font-medium transition-all">เขียนรีวิว</button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;