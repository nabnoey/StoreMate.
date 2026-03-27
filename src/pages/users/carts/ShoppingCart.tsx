import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import {
  deleteCartItemThunk,
  incrementCartItemThunk,
  decrementCartItemThunk,
  fetchCartThunk,
} from "../../../redux/carts/CartReducer";

import { Icon } from "@iconify/react";
import { toast } from "react-hot-toast";
import Loading from "../../../components/loading/Loading";
import type { CartItem } from "../../../types/cartItem";

const ShoppingCart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { items: cartItems = [], status: cartStatus } = useSelector(
    (state: RootState) => state.carts,
  );

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    dispatch(fetchCartThunk());
  }, [dispatch]);

  const enrichedCartItems = cartItems.map((item: CartItem) => ({
    ...item,
    product: {
      id: item.productId,
      productName: item.productName,
      price: item.price,
      imageUrl: item.imageUrl,
      stockQuantity: item.stockQuantity,
    },
  }));

  const isAllSelected =
    enrichedCartItems.length > 0 &&
    selectedItems.length === enrichedCartItems.length;

  const toggleSelect = (productId: number) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(enrichedCartItems.map((item) => item.productId));
    }
  };

  const selectedCartItems = enrichedCartItems.filter((item) =>
    selectedItems.includes(item.productId),
  );

  const subtotal = selectedCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const handleRemoveItem = (productId: number, quantity: number) => {
    if (quantity === 1) {
      toast(
        (t) => (
          <div className="flex flex-col gap-3 items-center p-2">
            <span className="text-gray-800 font-medium text-base">
              คุณต้องการลบสินค้านี้ใช่หรือไม่?
            </span>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => {
                  toast.dismiss(t.id);

                  dispatch(deleteCartItemThunk(productId));
                  setSelectedItems((prev) =>
                    prev.filter((id) => id !== productId),
                  );

                  toast.success("ลบสินค้าแล้ว");
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                ลบ
              </button>

              <button
                onClick={() => toast.dismiss(t.id)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        ),
        {
          duration: Infinity,
          position: "top-center",
        },
      );

      return;
    }

    dispatch(deleteCartItemThunk(productId));
    setSelectedItems((prev) => prev.filter((id) => id !== productId));
    toast.success("ลบออกจากตะกร้าแล้ว");
  };
  const handleRemoveSelected = () => {
    if (selectedItems.length === 0) return;
    selectedItems.forEach((id) => dispatch(deleteCartItemThunk(id)));
    setSelectedItems([]);
    toast.success("ลบสินค้าที่เลือกออกจากตะกร้าแล้ว");
  };

  if (cartStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-6 sm:py-12 px-4 font-anuphan">
      <nav className="flex flex-wrap items-center text-md text-black mb-6 md:mb-8 font-medium ml-4 md:ml-10 lg:ml-20 py-1">
        <Link
          data-test="click-home"
          to="/"
          className="transition-colors hover:text-blue-500"
        >
          หน้าหลัก
        </Link>
        <Icon
          icon="material-symbols:chevron-right-rounded"
          className="w-5 h-5 mx-1 text-black"
        />
        <span className="text-black">รถเข็น</span>
      </nav>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden p-4 sm:p-8 md:p-12">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Icon
              icon="lucide:shopping-cart"
              className="w-7 h-7 sm:w-8 sm:h-8 text-black"
            />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              รถเข็น
            </h1>
          </div>

          {enrichedCartItems.length > 0 ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-md sm:text-xl font-bold text-gray-700">
                  สินค้าในตะกร้า
                </span>
                <button
                  onClick={handleRemoveSelected}
                  disabled={selectedItems.length === 0}
                  className="text-md text-black hover:text-red-500 transition-colors"
                >
                  ลบออกทั้งหมด
                </button>
              </div>

              {enrichedCartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 py-4 border-b border-gray-50 last:border-0"
                >
                  {/* โซนซ้าย: Checkbox + รูปภาพ + ชื่อสินค้า */}
                  <div className="flex items-start md:items-center gap-3 w-full md:w-auto md:flex-1">
                    <div className="flex items-center pt-2 md:pt-0">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(
                          item.productId,
                          item.stockQuantity,
                        )}
                        onChange={() => toggleSelect(item.productId)}
                        className="w-5 h-5 appearance-none rounded-full border border-gray-300 cursor-pointer checked:bg-blue-500 checked:border-blue-500"
                      />
                    </div>

                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden not-last:p-1 flex-shrink-0">
                      <img
                        src={item.product.imageUrl || ""}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0 px-2">
                      <h3 className="text-md font-medium text-gray-800 leading-snug mb-2 line-clamp-2">
                        {item.product.productName}
                      </h3>

                      <span
                        className={`text-[10px] px-2 py-1 rounded-md font-md inline-block ${
                          Number(item.product.stockQuantity) > 0 ||
                          item.quantity > 0
                            ? "bg-green-50 text-green-500"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {Number(item.product.stockQuantity) > 0 ||
                        item.quantity > 0
                          ? "พร้อมจำหน่าย"
                          : "ไม่พร้อมจำหน่าย"}
                      </span>
                    </div>

                    {/* ปุ่มลบสำหรับ Mobile (โชว์เฉพาะหน้าจอเล็ก ขวาบน) */}
                    <button
                      onClick={() =>
                        handleRemoveItem(item.productId, item.quantity)
                      }
                      className="md:hidden text-gray-400 hover:text-red-500 p-2 cursor-pointer"
                    >
                      <Icon icon="lucide:trash-2" width="18" height="18" />
                    </button>
                  </div>

                  {/* โซนขวา: ราคา + ปุ่มเพิ่มลด + ราคารวม */}
                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto pl-8 md:pl-0 gap-4">
                    {/* ราคาต่อชิ้น (ซ่อนในมือถือ หรือจัดวางใหม่) */}
                    <div className="hidden md:block text-md font-medium text-black w-20 text-center">
                      ฿ {item.product.price}
                    </div>

                    <div className="flex items-center border border-gray-200 rounded-md h-9 bg-white overflow-hidden flex-shrink-0">
                      <button
                        data-test="decrease-product"
                        onClick={() => {
                          if (item.quantity === 1) {
                            handleRemoveItem(item.productId, item.quantity);
                            return;
                          }

                          dispatch(decrementCartItemThunk(item.productId));
                        }}
                        className="px-2 text-black flex items-center justify-center h-full cursor-pointer hover:bg-gray-50"
                      >
                        <Icon icon="lucide:minus" width="14" height="14" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-black">
                        {item.quantity}
                      </span>
                      <button
                        data-test="increase-product"
                        onClick={() =>
                          dispatch(incrementCartItemThunk(item.productId))
                        }
                        disabled={item.quantity >= item.product.stockQuantity}
                        className="px-2 text-black flex items-center justify-center h-full cursor-pointer hover:bg-gray-50"
                      >
                        <Icon icon="lucide:plus" width="14" height="14" />
                      </button>
                    </div>

                    <div className="text-blue-500 font-md w-20 md:w-24 text-right md:text-center">
                      ฿ {(item.product.price * item.quantity).toLocaleString()}
                    </div>

                    {/* ปุ่มลบสำหรับ Desktop */}
                    <button
                      data-test="btn-remove-item"
                      onClick={() =>
                        handleRemoveItem(item.productId, item.quantity)
                      }
                      className="hidden md:block text-black hover:text-red-500 p-2 cursor-pointer"
                    >
                      <Icon icon="lucide:trash-2" width="18" height="18" />
                    </button>
                  </div>
                </div>
              ))}

              {/* ส่วนสรุปยอดและสั่งซื้อ */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pt-8 border-t border-gray-300 gap-6">
                <div className="flex items-center gap-3">
                  <input
                    data-test="radio-all-product"
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 appearance-none rounded-full border border-gray-300 cursor-pointer checked:bg-blue-500 checked:border-blue-500"
                  />
                  <span className="text-md text-black font-normal">
                    เลือกทั้งหมด
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 w-full lg:w-auto">
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 text-gray-700 font-medium">
                    <span className="text-md text-gray-700 font-medium text-lg sm:text-base">
                      รวม ( {selectedItems.length} ) สินค้า
                    </span>
                    <span className="text-blue-500 font-md text-xl sm:text-lg">
                      ฿ {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <button
                    data-test="btn-payment"
                    disabled={selectedItems.length === 0}
                    onClick={() =>
                      navigate("/payment", {
                        state: { items: selectedCartItems, total: subtotal },
                      })
                    }
                    className="w-full sm:w-auto bg-[#4a89f3] text-white px-8 py-3 sm:py-2.5 rounded-lg font-bold hover:bg-blue-600 disabled:bg-gray-200 transition-all shadow-sm cursor-pointer"
                  >
                    สั่งซื้อสินค้า
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 sm:py-28">
              <Icon
                icon="lucide:shopping-cart"
                className="w-32 h-32 sm:w-40 sm:h-40 text-gray-200 mb-6"
              />
              <p className="text-base sm:text-lg font-medium text-gray-500 mb-6">
                ไม่มีสินค้าในตะกร้า
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-[#4a89f3] hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors text-sm shadow-sm cursor-pointer"
              >
                เลือกซื้อสินค้า{" "}
                <Icon icon="lucide:arrow-right" className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
