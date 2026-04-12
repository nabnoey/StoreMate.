import type { Order } from "../../types/order";

const OrderCard = ({ order }: { order: Order }) => {
  return (
    <div className="bg-white border p-4 mb-4">
      <div className="flex justify-between border-b pb-2">
        <span>{order.shopName}</span>
        <span>{order.statusPayment}</span>
      </div>

      {order.items.map((item) => (
        <div key={item.productId} className="flex gap-3 py-3">
          <img
            src={item.productDetail?.imageUrl}
            className="w-20 h-20"
          />
          <div>
            <p>{item.productDetail?.productName}</p>
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