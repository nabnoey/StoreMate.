import { useState } from "react";
import { Icon } from "@iconify/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import type { RootState, AppDispatch } from "../../../redux/store";
import type { CartItem } from "../../../types/cartItem";
import {
  decrementCartItemThunk,
  incrementCartItemThunk,
} from "../../../redux/carts/CartReducer";
import { toast } from "react-hot-toast";

const PaymentShoping = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [savedCards, setSavedCards] = useState([
    {
      id: "card_1",
      brand: "mastercard",
      bankName: "ธนาคารกสิกรไทย",
      last4: "8888",
    },
    // { id: "card_2", brand: "visa", bankName: "ธนาคารไทยพาณิชย์", last4: "1234" }
  ]);
  const [selectedCardId, setSelectedCardId] = useState("card_1");
  const navigate = useNavigate();

  const cartItems = useSelector(
    (state: RootState) => (state.carts.items as CartItem[]) || [],
  );
  const addresses = useSelector(
    (state: RootState) => state.address.address || [],
  );
  const defaultAddress =
    addresses.find((addr) => addr.isDefault) || addresses[0];

  const [paymentMethod, setPaymentMethod] = useState<string>("qr");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 0 ? 14.0 : 0.0;
  const totalPrice = subtotal + shipping;

  const handleConfirmOrder = async () => {
    // Alternate Flow 6.1: ไม่ได้เลือกช่องทางการชำระเงิน (และเช็กเงื่อนไขพื้นฐานอื่นๆ)
    if (cartItems.length === 0) {
      toast.error("ไม่มีสินค้าในตะกร้า");
      return;
    }
    if (!defaultAddress) {
      toast.error("กรุณาเพิ่มที่อยู่ในการจัดส่ง");
      return;
    }
    if (!paymentMethod) {
      toast.error("กรุณาเลือกช่องทางการชำระเงิน");
      return;
    }

    try {
      // โชว์ Loading toast ระหว่างรอ API
      const loadingToastId = toast.loading(
        "กำลังตรวจสอบสต็อกและสร้างคำสั่งซื้อ...",
      );

      // [TODO]: Main Flow 8-9: ยิง API ไปยัง Backend เพื่อ:
      // 1. ตรวจสอบความถูกต้องของสินค้าและสต็อกล่าสุด
      // 2. สร้างและบันทึกข้อมูลคำสั่งซื้อ
      /* const payload = {
        items: cartItems,
        addressId: defaultAddress.id,
        paymentMethod: paymentMethod,
        totalPrice: totalPrice,
      };
      const response = await createOrder(payload).unwrap(); 
      const newOrderId = response.orderId;
      */

      // สมมติว่าได้ orderId กลับมาจาก API
      const mockOrderId = "ORD-123456789";

      toast.dismiss(loadingToastId);

      // ชำระเงิน
      if (paymentMethod === "cod") {
        toast.success(
          `สั่งซื้อสำเร็จ! ยอดรวม ${totalPrice.toLocaleString()} บาท`,
        );

        navigate(`/order-success?id=${mockOrderId}`);
      } else if (paymentMethod === "qr" || paymentMethod === "credit") {
        toast.success("สร้างคำสั่งซื้อสำเร็จ กำลังพาท่านไปชำระเงิน...");

        navigate(`/payment-gateway/${mockOrderId}`);
      }
    } catch (error: any) {
      if (error?.status === "OUT_OF_STOCK") {
        toast.error("สินค้าในรถเข็นหมดหรือมีไม่เพียงพอ กรุณากลับไปแก้ไขจำนวน");
        navigate("/shopping-cart");
      } else {
        toast.error("เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] lg:bg-white pb-24 lg:pb-0 py-0 lg:py-8 px-0 lg:px-4 font-anuphan text-gray-800">
      <nav className="hidden lg:flex flex-wrap items-center mt-4 md:mt-6 text-md text-black mb-6 md:mb-8 font-medium ml-4 md:ml-10 lg:ml-20 py-1">
        <Link
          data-test="click-home"
          to="/"
          className="cursor-pointer transition-colors hover:text-blue-500"
        >
          หน้าหลัก
        </Link>
        <Icon
          icon="material-symbols:chevron-right-rounded"
          className="w-5 h-5 mx-1 text-black"
        />
        <Link
          data-test="click-home"
          to="/shopping-cart"
          className="cursor-pointer transition-colors hover:text-blue-500"
        >
          รถเข็น
        </Link>
        <Icon
          icon="material-symbols:chevron-right-rounded"
          className="w-5 h-5 mx-1 text-black"
        />
        <span data-test="current-page" className="cursor-pointer text-black">
          สรุปคำสั่งซื้อ
        </span>
      </nav>

      {/* Mobile (แสดงเฉพาะบนมือถือ) */}
      <div className="lg:hidden flex items-center bg-white p-4 shadow-sm sticky top-0 z-30">
        <Icon
          icon="lucide:arrow-left"
          className="w-6 h-6 mr-3 text-black cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <span className="text-lg font-bold text-black">ทำการสั่งซื้อ</span>
      </div>

      <div className="max-w-[1000px] mx-auto bg-transparent lg:bg-white lg:rounded-xl lg:shadow-sm lg:border lg:border-gray-200 overflow-hidden">
        <div className="p-0 lg:p-10">
          <div className="hidden lg:flex items-center gap-3 mb-6 sm:mb-10 pb-4 sm:pb-6">
            <Icon
              icon="fa7-solid:shopping-cart"
              className="w-9 h-9 sm:w-9 sm:h-9 text-black"
            />
            <h1 className="text-accent sm:text-2xl font-semibold text-black">
              สรุปคำสั่งซื้อ
            </h1>
          </div>

          <div className="hidden lg:block -mt-8 mb-8 sm:mb-10">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
              ที่อยู่ในการจัดส่ง
            </h2>
            <div className="-mt-4 mb-4 flex flex-col sm:flex-row justify-between items-start gap-3 py-2 border-b border-[#D1D5DB]">
              <div className="text-sm text-[#7E7E7E] leading-relaxed">
                {defaultAddress ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-md text-black">
                        {defaultAddress.fullName}
                      </span>
                      <span className="text-[#7E7E7E]">
                        {defaultAddress.addressLine} ต.
                        {defaultAddress.subDistrict} อ.{defaultAddress.district}{" "}
                        จ.{defaultAddress.province} {defaultAddress.zipcode}
                      </span>
                      {defaultAddress.isDefault && (
                        <span className="flex items-center justify-center w-[84px] h-[23px] px-[10px] gap-[10px] border border-blue-500 text-blue-500 text-sm rounded-[3px] cursor-pointer hover:bg-blue-50 transition-colors">
                          ค่าเริ่มต้น
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-red-500 font-medium">
                    ยังไม่มีข้อมูลที่อยู่
                  </span>
                )}
              </div>
              <button
                onClick={() => navigate("/address-profile")}
                className="flex items-center justify-center w-[84px] h-[23px] px-[10px] gap-[10px] border border-blue-500 text-blue-500 text-sm rounded-[3px] cursor-pointer hover:bg-blue-50 transition-colors"
              >
                เปลี่ยน
              </button>
            </div>
          </div>

          {/* ที่อยู่ Mobile  */}
          <div
            onClick={() => navigate("/address-profile")}
            className="lg:hidden bg-white p-4 mb-2 flex flex-col gap-2 cursor-pointer shadow-sm relative"
          >
            <div className="flex items-center text-black mb-1">
              <Icon icon="lucide:map-pin" className="w-5 h-5 mr-2" />
              <span className="font-bold text-sm">ที่อยู่ในการจัดส่ง</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 pr-4">
                {defaultAddress ? (
                  <>
                    <div className="font-bold text-black mb-1">
                      {defaultAddress.fullName}
                    </div>
                    <div className="line-clamp-2 text-xs text-gray-500">
                      {defaultAddress.addressLine} ต.
                      {defaultAddress.subDistrict} อ.{defaultAddress.district}{" "}
                      จ.{defaultAddress.province} {defaultAddress.zipcode}
                    </div>
                  </>
                ) : (
                  <span className="text-red-500">
                    กรุณาเพิ่มที่อยู่ในการจัดส่ง
                  </span>
                )}
              </div>
              <Icon
                icon="lucide:chevron-right"
                className="w-5 h-5 text-gray-400 flex-shrink-0"
              />
            </div>
            {/* เส้นขอบลาย Shopee */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[3px] opacity-60"
              style={{
                backgroundSize: "60px 3px",
                backgroundImage:
                  "repeating-linear-gradient(45deg, #FF6B6B 0, #FF6B6B 15px, transparent 0, transparent 20px, #4D96FF 0, #4D96FF 35px, transparent 0, transparent 40px)",
              }}
            ></div>
          </div>

          <div className="mb-2 lg:mb-12 flex justify-center items-center lg:pb-4 border-b-0 lg:border-b border-[#D1D5DB] bg-white lg:bg-transparent p-4 lg:p-0 shadow-sm lg:shadow-none">
            <div className="flex flex-col w-full lg:w-[1072px] lg:h-[223px] p-0 lg:p-[16px] gap-4 lg:gap-[6px] overflow-y-auto">
              {/* Header สินค้าบนมือถือ (Shopee style) */}
              <div className="lg:hidden flex items-center gap-2 pb-2 border-b border-gray-100">
                <Icon
                  icon="lucide:shopping-bag"
                  className="w-4 h-4 text-gray-600"
                />
                <span className="text-sm font-bold text-gray-900">
                  รายการสินค้า
                </span>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-row items-start lg:items-center gap-3 lg:gap-6 border-b border-gray-100 lg:border-0 pb-4 lg:pb-0 flex-shrink-0 last:border-0 last:pb-0"
                >
                  <div className="flex items-start lg:items-center gap-3 w-full lg:flex-1">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg border border-gray-100 p-1.5 flex-shrink-0 shadow-sm flex items-center justify-center">
                      <img
                        src={item.imageUrl || ""}
                        alt={item.productName}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    {/* ข้อมูลสินค้า (ปรับให้รองรับการแสดงผลจัดวางต่างกันบน Mobile/Desktop) */}
                    <div className="flex flex-col flex-1 h-20 sm:h-24 justify-between lg:justify-center">
                      <h3 className="text-sm lg:text-md font-bold text-black leading-snug line-clamp-2 lg:line-clamp-3">
                        {item.productName}
                      </h3>
                      {/* ส่วนราคาบนมือถือ (Shopee Style) ซ่อนบน Desktop */}
                      <div className="flex lg:hidden items-end justify-between w-full mt-auto">
                        <span className="text-blue-500 font-bold text-sm">
                          ฿ {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ราคาตามโค้ด Desktop เดิม (ซ่อนบนมือถือ) */}
                  <div className="hidden lg:flex items-center justify-between w-full md:w-auto gap-4 md:gap-10">
                    <div className="hidden lg:block text-sm font-medium text-black w-16 text-center">
                      ฿ {item.price.toLocaleString()}
                    </div>
                    <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden h-8 flex-shrink-0">
                      <button
                        onClick={() =>
                          dispatch(decrementCartItemThunk(item.productId))
                        }
                        className="px-3 hover:bg-gray-50 text-gray-500 border-r border-gray-300 h-full transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-bold min-w-[30px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(incrementCartItemThunk(item.productId))
                        }
                        className="px-3 hover:bg-gray-50 text-gray-500 border-l border-gray-300 h-full transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-blue-500 font-md text-md w-24 text-right">
                      ฿ {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 lg:p-0 shadow-sm lg:shadow-none mb-4 lg:mb-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px] w-full lg:w-[963px] lg:h-[367px] mx-auto">
              <div className="order-2 lg:order-1 space-y-4">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-6">
                  เลือกช่องทางการชำระเงิน
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      id: "qr",
                      title: "พร้อมเพย์ (PromptPay)",
                      desc: "สแกน QR Code เพื่อชำระเงินทันที",
                      icon: "lucide:qr-code",
                    },
                    {
                      id: "credit",
                      title: "บัตรเครดิต / บัตรเดบิต",
                      desc: "Visa , Mastercard",
                      icon: "lucide:credit-card",
                    },
                    {
                      id: "cod",
                      title: "เก็บเงินปลายทาง (Cash on Delivery)",
                      desc: "ชำระเงินเมื่อได้รับสินค้า",
                      icon: "lucide:truck",
                    },
                  ].map((method) => (
                    <div key={method.id} className="space-y-2">
                      <div
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-xl cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? "border-black border-[1.5px] bg-[#EAEAEA] shadow-sm lg:bg-[#EAEAEA]"
                            : "border-gray-200 hover:border-gray-400 bg-white"
                        }`}
                      >
                        <div className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded flex-shrink-0 text-gray-700">
                          <Icon icon={method.icon} className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-xs sm:text-sm text-gray-900">
                            {method.title}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                            {method.desc}
                          </p>
                        </div>
                        {paymentMethod === method.id && (
                          <div className="text-black flex-shrink-0">
                            <Icon
                              icon="lucide:check-circle"
                              className="w-5 h-5"
                            />
                          </div>
                        )}
                      </div>

                      {method.id === "credit" && paymentMethod === "credit" && (
                        <div className="ml-0 sm:ml-12 mt-3 space-y-3">
                          {/* ลิสต์บัตรที่บันทึกไว้ */}
                          {savedCards.map((card) => (
                            <div
                              key={card.id}
                              onClick={() => setSelectedCardId(card.id)}
                              className="flex items-center gap-3 cursor-pointer"
                            >
                              {/* Radio Button Custom */}
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${selectedCardId === card.id ? "border-blue-500" : "border-gray-400"}`}
                              >
                                {selectedCardId === card.id && (
                                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                                )}
                              </div>

                              {/* กรอบไอคอนบัตร */}
                              <div className="w-12 h-8 border border-gray-300 rounded flex items-center justify-center bg-white">
                                {card.brand === "mastercard" ? (
                                  <Icon
                                    icon="logos:mastercard"
                                    className="text-xl"
                                  />
                                ) : (
                                  <Icon icon="logos:visa" className="text-xl" />
                                )}
                              </div>

                              {/* ชื่อธนาคารและเลขบัตร */}
                              <span className="text-sm text-black">
                                {card.bankName}
                              </span>
                              <span className="text-sm text-black font-mono ml-2">
                                **** {card.last4}
                              </span>
                            </div>
                          ))}

                          {/* ปุ่มเพิ่มบัตรเครดิต/เดบิต */}
                          <div
                            data-test="click-add-credit-card"
                            onClick={() => navigate("/add-credit-card")}
                            className="cursor-pointer flex items-center w-fit px-3 py-1.5 gap-2 mt-2 border border-black rounded-md cursor-pointer hover:bg-gray-50 transition-all bg-white ml-7"
                          >
                            <Icon
                              icon="lucide:plus"
                              className="w-3.5 h-3.5 text-black"
                              style={{ strokeWidth: 3 }}
                            />
                            <p className="font-medium text-xs text-black">
                              เพิ่มบัตรเครดิต/เดบิต
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 4.1 สรุปยอด Desktop (ตามโค้ดเดิมเป๊ะ ซ่อนบนมือถือ) */}
              <div className="hidden lg:flex order-1 lg:order-2 flex-col items-start lg:items-center mt-20 lg:mt-32 -ml-10 lg:-ml-20">
                <div
                  data-test="order-summary"
                  className="w-[330px] h-[93px] grid grid-cols-2 grid-rows-3 gap-x-[50px] gap-y-[6px] items-center text-sm"
                >
                  <span className="font-medium text-md text-black text-left">
                    รวมการสั่งซื้อ
                  </span>
                  <span className="font-medium text-md text-black text-right">
                    ฿ {subtotal.toLocaleString()}
                  </span>

                  <span className="font-medium text-md text-black text-left">
                    ยอดชำระทั้งหมด
                  </span>
                  <span className="font-medium text-md text-black text-right">
                    ฿ {subtotal.toLocaleString()}
                  </span>

                  <button
                    data-test="click-confirm-payment"
                    onClick={handleConfirmOrder}
                    className="cursor-pointer col-start-2 row-start-3 justify-self-end flex items-center justify-center w-[146px] h-[29px] p-[10px] gap-[10px] bg-blue-500 active:scale-[0.98] text-white rounded-[7px] transition-all shadow-md text-md"
                  >
                    ยืนยันการชำระเงิน
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4.2 แถบสั่งซื้อด้านล่าง Mobile (Shopee Sticky Bottom Bar แสดงเฉพาะมือถือ) */}
      <div
        data-test="mobile-order-summary"
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-between z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]"
      >
        <div
          data-test="order-total"
          className="flex flex-col px-4 flex-1 text-right pr-4 pb-1"
        >
          <span className="text-[11px] text-gray-500 mt-1">ยอดชำระทั้งหมด</span>
          <span className="text-lg font-bold text-blue-500 leading-none mt-0.5">
            ฿ {subtotal.toLocaleString()}
          </span>
        </div>
        <button
          data-test="click-confirm-payment-mobile"
          onClick={handleConfirmOrder}
          className="cursor-pointer bg-blue-500 active:bg-blue-600 text-white h-[60px] px-8 font-bold text-sm transition-colors flex-shrink-0"
        >
          สั่งซื้อสินค้า
        </button>
      </div>
    </div>
  );
};

export default PaymentShoping;
