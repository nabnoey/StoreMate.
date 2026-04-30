import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../redux/store";
import { toast } from "react-hot-toast";
import { useStripe } from "@stripe/react-stripe-js";

import type {
  PaymentIntentPayload,
  PaymentNowPayload,
  SavedCard,
  PaymentMethod,
} from "../../../types/payment";

import { PaymentService } from "../../../services/payment.service";
import { fetchAddressDefault } from "../../../redux/address/addressReducer";
import { addSavedCard } from "../../../redux/payment/paymentReducer";
import { fetchCartThunk } from "../../../redux/carts/CartReducer";
import { PAYMENT_OPTIONS } from "../../../constants/payment";

const PaymentShoping = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const stripe = useStripe();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [selectedCardId, setSelectedCardId] = useState<string>("");

  const savedCards = useSelector(
    (state: RootState) => state.payment.savedCards,
  );
  const newlyAddedCard = location.state?.newlyAddedCard;

  const cartSelectedItems = useSelector(
    (state: RootState) => state.carts.selectedItems,
  );

  const isBuyNow = location.state?.isBuyNow || false;

  const selectedItems = isBuyNow
    ? location.state?.items || []
    : cartSelectedItems;

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
        brand: newlyAddedCard.card?.brand ?? "unknown",
        last4: newlyAddedCard.card?.last4 ?? "0000",
        bankName: `${cardName}`,
      };

      if (!savedCards.find((c) => c.id === formattedCard.id)) {
        dispatch(addSavedCard(formattedCard));
      }
    }
  }, [dispatch, newlyAddedCard, savedCards]);

  const handleAddNewCard = () => {
    navigate("/add-credit-card", {
      state: {
        cartItems: selectedItems,
        isBuyNow: isBuyNow,
      },
    });
  };

  const subtotal = (selectedItems ?? []).reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0,
  );

  const validateOrder = () => {
    if (!selectedItems || selectedItems.length === 0) {
      toast.error("ไม่พบสินค้าในคำสั่งซื้อ");
      navigate("/shopping-cart");
      return false;
    }

    if (!defaultAddress) {
      toast.error("กรุณาเลือกที่อยู่ในการรับสินค้า");
      return false;
    }

    if (!paymentMethod) {
      toast.error("กรุณาเลือกช่องทางการชำระเงิน");
      return false;
    }

    if (paymentMethod === "CARD" && !selectedCardId) {
      toast.error("กรุณาเลือกบัตรเครดิต");
      return false;
    }

    return true;
  };

  const executePaymentApi = async (checkoutType: PaymentMethod) => {
    if (isBuyNow) {
      const buyNowItem = selectedItems[0];
      const payload: PaymentNowPayload = {
        id: Number(buyNowItem.productId),
        quantity: Number(buyNowItem.quantity),
        checkoutType,
        ...(checkoutType === "CARD" && { cardId: selectedCardId }),
      };
      return await PaymentService.paymentNow(payload);
    }

    // กรณีไม่ได้กด Buy Now (ตะกร้าสินค้า)
    const ids = selectedItems.map((item: any) => Number(item.cartItemId));
    const payload: PaymentIntentPayload = {
      ids,
      checkoutType,
      ...(checkoutType === "CARD" && { cardId: selectedCardId }),
    };
    return await PaymentService.createPaymentIntent(payload);
  };

  const handlePaymentSuccess = async (
    checkoutType: PaymentMethod,
    clientSecret: string,
  ) => {
    if (checkoutType === "CARD") {
      if (!stripe) {
        toast.error(
          "ระบบชำระเงินผ่านบัตรเครดิตยังไม่พร้อมใช้งาน กรุณาลองใหม่อีกครั้งในภายหลัง",
        );
        return;
      }

      const confirmResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: selectedCardId,
      });

      if (confirmResult.paymentIntent?.status === "succeeded") {
        toast.success("ชำระเงินสำเร็จ", { duration: 2000 });
        setTimeout(() => {
          navigate("/orders", {
            state: {
              clientSecret,
              referenceId: confirmResult.paymentIntent?.id,
              totalPrice: subtotal,
              items: selectedItems,
            },
          });
        });
      }
      return;
    }

    if (checkoutType === "PROMPTPAY") {
      navigate("/payment-qr", {
        state: { clientSecret, totalPrice: subtotal },
      });
      return;
    }

    if (checkoutType === "DESTINATION") {
      toast.success("ชำระเงินสำเร็จ", { duration: 2000 });
      setTimeout(() => {
        navigate("/orders", {
          state: { status: "success", checkoutType: "DESTINATION" },
        });
      }, 2000);
    }
  };

  const handlePaymentError = (error: any) => {
    const isOutOfStock =
      error?.response?.status === 400 &&
      error?.response?.data?.message === "OUT_OF_STOCK";

    if (isOutOfStock) {
      toast.error("สินค้าในรถเข็นหมดหรือมีไม่เพียงพอ");
      navigate("/shopping-cart");
      return;
    }

    toast.error("เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ");
  };

  const handleConfirmOrder = async () => {
    if (!validateOrder()) return;

    let loadingToastId: string | undefined;

    try {
      loadingToastId = toast.loading("กำลังดำเนินการ...");
      const currentCheckoutType = paymentMethod as PaymentMethod;

      const response = await executePaymentApi(currentCheckoutType);

      if (!isBuyNow) dispatch(fetchCartThunk());

      await handlePaymentSuccess(currentCheckoutType, response.clientSecret);
    } catch (error: any) {
      handlePaymentError(error);
    } finally {
      if (loadingToastId) toast.dismiss(loadingToastId);
    }
  };
  return (
    <div className="min-h-screen bg-[#f5f5f5] lg:bg-white pb-[70px] lg:pb-0 font-anuphan flex flex-col items-center">
      <div className="w-[1136px] hidden lg:block">
        <nav className="flex items-start mt-16 mb-4 py-1 font-anuphan text-[14px] font-normal leading-[24px] text-black break-words">
          <Link to="/" className="cursor-pointer">
            หน้าหลัก
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1"
          />
          <Link to="/shopping-cart" className="cursor-pointer">
            รถเข็น
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1"
          />
          <span className="transition-colors">สรุปคำสั่งซื้อ</span>
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
            <Icon icon="ph:shopping-cart" className="w-8 h-8 text-[#111827]" />
            <h1 className="font-['Anuphan'] text-[30px] font-medium text-[#111827] leading-[40px] break-words">
              สรุปคำสั่งซื้อ
            </h1>
          </div>
          <div className="mb-10">
            <h2 className="font-anuphan text-[20px] font-semibold text-black leading-[32px] break-words mb-2">
              ที่อยู่ในการจัดส่ง
            </h2>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <div className="font-anuphan text-[16px] font-normal text-[#7E7E7E] leading-[24px] break-words">
                {defaultAddress ? (
                  <span className="flex items-center gap-2">
                    <strong className="text-black font-normal">
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
                className="cursor-pointer font-anuphan text-[16px] font-normal text-[#3B82F6] leading-[24px] break-words border border-blue-500 px-4 py-1 rounded-[3px] hover:bg-blue-50"
              >
                เปลี่ยน
              </button>
            </div>
          </div>

          <div className="max-h-[250px] overflow-y-auto mb-10 pr-2">
            {selectedItems.map((item: any) => (
              <div
                key={item.productId}
                className="flex items-center gap-6 py-3 border-b border-[#D1D5DB] last:border-0"
              >
                <img
                  src={item.imageUrl || ""}
                  alt=""
                  className="w-30 h-30 object-contain rounded-md"
                />
                <div className="flex-1 font-anuphan text-[20px] font-semibold text-black leading-[32px] break-words line-clamp-1">
                  {item.productName}
                </div>
                <div className="w-24 text-center font-anuphan text-[16px] font-normal text-black leading-[24px] break-words">
                  ฿ {item.price.toLocaleString()}
                </div>
                {/* <div className="w-12 text-center text-sm">{item.quantity}</div> */}
                <div className="w-24 text-right font-anuphan text-[16px] font-normal text-[#3B82F6] leading-[24px] break-words">
                  ฿ {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <hr className="border-t border-[#D1D5DB] mb-6" />
          <div className="flex flex-row items-start gap-[60px]">
            <div className="space-y-4">
              <h2 className="font-anuphan text-[20px] font-semibold text-black leading-[32px] break-words">
                เลือกช่องทางการชำระเงิน
              </h2>
              <div className="flex flex-col gap-3">
                {PAYMENT_OPTIONS.map((method: any) => (
                  <div key={method.id} className="flex flex-col">
                    <button
                      data-test="btn-select-payment-method-mobile"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`cursor-pointer flex items-center text-left gap-4 w-[585px] h-[71px] p-[10px] rounded-[12px] border-[2px] transition-all ${
                        paymentMethod === method.id
                          ? "border-black bg-[#EAEAEA]"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="w-10 h-10 flex items-center text-black justify-center bg-white border border-gray-100 rounded-lg">
                        <Icon icon={method.icon} className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-['Anuphan'] text-[14px] font-semibold text-[#0F172A] leading-[14px] break-words">
                          {method.title}
                        </p>
                        <p className="font-['Anuphan'] text-[12px] font-normal text-[#64748B] leading-[16px] break-words mt-1">
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
                    {method.id === "CARD" && paymentMethod === "CARD" && (
                      <div className="ml-0 sm:ml-12 mt-3 space-y-3">
                        {savedCards.map((card: any) => (
                          <button
                            key={card.id}
                            data-test="btn-select-card-method-mobile"
                            onClick={() => setSelectedCardId(card.id)}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                selectedCardId === card.id
                                  ? "border-blue-500"
                                  : "border-gray-400"
                              }`}
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
                  <span className="font-anuphan text-[16px] font-normal text-black leading-[24px] break-words">
                    รวมการสั่งซื้อ
                  </span>
                  <span className="font-anuphan text-[16px] font-normal text-black leading-[24px] break-words text-right">
                    ฿ {subtotal.toLocaleString()}
                  </span>
                  <span className="font-anuphan text-[16px] font-normal text-black leading-[24px] break-words">
                    ยอดชำระทั้งหมด
                  </span>
                  <span className="font-anuphan text-[16px] font-normal text-black leading-[24px] break-words text-right">
                    ฿ {subtotal.toLocaleString()}
                  </span>
                  <div className="col-start-2 flex justify-end">
                    <button
                      data-test="btn-confirm-payment-mobile"
                      onClick={handleConfirmOrder}
                      className="cursor-pointer w-[146px] h-[29px] bg-[#4285F4] rounded-[7px] shadow-md font-anuphan text-[16px] font-normal text-[#FCFCFC] leading-[24px] break-words"
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

      {/* ---------------- MOBILE SECTION ---------------- */}
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
            className="px-4 flex items-center justify-between cursor-pointer w-full text-left"
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
                    <p className="font-anuphan text-[20px] font-semibold text-black leading-[32px] break-words">
                      ที่อยู่ในการจัดส่ง
                    </p>
                    <p className="font-anuphan text-[16px] font-normal text-black leading-[24px] break-words mt-1">
                      {defaultAddress.receiverName}
                    </p>
                    <p className="font-anuphan text-[16px] font-normal text-[#7E7E7E] leading-[24px] break-words mt-0.5 line-clamp-1">
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
            <Icon icon="mdi:storefront" className="w-5 h-5 text-black" />
            <span className="font-semibold text-sm text-black">
              สินค้าที่สั่งซื้อ
            </span>
          </div>
          {selectedItems.map((item: any) => (
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
                <p className="font-anuphan text-[20px] font-semibold text-black leading-[32px] break-words line-clamp-2">
                  {item.productName}
                </p>
                <div className="flex justify-between items-end mt-2">
                  <span className="font-anuphan text-[16px] font-normal text-black leading-[24px] break-words">
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

        {/* Payment Method Mobile */}
        <div className="bg-white mb-2 p-4 shadow-sm">
          <div className="space-y-4 flex-1">
            <h2 className="font-anuphan text-[20px] font-semibold text-black leading-[32px] break-words">
              เลือกช่องทางการชำระเงิน
            </h2>
            <div className="flex flex-col gap-3">
              {PAYMENT_OPTIONS.map((method: any) => (
                <div key={method.id} className="flex flex-col">
                  <button
                    data-test="btn-select-payment-method"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`cursor-pointer flex items-center gap-4 w-full p-3 rounded-xl border-2 transition-all ${
                      paymentMethod === method.id
                        ? "border-black bg-gray-50"
                        : "border-gray-100 bg-white"
                    }`}
                  >
                    <div className="w-10 h-10 flex items-center text-black justify-center bg-white border border-gray-100 rounded-lg cursor-pointer">
                      <Icon icon={method.icon} className="w-5 h-5 " />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-['Inter'] text-[14px] font-semibold text-[#0F172A] leading-[14px] break-words">
                        {method.title}
                      </p>
                      <p className="font-['Inter'] text-[12px] font-normal text-[#64748B] leading-[16px] break-words mt-1">
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

                  {/* Credit Card Options Mobile */}
                  {method.id === "CARD" && paymentMethod === "CARD" && (
                    <div className="ml-12 mt-3 space-y-3 animate-in fade-in slide-in-from-top-1">
                      {savedCards.map((card: any) => (
                        <button
                          key={card.id}
                          data-test="btn-select-card-method"
                          onClick={() => setSelectedCardId(card.id)}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              selectedCardId === card.id
                                ? "border-blue-500"
                                : "border-gray-400"
                            }`}
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
                              className="text-lg text-black"
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
                        className="flex items-center gap-2 text-xs text-black font-medium border border-black px-3 py-1.5 rounded-md cursor-pointrer transition-all bg-white"
                      >
                        <Icon
                          icon="lucide:plus"
                          className="w-3.5 h-3.5 text-black"
                        />{" "}
                        เพิ่มบัตรเครดิต/เดบิต
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white mb-2 p-4 space-y-2.5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Icon
              icon="mdi:receipt-text-outline"
              className="w-5 h-5 text-black"
            />
            <span className="font-semibold text-sm text-black">
              รายละเอียดการชำระเงิน
            </span>
          </div>
          <div className="flex justify-between text-[13px] text-black">
            <span>รวมค่าสินค้า</span>
            <span>฿{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[13px] text-black">
            <span>ค่าจัดส่ง</span>
            <span>฿{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm pt-3 mt-2 border-t border-gray-100">
            <span className="font-anuphan text-[16px] font-normal text-black leading-[24px] break-words">
              ยอดชำระทั้งหมด
            </span>
            <span className="text-lg font-bold text-blue-500">
              ฿{subtotal.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-end z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col px-4 text-right justify-center">
            <span className="font-anuphan text-[16px] font-normal text-black leading-[24px] break-words mb-0.5">
              ยอดชำระทั้งหมด
            </span>
            <span className="text-[18px] font-bold text-blue-500 leading-none">
              ฿{subtotal.toLocaleString()}
            </span>
          </div>
          <button
            data-test="btn-confirm-order-mobile"
            onClick={handleConfirmOrder}
            className="cursor-pointer bg-blue-500 active:bg-blue-600 text-[#FCFCFC] h-[60px] px-8 font-normal text-[16px] font-anuphan transition-colors flex-shrink-0"
          >
            ยืนยันการชำระเงิน
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentShoping;
