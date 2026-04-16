import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/store";
import { toast } from "react-hot-toast";
import type { SavedCard } from "../../types/payment";
import { PaymentService } from "../../services/payment.service";
import { fetchAddressDefault } from "../../redux/address/addressReducer";
import { addSavedCard } from "../../redux/payment/paymentReducer";
import { fetchCartThunk } from "../../redux/carts/CartReducer";

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
        id: newlyAddedCard.id,
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

      // สร้าง Payload กลางไว้ใช้ได้ทั้ง 3 รูปแบบ (Credit, QR, COD)
      const requestPayload: any = {
        ids: selectedItems.map((item) =>
          isBuyNow ? Number(item.productId) : Number(item.cartItemId),
        ),
        isBuyNow: isBuyNow,
      };

      if (paymentMethod === "credit" || paymentMethod === "qr") {
        if (paymentMethod === "credit" && selectedCardId) {
          requestPayload.cardId = selectedCardId;
        }

        const responseData =
          await PaymentService.createPaymentIntent(requestPayload);
        toast.dismiss(loadingToastId);

        if (!isBuyNow) dispatch(fetchCartThunk());

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
        requestPayload.paymentMethod = "cod";
        await PaymentService.createPaymentIntent(requestPayload);

        toast.dismiss(loadingToastId);
        toast.success("สั่งซื้อแบบเก็บเงินปลายทางสำเร็จ");

        if (!isBuyNow) {
          dispatch(fetchCartThunk());
        }

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
            <Icon icon="ph:shopping-cart" className="w-8 h-8 text-black" />
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
                      {defaultAddress.receiverName}
                    </strong>
                    {`${defaultAddress.streetAddress} ${defaultAddress.subdistrict} ${defaultAddress.district} ${defaultAddress.province} ${defaultAddress.zipcode}`}
                  </span>
                ) : (
                  <span className="text-red-500">ยังไม่มีข้อมูลที่อยู่</span>
                )}
              </div>
              <button
                data-test="btn-change-address-mobile"
                onClick={() => navigate("/address-profile")}
                className="cursor-pointer text-blue-500 text-sm border border-blue-500 px-4 py-1 rounded-[3px] hover:bg-blue-50"
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
                    <button
                      data-test="btn-select-payment-method-mobile"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`cursor-pointer flex items-center text-left gap-4 w-[585px] h-[71px] p-[10px] rounded-[12px] border-[2px] transition-all ${paymentMethod === method.id ? "border-black bg-[#EAEAEA]" : "border-gray-200 bg-white"}`}
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
                    </button>
                    {method.id === "credit" && paymentMethod === "credit" && (
                      <div className="ml-0 sm:ml-12 mt-3 space-y-3">
                        {savedCards.map((card) => (
                          <button
                            key={card.id}
                            data-test="btn-select-card-method-mobile"
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
                          </button>
                        ))}
                        <button
                          data-test="click-add-credit-card-mobile"
                          onClick={handleAddNewCard}
                          className="cursor-pointer flex items-center w-fit px-3 py-1.5 gap-2 mt-2 border border-black rounded-md hover:bg-gray-50 transition-all bg-white ml-7"
                        >
                          <Icon
                            icon="lucide:plus"
                            className="w-3.5 h-3.5 text-black"
                            style={{ strokeWidth: 3 }}
                          />
                          <span className="font-medium text-xs text-black">
                            เพิ่มบัตรเครดิต/เดบิต
                          </span>
                        </button>
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
                    ฿ {subtotal.toLocaleString()}
                  </span>
                  <div className="col-start-2 flex justify-end">
                    <button
                      data-test="btn-confirm-payment-mobile"
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

      <div className="w-full lg:hidden block">
        <div className="bg-white mb-2 pb-3 shadow-sm">
          <div
            className="h-[3px] w-full mb-3"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #FF6B6B 0, #FF6B6B 12px, transparent 12px, transparent 16px, #4DABF7 16px, #4DABF7 28px, transparent 28px, transparent 32px)",
            }}
          ></div>
          <button
            data-test="btn-confirm-payment-mobile"
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
                      {defaultAddress.receiverName} |
                      {defaultAddress.receiverPhone}
                    </p>
                    <p className="text-gray-500 mt-0.5 line-clamp-2 leading-relaxed text-[13px]">
                      {`${defaultAddress.streetAddress} ${defaultAddress.subdistrict} ${defaultAddress.district} ${defaultAddress.province} ${defaultAddress.zipcode}`}
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
          </button>
        </div>

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
                    data-test="btn-select-payment-method"
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
                      <p className="text-[11px] text-gray-500">{method.desc}</p>
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
                          data-test="btn-select-card-method"
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

          <div className="bg-white mb-2 p-4 space-y-2.5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Icon
                icon="mdi:receipt-text-outline"
                className="w-5 h-5 text-gray-600"
              />
              <span className="font-semibold text-sm">
                รายละเอียดการชำระเงิน
              </span>
            </div>
            <div className="flex justify-between text-[13px] text-gray-500">
              <span>รวมค่าสินค้า</span>
              <span>฿{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[13px] text-gray-500">
              <span>ค่าจัดส่ง</span>
              <span>฿{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-3 mt-2 border-t border-gray-100">
              <span className="font-semibold text-gray-800">
                ยอดชำระทั้งหมด
              </span>
              <span className="text-lg font-bold text-blue-500">
                ฿{subtotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-end z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col px-4 text-right justify-center">
            <span className="text-[12px] text-gray-600 mb-0.5">
              ยอดชำระทั้งหมด
            </span>
            <span className="text-[18px] font-bold text-blue-500 leading-none">
              ฿{subtotal.toLocaleString()}
            </span>
          </div>
          <button
            data-test="btn-confirm-order-mobile"
            onClick={handleConfirmOrder}
            className="cursor-pointer bg-blue-500 active:bg-blue-600 text-white h-[60px] px-8 font-bold text-sm transition-colors flex-shrink-0"
          >
            สั่งซื้อสินค้า
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentShoping;
