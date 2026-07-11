import type { Order } from "../../types/orders";
import { useNavigate } from "react-router-dom";

  const STATUS_LABELS: Record<string, string> = {
  PENDING: "รอชำระ",
  TO_SHIP: "ต้องจัดส่ง",
  SHIPPING: "กำลังจัดส่ง",
  COMPLETED: "สำเร็จ",
  CANCELLED: "ยกเลิก",
};
const OrderCard = ({ order }: { order: Order }) => {
  const navigate = useNavigate();

  const handleOrderClick = () => {
    navigate(`/orders/${order.orderNo}`);
  };


  return (
    <div
      onClick={handleOrderClick}
      className="bg-white border border-gray-200 p-4 mb-4 rounded-lg hover:shadow-md cursor-pointer transition-shadow"
    >

      <div className="flex justify-between border-b pb-2 mb-3">
        <span className="text-sm text-gray-600">
          {order.orderItems.length} รายการ
        </span>
        <span className="text-sm font-medium text-blue-600">  {STATUS_LABELS[order.status]}</span>
      </div>

      {order.orderItems.map((item) => (
        <div key={item.id} className="flex gap-3 py-2">
          <img
            src={item.imageUrl}
            alt={item.productName}
            className="w-16 h-16 object-cover rounded"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 line-clamp-2">
              {item.productName}
            </p>
             <p className="text-xs text-gray-500 mt-1">ราคาต่อหน่วย ฿ {item.price}</p>
            <p className="text-xs text-gray-500 mt-1">จำนวน x {item.quantity}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">
              ฿ {item.price.toLocaleString()}
            </p>
          </div>
        </div>
      ))}

  
      <div className="border-t pt-2 mt-2 text-right">
        <p className="text-sm font-bold text-gray-900">
          รวม: ฿ {(order.total).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
