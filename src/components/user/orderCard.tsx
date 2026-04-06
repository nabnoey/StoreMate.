import type { Order } from "../../types/orders";

type Props = {
  order: Order;
};

const OrderCard = ({ order }: Props) => {
  return (
    <div
      className="bg-white shadow-sm border border-gray-200 p-4 sm:p-6 mb-4"
    >
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center pb-3 border-b border-gray-100 gap-2">
        <span className="font-semibold text-black text-base">
          {order.shopName}
        </span>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-green-600 font-medium">
            {order.statusDelivery}
          </span>
          <div className="w-[1px] h-3 bg-gray-300 mx-1 hidden md:block"></div>
          <span className="text-blue-600 font-medium">
            {order.statusPayment}
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        {order.items.map((item) => (
          <div
            key={item.productId}
            className="flex gap-4 py-5 border-b border-gray-100 last:border-b-0"
          >
            {/* Product Image */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-50 border border-gray-100 rounded overflow-hidden">
              {item.productDetail?.imageUrl && (
                <img
                  src={item.productDetail.imageUrl}
                  alt={item.productDetail.sammary}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <h3 className="text-sm text-gray-800 line-clamp-2 leading-snug">
                {item.productDetail?.sammary || "กำลังโหลด..."}
              </h3>
              <div className="flex flex-col items-end w-full">
                <span className="text-gray-500 text-xs sm:text-sm">
                  x {item.quantity}
                </span>
                <span className="text-[#E53725] font-bold text-base sm:text-lg">
                  {item.productDetail?.price.toLocaleString()}฿
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 pt-4 flex flex-col items-end gap-4 border-t border-gray-50">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">รวมการสั่งซื้อ:</span>
          <span className="text-xl font-bold text-[#E53725]">
            {order.totalPrice.toLocaleString()}฿
          </span>
        </div>
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-2.5 rounded text-sm font-medium transition-colors shadow-sm"
        >
          ซื้ออีกครั้ง
        </button>
      </div>
    </div>
  );
};

export default OrderCard;