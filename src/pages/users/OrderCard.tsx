import type { Order } from "../../types/orders";

const OrderCard = ({ order }: { order: Order }) => {
  return (
    <div className="bg-white border p-4 mb-4">
      <div className="flex justify-between border-b pb-2">
        <span>{order.orderNo}</span>
        <span>{order.statusDelivery}</span>
      </div>

      {order.orderItems?.map((item) => (
        <div key={item.id} className="flex gap-3 py-3">
          <img
            src={item.imageUrl}
            className="w-20 h-20"
          />
          <div>
            <p>{item.productName}</p>
            <p>x{item.quantity}</p>
          </div>
        </div>
      ))}

      <div className="text-right mt-2">
        {order.totalPrice}฿
      </div>
    </div>
  );
};

export default OrderCard;