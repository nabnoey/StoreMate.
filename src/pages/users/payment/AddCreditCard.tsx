import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { toast } from "react-hot-toast";
import { UserService } from "../../../services/users.service";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const AddCreditCardFormInner = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = location.state?.cartItems;

  const [cardName, setCardName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      toast.error("ข้อมูลฟอร์มไม่สมบูรณ์ กรุณาลองใหม่อีกครั้ง");
      return;
    }

    setIsProcessing(true);

    try {
      const userProfile = await UserService.getProfile();
      const userEmail = userProfile?.email || "guest@yourstore.com";

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
        billing_details: {
          email: userEmail,
          name: cardName || userProfile?.name || "Guest",
        },
      });

      if (error) {
        toast.error(error.message || "เกิดข้อผิดพลาดในการตรวจสอบบัตร");
      } else {
        toast.success("เพิ่มบัตรสำเร็จ!");

        navigate("/payment", {
          state: {
            items: cartItems,
            isBuyNow: true,
            newlyAddedCard: paymentMethod,
          },
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("ไม่สามารถดึงข้อมูลผู้ใช้งาน หรือเชื่อมต่อระบบได้");
    } finally {
      setIsProcessing(false);
    }
  };

  const cardNumberOptions = {
    placeholder: "0000 0000 0000 0000",
  };

  const cardExpiryOptions = {
    placeholder: "MM / YY",
  };

  const cardCvcOptions = {
    placeholder: "xxx",
  };

  return (
    <div className="min-h-screen bg-white lg:bg-white pb-10 lg:pb-0 font-anuphan text-gray-800 flex flex-col items-center">
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
          <Link to="/payment" className="cursor-pointer">
            สรุปคำสั่งซื้อ
          </Link>
          <Icon
            icon="material-symbols:chevron-right-rounded"
            className="w-5 h-5 mx-1"
          />
          <span className="transition-colors">เพิ่มบัตรเครดิต/เดบิต</span>
        </nav>
      </div>

      <div className="md:hidden bg-white pt-10 pb-4">
        <div className="flex items-center gap-3">
          <button
            className="mt-[2px] text-black p-0 flex-shrink-0 -ml-30"
            onClick={() => navigate("/payment")}
          >
            <Icon icon="material-symbols:arrow-back" className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <h1 className="text-[16px] leading-[28px] font-bold text-black">
              เพิ่มบัตรใหม่
            </h1>
            <p className="text-gray-400 text-[14px] font-anuphan font-normal leading-[24px] break-words mt-[2px]">
              เพิ่มบัตรเครดิตหรือเดบิตสำหรับการชำระเงิน
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[700px] mx-auto bg-white lg:rounded-xl lg:shadow-sm lg:border border-gray-200 overflow-hidden p-4 sm:p-6 lg:p-10 lg:mb-10 lg:mt-6">
        <div className="hidden lg:flex items-start gap-4 mb-8 border-b pb-4">
          <button type="button" onClick={() => navigate(-1)}>
            <Icon
              icon="lucide:arrow-left"
              className="w-6 h-6 mt-1 cursor-pointer text-black hover:text-[#4285F4] transition-colors"
            />
          </button>
          <div>
            <h1 className="text-xl font-bold text-black">เพิ่มบัตรใหม่</h1>
            <p className="text-sm text-gray-500">
              เพิ่มบัตรเครดิตหรือเดบิตสำหรับการชำระเงิน
            </p>
          </div>
        </div>

        <div className="flex justify-center mb-8 lg:mb-10 mt-4 lg:mt-0 px-2 sm:px-0">
          <div className="w-full max-w-[340px] aspect-[1.58] bg-[#0B1A3A] rounded-2xl p-5 sm:p-6 text-white shadow-xl relative flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-10 h-7 sm:w-12 sm:h-9 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-md opacity-90"></div>
              <div className="font-bold text-lg sm:text-xl italic opacity-50">
                CARD
              </div>
            </div>

            <div>
              <div className="font-mono text-lg sm:text-xl tracking-widest mb-3 sm:mb-4">
                **** **** **** ****
              </div>
              <div className="flex justify-between text-[11px] sm:text-xs font-mono">
                <div>
                  <div className="opacity-70 text-[9px] sm:text-[10px]">
                    Card Holder
                  </div>
                  <div className="uppercase tracking-wide line-clamp-1 max-w-[160px] sm:max-w-[180px]">
                    {cardName || "NAME SURNAME"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="opacity-70 text-[9px] sm:text-[10px]">
                    Expires
                  </div>
                  <div className="tracking-widest">MM/YY</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- FORM SECTION --- */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 max-w-[500px] mx-auto px-1 sm:px-0"
        >
          <div>
            <label
              htmlFor="cardName"
              className="block text-[16px] sm:text-sm font-semibold text-gray-900 mb-1.5"
            >
              ชื่อที่ปรากฏบนบัตร
            </label>
            <input
              id="cardName"
              type="text"
              placeholder="ชื่อบนบัตร"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="cardNumber"
              className="block text-[16px] sm:text-sm font-semibold text-gray-900 mb-1.5"
            >
              หมายเลขบัตร
            </label>
            <div className="w-full border border-gray-300 rounded-lg px-4 py-3.5 focus-within:border-[#4285F4] focus-within:ring-1 focus-within:ring-[#4285F4] bg-white">
              <CardNumberElement options={cardNumberOptions} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="cardExpiry"
                className="block text-[16px] sm:text-sm font-semibold text-gray-900 mb-1.5"
              >
                วันหมดอายุ
              </label>
              <div className="w-full border border-gray-300 rounded-lg px-4 py-3.5 focus-within:border-[#4285F4] focus-within:ring-1 focus-within:ring-[#4285F4] bg-white">
                <CardExpiryElement options={cardExpiryOptions} />
              </div>
            </div>

            <div>
              <label
                htmlFor="cardCvc"
                className="block text-[16px] sm:text-sm font-semibold text-gray-900 mb-1.5"
              >
                CVC
              </label>
              <div className="w-full border border-gray-300 rounded-lg px-4 py-3.5 focus-within:border-[#4285F4] focus-within:ring-1 focus-within:ring-[#4285F4] bg-white">
                <CardCvcElement options={cardCvcOptions} />
              </div>
            </div>
          </div>

          {/* --- ย้ายกล่องข้อความความปลอดภัยมาไว้ตรงนี้ (ก่อนปุ่ม) --- */}
          <div className="bg-[#F3F4F6] border border-[#e2e8f0] rounded-lg p-4 flex items-start gap-3 text-xs text-gray-500 mt-6">
            <Icon
              icon="lucide:shield-check"
              className="w-5 h-5 flex-shrink-0 text-black mt-0.5"
            />
            <div className="flex flex-col">
              <strong className="text-gray-900 font-bold mb-1 text-[13px]">
                การเชื่อมต่อที่ปลอดภัย
              </strong>
              <p className="leading-relaxed">
                ระบบของเราจะไม่มีการบันทึกข้อมูลบัตรเครดิต/เดบิต และรหัส CVC
                ไว้ในระบบ ข้อมูลทั้งหมดจะถูกเข้ารหัสผ่านโปรโตคอล 256-bit SSL
                ในขณะทำรายการเท่านั้น
                เพื่อป้องกันความเสี่ยงจากการรั่วไหลของข้อมูล
                คุณจำเป็นต้องกรอกข้อมูลบัตรใหม่ทุกครั้งที่ทำรายการสั่งซื้อ
              </p>
            </div>
          </div>

          {/* --- ปุ่มยืนยันย้ายมาอยู่ล่างสุดของฟอร์ม --- */}
          <button
            data-test="confirm-add-card-btn"
            type="submit"
            disabled={!stripe || isProcessing}
            className="cursor-pointer w-full bg-[#1E40AF] text-white font-bold py-3.5 rounded-lg mt-4 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base md:text-[20px]"
          >
            {isProcessing ? "กำลังประมวลผล..." : "ยืนยันการเพิ่มบัตร"}
          </button>
        </form>
      </div>
    </div>
  );
};

const AddCreditCardForm = () => {
  return (
    <Elements stripe={stripePromise}>
      <AddCreditCardFormInner />
    </Elements>
  );
};

export default AddCreditCardForm;
