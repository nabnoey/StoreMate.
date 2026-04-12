import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/store";
import { toast } from "react-hot-toast";
import type { SavedCard } from "../../types/payment";
import { PaymentService } from "../../services/payment.service";
import { fetchAddressDefault } from "../../redux/address/addressReducer";
import { addSavedCard } from "../../redux/payment/PaymentReducer";

const PaymentShoping = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const { savedCards } = useSelector((state: RootState) => state.payment);
  const newlyAddedCard = location.state?.newlyAddedCard;

  const selectedItems = useSelector(
    (state: RootState) => state.carts.selectedItems,
  );

  const defaultAddress = useSelector(
    (state: RootState) =>
      state.address.defaultAddress || state.address.addresses[0],
  );

  useEffect(() => {
    dispatch(fetchAddressDefault());

    if (newlyAddedCard) {
      const cardName = newlyAddedCard.billing_details?.name || "Card";

      const formattedCard: SavedCard = {
        id: newlyAddedCard.id, // เช่น pm_xxxx
        brand: newlyAddedCard.card.brand,
        last4: newlyAddedCard.card.last4,
        bankName: `${cardName}`,
      };

      dispatch(addSavedCard(formattedCard));
    }
  }, [dispatch, newlyAddedCard]);

  const handleAddNewCard = () => {
    navigate("/add-credit-card", {
      state: {
        cartItems: selectedItems,
        isBuyNow: location.state?.isBuyNow,
      },
    });
  };

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleConfirmOrder = async () => {
    if (!selectedItems || selectedItems.length === 0) {
      toast.error("ไม่พบสินค้าในคำสั่งซื้อ");
      navigate("/shopping-cart");
      return;
    }

    if (!defaultAddress) {
      toast.error("กรุณาเลือกที่อยู่ในการรับสินค้า");
      return;
    }

    if (!paymentMethod) {
      toast.error("กรุณาเลือกช่องทางการชำระเงิน");
      return;
    }

    const loadingToastId = toast.loading("กำลังดำเนินการ...");

    try {
      const isBuyNow = location.state?.isBuyNow || false;

      if (paymentMethod === "credit" || paymentMethod === "qr") {
        const requestPayload: any = {
          ids: selectedItems.map((item) =>
            isBuyNow ? Number(item.productId) : Number(item.cartItemId),
          ),
          isBuyNow: isBuyNow,
        };

        if (paymentMethod === "credit" && selectedCardId) {
          requestPayload.cardId = selectedCardId;
        }

        const responseData =
          await PaymentService.createPaymentIntent(requestPayload);
        toast.dismiss(loadingToastId);

        if (paymentMethod === "credit") {
          navigate("/history-shop", {
            state: {
              clientSecret: responseData.clientSecret,
              referenceId: responseData.paymentIntentId,
              totalPrice: subtotal,
              items: selectedItems,
            },
          });
        } else {
          navigate(`/payment-qr`, {
            state: {
              clientSecret: responseData.clientSecret,
              totalPrice: subtotal,
            },
          });
        }
      } else if (paymentMethod === "cod") {
        toast.dismiss(loadingToastId);
        toast.success("ชำระเงินสำเร็จ");
        navigate("/payment", { state: { status: "success" } });
      }
    } catch (error: any) {
      toast.dismiss(loadingToastId);
      if (
        error.response?.status === 400 &&
        error.response?.data?.message === "OUT_OF_STOCK"
      ) {
        toast.error("สินค้าในรถเข็นหมดหรือมีไม่เพียงพอ");
        navigate("/shopping-cart");
      } else {
        toast.error("เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ");
      }
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
          className="w-6 h-6 mr-3 text-black cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <span className="text-lg font-bold text-black">ทำการสั่งซื้อ</span>
      </div>

      {/* --- DESKTOP CONTENT --- */}
      <div className="hidden lg:block bg-white border border-gray-200 shadow-sm rounded-lg p-4 mb-20 w-[1136px] min-h-[800px]">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <Icon icon="ph:shopping-cart" className="w-8 h-8 text-black" />
            <h1 className="text-2xl font-bold text-black">สรุปคำสั่งซื้อ</h1>
          </div>

          {/* Shipping Address Section */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              ที่อยู่ในการจัดส่ง
            </h2>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <div className="text-sm text-gray-600">
                {defaultAddress ? (
                  <span className="flex items-center gap-2">
                    <strong className="text-black">
                      {defaultAddress.receiverName}
                    </strong>
                    {`${defaultAddress.streetAddress} ${defaultAddress.subdistrict} ${defaultAddress.district} ${defaultAddress.province} ${defaultAddress.zipcode}`}
                  </span>
                ) : (
                  <span className="text-red-500">ยังไม่มีข้อมูลที่อยู่</span>
                )}
              </div>
              <button
                onClick={() => navigate("/address-profile")}
                className="cursor-pointer text-blue-500 text-sm border border-blue-500 px-4 py-1 rounded-[3px] hover:bg-blue-50"
              >
                เปลี่ยน
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="max-h-[300px] overflow-y-auto mb-10 pr-2">
            {selectedItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-6 py-3 border-b border-gray-100 last:border-0"
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

          <hr className="border-t border-gray-200 mb-6" />

          {/* Payment Method & Summary Row */}
          <div className="flex flex-row items-start justify-between">
            <div className="space-y-4 flex-1">
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
                    <button
                      onClick={() => setPaymentMethod(method.id)}
                      className={`cursor-pointer flex items-center gap-4 w-full max-w-[585px] p-3 rounded-xl border-2 transition-all ${
                        paymentMethod === method.id
                          ? "border-black bg-gray-50"
                          : "border-gray-100 bg-white"
                      }`}
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-lg">
                        <Icon icon={method.icon} className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-sm text-gray-900">
                          {method.title}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {method.desc}
                        </p>
                      </div>
                      {paymentMethod === method.id && (
                        <Icon
                          icon="lucide:check-circle"
                          className="w-5 h-5 text-black"
                        />
                      )}
                    </button>

                    {/* Credit Card Options */}
                    {method.id === "credit" && paymentMethod === "credit" && (
                      <div className="ml-12 mt-3 space-y-3 animate-in fade-in slide-in-from-top-1">
                        {savedCards.map((card) => (
                          <button
                            key={card.id}
                            onClick={() => setSelectedCardId(card.id)}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedCardId === card.id ? "border-blue-500" : "border-gray-400"}`}
                            >
                              {selectedCardId === card.id && (
                                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                              )}
                            </div>
                            <div className="w-10 h-6 border border-gray-200 rounded flex items-center justify-center bg-white">
                              <Icon
                                icon={
                                  card.brand === "mastercard"
                                    ? "logos:mastercard"
                                    : "logos:visa"
                                }
                                className="text-lg"
                              />
                            </div>
                            <span className="text-sm text-black">
                              {card.bankName} **** {card.last4}
                            </span>
                          </button>
                        ))}
                        <button
                          data-test="add-to-card"
                          onClick={handleAddNewCard}
                          className="flex items-center gap-2 text-xs font-medium border border-black px-3 py-1.5 rounded-md hover:bg-gray-50 transition-all"
                        >
                          <Icon icon="lucide:plus" className="w-3.5 h-3.5" />{" "}
                          เพิ่มบัตรเครดิต/เดบิต
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary Box */}
            <div className="w-[330px] bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">รวมการสั่งซื้อ</span>
                  <span className="font-semibold">
                    ฿ {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ค่าจัดส่ง</span>
                  <span className="font-semibold">฿ 0</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <span className="font-bold text-gray-900">
                    ยอดชำระทั้งหมด
                  </span>
                  <span className="font-bold text-blue-600 text-lg">
                    ฿ {subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={handleConfirmOrder}
                className="w-full py-3 bg-blue-500 text-white rounded-lg font-bold shadow-lg hover:bg-blue-600 transition-colors"
              >
                ยืนยันการชำระเงิน
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MOBILE CONTENT --- */}
      <div className="w-full lg:hidden block">
        {/* Mobile Address */}
        <div className="bg-white mb-2 shadow-sm border-t-[3px] border-blue-400">
          <button
            className="w-full px-4 py-4 flex items-center justify-between text-left"
            onClick={() => navigate("/address-profile")}
          >
            <div className="flex gap-3">
              <Icon
                icon="mdi:map-marker"
                className="w-5 h-5 text-blue-500 mt-1"
              />
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-[15px]">
                  ที่อยู่ในการจัดส่ง
                </p>
                {defaultAddress ? (
                  <>
                    <p className="text-gray-800 text-sm mt-1">
                      {defaultAddress.receiverName} |{" "}
                      {defaultAddress.receiverPhone}
                    </p>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                      {`${defaultAddress.streetAddress} ${defaultAddress.subdistrict} ${defaultAddress.district} ${defaultAddress.province} ${defaultAddress.zipcode}`}
                    </p>
                  </>
                ) : (
                  <p className="text-blue-500 font-bold text-sm mt-1">
                    กรุณาเพิ่มที่อยู่ในการจัดส่ง
                  </p>
                )}
              </div>
            </div>
            <Icon icon="mdi:chevron-right" className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Mobile Items */}
        <div className="bg-white mb-2">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
            <Icon icon="mdi:storefront" className="w-5 h-5 text-gray-700" />
            <span className="font-bold text-sm">สินค้าที่สั่งซื้อ</span>
          </div>
          {selectedItems.map((item) => (
            <div
              key={item.productId}
              className="flex gap-3 p-4 bg-gray-50 border-b border-white"
            >
              <img
                src={item.imageUrl || ""}
                alt=""
                className="w-16 h-16 object-cover rounded border"
              />
              <div className="flex-1 flex flex-col justify-between">
                <p className="text-sm text-gray-800 line-clamp-2">
                  {item.productName}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-500">
                    ฿{item.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">
                    x{item.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Payment Methods */}
        <div className="bg-white mb-2">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
            <Icon icon="mdi:cash-multiple" className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-sm">วิธีการชำระเงิน</span>
          </div>
          {["qr", "credit", "cod"].map((id) => (
            <button
              key={id}
              onClick={() => setPaymentMethod(id)}
              className="w-full px-4 py-4 flex items-center justify-between border-b border-gray-50 last:border-none"
            >
              <div className="flex items-center gap-3">
                <Icon
                  icon={
                    id === "qr"
                      ? "lucide:wallet"
                      : id === "credit"
                        ? "lucide:credit-card"
                        : "lucide:truck"
                  }
                  className="w-5 h-5 text-gray-600"
                />
                <span className="text-sm">
                  {id === "qr"
                    ? "พร้อมเพย์"
                    : id === "credit"
                      ? "บัตรเครดิต/เดบิต"
                      : "เก็บเงินปลายทาง"}
                </span>
              </div>
              <Icon
                icon={
                  paymentMethod === id
                    ? "mdi:check-circle"
                    : "mdi:radiobox-blank"
                }
                className={`w-6 h-6 ${paymentMethod === id ? "text-blue-500" : "text-gray-300"}`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* --- MOBILE BOTTOM NAV --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-between z-40 h-[65px] shadow-lg">
        <div className="px-4 text-right flex-1">
          <p className="text-[11px] text-gray-500">ยอดชำระทั้งหมด</p>
          <p className="text-lg font-bold text-blue-500 leading-none">
            ฿{subtotal.toLocaleString()}
          </p>
        </div>
        <button
          onClick={handleConfirmOrder}
          className="bg-blue-500 text-white h-full px-10 font-bold text-sm"
        >
          สั่งซื้อสินค้า
        </button>
      </div>
    </div>
  );
};

export default PaymentShoping;
