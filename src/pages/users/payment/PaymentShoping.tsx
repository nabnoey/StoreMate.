import { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../redux/store";
import { toast } from "react-hot-toast";

import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe } from "@stripe/react-stripe-js";

import type {
  PaymentIntentPayload,
  PaymentNowPayload,
  SavedCard,
  PaymentMethod,
} from "../../../types/payment";

import { PaymentService } from "../../../services/payment.service";
import { fetchAddressDefault } from "../../../redux/address/addressReducer";
import { fetchCartThunk } from "../../../redux/carts/CartReducer";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentContent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const stripe = useStripe();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [selectedCardId, setSelectedCardId] = useState<string>("");

  const newlyAddedCard = location.state?.newlyAddedCard;
  const [currentCard, setCurrentCard] = useState<SavedCard | null>(null);

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

      setCurrentCard({
        id: newlyAddedCard.id,
        brand: newlyAddedCard.card?.brand ?? "unknown",
        last4: newlyAddedCard.card?.last4 ?? "0000",
        bankName: cardName,
      });
    }
  }, [dispatch, newlyAddedCard]);

  const handleAddNewCard = () => {
    navigate("/add-credit-card", {
      state: {
        cartItems: selectedItems,
        isBuyNow: isBuyNow,
      },
    });
  };

  const subtotal = useMemo(() => {
    return (selectedItems ?? []).reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    );
  }, [selectedItems]);

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
        toast.error("ขออภัย ไม่สามารถติดต่อผู้ให้บริการชำระเงินได้ในขณะนี้");
        return;
      }

      const confirmResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: selectedCardId,
      });

      if (confirmResult.error) {
        toast.error("ข้อมูลบัตรไม่ถูกต้องหรือยอดเงินไม่เพียงพอ");
        return;
      }

      if (confirmResult.paymentIntent?.status === "succeeded") {
        if (!isBuyNow) {
          await dispatch(fetchCartThunk());
        }

        toast.success("คำสั่งซื้อสำเร็จ", {
          duration: 2000,
        });

        setTimeout(() => {
          navigate("/orders", {
            state: {
              clientSecret,
              referenceId: confirmResult.paymentIntent?.id,
              totalPrice: subtotal,
              items: selectedItems,
            },
          });
        }, 2000);
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
      toast.success("คำสั่งซื้อสำเร็จ", {
        duration: 2000,
      });

      setTimeout(() => {
        navigate("/orders", {
          state: {
            status: "success",
            checkoutType: "DESTINATION",
          },
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

      // if (!isBuyNow) dispatch(fetchCartThunk());

      await handlePaymentSuccess(currentCheckoutType, response.clientSecret);
    } catch (error: any) {
      handlePaymentError(error);
    } finally {
      if (loadingToastId) toast.dismiss(loadingToastId);
    }
  };
  return (
    <div className="min-h-screen bg-white md:bg-white lg:bg-white pb-4 md:pb-0 font-anuphan flex flex-col items-center">
      {/* --- DESKTOP & TABLET BREADCRUMB --- */}
      <div className="w-full max-w-[1136px] px-4 md:px-8 hidden md:block">
        <nav className="flex items-start mt-16 mb-4 py-1 font-anuphan text-[14px] font-normal leading-[24px] text-black break-words">
          <Link to="/" className="cursor-pointer hover:text-blue-500">
            หน้าหลัก
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1"
          />
          <Link
            to="/shopping-cart"
            className="cursor-pointer hover:text-blue-500"
          >
            รถเข็น
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1"
          />
          <span className="transition-colors font-semibold">
            สรุปคำสั่งซื้อ
          </span>
        </nav>
      </div>

      {/* --- MOBILE HEADER --- */}
      <div className="md:hidden w-full flex items-center bg-white px-4 py-4 pt-10 border-b border-gray-100 sticky top-0 z-30">
        <Icon
          icon="lucide:arrow-left"
          className="w-6 h-6 mr-3 text-black cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <span className="text-[16px] font-bold text-black">สรุปคำสั่งซื้อ</span>
      </div>

      {/* --- DESKTOP & TABLET CONTENT --- */}
      <div className="hidden md:block bg-white border border-gray-200 shadow-sm overflow-hidden mb-19 w-full max-w-[1136px] min-h-[1000px] rounded-[8px] p-[16px] mx-auto">
        <div className="p-4 lg:p-8">
          <div className="flex items-center gap-3 mb-2 pb-4">
            <Icon icon="ph:shopping-cart" className="w-8 h-8 text-[#111827]" />
            <h1 className="font-['Anuphan'] text-[30px] font-medium text-[#111827] leading-[40px] break-words">
              สรุปคำสั่งซื้อ
            </h1>
          </div>
          <div className="mb-10">
            <h2 className="font-anuphan text-[16px] font-semibold text-black leading-[32px] break-words mb-2">
              ที่อยู่ในการจัดส่ง
            </h2>
            <div
              data-test="shipping-address"
              className="flex justify-between items-center py-3 border-b border-gray-200"
            >
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
                data-test="btn-change-address"
                // onClick={() => navigate("/address-profile")}
                onClick={() =>
                  navigate("/address-profile", {
                    state: {
                      from: "payment",
                      items: selectedItems,
                      isBuyNow,
                    },
                  })
                }
                className="cursor-pointer font-anuphan text-[16px] font-normal text-[#3B82F6] leading-[24px] break-words border border-blue-500 px-4 py-1 rounded-[3px] hover:bg-blue-50"
              >
                เปลี่ยน
              </button>
            </div>
          </div>

          <div className="max-h-[250px] overflow-y-auto mb-10 pr-2">
            {selectedItems.map((item: any) => (
              <div
                data-test="order-item"
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
                <div className="w-24 text-left font-anuphan text-[16px] font-normal text-black leading-[24px] break-words">
                  ฿ {item.price.toLocaleString()}
                </div>
                <div className="w-24 text-center font-anuphan text-[16px] font-normal text-black leading-[24px] break-words">
                  X {item.quantity}
                </div>
                <div className="w-24 text-right font-anuphan text-[16px] font-normal text-[#3B82F6] leading-[24px] break-words">
                  ฿ {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <hr className="border-t border-[#D1D5DB] mb-6" />
          <div className="flex flex-col lg:flex-row items-start gap-[60px]">
            <div className="space-y-4 w-full lg:w-auto">
              <h2 className="font-anuphan text-[20px] font-semibold text-black leading-[32px] break-words">
                เลือกช่องทางการชำระเงิน
              </h2>
              <div className="flex flex-col gap-3">
                {/* PromptPay */}
                <button
                  data-test="select-promptpay-desktop"
                  onClick={() => setPaymentMethod("PROMPTPAY")}
                  className={`cursor-pointer font-anuphan flex items-center text-left gap-4 w-full lg:w-[585px] min-h-[71px] p-[10px] rounded-[12px] border-[2px] transition-all ${
                    paymentMethod === "PROMPTPAY"
                      ? "border-black bg-[#EAEAEA]"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-lg text-black">
                    <Icon icon="lucide:wallet" className="w-5 h-5 text-black" />
                  </div>

                  <div className="flex-1">
                    <p className="font-anuphan text-[14px] font-semibold text-[#0F172A]">
                      พร้อมเพย์ (PromptPay)
                    </p>
                    <p className="font-anuphan text-[12px] text-[#64748B] mt-1">
                      สแกน QR Code เพื่อชำระเงินทันที
                    </p>
                  </div>

                  {paymentMethod === "PROMPTPAY" && (
                    <Icon
                      icon="lucide:check-circle"
                      className="w-5 h-5 text-black"
                    />
                  )}
                </button>

                {/* Card */}
                <div className="flex flex-col">
                  <button
                    data-test="select-credit-desktop"
                    onClick={() => setPaymentMethod("CARD")}
                    className={`cursor-pointer font-anuphan flex items-center text-left gap-4 w-full lg:w-[585px] min-h-[71px] p-[10px] rounded-[12px] border-[2px] transition-all ${
                      paymentMethod === "CARD"
                        ? "border-black bg-[#EAEAEA]"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-lg">
                      <Icon
                        icon="lucide:credit-card"
                        className="w-5 h-5 text-black"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="font-anuphan text-[14px] font-semibold text-[#0F172A]">
                        บัตรเครดิต / บัตรเดบิต
                      </p>
                      <p className="font-anuphan text-[12px] text-[#64748B] mt-1">
                        Visa , Mastercard
                      </p>
                    </div>

                    {paymentMethod === "CARD" && (
                      <Icon
                        icon="lucide:check-circle"
                        className="w-5 h-5 text-black"
                      />
                    )}
                  </button>

                  {paymentMethod === "CARD" && (
                    <div
                      data-test="saved-card-list"
                      className="ml-0 sm:ml-12 mt-3 space-y-3"
                    >
                      {currentCard && (
                        <button
                          data-test="btn-select-card-method-desktop"
                          onClick={() => setSelectedCardId(currentCard.id)}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              selectedCardId === currentCard.id
                                ? "border-blue-500"
                                : "border-gray-400"
                            }`}
                          >
                            {selectedCardId === currentCard.id && (
                              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                            )}
                          </div>

                          <div className="w-12 h-8 border border-gray-300 rounded flex items-center justify-center bg-white">
                            <Icon
                              icon={
                                currentCard.brand === "mastercard"
                                  ? "logos:mastercard"
                                  : "logos:visa"
                              }
                              className="text-xl text-black"
                            />
                          </div>

                          <span className="text-sm text-black">
                            {currentCard.bankName}
                          </span>
                          <span className="text-sm text-black font-mono ml-2">
                            **** {currentCard.last4}
                          </span>
                        </button>
                      )}

                      <button
                        data-test="btn-add-credit-card-desktop"
                        onClick={handleAddNewCard}
                        className="cursor-pointer flex items-center w-fit px-3 py-1.5 gap-2 mt-2 border border-black rounded-md hover:bg-gray-50 bg-white ml-7"
                      >
                        <Icon
                          icon="lucide:plus"
                          className="w-3.5 h-3.5 text-black"
                        />
                        <span className="font-medium text-xs text-black">
                          กรอกบัตรเครดิต/เดบิต
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* COD */}
                <button
                  data-test="select-destination-desktop"
                  onClick={() => setPaymentMethod("DESTINATION")}
                  className={`cursor-pointer font-anuphan flex items-center text-left gap-4 w-full lg:w-[585px] min-h-[71px] p-[10px] rounded-[12px] border-[2px] transition-all ${
                    paymentMethod === "DESTINATION"
                      ? "border-black bg-[#EAEAEA]"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-lg">
                    <Icon icon="lucide:truck" className="w-5 h-5 text-black" />
                  </div>

                  <div className="flex-1">
                    <p className="font-anuphan text-[14px] font-semibold text-[#0F172A]">
                      เก็บเงินปลายทาง
                    </p>
                    <p className="font-anuphan text-[12px] text-[#64748B] mt-1">
                      ชำระเงินเมื่อได้รับสินค้า
                    </p>
                  </div>

                  {paymentMethod === "DESTINATION" && (
                    <Icon
                      icon="lucide:check-circle"
                      className="w-5 h-5 text-black"
                    />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4 lg:pt-10 w-full lg:w-auto">
              <div className="flex lg:order-2 flex-col lg:pt-[90px]">
                <div className="w-full lg:w-[330px] grid grid-cols-2 grid-rows-3 gap-y-[10px] lg:gap-y-[6px] gap-x-[50px] items-center">
                  <span className="font-anuphan text-[16px] font-normal text-black leading-[24px] break-words">
                    ยอดชำระทั้งหมด
                  </span>
                  <span
                    data-test="order-total-price-desktop"
                    className="font-anuphan text-[16px] font-normal text-black leading-[24px] break-words text-right"
                  >
                    ฿ {subtotal.toLocaleString()}
                  </span>
                  <div className="col-start-2 flex justify-end mt-2 lg:mt-0">
                    <button
                      data-test="btn-confirm-payment-desktop"
                      onClick={handleConfirmOrder}
                      className="cursor-pointer w-[146px] h-[36px] lg:h-[29px] bg-[#4285F4] rounded-[7px] shadow-md font-anuphan text-[16px] font-normal text-[#FCFCFC] leading-[24px] break-words"
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
      <div className="w-full md:hidden flex flex-col flex-1 bg-white pt-4">
        <div className="px-4">
          {/* Address Mobile (No Border) */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-[16px] font-bold text-black">
              ที่อยู่ในการจัดส่ง
            </h2>
            <button
              onClick={() => navigate("/address-profile")}
              className="text-[#3B82F6] text-[13px] border border-[#3B82F6] px-4 py-1 rounded-[4px] cursor-pointer"
            >
              เปลี่ยน
            </button>
          </div>
          <div className="mb-4">
            {defaultAddress ? (
              <div className="text-[14px] text-gray-500">
                <p className="text-black text-[16px] mb-1">
                  {defaultAddress.receiverName}
                </p>
                <p className="leading-relaxed">
                  {`${defaultAddress.streetAddress} ${defaultAddress.subdistrict} ${defaultAddress.district} ${defaultAddress.province} ${defaultAddress.zipcode}`}
                </p>
              </div>
            ) : (
              <p className="text-blue-500 font-bold text-sm">
                กรุณาเพิ่มที่อยู่ในการจัดส่ง
              </p>
            )}
          </div>

          {/* --- BORDERED CARD (Products + Payment Methods) --- */}
          <div className="border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
            {/* Product Box Mobile */}
            <div>
              {selectedItems.map((item: any, idx: number) => (
                <div
                  key={item.productId}
                  className={`flex gap-4 ${
                    idx !== 0 ? "mt-4 border-t border-gray-100 pt-4" : ""
                  }`}
                >
                  <img
                    src={item.imageUrl || ""}
                    alt=""
                    className="w-[80px] h-[80px] object-cover rounded-md"
                  />
                  <div className="flex-1 flex flex-col justify-start">
                    <p className="text-[16px] font-bold text-black leading-snug mb-2 line-clamp-2">
                      {item.productName}
                    </p>
                    <div className="flex gap-4 items-center mt-auto">
                      <span className="text-[14px] font-semibold text-black">
                        ฿ {item.price.toLocaleString()}
                      </span>
                      <span className="text-[14px] font-semibold text-black">
                        X {item.quantity}
                      </span>
                      <span className="text-[14px] font-semibold text-[#3B82F6]">
                        ฿ {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <hr className="border-t border-gray-200 my-4" />

            {/* Payment Options Mobile */}
            <div>
              <h2 className="text-[16px] font-bold text-black mb-4">
                เลือกช่องทางการชำระเงิน
              </h2>
              <div className="flex flex-col gap-3">
                {/* PromptPay */}
                <button
                  data-test="select-promptpay-mobile"
                  onClick={() => setPaymentMethod("PROMPTPAY")}
                  className={`flex items-center p-3 border rounded-[8px] transition-all cursor-pointer ${
                    paymentMethod === "PROMPTPAY"
                      ? "border-gray-500 bg-gray-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center mr-3 bg-white">
                    <Icon icon="lucide:wallet" className="w-6 h-6 text-black" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-[14px] font-semibold text-black leading-tight">
                      พร้อมเพย์ (PromptPay)
                    </p>
                    <p className="text-[12px] text-gray-500 mt-1 leading-tight">
                      สแกน QR Code เพื่อชำระเงินทันที
                    </p>
                  </div>
                </button>

                {/* Credit Card */}
                <div className="flex flex-col">
                  <button
                    data-test="select-credit-mobile"
                    onClick={() => setPaymentMethod("CARD")}
                    className={`flex items-center p-3 border rounded-[8px] transition-all cursor-pointer ${
                      paymentMethod === "CARD"
                        ? "border-gray-500 bg-gray-50"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center mr-3 bg-white">
                      <Icon
                        icon="lucide:credit-card"
                        className="w-6 h-6 text-black"
                      />
                    </div>

                    <div className="text-left flex-1">
                      <p className="text-[14px] font-semibold text-black leading-tight">
                        บัตรเครดิต / บัตรเดบิต
                      </p>
                      <p className="text-[12px] text-gray-500 mt-1 leading-tight">
                        Visa , Mastercard
                      </p>
                    </div>
                  </button>

                  {paymentMethod === "CARD" && (
                    <div className="ml-11 mt-3 space-y-3">
                      {currentCard && (
                        <button
                          data-test="btn-select-card-method-mobile"
                          onClick={() => setSelectedCardId(currentCard.id)}
                          className="flex items-center gap-3 cursor-pointer w-full text-left"
                        >
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              selectedCardId === currentCard.id
                                ? "border-blue-500"
                                : "border-gray-400"
                            }`}
                          >
                            {selectedCardId === currentCard.id && (
                              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                            )}
                          </div>

                          <div className="w-10 h-6 border border-gray-200 rounded flex items-center justify-center bg-white">
                            <Icon
                              icon={
                                currentCard.brand === "mastercard"
                                  ? "logos:mastercard"
                                  : "logos:visa"
                              }
                              className="text-lg"
                            />
                          </div>

                          <span className="text-[13px] text-black">
                            {currentCard.bankName} **** {currentCard.last4}
                          </span>
                        </button>
                      )}

                      <button
                        data-test="btn-add-credit-card-mobile"
                        onClick={handleAddNewCard}
                        className="flex items-center gap-2 text-[13px] text-black font-medium border border-gray-300 px-3 py-1.5 rounded-md cursor-pointer transition-all bg-white mt-2"
                      >
                        <Icon
                          icon="lucide:plus"
                          className="w-3.5 h-3.5 text-black"
                        />
                        กรอกบัตรเครดิต/เดบิต
                      </button>
                    </div>
                  )}
                </div>

                {/* COD */}
                <button
                  data-test="select-destination-mobile"
                  onClick={() => setPaymentMethod("DESTINATION")}
                  className={`flex items-center p-3 border rounded-[8px] transition-all cursor-pointer ${
                    paymentMethod === "DESTINATION"
                      ? "border-gray-500 bg-gray-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center mr-3 bg-white">
                    <Icon icon="lucide:truck" className="w-6 h-6 text-black" />
                  </div>

                  <div className="text-left flex-1">
                    <p className="text-[14px] font-semibold text-black leading-tight">
                      เก็บเงินปลายทาง
                    </p>
                    <p className="text-[12px] text-gray-500 mt-1 leading-tight">
                      ชำระเงินเมื่อได้รับสินค้า
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- MOBILE BOTTOM SECTION (Summary & Button - NON-FIXED) --- */}
        <div className="mt-auto flex flex-col p-4 w-full bg-white">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-[16px] text-black">
              <span>ยอดชำระทั้งหมด</span>
              <span
                data-test="order-total-price-mobile"
                className="font-semibold text-[16px]"
              >
                ฿ {subtotal.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            data-test="btn-confirm-order-mobile"
            onClick={handleConfirmOrder}
            className="w-full py-3 bg-[#3B82F6] text-white rounded-md text-[15px] font-medium shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            ยืนยันการชำระเงิน
          </button>
        </div>
      </div>
    </div>
  );
};
const PaymentShopping = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentContent />
    </Elements>
  );
};

export default PaymentShopping;
