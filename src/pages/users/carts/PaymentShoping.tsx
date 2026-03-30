import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import type { RootState } from "../../../redux/store";
import { toast } from "react-hot-toast";
import type { CartItem } from "../../../types/cartItem";
import type { SavedCard } from "../../../types/payment";
import { PaymentService } from "../../../services/payment.service";

const PaymentShoping = () => {
  const location = useLocation();
  const [savedCards, setSavedCards] = useState<SavedCard[]>(() => {
    const localCards = localStorage.getItem("mockSavedCards");
    if (localCards) return JSON.parse(localCards);

    return [
      {
        id: "card_1",
        brand: "mastercard",
        bankName: "ธนาคารกสิกรไทย",
        last4: "8888",
      },
    ];
  });

  const [selectedCardId, setSelectedCardId] = useState(
    savedCards[0]?.id || "card_1",
  );

  const [paymentMethod, setPaymentMethod] = useState<string>("qr");

  useEffect(() => {
    const newCard = location.state?.newCard;
    if (newCard) {
      setSavedCards((prev) => {
        if (prev.some((c) => c.id === newCard.id)) return prev;

        const updatedCards = [...prev, newCard];
        localStorage.setItem("mockSavedCards", JSON.stringify(updatedCards));
        return updatedCards;
      });

      setSelectedCardId(newCard.id);
      setPaymentMethod("credit");
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const selectedItems: CartItem[] = location.state?.items || [];
  const navigate = useNavigate();
  const addresses = useSelector(
    (state: RootState) => state.address.address || [],
  );
  const defaultAddress =
    addresses.find((addr) => addr.isDefault) || addresses[0];

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 0 ? 14 : 0;
  const totalPrice = subtotal + shipping;

  const handleConfirmOrder = async () => {
    if (selectedItems.length === 0) {
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

    const loadingToastId = toast.loading("กำลังดำเนินการ...");

    try {
      const cartItemIds = selectedItems.map((item) => String(item.cartItemId));

      if (paymentMethod === "credit" || paymentMethod === "qr") {
        const responseData = await PaymentService.createPaymentIntent({
          ids: cartItemIds,
        });

        toast.dismiss(loadingToastId);

        if (responseData && responseData.clientSecret) {
          toast.success("กำลังพาท่านไปหน้าชำระเงิน...");
          const tempOrderId = `ORD${Date.now()}`;

          if (paymentMethod === "credit") {
            navigate("/checkout-stripe", {
              state: {
                clientSecret: responseData.clientSecret,
                paymentIntentId: responseData.paymentIntentId,
                totalPrice: totalPrice,
              },
            });
          } else if (paymentMethod === "qr") {
            navigate(`/payment-qr/${tempOrderId}`, {
              state: {
                clientSecret: responseData.clientSecret,
                totalPrice: totalPrice,
              },
            });
          }
        } else {
          toast.error("ไม่สามารถสร้างข้อมูลการชำระเงินได้");
        }
      } else if (paymentMethod === "cod") {
        toast.dismiss(loadingToastId);
        toast.success("สั่งซื้อสำเร็จ!");

        const tempOrderId = `ORD${Date.now()}`;

        navigate(`/payment/success?id=${tempOrderId}`, {
          state: { paymentMethod: "cod" },
        });
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
      console.error("Payment Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] lg:bg-white pb-[70px] lg:pb-0 font-anuphan text-gray-800 flex flex-col items-center">
      {/* --- DESKTOP BREADCRUMB --- */}
      <div className="w-[1136px] hidden lg:block">
        <nav className="flex items-center mt-10 text-md text-black mb-4 font-medium py-1">
          <Link to="/" className="hover:text-blue-500">
            หน้าหลัก
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1"
          />
          <Link to="/shopping-cart" className="hover:text-blue-500">
            รถเข็น
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1"
          />
          <span className="text-black">สรุปคำสั่งซื้อ</span>
        </nav>
      </div>

      {/* --- MOBILE HEADER --- */}
      <div className="lg:hidden w-full flex items-center bg-white p-4 shadow-sm sticky top-0 z-30">
        <Icon
          icon="lucide:arrow-left"
          className="w-6 h-6 mr-3 text-black"
          onClick={() => navigate(-1)}
        />
        <span className="text-lg font-bold text-black">ทำการสั่งซื้อ</span>
      </div>

      {/* =========================================
          DESKTOP VIEW (โครงสร้างเดิมของคุณ)
      ========================================= */}
      <div
        className="hidden lg:block bg-white border border-gray-200 shadow-sm overflow-hidden mb-19"
        style={{
          width: "1136px",
          height: "1000px",
          borderRadius: "8px",
          padding: "16px",
        }}
      >
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2 pb-4">
            <Icon
              icon="fa7-solid:shopping-cart"
              className="w-8 h-8 text-black"
            />
            <h1 className="text-2xl font-bold text-black">สรุปคำสั่งซื้อ</h1>
          </div>
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              ที่อยู่ในการจัดส่ง
            </h2>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <div className="text-sm text-gray-600">
                {defaultAddress ? (
                  <span className="flex items-center gap-2">
                    <strong className="text-black">
                      {defaultAddress.fullName}
                    </strong>
                    {defaultAddress.addressLine} ต.{defaultAddress.subDistrict}{" "}
                    อ.{defaultAddress.district} จ.{defaultAddress.province}{" "}
                    {defaultAddress.zipcode}
                  </span>
                ) : (
                  <span className="text-red-500">ยังไม่มีข้อมูลที่อยู่</span>
                )}
              </div>
              <button
                onClick={() => navigate("/address-profile")}
                className="text-blue-500 text-sm border border-blue-500 px-4 py-1 rounded-[3px] hover:bg-blue-50"
              >
                เปลี่ยน
              </button>
            </div>
          </div>
          <div className="max-h-[250px] overflow-y-auto mb-10 pr-2">
            {selectedItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-6 py-3 border-b border-[#D1D5DB] last:border-0"
              >
                <img
                  src={item.imageUrl || ""}
                  alt=""
                  className="w-16 h-16 object-contain rounded-md"
                />
                <div className="flex-1 font-bold text-sm line-clamp-1">
                  {item.productName}
                </div>
                <div className="w-24 text-center text-sm">
                  ฿ {item.price.toLocaleString()}
                </div>
                <div className="w-12 text-center text-sm">{item.quantity}</div>
                <div className="w-24 text-right text-blue-500 font-medium text-sm">
                  ฿ {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <hr className="border-t border-[#D1D5DB] mb-6" />
          <div className="flex flex-row items-start gap-[60px]">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">
                เลือกช่องทางการชำระเงิน
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  {
                    id: "qr",
                    title: "พร้อมเพย์ (PromptPay)",
                    desc: "สแกน QR Code เพื่อชำระเงินทันที",
                    icon: "lucide:wallet",
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
                  <div key={method.id} className="flex flex-col">
                    <div
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex items-center gap-4 w-[585px] h-[71px] p-[10px] rounded-[12px] border-[2px] cursor-pointer transition-all ${paymentMethod === method.id ? "border-black bg-[#EAEAEA]" : "border-gray-200 bg-white"}`}
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-lg">
                        <Icon icon={method.icon} className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-gray-900 leading-tight">
                          {method.title}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
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
                        {savedCards.map((card) => (
                          <div
                            key={card.id}
                            onClick={() => setSelectedCardId(card.id)}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${selectedCardId === card.id ? "border-blue-500" : "border-gray-400"}`}
                            >
                              {selectedCardId === card.id && (
                                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
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
                            <span className="text-sm text-black">
                              {card.bankName}
                            </span>
                            <span className="text-sm text-black font-mono ml-2">
                              **** {card.last4}
                            </span>
                          </div>
                        ))}
                        <div
                          data-test="click-add-credit-card"
                          onClick={() => navigate("/add-credit-card")}
                          className="cursor-pointer flex items-center w-fit px-3 py-1.5 gap-2 mt-2 border border-black rounded-md hover:bg-gray-50 transition-all bg-white ml-7"
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

            <div className="pt-10">
              <div className="hidden lg:flex lg:order-2 flex-col pt-[90px]">
                <div className="w-[330px] h-[93px] grid grid-cols-2 grid-rows-3 gap-y-[6px] gap-x-[50px] items-center">
                  <span className="text-sm font-medium">รวมการสั่งซื้อ</span>
                  <span className="text-md font-medium text-right">
                    ฿ {subtotal.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium">ยอดชำระทั้งหมด</span>
                  <span className="text-md font-medium text-right">
                    ฿ {totalPrice.toLocaleString()}
                  </span>
                  <div className="col-start-2 flex justify-end">
                    <button
                      onClick={handleConfirmOrder}
                      className=" cursor-pointer w-[146px] h-[29px] bg-[#4285F4] text-white rounded-[7px] text-[13px] font-medium shadow-md"
                    >
                      ยืนยันการชำระเงิน
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          MOBILE VIEW (Shopee Style)
      ========================================= */}
      <div className="w-full lg:hidden block">
        {/* 1. Address Section */}
        <div className="bg-white mb-2 pb-3 shadow-sm">
          {/* แถบสีแดงสลับน้ำเงินขอบซองจดหมาย */}
          <div
            className="h-[3px] w-full mb-3"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #FF6B6B 0, #FF6B6B 12px, transparent 12px, transparent 16px, #4DABF7 16px, #4DABF7 28px, transparent 28px, transparent 32px)",
            }}
          ></div>
          <div
            className="px-4 flex items-center justify-between cursor-pointer"
            onClick={() => navigate("/address-profile")}
          >
            <div className="flex items-start gap-3">
              <Icon
                icon="mdi:map-marker"
                className="w-[18px] h-[18px] text-blue-500 mt-0.5"
              />
              <div className="text-sm flex-1">
                {defaultAddress ? (
                  <>
                    <p className="font-semibold text-gray-800 text-[15px]">
                      ที่อยู่ในการจัดส่ง
                    </p>
                    <p className="text-gray-800 mt-1">
                      {defaultAddress.fullName} | {defaultAddress.phone}
                    </p>
                    <p className="text-gray-500 mt-0.5 line-clamp-2 leading-relaxed text-[13px]">
                      {defaultAddress.addressLine} ต.
                      {defaultAddress.subDistrict} อ.{defaultAddress.district}{" "}
                      จ.{defaultAddress.province} {defaultAddress.zipcode}
                    </p>
                  </>
                ) : (
                  <p className="text-blue-500 font-bold mt-0.5">
                    กรุณาเพิ่มที่อยู่ในการจัดส่ง
                  </p>
                )}
              </div>
            </div>
            <Icon icon="mdi:chevron-right" className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* 2. Product Section */}
        <div className="bg-white mb-2 shadow-sm">
          <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-100">
            <Icon icon="mdi:storefront" className="w-5 h-5 text-gray-700" />
            <span className="font-semibold text-sm">สินค้าที่สั่งซื้อ</span>
          </div>
          {selectedItems.map((item) => (
            <div
              key={item.productId}
              className="flex gap-3 p-4 bg-[#f9f9f9] border-b border-white last:border-none"
            >
              <img
                src={item.imageUrl || ""}
                alt=""
                className="w-[72px] h-[72px] object-cover border border-gray-200"
              />
              <div className="flex-1 flex flex-col justify-between">
                <p className="text-sm text-gray-800 line-clamp-2">
                  {item.productName}
                </p>
                <div className="flex justify-between items-end mt-2">
                  <span className="text-[15px] font-semibold text-blue-500">
                    ฿{item.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    x{item.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Payment Methods */}
        <div className="bg-white mb-2 shadow-sm">
          <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-100">
            <Icon icon="mdi:cash-multiple" className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-sm">วิธีการชำระเงิน</span>
          </div>
          <div className="flex flex-col">
            {[
              {
                id: "qr",
                title: "พร้อมเพย์ (PromptPay)",
                icon: "lucide:wallet",
              },
              {
                id: "credit",
                title: "บัตรเครดิต / บัตรเดบิต",
                icon: "lucide:credit-card",
              },
              { id: "cod", title: "เก็บเงินปลายทาง", icon: "lucide:truck" },
            ].map((method) => (
              <div
                key={method.id}
                className="border-b border-gray-100 last:border-none"
              >
                <div
                  className="px-4 py-3 flex items-center justify-between cursor-pointer"
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      icon={method.icon}
                      className="w-5 h-5 text-gray-600"
                    />
                    <span className="text-[14px] text-gray-800">
                      {method.title}
                    </span>
                  </div>
                  {paymentMethod === method.id ? (
                    <Icon
                      icon="mdi:check-circle"
                      className="w-[22px] h-[22px] text-blue-500"
                    />
                  ) : (
                    <div className="w-[20px] h-[20px] rounded-full border-2 border-gray-300"></div>
                  )}
                </div>

                {/* Nested Credit Cards for Mobile */}
                {method.id === "credit" && paymentMethod === "credit" && (
                  <div className="bg-[#fafafa] px-5 py-2 space-y-1">
                    {savedCards.map((card) => (
                      <div
                        key={card.id}
                        onClick={() => setSelectedCardId(card.id)}
                        className="flex items-center gap-3 py-2 cursor-pointer"
                      >
                        {selectedCardId === card.id ? (
                          <Icon
                            icon="mdi:radiobox-marked"
                            className="w-5 h-5 text-blue-500"
                          />
                        ) : (
                          <Icon
                            icon="mdi:radiobox-blank"
                            className="w-5 h-5 text-gray-400"
                          />
                        )}
                        <Icon
                          icon={
                            card.brand === "mastercard"
                              ? "logos:mastercard"
                              : "logos:visa"
                          }
                          className="w-7 text-xl"
                        />
                        <span className="text-[13px] text-gray-700">
                          {card.bankName} (****{card.last4})
                        </span>
                      </div>
                    ))}
                    <div
                      onClick={() => navigate("/add-credit-card")}
                      className="flex items-center gap-2 py-3 cursor-pointer text-blue-500 pl-8"
                    >
                      <Icon
                        icon="lucide:plus-circle"
                        className="w-[18px] h-[18px]"
                      />
                      <span className="text-[13px] font-medium">
                        เพิ่มบัตรใหม่
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4. Order Summary */}
        <div className="bg-white mb-2 p-4 space-y-2.5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Icon
              icon="mdi:receipt-text-outline"
              className="w-5 h-5 text-gray-600"
            />
            <span className="font-semibold text-sm">รายละเอียดการชำระเงิน</span>
          </div>
          <div className="flex justify-between text-[13px] text-gray-500">
            <span>รวมค่าสินค้า</span>
            <span>฿{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[13px] text-gray-500">
            <span>ค่าจัดส่ง</span>
            <span>฿{shipping.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm pt-3 mt-2 border-t border-gray-100">
            <span className="font-semibold text-gray-800">ยอดชำระทั้งหมด</span>
            <span className="text-lg font-bold text-blue-500">
              ฿{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* --- MOBILE FOOTER (Sticky) --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-end z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col px-4 text-right justify-center">
          <span className="text-[12px] text-gray-600 mb-0.5">
            ยอดชำระทั้งหมด
          </span>
          <span className="text-[18px] font-bold text-blue-500 leading-none">
            ฿{totalPrice.toLocaleString()}
          </span>
        </div>
        <button
          onClick={handleConfirmOrder}
          className="bg-blue-500 active:bg-blue-600 text-white h-[60px] px-8 font-bold text-sm transition-colors flex-shrink-0"
        >
          สั่งซื้อสินค้า
        </button>
      </div>
    </div>
  );
};

export default PaymentShoping;
