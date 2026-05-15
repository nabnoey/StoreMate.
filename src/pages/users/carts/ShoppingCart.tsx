import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import {
  deleteCartItemThunk,
  incrementCartItemThunk,
  decrementCartItemThunk,
  fetchCartThunk,
  setSelectedItems as setReduxSelectedItems,
} from "../../../redux/carts/CartReducer";

import { Icon } from "@iconify/react";
import { type Toast, toast } from "react-hot-toast";
import Loading from "../../../components/loading/Loading";
import type { CartItem } from "../../../types/cartItem";

interface ConfirmToastProps {
  t: Toast;
  message: string;
  onResolve: (value: boolean) => void;
  setIsBlocking: (value: boolean) => void;
}

const ConfirmToastUI = ({
  t,
  message,
  onResolve,
  setIsBlocking,
}: ConfirmToastProps) => {
  const handleConfirm = () => {
    toast.dismiss(t.id);
    setIsBlocking(false);
    onResolve(true);
  };

  const handleCancel = () => {
    toast.dismiss(t.id);
    setIsBlocking(false);
    onResolve(false);
  };

  return (
    <div className="flex flex-col gap-3 items-center p-2">
      <span className="text-gray-800 font-medium text-base">{message}</span>
      <div className="flex gap-3 mt-2">
        <button
          onClick={handleConfirm}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          ยืนยัน
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
};

const ShoppingCart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { items: cartItems = [], status: cartStatus } = useSelector(
    (state: RootState) => state.carts,
  );

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isBlocking, setIsBlocking] = useState(false);

  useEffect(() => {
    dispatch(fetchCartThunk());
  }, [dispatch]);

  const enrichedCartItems = useMemo(() => {
    return cartItems.map((item: CartItem) => {
      const isAvailable = item.productStatus === "ACTIVE";
      return {
        ...item,
        isAvailable,
        product: {
          id: item.productId,
          productName: item.productName,
          price: item.price,
          imageUrl: item.imageUrl,
          stockQuantity: item.stockQuantity,
          productStatus: item.productStatus,
        },
      };
    });
  }, [cartItems]);

  // เอาไว้กรองสินค้าที่มีสถานะ พร้อมจำหน่าย
  const availableItems = useMemo(
    () => enrichedCartItems.filter((item) => item.isAvailable),
    [enrichedCartItems],
  );

  const isAllSelected = useMemo(() => {
    return (
      availableItems.length > 0 &&
      selectedItems.length === availableItems.length
    );
  }, [availableItems.length, selectedItems.length]);

  const selectedCartItems = useMemo(() => {
    return enrichedCartItems
      .filter((item) => selectedItems.includes(item.productId))
      .map((item) => ({ ...item, cartItemId: item.cartItemId }));
  }, [enrichedCartItems, selectedItems]);

  const subtotal = useMemo(() => {
    return selectedCartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
  }, [selectedCartItems]);

  const confirmAction = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setIsBlocking(true);
      toast(
        (t) => (
          <ConfirmToastUI
            t={t}
            message={message}
            onResolve={resolve}
            setIsBlocking={setIsBlocking}
          />
        ),
        { duration: Infinity, position: "top-center" },
      );
    });
  }, []);

  const toggleSelect = (productId: number) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const toggleSelectAll = () => {
    setSelectedItems(
      isAllSelected ? [] : availableItems.map((item) => item.productId),
    );
  };

  const handleRemoveItem = async (productId: number) => {
    const isConfirmed = await confirmAction("คุณต้องการลบสินค้านี้ใช่หรือไม่?");
    if (!isConfirmed) return;

    dispatch(deleteCartItemThunk(productId));
    setSelectedItems((prev) => prev.filter((id) => id !== productId));
    toast.success("ลบสินค้าแล้ว", { duration: 1500 });
  };

  const handleRemoveSelected = async () => {
    if (selectedItems.length === 0) {
      toast.error("กรุณาเลือกสินค้าก่อน");
      return;
    }

    const isConfirmed = await confirmAction(
      "คุณต้องการลบสินค้าทั้งหมดนี้ใช่หรือไม่?",
    );
    if (!isConfirmed) return;

    await Promise.all(
      selectedItems.map((id) => dispatch(deleteCartItemThunk(id))),
    );

    setSelectedItems([]);
    toast.success("ลบสินค้าสำเร็จ", { duration: 1500 });
  };

  const handleIncreaseQuantity = (
    productId: number,
    currentQuantity: number,
    stockQuantity: number,
  ) => {
    if (currentQuantity >= stockQuantity) {
      toast.error("จำนวนสินค้าในสต๊อกไม่เพียงพอ");
      return;
    }
    dispatch(incrementCartItemThunk(productId));
  };

  const handleDecreaseQuantity = (
    productId: number,
    currentQuantity: number,
  ) => {
    if (currentQuantity === 1) {
    } else {
      dispatch(decrementCartItemThunk(productId));
    }
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
          className="transition-colors cursor-pointer"
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
          <div className="mb-6 md:mb-10">
            <div className="flex items-center gap-3">
              <Icon
                icon="lucide:shopping-cart"
                className="w-7 h-7 sm:w-8 sm:h-8 text-black"
              />
              <h1 className="text-2xl sm:text-[36px] font-bold text-black">
                รถเข็น
              </h1>
            </div>

            <p className="text-base sm:text-[20px] font-normal text-black mt-1">
              สินค้าในรถเข็น
            </p>

            <div className="hidden md:block w-full border-b border-black mt-4" />
          </div>

          {enrichedCartItems.length > 0 ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-md sm:text-xl font-bold text-gray-700">
                  สินค้าในรถเข็น
                </span>
                <button
                  onClick={() => handleRemoveSelected()}
                  className="text-md text-black hover:text-red-500 transition-colors cursor-pointer"
                >
                  ลบออกทั้งหมด
                </button>
              </div>
              <div className="max-h-[250px] overflow-y-auto mb-10 pr-2 ">
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
                          disabled={!item.isAvailable}
                          checked={selectedItems.includes(item.productId)}
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
                            item.isAvailable
                              ? "bg-green-50 text-green-500"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {item.isAvailable
                            ? "พร้อมจำหน่าย"
                            : "ไม่พร้อมจำหน่าย"}
                        </span>
                      </div>

                      {/* ปุ่มลบสำหรับ Mobile (โชว์เฉพาะหน้าจอเล็ก ขวาบน) */}
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="md:hidden text-gray-400 hover:text-red-500 p-2 cursor-pointer"
                      >
                        <Icon icon="lucide:trash-2" width="18" height="18" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto pl-8 md:pl-0 gap-4">
                      <div className="hidden md:block text-md font-medium text-black w-20 text-center">
                        ฿ {item.product.price}
                      </div>

                      <div className="flex items-center border border-gray-200 rounded-md h-9 bg-white overflow-hidden flex-shrink-0">
                        <button
                          data-test="decrease-product"
                          onClick={() =>
                            handleDecreaseQuantity(
                              item.productId,
                              item.quantity,
                            )
                          }
                          disabled={!item.isAvailable}
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
                            handleIncreaseQuantity(
                              item.productId,
                              item.quantity,
                              item.product.stockQuantity,
                            )
                          }
                          disabled={
                            !item.isAvailable ||
                            item.quantity >= item.product.stockQuantity
                          }
                          className="px-2 text-black flex items-center justify-center h-full cursor-pointer hover:bg-gray-50"
                        >
                          <Icon icon="lucide:plus" width="14" height="14" />
                        </button>
                      </div>

                      <div className="text-blue-500 font-md w-20 md:w-24 text-right md:text-center">
                        ฿{(item.product.price * item.quantity).toLocaleString()}
                      </div>

                      {/* ปุ่มลบสำหรับ Desktop */}
                      <button
                        data-test="btn-remove-item"
                        onClick={() => handleRemoveItem(item.productId)}
                        className="hidden md:block text-black hover:text-red-500 p-2 cursor-pointer"
                      >
                        <Icon icon="lucide:trash-2" width="18" height="18" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

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
                    onClick={() => {
                      dispatch(setReduxSelectedItems(selectedCartItems));
                      navigate("/payment");
                    }}
                    className="w-full sm:w-auto bg-[#4a89f3] text-white px-8 py-3 sm:py-2.5 rounded-lg font-bold hover:bg-blue-600 disabled:bg-gray-200 transition-all shadow-sm cursor-pointer"
                  >
                    สั่งซื้อสินค้า
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full min-h-[60vh] md:min-h-0 bg-white">
              {/* 🟢 ส่วนหลัก (ไอคอน + ข้อความ) */}
              <div className="flex-1 md:flex-none flex flex-col items-center justify-center py-16 sm:py-28">
                <Icon
                  icon="mdi-light:cart"
                  className="w-50 h-50 sm:w-70 sm:h-70 text-black mb-6"
                />
                <p className="text-[20px] sm:text-[30px] font-medium text-[#111827] mb-6 md:mb-6">
                  ไม่มีสินค้าในรถเข็น
                </p>

                <button
                  onClick={() => navigate("/")}
                  className="hidden md:flex bg-[#4a89f3] hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold items-center gap-2 transition-colors text-sm shadow-sm cursor-pointer"
                >
                  เลือกซื้อสินค้า
                  <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                </button>
              </div>

              <div className="md:hidden p-4 bg-white border-t border-gray-100 mt-auto">
                <button
                  onClick={() => navigate("/")}
                  className="w-full py-3 bg-[#4a89f3] hover:bg-blue-600 text-white rounded-md text-[15px] font-medium transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  เลือกซื้อสินค้า
                  <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {isBlocking && (
        <div className="fixed inset-0 bg-black/40 z-[999] pointer-events-auto" />
      )}
    </div>
  );
};

export default ShoppingCart;
